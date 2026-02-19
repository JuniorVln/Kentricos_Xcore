import React from 'react';
import { useMetrics } from '../hooks/useMetrics';
import { FileText, Download, PieChart, Layers } from 'lucide-react';

export const Relatorios: React.FC = () => {
    // Get metrics (no date filter for now to show all)
    const { metrics, loading } = useMetrics();

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
                        Exportação de dados agregados por setor e maturidade.
                    </p>
                </div>
            </div>

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
                            onClick={() => handleExport(metrics.setorChart, 'relatorio_setores')}
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
                                {metrics.setorChart.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-brand-dark">{item.name}</td>
                                        <td className="px-6 py-3 text-right text-gray-600 font-bold">{item.value}</td>
                                        <td className="px-6 py-3 text-right text-gray-500">
                                            {((item.value / metrics.total) * 100).toFixed(1)}%
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
                            onClick={() => handleExport(metrics.nivelChart, 'relatorio_maturidade')}
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
                                {metrics.nivelChart.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-brand-dark">{item.name}</td>
                                        <td className="px-6 py-3 text-right text-gray-600 font-bold">{item.value}</td>
                                        <td className="px-6 py-3 text-right text-gray-500">
                                            {((item.value / metrics.total) * 100).toFixed(1)}%
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
