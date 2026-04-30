import type { Assessment } from './firebase';
import config from '../../../scoring_config.json';

// Helpers
function normalizeString(str: string): string {
    return str?.toLowerCase().trim() || "";
}

function checkMatch(value: string, list: string[]): boolean {
    if (!value) return false;
    const normalized = normalizeString(value);
    return list.some(item => normalized.includes(normalizeString(item)));
}

// ScoredAssessment: extends Assessment com campos calculados + campos "achatados"
// para retrocompatibilidade com os componentes de UI existentes
export interface ScoredAssessment extends Assessment {
    _score: number;
    _flag: 'HOT' | 'WARM' | 'COLD';
    // Campos planos extraídos de personalData (para facilitar uso nos componentes)
    nome: string;
    empresa: string;
    email: string;
    celular: string;
    setor: string;
    nivelMaturidadeSelecionado: string;
    receitaAnual: string;
    pontuacaoTotalFinal: number;
    data: string; // dd/mm/yyyy extraído de createdAt
}

export function calculateScore(lead: Assessment): ScoredAssessment {
    const pd = lead.personalData || {};
    const as_ = lead.assessmentScore || { totalScore: 0, scoresByPillar: {} };

    // Extrair data de createdAt (Timestamp ou string)
    let data = '';
    if (lead.createdAt) {
        const d = lead.createdAt instanceof Date ? lead.createdAt : new Date(lead.createdAt as any);
        if (!isNaN(d.getTime())) {
            data = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        }
    }

    // 1. Cargo Score (40% weight) — usa personalData.role ou campo cargo se existir
    const cargo = pd.role || pd.cargo || (lead as any).cargo || "";
    let scoreCargo = 0;
    if (checkMatch(cargo, config.cargos_alto_potencial.hot)) {
        scoreCargo = 100;
    } else if (checkMatch(cargo, config.cargos_alto_potencial.warm)) {
        scoreCargo = 50;
    }

    // 2. Pontuação Score (60% weight) — usa assessmentScore.totalScore
    const scorePontuacao = as_.totalScore ?? 0;

    // Cálculo ponderado
    const weights = config.regra_combinada;
    const finalScore = (scoreCargo * weights.peso_cargo) + (scorePontuacao * weights.peso_pontuacao);

    // Classificação por faixa
    let flag: 'HOT' | 'WARM' | 'COLD' = 'COLD';
    if (finalScore >= config.faixas_pontuacao.hot.min) flag = 'HOT';
    else if (finalScore >= config.faixas_pontuacao.warm.min) flag = 'WARM';

    return {
        ...lead,
        // Campos calculados
        _score: Math.round(finalScore),
        _flag: flag,
        // Campos planos para os componentes de UI (extraídos de personalData)
        nome: pd.fullName || '',
        empresa: pd.company || '',
        email: pd.email || '',
        celular: pd.whatsapp || '',
        setor: pd.sector || '',
        nivelMaturidadeSelecionado: pd.maturityLevel || '',
        receitaAnual: pd.annualRevenue || pd.employeeQuantity || '',
        pontuacaoTotalFinal: as_.totalScore ?? 0,
        data,
    };
}

export function processLeads(leads: Assessment[]): ScoredAssessment[] {
    return leads
        .map(calculateScore)
        .sort((a, b) => {
            // Ordenar por data decrescente (mais recente primeiro)
            const parseDate = (dateStr?: string) => {
                if (!dateStr) return 0;
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])).getTime();
                }
                return 0;
            };
            return parseDate(b.data) - parseDate(a.data);
        });
}
