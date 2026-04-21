import { useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { LayoutDashboard, Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { globalProducts, globalMovements } = useTenant();

  const metrics = useMemo(() => {
    const totalItems = globalProducts.length;
    
    const totalValue = globalProducts.reduce((acc, p) => {
      const cost = Number(p.costPrice) || 0;
      const stock = Number(p.currentStock) || 0;
      return acc + (cost * stock);
    }, 0);

    const lowStock = globalProducts.filter(p => {
      const stock = Number(p.currentStock) || 0;
      const min = Number(p.minStock) || 0;
      return stock <= min && min > 0;
    }).length;
    
    const recentExits = globalMovements.filter(m => m.type === 'EXIT').length;

    return { totalItems, totalValue, lowStock, recentExits };
  }, [globalProducts, globalMovements]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animation-fade-in">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
            <LayoutDashboard size={28} strokeWidth={2.5} />
          </div>
          Visão Geral do Negócio
        </h1>
        <p className="text-slate-500 font-medium ml-16">
          Acompanhe os indicadores principais do seu estoque e movimentações em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Package size={24} strokeWidth={2.5} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Itens no Catálogo</p>
          </div>
          <div className="mt-auto">
            <p className="text-4xl font-black text-slate-800">{metrics.totalItems}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-40 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full z-0 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign size={24} strokeWidth={2.5} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capital Imobilizado</p>
          </div>
          <div className="mt-auto relative z-10">
            <p className="text-3xl font-black text-slate-800 tracking-tight">{formatCurrency(metrics.totalValue)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-40 relative overflow-hidden">
          {metrics.lowStock > 0 && (
             <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
          )}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${metrics.lowStock > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
              <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estoque Crítico</p>
          </div>
          <div className="mt-auto flex items-baseline gap-2">
            <p className={`text-4xl font-black ${metrics.lowStock > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
              {metrics.lowStock}
            </p>
            <p className="text-sm font-bold text-slate-400">produtos</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp size={24} strokeWidth={2.5} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saídas Registradas</p>
          </div>
          <div className="mt-auto flex items-baseline gap-2">
            <p className="text-4xl font-black text-slate-800">{metrics.recentExits}</p>
            <p className="text-sm font-bold text-slate-400">operações</p>
          </div>
        </div>

      </div>
    </div>
  );
}