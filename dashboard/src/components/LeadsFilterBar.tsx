import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, X, Calendar as CalendarIcon } from 'lucide-react';
import type { ScoredAssessment } from '../lib/scorer';
import { DatePicker } from './DatePicker';
import { format } from 'date-fns';

export interface FilterState {
    status: string[];
    sector: string[];
    revenue: string[];
    maturity: string[];
    scoreRange: [number, number];
    dateRange: { from?: Date; to?: Date };
    search: string;
}

interface LeadsFilterBarProps {
    data: ScoredAssessment[];
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
}

export const LeadsFilterBar: React.FC<LeadsFilterBarProps> = ({ data, filters, onFiltersChange }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // dynamic value extraction
    const uniqueValues = useMemo(() => {
        const sectors = new Set<string>();
        const revenues = new Set<string>();
        const maturities = new Set<string>();

        data.forEach(lead => {
            if (lead.setor) sectors.add(lead.setor);
            if (lead.receitaAnual) revenues.add(lead.receitaAnual);
            if (lead.nivelMaturidadeSelecionado) maturities.add(lead.nivelMaturidadeSelecionado);
        });

        return {
            sectors: Array.from(sectors).sort(),
            revenues: Array.from(revenues).sort(), // Need to improve revenue sorting later
            maturities: Array.from(maturities).sort()
        };
    }, [data]);

    const toggleStatus = (status: string) => {
        const next = filters.status.includes(status)
            ? filters.status.filter(s => s !== status)
            : [...filters.status, status];
        onFiltersChange({ ...filters, status: next });
    };

    const toggleValue = (key: keyof Pick<FilterState, 'sector' | 'revenue' | 'maturity'>, value: string) => {
        const current = filters[key] as string[];
        const next = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        onFiltersChange({ ...filters, [key]: next });
    };

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        const val = parseInt(e.target.value);
        const nextRange: [number, number] = [...filters.scoreRange];
        if (type === 'min') nextRange[0] = Math.min(val, filters.scoreRange[1]);
        else nextRange[1] = Math.max(val, filters.scoreRange[0]);
        onFiltersChange({ ...filters, scoreRange: nextRange });
    };

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-lg mb-6 sticky top-0 z-40">
            <div className="flex flex-wrap items-center gap-4">
                {/* Search Integration */}
                <div className="relative flex-1 min-w-[250px] group">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-cyan transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar empresas..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-white/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 shadow-sm transition-all"
                        value={filters.search}
                        onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
                    />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <button
                        onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                        className={`flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-white/50 rounded-2xl text-sm font-medium transition-all hover:bg-white ${filters.status.length > 0 ? 'ring-2 ring-brand-cyan/20 border-brand-cyan' : ''}`}
                    >
                        <span>Status</span>
                        {filters.status.length > 0 && <span className="bg-brand-cyan/20 text-brand-dark px-2 rounded-full text-[10px]">{filters.status.length}</span>}
                        <ChevronDown size={14} className={`transition-transform ${openDropdown === 'status' ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === 'status' && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in duration-200">
                            <div className="space-y-1">
                                {['HOT', 'WARM', 'COLD'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => toggleStatus(status)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${filters.status.includes(status) ? 'bg-brand-cyan/10 text-brand-dark' : 'hover:bg-gray-50 text-gray-500'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${status === 'HOT' ? 'bg-amber-400' : status === 'WARM' ? 'bg-blue-400' : 'bg-gray-400'}`} />
                                            {status}
                                        </div>
                                        {filters.status.includes(status) && <X size={12} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sector Filter */}
                <div className="relative">
                    <button
                        onClick={() => setOpenDropdown(openDropdown === 'sector' ? null : 'sector')}
                        className={`flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-white/50 rounded-2xl text-sm font-medium transition-all hover:bg-white ${filters.sector.length > 0 ? 'ring-2 ring-brand-cyan/20 border-brand-cyan' : ''}`}
                    >
                        <span>Setor</span>
                        <ChevronDown size={14} className={`transition-transform ${openDropdown === 'sector' ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === 'sector' && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-3 z-50 max-h-80 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in duration-200">
                            <div className="space-y-1">
                                {uniqueValues.sectors.map(sector => (
                                    <button
                                        key={sector}
                                        onClick={() => toggleValue('sector', sector)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${filters.sector.includes(sector) ? 'bg-brand-cyan/10 text-brand-dark font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                                    >
                                        <span className="truncate mr-2">{sector}</span>
                                        {filters.sector.includes(sector) && <X size={12} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Revenue Filter */}
                <div className="relative">
                    <button
                        onClick={() => setOpenDropdown(openDropdown === 'revenue' ? null : 'revenue')}
                        className={`flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-white/50 rounded-2xl text-sm font-medium transition-all hover:bg-white ${filters.revenue.length > 0 ? 'ring-2 ring-brand-cyan/20 border-brand-cyan' : ''}`}
                    >
                        <span>Receita</span>
                        <ChevronDown size={14} className={`transition-transform ${openDropdown === 'revenue' ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === 'revenue' && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in duration-200">
                            <div className="space-y-1">
                                {uniqueValues.revenues.map(rev => (
                                    <button
                                        key={rev}
                                        onClick={() => toggleValue('revenue', rev)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${filters.revenue.includes(rev) ? 'bg-brand-cyan/10 text-brand-dark font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                                    >
                                        <span className="truncate mr-2">{rev}</span>
                                        {filters.revenue.includes(rev) && <X size={12} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Maturity Filter */}
                <div className="relative">
                    <button
                        onClick={() => setOpenDropdown(openDropdown === 'maturity' ? null : 'maturity')}
                        className={`flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-white/50 rounded-2xl text-sm font-medium transition-all hover:bg-white ${filters.maturity.length > 0 ? 'ring-2 ring-brand-cyan/20 border-brand-cyan' : ''}`}
                    >
                        <span>Maturidade</span>
                        <ChevronDown size={14} className={`transition-transform ${openDropdown === 'maturity' ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === 'maturity' && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in duration-200">
                            <div className="space-y-1">
                                {uniqueValues.maturities.map(mat => (
                                    <button
                                        key={mat}
                                        onClick={() => toggleValue('maturity', mat)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${filters.maturity.includes(mat) ? 'bg-brand-cyan/10 text-brand-dark font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                                    >
                                        <span className="truncate mr-2">{mat}</span>
                                        {filters.maturity.includes(mat) && <X size={12} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Score Range Filter */}
                <div className="relative group">
                    <div className="flex flex-col gap-1 px-4 py-1.5 bg-white/80 border border-white/50 rounded-2xl shadow-sm min-w-[180px]">
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            <span>Score</span>
                            <span className="text-brand-blue">{filters.scoreRange[0]} - {filters.scoreRange[1]} pts</span>
                        </div>
                        <div className="flex items-center gap-2 h-6 relative pt-4">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={filters.scoreRange[0]}
                                onChange={e => handleScoreChange(e, 'min')}
                                className="absolute w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-cyan pointer-events-auto"
                                style={{ zIndex: filters.scoreRange[0] > 50 ? 5 : 4 }}
                            />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={filters.scoreRange[1]}
                                onChange={e => handleScoreChange(e, 'max')}
                                className="absolute w-full h-1 bg-transparent rounded-lg appearance-none cursor-pointer accent-brand-blue pointer-events-auto"
                                style={{ zIndex: 4 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Date Range Picker */}
                <div className="relative">
                    <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className={`flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-white/50 rounded-2xl text-sm font-medium transition-all hover:bg-white ${filters.dateRange.from ? 'ring-2 ring-brand-cyan/20 border-brand-cyan' : ''}`}
                    >
                        <CalendarIcon size={16} className="text-gray-400" />
                        <span className="max-w-[120px] truncate">
                            {filters.dateRange.from ?
                                `${format(filters.dateRange.from, 'dd/MM')} - ${filters.dateRange.to ? format(filters.dateRange.to, 'dd/MM') : '...'}`
                                : 'Período'}
                        </span>
                        <ChevronDown size={14} className={`transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
                    </button>
                    {showDatePicker && (
                        <div className="absolute top-full right-0 mt-2 z-50">
                            <DatePicker
                                dateRange={filters.dateRange as any}
                                onChange={(range) => onFiltersChange({ ...filters, dateRange: range })}
                                onClose={() => setShowDatePicker(false)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
