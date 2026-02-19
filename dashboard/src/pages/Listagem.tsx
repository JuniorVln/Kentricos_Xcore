import React, { useMemo, useState } from 'react';
import { useLeadsData } from '../hooks/useLeadsData';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel
} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import type { ScoredAssessment } from '../lib/scorer';
import { ArrowUpDown, Eye, Download, LayoutGrid, List } from 'lucide-react';
import { LeadsFilterBar, type FilterState } from '../components/LeadsFilterBar';
import { ActiveFilters } from '../components/ActiveFilters';

const columnHelper = createColumnHelper<ScoredAssessment>();

export const Listagem: React.FC = () => {
    const { data, loading, error } = useLeadsData();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 12 });
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const initialFilters: FilterState = {
        status: [],
        sector: [],
        revenue: [],
        maturity: [],
        scoreRange: [0, 100],
        dateRange: {},
        search: ''
    };

    const [filters, setFilters] = useState<FilterState>(() => {
        // 1. Try URL first
        const params = new URLSearchParams(window.location.search);
        if (params.toString()) {
            const urlFilters: FilterState = { ...initialFilters };
            if (params.get('status')) urlFilters.status = params.get('status')!.split(',');
            if (params.get('sector')) urlFilters.sector = params.get('sector')!.split(',');
            if (params.get('revenue')) urlFilters.revenue = params.get('revenue')!.split(',');
            if (params.get('maturity')) urlFilters.maturity = params.get('maturity')!.split(',');
            if (params.get('search')) urlFilters.search = params.get('search')!;
            if (params.get('minScore')) urlFilters.scoreRange[0] = parseInt(params.get('minScore')!);
            if (params.get('maxScore')) urlFilters.scoreRange[1] = parseInt(params.get('maxScore')!);
            if (params.get('from')) urlFilters.dateRange.from = new Date(params.get('from')!);
            if (params.get('to')) urlFilters.dateRange.to = new Date(params.get('to')!);
            return urlFilters;
        }

        // 2. Try localStorage
        const saved = localStorage.getItem('leads_filters');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.dateRange?.from) parsed.dateRange.from = new Date(parsed.dateRange.from);
                if (parsed.dateRange?.to) parsed.dateRange.to = new Date(parsed.dateRange.to);
                return parsed;
            } catch (e) { return initialFilters; }
        }
        return initialFilters;
    });

    React.useEffect(() => {
        const params = new URLSearchParams();
        if (filters.status.length) params.set('status', filters.status.join(','));
        if (filters.sector.length) params.set('sector', filters.sector.join(','));
        if (filters.revenue.length) params.set('revenue', filters.revenue.join(','));
        if (filters.maturity.length) params.set('maturity', filters.maturity.join(','));
        if (filters.search) params.set('search', filters.search);
        if (filters.scoreRange[0] !== 0) params.set('minScore', filters.scoreRange[0].toString());
        if (filters.scoreRange[1] !== 100) params.set('maxScore', filters.scoreRange[1].toString());
        if (filters.dateRange.from) params.set('from', filters.dateRange.from.toISOString());
        if (filters.dateRange.to) params.set('to', filters.dateRange.to.toISOString());

        const newPath = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
        window.history.replaceState({}, '', newPath);

        localStorage.setItem('leads_filters', JSON.stringify(filters));
    }, [filters]);

    const filteredData = useMemo(() => {
        return data.filter(lead => {
            if (filters.search && !lead.empresa?.toLowerCase().includes(filters.search.toLowerCase()) && !lead.nome?.toLowerCase().includes(filters.search.toLowerCase())) return false;
            if (filters.status.length > 0 && !filters.status.includes(lead._flag)) return false;
            if (filters.sector.length > 0 && (!lead.setor || !filters.sector.includes(lead.setor))) return false;
            if (filters.revenue.length > 0 && (!lead.receitaAnual || !filters.revenue.includes(lead.receitaAnual))) return false;
            if (filters.maturity.length > 0 && (!lead.nivelMaturidadeSelecionado || !filters.maturity.includes(lead.nivelMaturidadeSelecionado))) return false;
            if (lead._score < filters.scoreRange[0] || lead._score > filters.scoreRange[1]) return false;
            if (filters.dateRange.from || filters.dateRange.to) {
                try {
                    if (!lead.data) return false;
                    const parts = lead.data.split('/');
                    const leadDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
                    if (filters.dateRange.from && leadDate < filters.dateRange.from) return false;
                    if (filters.dateRange.to && leadDate > filters.dateRange.to) return false;
                } catch (e) { return true; }
            }
            return true;
        });
    }, [data, filters]);

    const handleFiltersChange = (newFilters: FilterState) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    const removeFilter = (key: keyof FilterState, value?: any) => {
        const next = { ...filters };
        if (Array.isArray(next[key])) {
            (next[key] as string[]) = (next[key] as string[]).filter(v => v !== value);
        } else if (key === 'scoreRange') {
            next.scoreRange = [0, 100];
        } else if (key === 'dateRange') {
            next.dateRange = {};
        } else {
            (next[key] as any) = '';
        }
        handleFiltersChange(next);
    };

    const clearAllFilters = () => handleFiltersChange(initialFilters);

    const handleExport = () => {
        const headers = ['Empresa', 'Email', 'Receita Anual', 'Setor', 'Score', 'Status'];
        const csvRows = [headers.join(',')];

        table.getFilteredRowModel().rows.forEach(row => {
            const d = row.original;
            const values = [
                `"${d.empresa || ''}"`,
                `"${d.email || ''}"`,
                `"${d.receitaAnual || ''}"`,
                `"${d.setor || ''}"`,
                `"${d.pontuacaoTotalFinal || 0}"`,
                `"${d._flag}"`
            ];
            csvRows.push(values.join(','));
        });

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_xcore_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };


    const columns = useMemo(() => [
        columnHelper.accessor('_flag', {
            id: '_flag',
            header: 'Status',
            cell: info => {
                const flag = info.getValue();
                const styles = {
                    // Match scoring_config.json colors: HOT=#F59E0B (Amber/Yellow), WARM=#3B82F6 (Blue), COLD=#6B7280 (Gray)
                    HOT: 'bg-amber-100 text-amber-700 border-amber-200',
                    WARM: 'bg-blue-100 text-blue-700 border-blue-200',
                    COLD: 'bg-gray-100 text-gray-700 border-gray-200'
                };
                const style = styles[flag as keyof typeof styles] || styles.COLD;
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${style}`}>
                        {flag}
                    </span>
                );
            },
            filterFn: 'equalsString'
        }),
        columnHelper.accessor('empresa', {
            header: ({ column }) => (
                <button className="flex items-center gap-2 hover:text-brand-cyan transition-colors" onClick={column.getToggleSortingHandler()}>
                    Empresa <ArrowUpDown size={14} className="opacity-50" />
                </button>
            ),
            cell: info => <span className="font-semibold text-brand-dark">{info.getValue() || '-'}</span>,
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: info => <span className="text-gray-600">{info.getValue() || '-'}</span>,
        }),
        columnHelper.accessor('receitaAnual', {
            header: 'Receita',
            cell: info => <span className="text-gray-600 font-medium">{info.getValue() || '-'}</span>,
        }),
        columnHelper.accessor('_score', {
            header: ({ column }) => (
                <button className="flex items-center gap-2 hover:text-brand-cyan transition-colors" onClick={column.getToggleSortingHandler()}>
                    Score <ArrowUpDown size={14} className="opacity-50" />
                </button>
            ),
            cell: info => {
                const val = info.getValue();
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-brand-cyan to-brand-blue"
                                style={{ width: `${Math.min(val || 0, 100)}%` }}
                            ></div>
                        </div>
                        <span className="font-bold text-brand-dark">{val}</span>
                    </div>
                );
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: '',
            cell: () => (
                <button className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-full transition-all">
                    <Eye size={18} />
                </button>
            ),
        })
    ], []);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,
            pagination
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualFiltering: true,
    });

    if (loading) return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200/50 rounded-xl"></div>
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center text-red-600">
            Erro ao carregar dados: {JSON.stringify(error)}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-0 px-2 lg:px-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-brand-dark">Leads Qualificados</h2>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex bg-white/60 backdrop-blur-md border border-white/50 rounded-xl p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-400 hover:text-brand-blue hover:bg-white/50'}`}
                                title="Visualização em Lista"
                            >
                                <List size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-400 hover:text-brand-blue hover:bg-white/50'}`}
                                title="Visualização em Cards"
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                        <button
                            onClick={handleExport}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-bold shadow-lg hover:bg-gray-900 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Download size={16} />
                            Exportar
                        </button>
                    </div>
                </div>

                <LeadsFilterBar
                    data={data}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                />

                <ActiveFilters
                    filters={filters}
                    onRemoveFilter={removeFilter}
                    onClearAll={clearAllFilters}
                    totalCount={data.length}
                    filteredCount={filteredData.length}
                />
            </div>

            {/* Content Visualization */}
            {viewMode === 'table' ? (
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/40 text-xs uppercase text-gray-500 font-semibold tracking-wider border-b border-white/50">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} className="px-6 py-4 first:pl-8 last:pr-8">
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-gray-100/50">
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-white/50 transition-colors group">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4 first:pl-8 last:pr-8">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-4 border-t border-white/50 flex items-center justify-between bg-white/20">
                        <span className="text-sm text-gray-500">
                            Mostrando <span className="font-bold text-brand-dark">{table.getRowModel().rows.length}</span> de <span className="font-bold text-brand-dark">{table.getFilteredRowModel().rows.length}</span> resultados
                        </span>
                        <div className="flex gap-2">
                            <button
                                className="px-4 py-2 bg-white/50 border border-white/50 rounded-xl text-sm hover:bg-white disabled:opacity-50 transition-all shadow-sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Anterior
                            </button>
                            <button
                                className="px-4 py-2 bg-white/50 border border-white/50 rounded-xl text-sm hover:bg-white disabled:opacity-50 transition-all shadow-sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {table.getRowModel().rows.map(row => {
                            const lead = row.original;
                            return (
                                <div key={row.id} className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col justify-between h-full">
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${lead._flag === 'HOT' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                            lead._flag === 'WARM' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                'bg-gray-100 text-gray-700 border-gray-200'
                                            }`}>
                                            {lead._flag}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xl font-bold text-brand-dark group-hover:text-brand-blue transition-colors">
                                            {lead.nome || 'Nome não informado'}
                                        </h4>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Data:</span>
                                                <span className="text-gray-600 font-medium">{lead.data || '-'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Empresa:</span>
                                                <span className="text-gray-600 font-medium truncate ml-4">{lead.empresa || '-'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Email:</span>
                                                <span className="text-gray-600 font-medium truncate ml-4 text-xs italic">{lead.email || '-'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Celular:</span>
                                                <span className="text-gray-600 font-medium">{lead.whatsapp || '-'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Receita Anual:</span>
                                                <span className="text-gray-600 font-medium truncate ml-4">{lead.receitaAnual || '-'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Setor:</span>
                                                <span className="text-gray-600 font-medium">{lead.setor || '-'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100/50">
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Nível de Maturidade Selecionado:</p>
                                            <p className="text-xs text-gray-700 leading-relaxed italic">
                                                "{lead.nivelMaturidadeSelecionado || 'Não informado'}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="px-4 py-2 bg-brand-dark/5 rounded-2xl border border-brand-dark/10">
                                                <span className="text-xs text-gray-500 block">Pontuação Total Final:</span>
                                                <span className="text-xl font-bold text-brand-dark font-mono">{lead._score || 0}</span>
                                            </div>
                                        </div>
                                        <button className="p-3 bg-brand-blue/10 text-brand-blue rounded-2xl hover:bg-brand-blue hover:text-white transition-all shadow-sm">
                                            <Eye size={20} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination for Grid View */}
                    <div className="flex items-center justify-between py-4">
                        <span className="text-sm text-gray-500 backdrop-blur-md px-4 py-2 bg-white/40 rounded-full border border-white/50">
                            Mostrando <span className="font-bold text-brand-dark">{table.getRowModel().rows.length}</span> resultados
                        </span>
                        <div className="flex gap-2">
                            <button
                                className="px-6 py-2 bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl text-sm hover:bg-brand-blue hover:text-white disabled:opacity-50 transition-all shadow-md"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Anterior
                            </button>
                            <button
                                className="px-6 py-2 bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl text-sm hover:bg-brand-blue hover:text-white disabled:opacity-50 transition-all shadow-md"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
