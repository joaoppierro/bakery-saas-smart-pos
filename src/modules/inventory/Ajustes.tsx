import { useState, useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { insertMovement, updateProduct } from '../../dataconnect/default-connector';
import { Settings2, ArrowDownRight, ArrowUpRight, Save, Package, History, FileText } from 'lucide-react';

export default function Ajustes() {
  const { tenant, globalProducts, setGlobalProducts, globalMovements, setGlobalMovements } = useTenant();
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [type, setType] = useState<'ENTRY' | 'EXIT'>('ENTRY');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const recentHistory = useMemo(() => {
    return [...globalMovements]
      .sort((a, b) => b.dateString.localeCompare(a.dateString))
      .slice(0, 50);
  }, [globalMovements]);

  const handleSave = async () => {
    if (!tenant?.id || !selectedProductId || !quantity) {
      return alert("Preencha o produto e a quantidade.");
    }

    const numQuantity = parseFloat(quantity);
    if (numQuantity <= 0) return alert("A quantidade deve ser maior que zero.");

    setIsSaving(true);
    
    try {
      const targetProduct = globalProducts.find(p => p.id === selectedProductId);
      if (!targetProduct) throw new Error("Produto não encontrado.");

      const isKg = targetProduct.unit === 'KG';
      const finalQuantity = isKg ? Number(numQuantity.toFixed(3)) : Math.ceil(numQuantity);

      const currentStock = Number(targetProduct.currentStock) || 0;
      const updatedStock = type === 'ENTRY' 
        ? currentStock + finalQuantity 
        : currentStock - finalQuantity;

      const dateString = new Date().toISOString();
      const movId = `mov-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const movementPayload = {
        id: movId,
        tenantId: tenant.id,
        productId: selectedProductId,
        type,
        quantity: finalQuantity,
        reason: reason.trim() || (type === 'ENTRY' ? 'Entrada Manual' : 'Saída Manual'),
        dateString
      };

      const productPayload = {
        ...targetProduct,
        currentStock: isKg ? Number(updatedStock.toFixed(3)) : updatedStock
      };

      await insertMovement(movementPayload);
      await updateProduct(productPayload);
      
      setGlobalMovements((prev: any) => [movementPayload, ...prev]);
      setGlobalProducts((prev: any) => prev.map((p: any) => p.id === selectedProductId ? productPayload : p));
      
      alert("Movimentação registrada com sucesso!");
      
      setQuantity('');
      setReason('');
      setSelectedProductId('');
    } catch (error: any) {
      alert(`Erro ao registrar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
            <Settings2 size={28} strokeWidth={2.5} />
          </div>
          Ajustes Manuais
        </h1>
        <p className="text-slate-500 font-medium ml-16">
          Registre entradas de fornecedores, perdas, devoluções ou consumo interno.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm h-fit space-y-8 sticky top-6">
          
          <div>
            <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Tipo de Movimento</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setType('ENTRY')} 
                className={`p-4 rounded-2xl border-2 font-black flex flex-col items-center gap-2 transition-all active:scale-95 ${type === 'ENTRY' ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                <ArrowDownRight size={28} /> <span className="text-[10px]">ENTRADA</span>
              </button>
              <button 
                onClick={() => setType('EXIT')} 
                className={`p-4 rounded-2xl border-2 font-black flex flex-col items-center gap-2 transition-all active:scale-95 ${type === 'EXIT' ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                <ArrowUpRight size={28} /> <span className="text-[10px]">SAÍDA</span>
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">
              <Package size={14} /> Produto
            </label>
            <select 
              value={selectedProductId} 
              onChange={e => setSelectedProductId(e.target.value)} 
              className={`w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black outline-none transition-all cursor-pointer truncate ${type === 'ENTRY' ? 'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-emerald-900' : 'focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-rose-900'}`}
            >
              <option value="">Selecione o produto...</option>
              {globalProducts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Estoque: {p.currentStock})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`flex items-center gap-2 text-xs font-black mb-3 uppercase tracking-wider ${type === 'ENTRY' ? 'text-emerald-500' : 'text-rose-500'}`}>
                Quantidade
              </label>
              <input 
                type="number" 
                step="0.001"
                min="0"
                placeholder="Ex: 10" 
                value={quantity} 
                onChange={e => setQuantity(e.target.value)} 
                className={`w-full p-4 border rounded-xl font-black text-lg outline-none transition-all placeholder:text-slate-300 ${type === 'ENTRY' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20' : 'bg-rose-50 border-rose-200 text-rose-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20'}`}
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">
                <FileText size={14} /> Motivo (Opcional)
              </label>
              <input 
                type="text" 
                placeholder={type === 'ENTRY' ? "Ex: Nota 1234" : "Ex: Vencimento"} 
                value={reason} 
                onChange={e => setReason(e.target.value)} 
                className={`w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none transition-all placeholder:text-slate-300 ${type === 'ENTRY' ? 'focus:border-emerald-500 text-emerald-800' : 'focus:border-rose-500 text-rose-800'}`}
              />
            </div>
          </div>

          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className={`w-full py-4 text-white font-black text-lg rounded-xl shadow-xl transition-all flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50 ${type === 'ENTRY' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'}`}
          >
            <Save size={24} /> {isSaving ? 'Salvando...' : `Confirmar ${type === 'ENTRY' ? 'Entrada' : 'Saída'}`}
          </button>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
          
          <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <History size={24} className="text-slate-400" /> Últimas Movimentações
            </h2>
            <span className="text-xs font-black text-slate-400 bg-slate-200/50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
              Ao Vivo
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-3 custom-scrollbar">
            {recentHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-70">
                <Settings2 size={64} strokeWidth={1} />
                <p className="font-bold text-lg text-center">Nenhuma movimentação registrada.</p>
              </div>
            ) : (
              recentHistory.map(item => {
                const product = globalProducts.find(p => p.id === item.productId);
                const isEntry = item.type === 'ENTRY';
                
                const dataFormatada = new Date(item.dateString).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                });

                return (
                  <div key={item.id} className={`bg-white border p-4 rounded-2xl flex items-center justify-between transition-all group animate-in slide-in-from-right-4 duration-200 ${isEntry ? 'border-emerald-100 hover:border-emerald-300' : 'border-rose-100 hover:border-rose-300'}`}>
                    
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform ${isEntry ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                        {isEntry ? <ArrowDownRight size={20} strokeWidth={3} /> : <ArrowUpRight size={20} strokeWidth={3} />}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="font-black text-slate-800 text-base leading-tight">
                          {product ? product.name : 'Produto Desconhecido'}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{dataFormatada}</p>
                          {item.reason && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><FileText size={10}/> {item.reason}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                      <span className={`font-black text-lg ${isEntry ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isEntry ? '+' : '-'}{item.quantity}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase ml-1">
                        {product?.unit || 'UN'}
                      </span>
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