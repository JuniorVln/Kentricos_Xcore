import React from 'react';
import { useMetrics } from '../hooks/useMetrics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Calendar } from 'lucide-react';
import { DatePicker } from '../components/DatePicker';

const COLORS = ['#76E2F4', '#184E77', '#0E334F', '#00A8E8', '#007EA7', '#003459'];

export const Geral: React.FC = () => {
    const { loading, error, metrics } = useMetrics();
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [dateRange, setDateRange] = React.useState<{ from: Date | undefined, to: Date | undefined }>({
        from: undefined,
        to: undefined
    });

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
                <div className="flex flex-wrap gap-4 items-center bg-white/30 p-2 rounded-full border border-white/40 backdrop-blur-md">
                    <div className="px-8 py-2 bg-brand-dark text-white rounded-full shadow-lg flex items-center gap-3">
                        <span className="text-sm opacity-70">Total:</span>
                        <span className="text-xl font-bold">{metrics.total}</span>
                    </div>
                    <div className="px-8 py-2 bg-[#FCD34D] text-brand-dark rounded-full shadow-lg flex items-center gap-3">
                        <span className="text-sm font-medium opacity-80">Média Score:</span>
                        <span className="text-xl font-bold">{Math.round(metrics.avgScore)}</span>
                    </div>
                    <div className="px-4 py-1 flex items-center gap-6">
                        <div className="h-6 w-[1px] bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Leads Quentes</span>
                            <span className="text-xl font-light text-brand-dark">{metrics.quality.hot}</span>
                        </div>
                        <div className="h-6 w-[1px] bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Faltando Dados</span>
                            <span className="text-xl font-light text-brand-dark">{metrics.quality.cold}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[380px]">

                {/* Card 1: Highlight / Profile Style (Left - 3 cols) */}
                <div className="lg:col-span-3 bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-xl border border-white/50 rounded-3xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-brand-bg shadow-inner mb-4 overflow-hidden">
                            <img src="/logo.png" alt="Xcore" className="w-full h-full object-contain p-2 opacity-80 mix-blend-multiply" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark">Relatório XCore</h3>
                        <p className="text-sm text-gray-500 mt-1">Análise de maturidade em tempo real.</p>
                    </div>

                    <div className="bg-white/50 rounded-2xl p-4 mt-6 backdrop-blur-sm border border-white/40">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">Conversão Estimada</span>
                            <span className="text-xs font-bold text-green-600">+12%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-cyan w-[65%] rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Progress / Maturity Chart (Center - 4 cols) */}
                <div className="lg:col-span-5 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl flex flex-col relative">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-brand-dark">Nível de Maturidade</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light mt-1">4.2</span>
                                <span className="text-xs text-gray-500">Média Geral</span>
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

                {/* Card 3: Time Tracker / Score Radial (Right - 4 cols) */}
                <div className="lg:col-span-4 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl flex flex-col">
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
                            <h3 className="text-lg font-bold">Expectativa vs. Realidade</h3>
                            <p className="text-xs text-gray-400 mt-1">
                                {activeCategory ? `Filtrado por: ${activeCategory}` : 'Análise de coerência entre autodeclaração e score real.'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/10">30 dias</span>
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
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', backgroundColor: '#1E293B', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
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
