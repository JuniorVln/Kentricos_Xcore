import React from 'react';
import { BookOpen, Calculator, Target, Zap, ShieldAlert, BarChart3, Database } from 'lucide-react';

export const Documentacao: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in-up max-w-5xl mx-auto pb-12">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-brand-blue text-white rounded-2xl shadow-lg">
                    <BookOpen size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-brand-dark dark:text-white mb-1 transition-colors">Documentação do Sistema</h2>
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 font-light transition-colors">Entenda como funcionam os cálculos, regras e metodologias por trás do XCore.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Algoritmo de Diagnóstico */}
                <div className="bg-white/60 dark:bg-[#1E293B]/60/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-8 shadow-xl transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                        <Calculator className="text-brand-blue" size={24} />
                        <h3 className="text-xl font-bold text-brand-dark dark:text-white">Algoritmo de Cálculo</h3>
                    </div>
                    <div className="space-y-4 text-gray-600 dark:text-gray-200 text-sm leading-relaxed">
                        <p>
                            O Score de Maturidade é calculado convertendo as respostas de múltipla escolha (geralmente notas de 1 a 5) em uma escala percentual de <strong>0 a 100 pontos</strong>.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Cada pergunta ou eixo temólico recebe um peso específico.</li>
                            <li>A pontuação total é a soma ponderada de todos os eixos avaliados.</li>
                            <li>Leads que não preenchem todas as respostas obrigatórias não recebem o <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">pontuacaoTotalFinal</code> e são ignorados nos totais concluídos.</li>
                        </ul>
                    </div>
                </div>

                {/* Qualificação de Leads */}
                <div className="bg-white/60 dark:bg-[#1E293B]/60/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-8 shadow-xl transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="text-brand-cyan" size={24} />
                        <h3 className="text-xl font-bold text-brand-dark dark:text-white">Qualificação & Temperatura</h3>
                    </div>
                    <div className="space-y-4 text-gray-600 dark:text-gray-200 text-sm leading-relaxed">
                        <p>
                            Após o cálculo do score final, as empresas são enquadradas em 3 faixas de temperatura (flag de prioridade comercial), definindo a proximidade para o fechamento.
                        </p>
                        <div className="space-y-3 mt-4">
                            <div className="flex border-l-4 border-amber-400 pl-3">
                                <div>
                                    <h4 className="font-bold text-brand-dark dark:text-white uppercase text-xs tracking-wider">HOT (70 - 100 pts)</h4>
                                    <p className="text-xs">Elevada prontidão para projeto de transformação.</p>
                                </div>
                            </div>
                            <div className="flex border-l-4 border-blue-400 pl-3">
                                <div>
                                    <h4 className="font-bold text-brand-dark dark:text-white uppercase text-xs tracking-wider">WARM (40 - 69 pts)</h4>
                                    <p className="text-xs">Identificam os déficits, mas ainda necessitam amadurecimento ou planejamento orçamentário.</p>
                                </div>
                            </div>
                            <div className="flex border-l-4 border-gray-400 pl-3">
                                <div>
                                    <h4 className="font-bold text-brand-dark dark:text-white uppercase text-xs tracking-wider">COLD (0 - 39 pts)</h4>
                                    <p className="text-xs">Baixo desempenho ou ainda operam majoritariamente de forma manual/ad-hoc.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Níveis de Maturidade */}
                <div className="bg-white/60 dark:bg-[#1E293B]/60/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-8 shadow-xl md:col-span-2 transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className="text-brand-blue" size={24} />
                        <h3 className="text-xl font-bold text-brand-dark dark:text-white">Escala de Maturidade</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                            { name: 'Inicial', points: '0-30', label: 'Manual' },
                            { name: 'Conscientização', points: '31-60', label: 'Reconhecimento' },
                            { name: 'Organizacional', points: '61-80', label: 'Evolução' },
                            { name: 'Estruturação', points: '81-90', label: 'Sistematização' },
                            { name: 'Proatividade', points: '91-100', label: 'Otimização Contínua' }
                        ].map((level, i) => (
                            <div key={i} className="bg-white/50 dark:bg-[#1E293B]/50 dark:bg-white/5 border border-white dark:border-white/10 p-4 rounded-2xl text-center shadow-sm">
                                <span className="block text-xs font-bold text-brand-cyan mb-1">{level.points} pts</span>
                                <h4 className="font-bold text-brand-dark dark:text-white mb-1 text-sm">{level.name}</h4>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase font-medium">{level.label}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-6 text-center">
                        <Zap className="inline-block mb-1 text-brand-cyan" size={14} /> Na Matriz (Declarado x Calculado), mapeamos a distorção entre onde a empresa acha que está, frente à sua pontuação real calculada tecnicamente.
                    </p>
                </div>

                {/* Regras e Pesos */}
                <div className="bg-gradient-to-r from-brand-dark to-brand-blue text-white rounded-3xl p-8 shadow-xl md:col-span-2 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldAlert className="text-brand-cyan" size={24} />
                            <h3 className="text-xl font-bold text-white">Importante: Score Baseado no Cargo</h3>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">
                            Além das respostas objetivas, nosso sistema avalia o impacto e o nível de decisão do <strong>cargo do respondente</strong>. Existe um peso adicional conferido a cargos de nível "C-Level" ou "Diretoria", porque eles costumam possuir verba dedicada e percepção real do risco estratégico. Respostas dadas por analistas podem ter um 'downgrade' ou fator de desconto na temperatura final (Hot/Warm/Cold), pois não são, geralmente, os pagadores/tomadores de decisão reais da organização.
                        </p>
                    </div>
                    <div className="w-full md:w-1/3 flex justify-center">
                        <div className="p-4 bg-white/10 border border-white/20 rounded-2xl w-full">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-3 flex items-center justify-center gap-2">
                                <Database size={14} /> Fonte da Verdade
                            </h4>
                            <p className="text-xs text-center text-white/90">
                                As configurações rígidas de pesos e lógicas de cargos estão salvas no arquivo <code>scoring_config.json</code> no backend (conforme arquivo de memória do sistema).
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
