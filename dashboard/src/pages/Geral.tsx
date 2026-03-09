import React from 'react';
import { useMetrics } from '../hooks/useMetrics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Calendar, Users, TrendingUp, Info } from 'lucide-react';
import { DatePicker } from '../components/DatePicker';

const COLORS = ['#76E2F4', '#184E77', '#0E334F', '#00A8E8', '#007EA7', '#003459'];

export const Geral: React.FC = () => {
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [dateRange, setDateRange] = React.useState<{ from: Date | undefined, to: Date | undefined }>({
        from: undefined,
        to: undefined
    });

    const { loading, error, metrics } = useMetrics(dateRange.from, dateRange.to);

    if (loading) return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between items-center mb-8">
                <div className="h-8 w-48 bg-gray-200 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-white/50 rounded-xl" />
                ))}
            </div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl">Erro ao carregar dados: {JSON.stringify(error)}</div>;
    if (!metrics) return <div className="p-8 text-center text-gray-500">Nenhum dado encontrado.</div>;

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-4xl font-light text-brand-dark mb-1">
                        Bem-vindo, <span className="font-semibold">Kentricos</span>
                    </h2>
                    <p className="text-gray-500 font-light">Monitoramento estratégico de maturidade de leads.</p>
                </div>

                {/* Top Stats - Pill Style */}
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="bg-white/60 backdrop-blur-md border border-white/50 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 group hover:bg-white transition-all cursor-default">
                        <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl group-hover:scale-110 transition-transform">
                            <Users size={18} />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Concluídos</span>
                                <div className="group/info relative">
                                    <Info size={10} className="text-gray-400" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-brand-dark text-white text-[9px] rounded-lg opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50">
                                        Considera apenas diagnósticos com pontuação final calculada (completos).
                                    </div>
                                </div>
                            </div>
                            <p className="text-xl font-bold text-brand-dark leading-none mt-0.5">{metrics.total}</p>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md border border-white/50 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 group hover:bg-white transition-all cursor-default">
                        <div className="p-2 bg-[#FCD34D]/10 text-brand-dark rounded-xl group-hover:scale-110 transition-transform">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Score Médio</span>
                            <p className="text-xl font-bold text-brand-dark leading-none mt-0.5">{Math.round(metrics.avgScore)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[380px]">

                {/* Card 1: Highlight / Profile Style (Left - 3 cols) */}
                <div className="lg:col-span-3 bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-xl border border-white/50 rounded-3xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-brand-bg shadow-inner mb-4 overflow-hidden">
                            <img src="/logo.png" alt="Xcore" className="w-full h-full object-contain p-2 opacity-80 mix-blend-multiply" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark">Relatório XCore</h3>
                        <p className="text-sm text-gray-500 mt-1">Análise de maturidade em tempo real.</p>
                    </div>

                    <div className="bg-white/50 rounded-2xl p-4 mt-6 backdrop-blur-sm border border-white/40">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500 cursor-help" title="Cálculo baseado no volume de leads 'Hot' e 'Warm' em relação ao total">Conversão Estimada</span>
                            <span className="text-xs font-bold text-green-600">+12%</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mb-3 leading-tight">Projeção considerando o potencial de fechamento dos leads qualificados.</p>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-cyan w-[65%] rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Qualification Logic (New) */}
                <div className="lg:col-span-3 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between group h-full">
                    <div>
                        <h3 className="text-xl font-bold text-brand-dark mb-4">Lógica de Qualificação</h3>
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
                                            <span className="text-[11px] font-bold text-brand-dark">{item.label}</span>
                                            <span className="text-[10px] text-gray-400">{item.range}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-light mt-0.5 leading-tight">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Card 3: Maturity Chart */}
                <div className="lg:col-span-3 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl flex flex-col relative h-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-brand-dark">Nível de Maturidade</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light mt-1">
                                    {(metrics.avgScore / 20).toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-500">Média Geral (1-5)</span>
                            </div>
                        </div>
                        <button className="bg-[#FCD34D] text-brand-dark text-xs font-bold px-3 py-1 rounded-full shadow-sm">
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
                <div className="lg:col-span-3 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-brand-dark">Pontuação</h3>
                        <div className="relative">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className={`p-2 rounded-full shadow-sm transition-all cursor-pointer border ${showDatePicker ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-400 hover:bg-gray-50 border-transparent hover:border-brand-blue/20'}`}
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
                        <div className="w-[220px] h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
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
                                <span className="text-3xl font-bold text-brand-dark">
                                    {metrics.avgScore ? Math.round(metrics.avgScore) : 0}
                                </span>
                                <span className="text-xs text-gray-500 uppercase tracking-widest">Score Médio</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* List Widget (Left) */}
                <div className="lg:col-span-1 bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-lg h-[400px] overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-brand-dark">Categorias</h3>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {['Tecnologia e Dados', 'Processos e Governança', 'Pessoas e Cultura', 'Resultados e Métricas'].map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                                className={`w-full group p-4 rounded-2xl transition-all cursor-pointer border shadow-sm flex justify-between items-center text-left ${activeCategory === cat
                                    ? 'bg-white border-brand-cyan ring-1 ring-brand-cyan shadow-md'
                                    : 'bg-white/60 hover:bg-white border-transparent hover:border-brand-cyan/30'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${activeCategory === cat ? 'bg-brand-cyan' : 'bg-gray-300 group-hover:bg-brand-blue'}`}></div>
                                    <span className={`text-sm font-medium ${activeCategory === cat ? 'text-brand-dark' : 'text-gray-600 group-hover:text-brand-dark'}`}>{cat}</span>
                                </div>
                                <span className={`text-xs ${activeCategory === cat ? 'text-brand-cyan font-bold' : 'text-gray-400'}`}>
                                    {activeCategory === cat ? 'Ativo' : 'Ver'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline / Scatter Chart (Right - 2 cols) */}
                <div className="lg:col-span-2 bg-[#1E293B] text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden h-[400px]">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold">Expectativa vs. Realidade</h3>
                                <div className="group relative cursor-help">
                                    <Info size={14} className="text-gray-400 hover:text-brand-cyan transition-colors" />
                                    <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-brand-dark text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl z-20 pointer-events-none border border-white/10">
                                        <p className="font-bold mb-1 underline decoration-brand-cyan">O que isso mede?</p>
                                        A diferença entre a percepção do cliente (X) e a pontuação real do diagnóstico (Y).
                                        Pontos fora da diagonal indicam lacunas de autoconhecimento ou excesso de otimismo.
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">
                                {activeCategory ? `Filtrado por: ${activeCategory}` : 'Cruzamento de autodeclaração e score real.'}
                            </p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis
                                    dataKey="autoLevel"
                                    type="category"
                                    name="Nível Declarado"
                                    fontSize={10}
                                    tick={{ fill: '#888' }}
                                    allowDuplicatedCategory={false}
                                    axisLine={{ stroke: '#333' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    dataKey="score"
                                    type="number"
                                    name="Score"
                                    unit="pts"
                                    fontSize={10}
                                    tick={{ fill: '#888' }}
                                    domain={[0, 100]}
                                    axisLine={{ stroke: '#333' }}
                                    tickLine={false}
                                />
                                <ZAxis dataKey="revenue" range={[60, 400]} name="Receita" />
                                <Tooltip
                                    cursor={{ strokeDasharray: '3 3', stroke: '#555' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-[#1E293B] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl min-w-[200px]">
                                                    <p className="text-brand-cyan text-sm font-bold border-b border-white/10 pb-2 mb-2">{data.name}</p>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[11px]">
                                                            <span className="text-gray-400">Score Real:</span>
                                                            <span className="font-bold text-white">{data.score} pts</span>
                                                        </div>
                                                        <div className="flex justify-between text-[11px]">
                                                            <span className="text-gray-400">Nível Declarado:</span>
                                                            <span className="font-bold text-white">{data.autoLevel}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[11px]">
                                                            <span className="text-gray-400">Receita:</span>
                                                            <span className="font-bold text-white truncate max-w-[80px]">{data.revenue}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Scatter name="Empresas" data={metrics.expectationChart} fill="#76E2F4" shape="circle" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Dark Card Decoration */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none"></div>
                </div>
            </div>
        </div >
    );
};
