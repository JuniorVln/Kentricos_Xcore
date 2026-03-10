import React, { useState } from 'react';
import { Settings, Moon, Sun, Monitor, BellRing, Shield, Database } from 'lucide-react';

interface ConfiguracoesProps {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    notifications: boolean;
    setNotifications: (notifications: boolean) => void;
    dailyReport: boolean;
    setDailyReport: (dailyReport: boolean) => void;
}

export const Configuracoes: React.FC<ConfiguracoesProps> = ({
    theme,
    setTheme,
    notifications,
    setNotifications,
    dailyReport,
    setDailyReport
}) => {

    return (
        <div className="space-y-8 animate-fade-in-up max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-brand-blue text-white rounded-2xl shadow-lg">
                    <Settings size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-brand-dark dark:text-white/90 mb-1 transition-colors">Configurações</h2>
                    <p className="text-gray-500 dark:text-gray-300 dark:text-gray-500 dark:text-gray-300 dark:text-gray-500 font-light transition-colors">Gerencie suas preferências de interface e sistema.</p>
                </div>
            </div>

            <div className="bg-white/60 dark:bg-[#1E293B]/60/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl transition-colors">

                {/* Interface & Theme */}
                <div className="p-6 md:p-8 border-b border-white/40 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                        <Monitor className="text-brand-blue" size={20} />
                        <h3 className="text-xl font-bold text-brand-dark dark:text-white/90">Aparência e Interface</h3>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-300 dark:text-gray-500 dark:text-gray-300 dark:text-gray-500 mb-4">Escolha seu tema favorito para o Dashboard. O Modo Noturno é ideal para ambientes com pouca luz.</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border flex-1 transition-all ${theme === 'light' ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-white dark:bg-[#1E293B]dark:bg-[#0A0A0A] text-gray-500 dark:text-gray-300 dark:text-gray-500 dark:text-gray-300 dark:text-gray-500 border-gray-200 dark:border-gray-700 dark:border-gray-700 hover:border-brand-blue/30 dark:hover:border-brand-blue/50 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                >
                                    <Sun size={18} />
                                    <span className="font-bold text-sm">Claro</span>
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border flex-1 transition-all ${theme === 'dark' ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-white dark:bg-[#1E293B]dark:bg-[#0A0A0A] text-gray-500 dark:text-gray-300 dark:text-gray-500 dark:text-gray-300 dark:text-gray-500 border-gray-200 dark:border-gray-700 dark:border-gray-700 hover:border-brand-blue/30 dark:hover:border-brand-blue/50 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                >
                                    <Moon size={18} />
                                    <span className="font-bold text-sm">Escuro</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="p-6 md:p-8 border-b border-white/40 dark:border-white/10 bg-white/30 dark:bg-black/10">
                    <div className="flex items-center gap-3 mb-6">
                        <BellRing className="text-brand-cyan" size={20} />
                        <h3 className="text-xl font-bold text-brand-dark dark:text-white/90">Notificações e Alertas</h3>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-white/50 dark:bg-[#1E293B]/50 dark:bg-white/5 rounded-2xl border border-white/50 dark:border-white/10 cursor-pointer hover:bg-white dark:bg-[#1E293B]dark:hover:bg-white/10 transition-colors">
                            <div>
                                <h4 className="font-bold text-brand-dark dark:text-white/90 text-sm">Notificações Push</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-300 dark:text-gray-500 dark:text-gray-300 dark:text-gray-500 mt-1">Receber alertas quando um novo lead nível "HOT" entrar no sistema.</p>
                            </div>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-[#1E293B]dark:bg-gray-200 border-4 appearance-none cursor-pointer border-brand-blue" checked={notifications} onChange={() => setNotifications(!notifications)} />
                                <label htmlFor="toggle1" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${notifications ? 'bg-brand-blue' : 'bg-gray-300 dark:bg-gray-600'}`}></label>
                            </div>
                        </label>

                        <label className="flex items-center justify-between p-4 bg-white/50 dark:bg-[#1E293B]/50 dark:bg-white/5 rounded-2xl border border-white/50 dark:border-white/10 cursor-pointer hover:bg-white dark:bg-[#1E293B]dark:hover:bg-white/10 transition-colors">
                            <div>
                                <h4 className="font-bold text-brand-dark dark:text-white/90 text-sm">Relatório Diário</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-300 dark:text-gray-500 dark:text-gray-300 dark:text-gray-500 mt-1">Receber um resumo diário dos leads e métricas no seu e-mail.</p>
                            </div>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-[#1E293B]dark:bg-gray-200 border-4 appearance-none cursor-pointer border-brand-blue" checked={dailyReport} onChange={() => setDailyReport(!dailyReport)} />
                                <label htmlFor="toggle2" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${dailyReport ? 'bg-brand-blue' : 'bg-gray-300 dark:bg-gray-600'}`}></label>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Admin Details */}
                <div className="p-6 md:p-8 bg-brand-dark dark:bg-black/60 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="text-brand-cyan" size={20} />
                        <h3 className="text-xl font-bold">Banco de Dados (Mock)</h3>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">As regras de processamento (scoring_config.json) estão conectadas no backend.</p>
                    <div className="flex items-center gap-2">
                        <Shield className="text-green-400" size={16} />
                        <span className="text-sm font-medium text-green-400">Conexão Segura e Atualizada</span>
                    </div>
                </div>

            </div>

            <style>{`
                .toggle-checkbox:checked { right: 0; border-color: #184E77; }
                .toggle-checkbox:checked + .toggle-label { background-color: #184E77; }
                .toggle-checkbox { left: 0; transition: all 0.3s; }
            `}</style>
        </div>
    );
};
