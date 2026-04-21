import { useState, useEffect, useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { insertRuptureLog, getRuptureLogs } from '../../dataconnect/default-connector';
import { AlertCircle, Save, Calendar, Package, FileText, AlertTriangle, TrendingDown } from 'lucide-react';

export default function RegistroRupturas() {
  const { tenant, globalProducts } = useTenant();
  const [history, setHistory] = useState<any[]>([]);
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [lostQuantity, setLostQuantity] = useState('');
  const [dateString, setDateString] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const finalProducts = useMemo(() => globalProducts.filter(p => p.type === 'FINAL_GOOD'), [globalProducts]);

  useEffect(() => {
    async function load() {
      if (!tenant?.id) return;
      setIsLoading(true);
      try {
        const res = await getRuptureLogs({ tenantId: tenant.id });
        const sorted = (res.data.ruptureLogs || []).sort((a: any, b: any) => b.dateString.localeCompare(a.dateString));
        setHistory(sorted);
      } catch (e) {
        console.error("Erro ao carregar histórico de rupturas:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [tenant]);

  const handleSave = async () => {
    if (!tenant?.id || !selectedProductId || !lostQuantity) {
      return alert("Preencha o produto e a quantidade perdida estimada.");
    }

    setIsSaving(true);
    
    try {
      const payload = {
        id: `rup-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        tenantId: tenant.id,
        productId: selectedProductId,
        dateString,
        lostQuantity: parseFloat(lostQuantity),
        notes: notes.trim() || undefined
      };

      await insertRuptureLog(payload);
      
      setHistory(prev => [payload, ...prev].sort((a: any, b: any) => b.dateString.localeCompare(a.dateString)));
      
      alert("Venda perdida registrada! A IA usará isso para ajustar a próxima produção.");
      setLostQuantity('');
      setNotes('');
    } catch (error: any) {
      alert(`Erro ao salvar ruptura: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20">
            <AlertTriangle size={28} strokeWidth={2.5} />
          </div>
          Registro de Rupturas
        </h1>
        <p className="text-slate-500 font-medium ml-16">
          Anote vendas perdidas por falta de produto. A IA usará esses dados para corrigir o planejamento futuro.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm h-fit flex flex-col gap-6 sticky top-6">
          
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-2 uppercase tracking-wider">
              <Calendar size={14} /> Data da Ocorrência
            </label>
            <input 
              type="date" 
              value={dateString} 
              onChange={e => setDateString(e.target.value)} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-2 uppercase tracking-wider">
              <Package size={14} /> Produto em Falta
            </label>
            <select 
              value={selectedProductId} 
              onChange={e => setSelectedProductId(e.target.value)} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all cursor-pointer truncate"
            >
              <option value="">Selecione o produto...</option>
              {finalProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({formatCurrency(p.sellPrice || 0)})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-black text-rose-500 mb-2 uppercase tracking-wider">
              <TrendingDown size={14} /> Venda Perdida Estimada (Qtd)
            </label>
            <input 
              type="number" 
              step="0.001"
              min="0"
              placeholder="Ex: 5" 
              value={lostQuantity} 
              onChange={e => setLostQuantity(e.target.value)} 
              className="w-full p-4 bg-rose-50 border border-rose-200 rounded-xl font-black text-rose-700 text-lg outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 transition-all placeholder:text-rose-300"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-2 uppercase tracking-wider">
              <FileText size={14} /> Observações (Opcional)
            </label>
            <input 
              type="text" 
              placeholder="Ex: Cliente queria para uma festa..." 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all"
            />
          </div>

          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full mt-2 py-4 bg-rose-500 hover:bg-rose-600 text-white font-black text-lg rounded-xl shadow-xl shadow-rose-500/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <Save size={24} /> {isSaving ? 'Salvando...' : 'Registrar Venda Perdida'}
          </button>
        </div>
     
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
          
          <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <AlertCircle size={24} className="text-rose-500" /> Histórico de Rupturas
            </h2>
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider bg-slate-200/50 px-3 py-1.5 rounded-lg">
              Últimos Registros
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 custom-scrollbar">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-70">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin"></div>
                <p className="font-bold">Carregando histórico...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-70">
                <AlertCircle size={64} strokeWidth={1} />
                <p className="font-bold text-lg">Nenhuma ruptura registrada. Ótimo trabalho!</p>
              </div>
            ) : (
              history.map(item => {
                const product = globalProducts.find(p => p.id === item.productId);
                const lostValue = (Number(product?.sellPrice) || 0) * (Number(item.lostQuantity) || 0);

                return (
                  <div key={item.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-rose-200 hover:shadow-md transition-all group animate-in slide-in-from-bottom-2">
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-rose-50 text-rose-500 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                        <TrendingDown size={24} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.dateString}</p>
                        <p className="font-black text-slate-800 text-lg leading-tight">
                          {product ? product.name : 'Produto Excluído/Desconhecido'}
                        </p>
                        {item.notes && (
                          <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                            <FileText size={12} /> {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-5 shrink-0">
                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Deixou de vender</span>
                        <span className="font-black text-slate-700 text-base">{item.lostQuantity} {product?.unit || 'UN'}</span>
                      </div>
                      
                      <div className="flex flex-col items-end mt-1">
                        <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">Prejuízo</span>
                        <span className="font-black text-xl text-rose-600 tracking-tight">
                          -{formatCurrency(lostValue)}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}