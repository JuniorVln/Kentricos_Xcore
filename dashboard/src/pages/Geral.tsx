import React from 'react';
import { useMetrics } from '../hooks/useMetrics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Calendar, Users, TrendingUp, Info } from 'lucide-react';
import { DatePicker } from '../components/DatePicker';

const COLORS = ['#76E2F4', '#184E77', '#0E334F', '#00A8E8', '#007EA7', '#003459'];

const MATURITY_LEVELS = ['Inicial', 'Conscientização', 'Organizacional', 'Estruturação', 'Proatividade'];

function getMaturityFromScore(score: number): string {
    if (score <= 30) return 'Inicial';
    if (score <= 60) return 'Conscientização';
    if (score <= 80) return 'Organizacional';
    if (score <= 90) return 'Estruturação';
    return 'Proatividade';
}

export const Geral: React.FC = () => {
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [dateRange, setDateRange] = React.useState<{ from: Date | undefined, to: Date | undefined }>({
        from: undefined,
        to: undefined
    });

    const { loading, error, metrics } = useMetrics(dateRange.from, dateRange.to);

    const conversao = metrics && metrics.total > 0
        ? Math.round((metrics.quality.hot + metrics.quality.warm) / metrics.total * 100)
        : 0;

    const matrixData = React.useMemo(() => {
        const matrix: number[][] = MATURITY_LEVELS.map(() => MATURITY_LEVELS.map(() => 0));
        (metrics?.expectationChart ?? []).forEach(d => {
            const ri = MATURITY_LEVELS.indexOf(d.autoLevel || '');
            const ci = MATURITY_LEVELS.indexOf(getMaturityFromScore(d.score || 0));
            if (ri >= 0 && ci >= 0) matrix[ri][ci]++;
        });
        return matrix;
    }, [metrics?.expectationChart]);

    const matrixMax = React.useMemo(() => Math.max(1, ...matrixData.flat()), [matrixData]);

    const matrixStats = React.useMemo(() => {
        let aligned = 0, overEstimated = 0, underEstimated = 0;
        matrixData.forEach((row, ri) => {
            row.forEach((count, ci) => {
                if (ri === ci) aligned += count;
                else if (ri > ci) overEstimated += count;
                else underEstimated += count;
            });
        });
        return { aligned, overEstimated, underEstimated };
    }, [matrixData]);

    if (loading) return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between items-center mb-8">
                <div className="h-8 w-48 bg-gray-200 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-white/50 dark:bg-[#1E293B]/50 rounded-xl" />
                ))}
            </div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl">Erro ao carregar dados: {JSON.stringify(error)}</div>;
    if (!metrics) return <div className="p-8 text-center text-gray-500 dark:text-gray-300 dark:text-gray-500">Nenhum dado encontrado.</div>;

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-4xl font-light text-brand-dark dark:text-gray-100 mb-1">
                        Bem-vindo, <span className="font-semibold">Kentricos</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-300 dark:text-gray-500 font-light">Monitoramento estratégico de maturidade de leads.</p>
                </div>

                {/* Top Stats - Pill Style */}
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-md border border-white/50 dark:border-white/10 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 group hover:bg-white dark:bg-[#1E293B]transition-all cursor-default">
                        <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl group-hover:scale-110 transition-transform">
                            <Users size={18} />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-500 dark:text-gray-300 dark:text-gray-500 uppercase tracking-widest font-bold">Total Concluídos</span>
                                <div className="group/info relative z-50">
                                    <Info size={10} className="text-gray-400 dark:text-gray-500" />
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-2.5 bg-[#0A0A0A] text-white text-[10px] rounded-xl opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none border border-slate-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-50">
                                        Reflete o total de empresas que finalizaram 100% do diagnóstico e já possuem um Score de Maturidade calculado. Leads incompletos não entram nesta contagem.
                                    </div>
                                </div>
                            </div>
                            <p className="text-xl font-bold text-brand-dark dark:text-gray-100 leading-none mt-0.5">{metrics.total}</p>
                        </div>
                    </div>

                    <div className="bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-md border border-white/50 dark:border-white/10 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 group hover:bg-white dark:bg-[#1E293B]transition-all cursor-default">
                        <div className="p-2 bg-[#FCD34D]/10 text-brand-dark dark:text-gray-100 rounded-xl group-hover:scale-110 transition-transform">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-500 dark:text-gray-300 dark:text-gray-500 uppercase tracking-widest font-bold">Score Médio</span>
                                <div className="group/info relative z-50">
                                    <Info size={10} className="text-gray-400 dark:text-gray-500" />
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-2.5 bg-[#0A0A0A] text-white text-[10px] rounded-xl opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none border border-slate-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-50">
                                        Média geral de desempenho de todos os leads concluídos. Mostra o nível médio de maturidade do seu banco de dados atual.
                                    </div>
                                </div>
                            </div>
                            <p className="text-xl font-bold text-brand-dark dark:text-gray-100 leading-none mt-0.5">{Math.round(metrics.avgScore)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[380px]">

                {/* Card 1: Highlight / Profile Style (Left - 3 cols) */}
                <div className="lg:col-span-3 bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-brand-bg shadow-inner mb-4 overflow-hidden">
                            <img src="/logo.png" alt="Xcore" className="w-full h-full object-contain p-2 opacity-80 mix-blend-multiply" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark dark:text-gray-100">Relatório XCore</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300 dark:text-gray-500 mt-1">Análise de maturidade em tempo real.</p>
                    </div>

                    <div className="bg-white/50 dark:bg-[#1E293B]/50 rounded-2xl p-4 mt-6 backdrop-blur-sm border border-white/40 dark:border-white/10">
                        <div className="flex justify-between items-center mb-1 group/conv relative z-50">
                            <span className="text-xs text-gray-500 dark:text-gray-300 dark:text-gray-500 flex items-center gap-1">
                                Conversão Estimada
                                <Info size={12} className="text-gray-300" />
                            </span>
                            <span className="text-xs font-bold text-green-600">{conversao}%</span>

                            <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-[#0A0A0A] text-white text-[10px] rounded-xl opacity-0 group-hover/conv:opacity-100 transition-opacity pointer-events-none border border-slate-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-50">
                                <p className="font-bold text-brand-cyan mb-1">Como é calculado?</p>
                                É a proporção de leads qualificados como <strong>Quentes (Hot)</strong> e <strong>Mornos (Warm)</strong> em relação ao total da base. Indica a taxa provável de sucesso comercial para priorização do time de vendas.
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-3 leading-tight">Projeção considerando o potencial de fechamento dos leads qualificados.</p>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-cyan rounded-full" style={{ width: `${conversao}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Qualification Logic (New) */}
                <div className="lg:col-span-3 bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between group h-full">
                    <div>
                        <h3 className="text-xl font-bold text-brand-dark dark:text-gray-100 mb-4">Lógica de Qualificação</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Hot (Quente)', range: '70-100 pts', color: 'bg-amber-400', text: 'Alta prontidão tecnológica e executiva.' },
                                { label: 'Warm (Morno)', range: '40-69 pts', color: 'bg-blue-400', text: 'Engajado, necessita de refinamento.' },
                                { label: 'Cold (Frio)', range: '0-39 pts', color: 'bg-gray-400', text: 'Baixo perfil de maturidade atual.' }
                            ].map((item, j) => (
                                <div key={j} className="flex gap-3 items-start">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.color}`} />
                                    <div>
                                        <div className="flex justify-between items-center w-full">
                                            <span className="text-[11px] font-bold text-brand-dark dark:text-gray-100">{item.label}</span>
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500">{item.range}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-300 font-light mt-0.5 leading-tight">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Card 3: Maturity Chart */}
                <div className="lg:col-span-3 bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col relative h-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-brand-dark dark:text-gray-100">Nível de Maturidade</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light mt-1">
                                    {(metrics.avgScore / 20).toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-300 dark:text-gray-500">Média Geral (1-5)</span>
                            </div>
                        </div>
                        <button className="bg-[#FCD34D] text-brand-dark dark:text-gray-100 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            Distribuição
                        </button>
                    </div>

                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.nivelChart}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#6B7280' }} interval={0} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6', opacity: 0.4 }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)' }}
                                />
                                <Bar dataKey="value" fill="#184E77" radius={[4, 4, 4, 4]} barSize={24}>
                                    {metrics.nivelChart.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#184E77' : '#76E2F4'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Card 4: Score Radial */}
                <div className="lg:col-span-3 bg-white/60 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-brand-dark dark:text-gray-100">Pontuação</h3>
                        <div className="relative">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className={`p-2 rounded-full shadow-sm transition-all cursor-pointer border ${showDatePicker ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white dark:bg-[#1E293B]text-gray-400 dark:text-gray-500 hover:bg-gray-50 border-transparent hover:border-brand-blue/20'}`}
                                title="Filtrar por data"
                            >
                                <Calendar size={16} />
                            </button>

                            {showDatePicker && (
                                <DatePicker
                                    dateRange={dateRange}
                                    onChange={setDateRange}
                                    onClose={() => setShowDatePicker(false)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center relative">
                        {/* Custom Radial Representation using Pie Chart */}
                        <div className="w-[220px] h-[220px]" style={{ overflow: 'visible' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart style={{ overflow: 'visible' }}>
                                    <Pie
                                        data={metrics.scoreChart}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        paddingAngle={5}
                                        cornerRadius={10}
                                    >
                                        {metrics.scoreChart.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#FCD34D' : COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-brand-dark dark:text-gray-100">
                                    {metrics.avgScore ? Math.round(metrics.avgScore) : 0}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-300 dark:text-gray-500 uppercase tracking-widest">Score Médio</span>
                                <span className="text-[10px] text-brand-blue font-semibold mt-1">
                                    {getMaturityFromScore(metrics.avgScore || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Summary */}
                <div className="lg:col-span-1 bg-white/40 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-6 shadow-lg flex flex-col gap-5">
                    <div>
                        <h3 className="font-bold text-brand-dark dark:text-gray-100 mb-1">Autoavaliação vs. Diagnóstico</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-300 dark:text-gray-500 leading-relaxed">
                            Compara o nível que cada empresa declarou com o nível calculado pelo score real. Quanto mais na diagonal, maior o autoconhecimento.
                        </p>
                    </div>
                    <div className="space-y-3">
                        {[
                            { label: 'Alinhados', count: matrixStats.aligned, color: '#76E2F4', bg: 'rgba(118,226,244,0.15)' },
                            { label: 'Superestimaram', count: matrixStats.overEstimated, color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
                            { label: 'Subestimaram', count: matrixStats.underEstimated, color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
                        ].map(({ label, count, color, bg }) => (
                            <div key={label} className="flex items-center justify-between rounded-2xl p-3 border border-white/50 dark:border-white/10" style={{ backgroundColor: bg }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                                    <span className="text-xs font-medium text-gray-700">{label}</span>
                                </div>
                                <span className="text-sm font-bold text-brand-dark dark:text-gray-100">{count}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed mt-auto">
                        <strong className="text-gray-500 dark:text-gray-300 dark:text-gray-500">Linha</strong> = nível declarado &nbsp;·&nbsp; <strong className="text-gray-500 dark:text-gray-300 dark:text-gray-500">Coluna</strong> = nível calculado pelo score
                    </p>
                </div>

                {/* Right: Matrix heatmap */}
                <div className="lg:col-span-2 bg-[#1E293B] text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-5 relative z-40">
                        <h3 className="text-lg font-bold">Declarado × Calculado</h3>
                        <div className="group relative cursor-help">
                            <Info size={14} className="text-gray-400 dark:text-gray-500 hover:text-brand-cyan transition-colors" />
                            <div className="absolute top-full left-0 mt-2 w-72 p-4 bg-[#0A0A0A] text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 leading-relaxed drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-50">
                                <p className="font-bold mb-2 text-brand-cyan text-xs">Entendendo a Matriz</p>
                                <p className="mb-2">Compara a <strong>autopercepção</strong> da empresa (o nível que ela achou que tinha) com a <strong>realidade</strong> apontada pelo algoritmo.</p>
                                <ul className="space-y-1.5 opacity-90">
                                    <li><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#76E2F4] mr-1.5"></span><strong>Linha diagonal:</strong> Autoconhecimento correto.</li>
                                    <li><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#F59E0B] mr-1.5"></span><strong>Acima (laranja):</strong> Ilusão de maturidade (superestimou).</li>
                                    <li><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#3B82F6] mr-1.5"></span><strong>Abaixo (azul):</strong> Mais madura do que pensava (subestimou).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-auto relative z-10">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left pb-3 pr-2 w-32">
                                        <span className="text-[9px] text-gray-500 dark:text-gray-300 dark:text-gray-500 font-normal leading-tight block">declarado ↓<br />calculado →</span>
                                    </th>
                                    {MATURITY_LEVELS.map((level, i) => (
                                        <th key={i} className="text-center pb-3 px-1 min-w-[56px]">
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">
                                                {level.slice(0, 3)}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MATURITY_LEVELS.map((rowLevel, ri) => (
                                    <tr key={ri}>
                                        <td className="text-[10px] text-gray-400 dark:text-gray-500 font-medium pr-2 py-1 truncate max-w-[128px]">
                                            {rowLevel}
                                        </td>
                                        {MATURITY_LEVELS.map((_, ci) => {
                                            const count = matrixData[ri][ci];
                                            const intensity = count > 0 ? 0.18 + (count / matrixMax) * 0.72 : 0;
                                            let bg = 'rgba(255,255,255,0.04)';
                                            let textColor = 'rgba(255,255,255,0.18)';
                                            if (count > 0) {
                                                if (ri === ci) bg = `rgba(118,226,244,${intensity})`;
                                                else if (ri > ci) bg = `rgba(245,158,11,${intensity})`;
                                                else bg = `rgba(59,130,246,${intensity})`;
                                                textColor = 'rgba(255,255,255,0.92)';
                                            }
                                            return (
                                                <td key={ci} className="py-1 px-1 text-center">
                                                    <div
                                                        className="rounded-lg py-2.5 text-sm font-bold transition-all cursor-default"
                                                        style={{ backgroundColor: bg, color: textColor }}
                                                        title={count > 0 ? `${rowLevel} → ${MATURITY_LEVELS[ci]}: ${count} empresa${count !== 1 ? 's' : ''}` : undefined}
                                                    >
                                                        {count > 0 ? count : '·'}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none"></div>
                </div>
            </div>
        </div >
    );
};
