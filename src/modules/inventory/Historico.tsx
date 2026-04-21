import { useState, useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { History, ArrowDownRight, ArrowUpRight, Search, Filter, PackageSearch } from 'lucide-react';

export default function Historico() {
  const { globalMovements, globalProducts } = useTenant();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, ENTRY, EXIT

  const enrichedMovements = useMemo(() => {
    return globalMovements.map(m => {
      const product = globalProducts.find(p => p.id === m.productId);
      return {
        ...m,
        productName: product?.name || 'Produto Excluído/Desconhecido',
        productType: product?.type || 'UNKNOWN',
        unit: product?.unit || 'UN'
      };
    }).sort((a, b) => new Date(b.dateString).getTime() - new Date(a.dateString).getTime());
  }, [globalMovements, globalProducts]);

  const filteredMovements = useMemo(() => {
    return enrichedMovements.filter(m => {
      const matchesSearch = m.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (m.reason || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || m.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [enrichedMovements, searchTerm, filterType]);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).format(d);
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
            <History size={28} strokeWidth={2.5} />
          </div>
          Histórico de Movimentações
        </h1>
        <p className="text-slate-500 font-medium ml-16">
          Auditoria completa de Entradas (Produção/Compras) e Saídas (Vendas/Consumo).
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        
        <div className="flex-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          <div className="pl-4 text-slate-400">
            <Search size={22} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por produto ou motivo (ex: Venda, Produção)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent py-3 pr-4 outline-none font-bold text-slate-700 placeholder:text-slate-300"
          />
        </div>
        
        <div className="md:w-64 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          <div className="pl-4 text-slate-400">
            <Filter size={22} />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-transparent py-3 pr-4 outline-none font-black text-slate-600 cursor-pointer"
          >
            <option value="ALL">Todas Movimentações</option>
            <option value="ENTRY">Apenas Entradas</option>
            <option value="EXIT">Apenas Saídas</option>
          </select>
        </div>
        
      </div>

      {/* Tabela de Auditoria */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[900px]">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-48">Data e Hora</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto / Insumo</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Motivo</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Quantidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMovements.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-4 opacity-60">
                    <PackageSearch size={64} strokeWidth={1} />
                    <div>
                      <p className="font-bold text-xl text-slate-600">Nenhum registro encontrado</p>
                      <p className="text-sm mt-1">As vendas do PDV e a produção do Planejador aparecerão aqui.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMovements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                  
                  <td className="p-6">
                    <span className="text-slate-500 font-black text-xs uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg group-hover:bg-white transition-colors">
                      {formatDate(m.dateString)}
                    </span>
                  </td>
                  
                  <td className="p-6">
                    {m.type === 'ENTRY' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                        <ArrowDownRight size={14} strokeWidth={3} /> Entrada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest">
                        <ArrowUpRight size={14} strokeWidth={3} /> Saída
                      </span>
                    )}
                  </td>
                  
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-slate-800 text-base">{m.productName}</span>
                      <span className={`text-[9px] w-fit px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${m.productType === 'FINAL_GOOD' ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>
                        {m.productType === 'FINAL_GOOD' ? 'Produto Final' : 'Insumo'}
                      </span>
                    </div>
                  </td>
                  
                   <td className="p-6 text-slate-500 font-bold">
                    {m.reason || 'Ajuste Manual'}
                  </td>
                  
                  <td className="p-6 text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className={`font-black text-2xl tracking-tighter ${m.type === 'ENTRY' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {m.type === 'ENTRY' ? '+' : '-'}{m.quantity}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase">
                        {m.unit}
                      </span>
                    </div>
                  </td>
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}