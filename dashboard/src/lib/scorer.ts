import type { Assessment } from './firebase';
import config from '../../../scoring_config.json'; // Import from root

// Helpers
function normalizeString(str: string): string {
    return str?.toLowerCase().trim() || "";
}

function checkMatch(value: string, list: string[]): boolean {
    if (!value) return false;
    const normalized = normalizeString(value);
    return list.some(item => normalized.includes(normalizeString(item)));
}

export interface ScoredAssessment extends Assessment {
    _score: number;
    _flag: 'HOT' | 'WARM' | 'COLD';
}

export function calculateScore(lead: Assessment): ScoredAssessment {
    // 1. Cargo Score (40% Weight)
    let scoreCargo = 0;
    // Mock leads don't have explicit 'cargo' field, assuming it might be in 'cargo' or 'role' prop if it existed.
    // For now, checking if 'empresa' name contains role hints is unreliable.
    // Let's assume a 'cargo' field might be present in the future or assume 0 if missing.
    // In the real implementation, this field needs to exist in the Lead object.
    const cargo = (lead as any).cargo || "";

    if (checkMatch(cargo, config.cargos_alto_potencial.hot)) {
        scoreCargo = 100;
    } else if (checkMatch(cargo, config.cargos_alto_potencial.warm)) {
        scoreCargo = 50;
    } else {
        scoreCargo = 0;
    }

    // 2. Pontuação Score (60% Weight)
    // The existing 'pontuacaoTotalFinal' (0-100)
    const scorePontuacao = lead.pontuacaoTotalFinal || 0;

    // Weighted Calculation
    const weights = config.regra_combinada;
    // score = (cargo * 0.4) + (pontuacao * 0.6)
    const finalScore = (scoreCargo * weights.peso_cargo) + (scorePontuacao * weights.peso_pontuacao);

    // Determine Flag based on Ranges
    let flag: 'HOT' | 'WARM' | 'COLD' = 'COLD';
    if (finalScore >= config.faixas_pontuacao.hot.min) flag = 'HOT';
    else if (finalScore >= config.faixas_pontuacao.warm.min) flag = 'WARM';

    return {
        ...lead,
        _score: Math.round(finalScore),
        _flag: flag
    };
}

export function processLeads(leads: Assessment[]): ScoredAssessment[] {
    return leads.map(calculateScore).sort((a, b) => b._score - a._score);
}
