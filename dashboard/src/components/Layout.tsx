import { Settings, Bell } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    currentTab: string;
    setTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentTab, setTab }) => {


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EDEDED] via-[#E0E7FF] to-[#D1FAE5] font-sans text-brand-dark overflow-x-hidden selection:bg-brand-cyan/30">
            {/* Top Navigation Bar */}
            <header className="px-8 py-6 flex items-center justify-between relative z-50 mb-8">
                {/* Logo Area */}
                <div className="flex items-center gap-2">
                    <div className="bg-white/80 backdrop-blur-xl px-12 py-1.5 rounded-full shadow-sm border border-white/40">
                        <img src="/logo.png" alt="Xcore" className="h-9 w-auto" />
                    </div>
                </div>

                {/* Main Navigation - Pill Style */}
                <nav className="hidden md:flex items-center bg-white/60 backdrop-blur-xl px-2 py-2 rounded-full shadow-sm border border-white/40">
                    <button
                        onClick={() => setTab('geral')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentTab === 'geral'
                            ? 'bg-brand-dark text-white shadow-md'
                            : 'text-gray-600 hover:text-brand-dark hover:bg-white/50'
                            }`}
                    >
                        Visão Geral
                    </button>
                    <button
                        onClick={() => setTab('leads')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentTab === 'leads'
                            ? 'bg-brand-dark text-white shadow-md'
                            : 'text-gray-600 hover:text-brand-dark hover:bg-white/50'
                            }`}
                    >
                        Leads
                    </button>
                    <button
                        onClick={() => setTab('relatorios')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentTab === 'relatorios'
                            ? 'bg-brand-dark text-white shadow-md'
                            : 'text-gray-600 hover:text-brand-dark hover:bg-white/50'
                            }`}
                    >
                        Relatórios
                    </button>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3 relative z-50">
                    <button
                        onClick={() => alert("Configurações em desenvolvimento!")}
                        className="p-3 bg-white/80 backdrop-blur-xl rounded-full text-gray-500 hover:text-brand-blue shadow-sm border border-white/40 transition-colors cursor-pointer"
                        title="Configurações"
                    >
                        <Settings size={20} />
                    </button>
                    <button
                        onClick={() => alert("Sem novas notificações.")}
                        className="p-3 bg-white/80 backdrop-blur-xl rounded-full text-gray-500 hover:text-brand-blue shadow-sm border border-white/40 transition-colors cursor-pointer"
                        title="Notificações"
                    >
                        <Bell size={20} />
                    </button>
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
                <nav className="flex items-center bg-white/60 backdrop-blur-xl px-1 py-1 rounded-full shadow-sm border border-white/40 w-full justify-between">
                    <button
                        onClick={() => setTab('geral')}
                        className={`flex-1 py-2 rounded-full text-xs font-medium transition-all duration-300 ${currentTab === 'geral' ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600'
                            }`}
                    >
                        Geral
                    </button>
                    <button
                        onClick={() => setTab('leads')}
                        className={`flex-1 py-2 rounded-full text-xs font-medium transition-all duration-300 ${currentTab === 'leads' ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600'
                            }`}
                    >
                        Leads
                    </button>
                    <button
                        onClick={() => setTab('relatorios')}
                        className={`flex-1 py-2 rounded-full text-xs font-medium transition-all duration-300 ${currentTab === 'relatorios' ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600'
                            }`}
                    >
                        Relatórios
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
