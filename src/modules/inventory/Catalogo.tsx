import { useState, useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { updateProduct } from '../../dataconnect/default-connector';
import { Package, Search, Plus, X, Scale, Box, ChefHat, Tag } from 'lucide-react';

export default function Catalogo() {
  const { tenant, globalProducts, setGlobalProducts } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '', name: '', sku: '', type: 'FINAL_GOOD', unit: 'UN', costPrice: 0, sellPrice: 0, currentStock: 0, minStock: 0
  });

  const filteredProducts = useMemo(() => {
    return globalProducts.filter(p => 
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [globalProducts, searchTerm]);

  const handleOpenModal = (product?: any) => {
    if (product) {
      setFormData({ ...product, unit: product.unit || 'UN' });
    } else {
      setFormData({ id: '', name: '', sku: '', type: 'FINAL_GOOD', unit: 'UN', costPrice: 0, sellPrice: 0, currentStock: 0, minStock: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!tenant?.id) return;
    if (!formData.name.trim()) return alert("O nome do produto é obrigatório!");
    
    setIsSaving(true);
    try {
      const isNew = !formData.id;
      const finalId = isNew ? `prod-${Date.now()}` : formData.id;
      
      const payload = {
        id: finalId,
        tenantId: tenant.id,
        sku: formData.sku || "",
        name: formData.name.trim(),
        type: formData.type || "FINAL_GOOD",
        unit: formData.unit || "UN", 
        costPrice: Number(formData.costPrice) || 0,
        sellPrice: Number(formData.sellPrice) || 0,
        currentStock: Number(formData.currentStock) || 0,
        minStock: Number(formData.minStock) || 0
      };

      await updateProduct(payload); 
      
      setGlobalProducts((prev: any) => 
        isNew ? [...prev, payload] : prev.map((p: any) => p.id === finalId ? payload : p)
      );
      
      setIsModalOpen(false);
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getTypeBadge = (type: string) => {
    if (type === 'FINAL_GOOD') return <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 w-fit"><Package size={14}/> Produto Final</span>;
    if (type === 'RAW_MATERIAL') return <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 w-fit"><ChefHat size={14}/> Insumo</span>;
    return <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 w-fit"><Box size={14}/> Embalagem</span>;
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
              <Package size={28} strokeWidth={2.5} />
            </div>
            Catálogo de Produtos
          </h1>
          <p className="text-slate-500 font-medium ml-16">Gerencie todos os itens do seu negócio em um só lugar.</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus size={20} /> Novo Item
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
        <div className="pl-4">
          <Search size={24} className="text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Buscar produto por nome ou SKU..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="bg-transparent w-full py-3 pr-4 outline-none font-bold text-slate-700 text-lg placeholder:text-slate-300" 
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[900px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Item e Categoria</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider text-center">Unidade</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Custo</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Venda</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider text-center">Estoque Atual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400 font-bold text-lg">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              filteredProducts.map(p => (
                <tr 
                  key={p.id} 
                  onClick={() => handleOpenModal(p)} 
                  className="hover:bg-blue-50 cursor-pointer transition-colors group"
                >
                  <td className="p-5">
                    <div className="flex flex-col gap-2">
                      <span className="font-black text-slate-800 text-base group-hover:text-blue-700 transition-colors">{p.name}</span>
                      <div className="flex items-center gap-2">
                        {p.sku && <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Tag size={12}/> {p.sku}</span>}
                        {getTypeBadge(p.type)}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 w-fit">
                        <Scale size={14} /> {p.unit}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-right font-bold text-slate-500">
                    {formatCurrency(p.costPrice)}
                  </td>
                  <td className="p-5 text-right font-black text-slate-800 text-base">
                    {p.type === 'FINAL_GOOD' ? formatCurrency(p.sellPrice) : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center">
                      <span className={`font-black text-base px-4 py-1.5 rounded-xl ${Number(p.currentStock) <= Number(p.minStock) ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                        {p.currentStock}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Package size={24} />
                </div>
                {formData.id ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-slate-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Nome do Produto</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="Ex: Bolo de Chocolate Inteiro"
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Código SKU (Opcional)</label>
                  <input 
                    type="text" 
                    value={formData.sku} 
                    onChange={e => setFormData({...formData, sku: e.target.value})} 
                    placeholder="Ex: BOL-CHO-01"
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Tipo de Produto</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})} 
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                  >
                    <option value="FINAL_GOOD">Produto Final (Venda)</option>
                    <option value="RAW_MATERIAL">Insumo (Matéria Prima)</option>
                    <option value="PACKAGING">Embalagem</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Unidade de Medida</label>
                  <select 
                    value={formData.unit} 
                    onChange={e => setFormData({...formData, unit: e.target.value})} 
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                  >
                    <option value="UN">Unidade (UN)</option>
                    <option value="KG">Quilograma (KG)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Custo Base (R$)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.costPrice} 
                    onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value) || 0})} 
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl font-black text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                  />
                </div>

                {formData.type === 'FINAL_GOOD' && (
                  <div className="md:col-span-2 bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <label className="block text-xs font-black text-blue-600 uppercase tracking-wider mb-2">Preço de Venda ao Consumidor (R$)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={formData.sellPrice} 
                      onChange={e => setFormData({...formData, sellPrice: parseFloat(e.target.value) || 0})} 
                      className="w-full p-4 bg-white border border-blue-200 rounded-xl font-black text-blue-700 text-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all" 
                    />
                  </div>
                )}

                <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Estoque Atual</label>
                    <input 
                      type="number" 
                      step="0.001" 
                      value={formData.currentStock} 
                      onChange={e => setFormData({...formData, currentStock: parseFloat(e.target.value) || 0})} 
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>

                <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                      Estoque Mínimo (Alerta)
                    </label>
                    <input 
                      type="number" 
                      step="0.001" 
                      value={formData.minStock} 
                      onChange={e => setFormData({...formData, minStock: parseFloat(e.target.value) || 0})} 
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveProduct} 
                disabled={isSaving} 
                className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 active:scale-95 flex justify-center items-center gap-2"
              >
                {isSaving ? 'Salvando Registro...' : 'Salvar Produto'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}