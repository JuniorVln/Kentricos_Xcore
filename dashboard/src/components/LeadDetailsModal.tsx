import React from 'react';
import { X } from 'lucide-react';
import type { ScoredAssessment } from '../lib/scorer';

function getMaturityFromScore(score: number): string {
    if (score <= 30) return 'Inicial';
    if (score <= 60) return 'Conscientização';
    if (score <= 80) return 'Organizacional';
    if (score <= 90) return 'Estruturação';
    return 'Proatividade';
}

interface LeadDetailsModalProps {
    lead: ScoredAssessment;
    onClose: () => void;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({ lead, onClose }) => {
    const flagStyles = {
        HOT: { badge: 'bg-amber-100 text-amber-700 border-amber-200', bar: 'bg-amber-400' },
        WARM: { badge: 'bg-blue-100 text-blue-700 border-blue-200', bar: 'bg-blue-400' },
        COLD: { badge: 'bg-gray-100 text-gray-700 border-gray-200 dark:border-gray-700', bar: 'bg-gray-400' },
    };
    const style = flagStyles[lead._flag as keyof typeof flagStyles] ?? flagStyles.COLD;
    const maturityCalculated = getMaturityFromScore(lead._score || 0);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-md bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-6"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h3 className="text-xl font-bold text-brand-dark dark:text-white">
                            {lead.nome || 'Nome não informado'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{lead.empresa || '-'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style.badge}`}>
                            {lead._flag}
                        </span>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Score bar */}
                <div className="mb-5 p-4 bg-gray-50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-widest">Score Final</span>
                        <span className="text-2xl font-bold text-brand-dark dark:text-white">{lead._score ?? 0}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${style.bar}`}
                            style={{ width: `${Math.min(lead._score ?? 0, 100)}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">Nível calculado: <strong className="text-brand-blue">{maturityCalculated}</strong></span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">Declarado: <strong className="text-gray-600 dark:text-gray-300">{lead.nivelMaturidadeSelecionado || '—'}</strong></span>
                    </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                        { label: 'Email', value: lead.email },
                        { label: 'Celular', value: lead.celular },
                        { label: 'Setor', value: lead.setor },
                        { label: 'Receita Anual', value: lead.receitaAnual },
                        { label: 'Data', value: lead.data },
                        { label: 'Pontuação Diagnóstico', value: lead.pontuacaoTotalFinal != null ? `${lead.pontuacaoTotalFinal} pts` : undefined },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-white/70 border border-gray-100 dark:border-gray-700 rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold mb-0.5">{label}</p>
                            <p className="text-gray-700 font-medium truncate">{value || '—'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
