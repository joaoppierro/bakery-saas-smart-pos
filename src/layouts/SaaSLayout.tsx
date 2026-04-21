import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings2, Clock, 
  LogOut, TrendingUp, BarChart3, ChefHat, Calculator,
  AlertCircle, CloudRain, Sparkles, Menu, X
} from 'lucide-react';

export default function SaaSLayout() {
  const { logout, user } = useAuth();
  const { tenant } = useTenant();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight truncate">
              {tenant ? tenant.name : 'Meu negócio'}
            </h1>
            <p className="text-xs text-blue-400 mt-1 font-bold tracking-wider">SISTEMA ERP</p>
          </div>
          {/* Botão de Fechar exclusivo do Mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
    
          <div className="px-6 mb-3 text-xs font-black text-slate-500 uppercase tracking-wider">
            1. Gestão de Estoque
          </div>
          <ul className="space-y-1 px-3 mb-8">
            <li>
              <Link to="/estoque/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/estoque/dashboard') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                <LayoutDashboard size={18} /> Visão Geral
              </Link>
            </li>
            <li>
              <Link to="/estoque/catalogo" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/estoque/catalogo') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                <Package size={18} /> Catálogo Base
              </Link>
            </li>
            <li>
              <Link to="/estoque/pdv" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/estoque/pdv') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                <ShoppingCart size={18} /> Frente de Caixa (PDV)
              </Link>
            </li>
            <li>
              <Link to="/estoque/ajustes" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/estoque/ajustes') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                <Settings2 size={18} /> Ajustes e Entradas
              </Link>
            </li>
            <li>
              <Link to="/estoque/historico" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/estoque/historico') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                <Clock size={18} /> Histórico (Auditoria)
              </Link>
            </li>
          </ul>

           <div className="px-6 mb-3 text-xs font-black text-slate-500 uppercase tracking-wider">
            2. Precificação
          </div>
          <ul className="space-y-1 px-3 mb-8">
            <li>
              <Link to="/precificacao/fichas-tecnicas" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/precificacao/fichas-tecnicas') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                <ChefHat size={18} /> Fichas Técnicas
              </Link>
            </li>
            <li>
              <Link to="/precificacao/mix" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/precificacao/mix') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                <TrendingUp size={18} /> Simulador de Mix
              </Link>
            </li>
            <li>
              <Link to="/precificacao/configuracoes" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/precificacao/configuracoes') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                <Calculator size={18} /> Parâmetros Globais
              </Link>
            </li>
          </ul>

             <div className="px-6 mb-3 text-xs font-black text-slate-500 uppercase tracking-wider">
            3. Previsão e Demanda
          </div>
          <ul className="space-y-1 px-3 mb-8">
            <li>
              <Link to="/demanda/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/demanda/dashboard') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                <BarChart3 size={18} /> Painel de Demanda
              </Link>
            </li>
            <li>
              <Link to="/demanda/feedback" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/demanda/feedback') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                <AlertCircle size={18} /> Reg. de Rupturas
              </Link>
            </li>
            <li>
              <Link to="/demanda/contexto" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/demanda/contexto') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                <CloudRain size={18} /> Diário de Contexto
              </Link>
            </li>
            <li>
              <Link to="/demanda/planejador" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/demanda/planejador') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                <Sparkles size={18} /> Planejador IA
              </Link>
            </li>
          </ul>

        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-inner">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-3 py-2.5 text-sm font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-colors">
            <LogOut size={16} /> Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 lg:px-8 shadow-sm shrink-0 justify-between">
          
          <div className="flex items-center gap-3">
               <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={24} />
            </button>
            
            <h2 className="font-bold text-slate-800 text-lg hidden sm:block">
              {isActive('/estoque') ? 'Módulo de Estoque' : isActive('/precificacao') ? 'Engenharia de Cardápio' : isActive('/demanda') ? 'Inteligência de Demanda' : 'Painel de Controle'}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline">Sistema Online</span>
            <span className="sm:hidden">Online</span>
          </div>
        </header>
        
        {/* Aqui é onde o App.tsx injeta as telas */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </div>

      </main>

    </div>
  );
}