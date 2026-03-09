import React, { useState, useMemo } from 'react';
import { useMetrics } from '../hooks/useMetrics';
import { useLeadsData } from '../hooks/useLeadsData';
import { FileText, Download, PieChart, Layers, Filter } from 'lucide-react';
import { LeadsFilterBar, type FilterState } from '../components/LeadsFilterBar';
import { ActiveFilters } from '../components/ActiveFilters';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';

export const Relatorios: React.FC = () => {
    const { data: allData, loading } = useLeadsData();
    const [filters, setFilters] = useState<FilterState>({
        status: [],
        sector: [],
        revenue: [],
        maturity: [],
        scoreRange: [0, 100],
        dateRange: {},
        search: ''
    });

    const filteredLeads = useMemo(() => {
        return allData.filter(lead => {
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
    }, [allData, filters]);

    const reportMetrics = useMemo(() => {
        if (!filteredLeads.length) return null;

        const setorMap: Record<string, number> = {};
        const receitaMap: Record<string, number> = {};
        const nivelMap: Record<string, number> = {};

        filteredLeads.forEach(d => {
            const s = d.setor || 'N/A';
            const r = d.receitaAnual || 'N/A';
            const n = d.nivelMaturidadeSelecionado || 'N/A';
            setorMap[s] = (setorMap[s] || 0) + 1;
            receitaMap[r] = (receitaMap[r] || 0) + 1;
            nivelMap[n] = (nivelMap[n] || 0) + 1;
        });

        const COLORS = ['#184E77', '#1E6091', '#1A759F', '#168AAD', '#34A0A4', '#52B69A', '#76C893', '#99D98C', '#B5E48C', '#D9ED92'];

        return {
            setor: Object.entries(setorMap).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] })),
            receita: Object.entries(receitaMap).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] })),
            nivel: Object.entries(nivelMap).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] })),
            total: filteredLeads.length
        };
    }, [filteredLeads]);

    const handleFiltersChange = (newFilters: FilterState) => setFilters(newFilters);

    const handleExport = (data: { name: string; value: number }[], filename: string) => {
        if (!data || !data.length) return;

        const header = ['Categoria', 'Quantidade'];
        const rows = data.map(item => `"${item.name}",${item.value}`);
        const csvContent = [header.join(','), ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (loading || !metrics) return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl animate-pulse min-h-[400px]">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200/50 rounded-2xl"></div>
                <div className="h-64 bg-gray-200/50 rounded-2xl"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-3xl font-light text-brand-dark mb-1">
                        Relatórios Analíticos
                    </h2>
                    <p className="text-gray-500 font-light">
                        Visualize e exporte dados agregados da sua base.
                    </p>
                </div>
            </div>

            <LeadsFilterBar
                data={allData}
                filters={filters}
                onFiltersChange={handleFiltersChange}
            />

            <ActiveFilters
                filters={filters}
                onRemoveFilter={(key, val) => {
                    const next = { ...filters };
                    if (Array.isArray(next[key])) {
                        (next[key] as string[]) = (next[key] as string[]).filter(v => v !== val);
                    } else if (key === 'scoreRange') next.scoreRange = [0, 100];
                    else if (key === 'dateRange') next.dateRange = {};
                    else (next[key] as any) = '';
                    setFilters(next);
                }}
                onClearAll={() => setFilters({
                    status: [], sector: [], revenue: [], maturity: [],
                    scoreRange: [0, 100], dateRange: {}, search: ''
                })}
                totalCount={allData.length}
                filteredCount={filteredLeads.length}
            />

            {!reportMetrics ? (
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-12 text-center text-gray-400">
                    Nenhum lead encontrado para os filtros selecionados.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Charts Row */}
                    {[
                        { title: 'Por Setor', data: reportMetrics.setor, icon: <PieChart size={20} /> },
                        { title: 'Por Receita', data: reportMetrics.receita, icon: <Layers size={20} /> },
                        { title: 'Por Maturidade', data: reportMetrics.nivel, icon: <Filter size={20} /> }
                    ].map((chart, i) => (
                        <div key={i} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-lg flex flex-col h-[400px]">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue">
                                    {chart.icon}
                                </div>
                                <h3 className="font-bold text-brand-dark">{chart.title}</h3>
                            </div>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={chart.data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chart.data.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <ReTooltip />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-1 overflow-y-auto custom-scrollbar pr-2 h-24">
                                {chart.data.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-[10px]">
                                        <div className="flex items-center gap-2 truncate">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                            <span className="text-gray-600 truncate">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-brand-dark">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sector Report */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-cyan/10 rounded-xl text-brand-blue">
                                <PieChart size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-brand-dark">Distribuição por Setor</h3>
                        </div>
                        <button
                            onClick={() => reportMetrics && handleExport(reportMetrics.setor, 'relatorio_setores')}
                            className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-xl transition-all"
                            title="Exportar CSV"
                        >
                            <Download size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden rounded-2xl border border-white/60">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/40 text-xs uppercase text-gray-500 font-semibold border-b border-white/50">
                                <tr>
                                    <th className="px-6 py-3">Setor</th>
                                    <th className="px-6 py-3 text-right">Leads</th>
                                    <th className="px-6 py-3 text-right">%</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/50 bg-white/30">
                                {reportMetrics && reportMetrics.setor.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-brand-dark">{item.name}</td>
                                        <td className="px-6 py-3 text-right text-gray-600 font-bold">{item.value}</td>
                                        <td className="px-6 py-3 text-right text-gray-500">
                                            {reportMetrics && ((item.value / reportMetrics.total) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Maturity Report */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue">
                                <Layers size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-brand-dark">Níveis de Maturidade</h3>
                        </div>
                        <button
                            onClick={() => reportMetrics && handleExport(reportMetrics.nivel, 'relatorio_maturidade')}
                            className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-xl transition-all"
                            title="Exportar CSV"
                        >
                            <Download size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden rounded-2xl border border-white/60">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/40 text-xs uppercase text-gray-500 font-semibold border-b border-white/50">
                                <tr>
                                    <th className="px-6 py-3">Nível</th>
                                    <th className="px-6 py-3 text-right">Leads</th>
                                    <th className="px-6 py-3 text-right">%</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/50 bg-white/30">
                                {reportMetrics && reportMetrics.nivel.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-brand-dark">{item.name}</td>
                                        <td className="px-6 py-3 text-right text-gray-600 font-bold">{item.value}</td>
                                        <td className="px-6 py-3 text-right text-gray-500">
                                            {reportMetrics && ((item.value / reportMetrics.total) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* General Export Card */}
            <div className="bg-gradient-to-r from-brand-dark to-[#184E77] rounded-3xl p-8 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Relatório Completo</h3>
                    <p className="text-white/70 max-w-xl">
                        Baixe um PDF consolidado com todos os insights, gráficos de performance e recomendações de IA para sua base de leads.
                    </p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-white text-brand-dark rounded-xl font-bold hover:bg-brand-cyan hover:shadow-lg hover:scale-105 transition-all active:scale-95">
                    <FileText size={20} />
                    Gerar Relatório PDF
                </button>
            </div>
        </div>
    );
};
