import { Settings, Bell } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    currentTab: string;
    setTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentTab, setTab }) => {


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EDEDED] via-[#E0E7FF] to-[#D1FAE5] dark:from-[#050505] dark:via-[#0F172A] dark:to-[#0A0A0A] font-sans text-brand-dark dark:text-white dark:text-gray-100 overflow-x-hidden selection:bg-brand-cyan/30 transition-colors duration-500">
            {/* Top Navigation Bar */}
            <header className="px-8 py-6 flex items-center justify-between relative z-50 mb-8">
                {/* Logo Area */}
                <div className="flex items-center gap-2">
                    <div className="bg-white/80 dark:bg-[#1E293B]/80/80 backdrop-blur-xl px-12 py-1.5 rounded-full shadow-sm border border-white/40 dark:border-white/10 transition-colors">
                        <img src="/logo.png" alt="Xcore" className="h-9 w-auto dark:invert dark:brightness-0" />
                    </div>
                </div>

                {/* Main Navigation - Pill Style */}
                <nav className="hidden md:flex items-center bg-white/60 dark:bg-[#1E293B]/60/60 backdrop-blur-xl px-2 py-2 rounded-full shadow-sm border border-white/40 dark:border-white/10 transition-colors">
                    <button
                        onClick={() => setTab('geral')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentTab === 'geral'
                            ? 'bg-brand-dark text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-300 hover:text-brand-dark dark:text-white hover:bg-white/50 dark:bg-[#1E293B]/50'
                            }`}
                    >
                        Visão Geral
                    </button>
                    <button
                        onClick={() => setTab('leads')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentTab === 'leads'
                            ? 'bg-brand-dark text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-300 hover:text-brand-dark dark:text-white hover:bg-white/50 dark:bg-[#1E293B]/50'
                            }`}
                    >
                        Leads
                    </button>
                    <button
                        onClick={() => setTab('relatorios')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentTab === 'relatorios'
                            ? 'bg-brand-dark text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-300 hover:text-brand-dark dark:text-white hover:bg-white/50 dark:bg-[#1E293B]/50'
                            }`}
                    >
                        Relatórios
                    </button>
                    <button
                        onClick={() => setTab('documentacao')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentTab === 'documentacao'
                            ? 'bg-brand-dark text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-300 hover:text-brand-dark dark:text-white hover:bg-white/50 dark:bg-[#1E293B]/50'
                            }`}
                    >
                        Docs
                    </button>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3 relative z-50">
                    <button
                        onClick={() => setTab('configuracoes')}
                        className={`p-3 backdrop-blur-xl rounded-full shadow-sm border border-white/40 dark:border-white/10 transition-colors cursor-pointer ${currentTab === 'configuracoes' ? 'bg-brand-blue text-white' : 'bg-white/80 dark:bg-[#1E293B]/80 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-brand-blue'} `}
                        title="Configurações"
                    >
                        <Settings size={20} />
                    </button>

                    {/* Notifications Button & Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                const el = document.getElementById('notif-dropdown');
                                if (el) el.classList.toggle('hidden');
                            }}
                            className="p-3 bg-white/80 dark:bg-[#1E293B]/80/80 backdrop-blur-xl rounded-full text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-300 hover:text-brand-blue dark:hover:text-white shadow-sm border border-white/40 dark:border-white/10 transition-colors cursor-pointer relative"
                            title="Notificações"
                        >
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-cyan rounded-full ring-2 ring-white"></span>
                        </button>

                        <div id="notif-dropdown" className="hidden absolute top-full right-0 mt-3 w-80 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center mb-4 px-2">
                                <h4 className="font-bold text-brand-dark dark:text-white">Notificações</h4>
                                <span className="text-[10px] bg-brand-cyan/20 text-brand-dark dark:text-white dark:text-brand-cyan px-2 py-0.5 rounded-full font-bold">2 novas</span>
                            </div>
                            <div className="space-y-2">
                                <div className="p-3 bg-gray-50/80 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-700 dark:border-white/5 hover:bg-brand-cyan/5 transition-colors cursor-pointer">
                                    <p className="text-xs font-bold text-brand-dark dark:text-white mb-1">Novo Lead HOT 🔥</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500">A empresa <strong>Alpha Global</strong> acaba de atingir 92pts.</p>
                                </div>
                                <div className="p-3 bg-gray-50/80 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-700 dark:border-white/5 hover:bg-brand-cyan/5 transition-colors cursor-pointer">
                                    <p className="text-xs font-bold text-brand-dark dark:text-white mb-1">Atualização no Sistema</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500">As regras de pontuação (scoring_config) foram sincronizadas.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pl-2">
                        <div
                            onClick={() => alert("Perfil do Usuário: Kentricos")}
                            className="h-10 w-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white ring-2 ring-brand-cyan/20 cursor-pointer hover:ring-brand-cyan/50 transition-all"
                            title="Perfil"
                        >
                            K
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Button (Visible only on small screens) */}
            <div className="md:hidden px-8 pb-4 flex justify-center">
                <nav className="flex items-center bg-white/60 dark:bg-[#1E293B]/60/60 backdrop-blur-xl px-1 py-1 rounded-full shadow-sm border border-white/40 dark:border-white/10 w-full justify-between transition-colors">
                    <button
                        onClick={() => setTab('geral')}
                        className={`flex-1 py-2 rounded-full text-xs font-medium transition-all duration-300 ${currentTab === 'geral' ? 'bg-brand-dark dark:bg-white dark:bg-[#1E293B]text-white dark:text-brand-dark dark:text-white shadow-md' : 'text-gray-600 dark:text-gray-300'
                            }`}
                    >
                        Geral
                    </button>
                    <button
                        onClick={() => setTab('leads')}
                        className={`flex-1 py-2 rounded-full text-xs font-medium transition-all duration-300 ${currentTab === 'leads' ? 'bg-brand-dark dark:bg-white dark:bg-[#1E293B]text-white dark:text-brand-dark dark:text-white shadow-md' : 'text-gray-600 dark:text-gray-300'
                            }`}
                    >
                        Leads
                    </button>
                    <button
                        onClick={() => setTab('relatorios')}
                        className={`flex-1 py-2 rounded-full text-xs font-medium transition-all duration-300 ${currentTab === 'relatorios' ? 'bg-brand-dark dark:bg-white dark:bg-[#1E293B]text-white dark:text-brand-dark dark:text-white shadow-md' : 'text-gray-600 dark:text-gray-300'
                            }`}
                    >
                        Relatórios
                    </button>
                    <button
                        onClick={() => setTab('documentacao')}
                        className={`flex-1 py-2 rounded-full text-xs font-medium transition-all duration-300 ${currentTab === 'documentacao' ? 'bg-brand-dark dark:bg-white dark:bg-[#1E293B]text-white dark:text-brand-dark dark:text-white shadow-md' : 'text-gray-600 dark:text-gray-300'
                            }`}
                    >
                        Docs
                    </button>
                </nav>
            </div>

            {/* Main Content Area - Full Width */}
            <main className="px-4 md:px-8 pb-8 max-w-[1600px] mx-auto">
                <div className="animate-fade-in-up">
                    {children}
                </div>
            </main>
        </div>
    );
};
