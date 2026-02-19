import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import type { FilterState } from './LeadsFilterBar';
import { format } from 'date-fns';

interface ActiveFiltersProps {
    filters: FilterState;
    onRemoveFilter: (key: keyof FilterState, value?: any) => void;
    onClearAll: () => void;
    totalCount: number;
    filteredCount: number;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
    filters,
    onRemoveFilter,
    onClearAll,
    totalCount,
    filteredCount
}) => {
    const hasActiveFilters =
        filters.status.length > 0 ||
        filters.sector.length > 0 ||
        filters.revenue.length > 0 ||
        filters.maturity.length > 0 ||
        filters.search !== '' ||
        filters.scoreRange[0] !== 0 ||
        filters.scoreRange[1] !== 100 ||
        !!filters.dateRange.from;

    if (!hasActiveFilters && filteredCount === totalCount) return (
        <div className="flex items-center justify-between mb-6 px-2">
            <span className="text-sm text-gray-500 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/50">
                Exibindo todos os <span className="font-bold text-brand-dark">{totalCount}</span> leads
            </span>
        </div>
    );

    return (
        <div className="flex flex-col gap-4 mb-6 px-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm">
                        Exibindo <span className="font-bold text-brand-dark">{filteredCount}</span> de <span className="font-bold text-brand-dark">{totalCount}</span> leads
                    </span>
                    {hasActiveFilters && (
                        <button
                            onClick={onClearAll}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 bg-red-50 border border-red-100 rounded-full transition-all shadow-sm"
                        >
                            <RotateCcw size={14} />
                            Limpar filtros
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {filters.search && (
                    <Chip label="Busca" value={filters.search} onRemove={() => onRemoveFilter('search')} />
                )}
                {filters.status.map(s => (
                    <Chip key={s} label="Status" value={s} onRemove={() => onRemoveFilter('status', s)} color="cyan" />
                ))}
                {filters.sector.map(s => (
                    <Chip key={s} label="Setor" value={s} onRemove={() => onRemoveFilter('sector', s)} />
                ))}
                {filters.revenue.map(r => (
                    <Chip key={r} label="Receita" value={r} onRemove={() => onRemoveFilter('revenue', r)} />
                ))}
                {filters.maturity.map(m => (
                    <Chip key={m} label="Maturidade" value={m} onRemove={() => onRemoveFilter('maturity', m)} />
                ))}
                {(filters.scoreRange[0] !== 0 || filters.scoreRange[1] !== 100) && (
                    <Chip
                        label="Score"
                        value={`${filters.scoreRange[0]} - ${filters.scoreRange[1]}`}
                        onRemove={() => onRemoveFilter('scoreRange')}
                    />
                )}
                {filters.dateRange.from && (
                    <Chip
                        label="Período"
                        value={`${format(filters.dateRange.from, 'dd/MM/yy')}${filters.dateRange.to ? ` - ${format(filters.dateRange.to, 'dd/MM/yy')}` : ''}`}
                        onRemove={() => onRemoveFilter('dateRange')}
                    />
                )}
            </div>
        </div>
    );
};

const Chip: React.FC<{ label: string, value: string, onRemove: () => void, color?: 'cyan' | 'gray' }> = ({ label, value, onRemove, color = 'gray' }) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium shadow-sm transition-all animate-in zoom-in duration-200 ${color === 'cyan'
        ? 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-dark'
        : 'bg-white border-white/60 text-gray-600'
        }`}>
        <span className="opacity-60">{label}:</span>
        <span>{value}</span>
        <button onClick={onRemove} className="hover:text-red-500 transition-colors">
            <X size={14} />
        </button>
    </div>
);
