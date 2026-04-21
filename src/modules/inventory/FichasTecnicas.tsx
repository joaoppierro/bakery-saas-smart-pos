import { useState, useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { updateProduct } from '../../dataconnect/default-connector';
import { ChefHat, Plus, Trash2, Save, Calculator, Package, ArrowRight } from 'lucide-react';

export default function FichasTecnicas() {
  const { tenant, globalProducts, setGlobalProducts } = useTenant();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [recipeItems, setRecipeItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const finalProducts = useMemo(() => globalProducts.filter(p => p.type === 'FINAL_GOOD'), [globalProducts]);
  const ingredients = useMemo(() => globalProducts.filter(p => p.id !== selectedProductId), [globalProducts, selectedProductId]);

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    if (!tenant?.id) return;
    const savedLocal = JSON.parse(localStorage.getItem(`recipes_${tenant.id}`) || '[]');
    setRecipeItems(savedLocal.filter((r: any) => r.productId === id));
  };

  const handleAddIngredient = () => {
    setRecipeItems([...recipeItems, { ingredientId: '', quantity: 0 }]);
  };

  const handleUpdateIngredient = (index: number, field: string, value: any) => {
    const newItems = [...recipeItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setRecipeItems(newItems);
  };

  const handleRemoveIngredient = (index: number) => {
    const newItems = [...recipeItems];
    newItems.splice(index, 1);
    setRecipeItems(newItems);
  };

  const totalCost = useMemo(() => {
    return recipeItems.reduce((acc, item) => {
      const ing = globalProducts.find(p => p.id === item.ingredientId);
      if (!ing) return acc;
      return acc + ((Number(ing.costPrice) || 0) * (Number(item.quantity) || 0));
    }, 0);
  }, [recipeItems, globalProducts]);

  const handleSaveRecipe = async () => {
    if (!tenant?.id || !selectedProductId) return;
    setIsSaving(true);
    
    try {
      const allRecipes = JSON.parse(localStorage.getItem(`recipes_${tenant.id}`) || '[]').filter((r: any) => r.productId !== selectedProductId);
      const newRecipeData = recipeItems.filter(r => r.ingredientId && r.quantity > 0).map(r => ({
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        tenantId: tenant.id,
        productId: selectedProductId,
        ingredientId: r.ingredientId,
        quantity: Number(r.quantity)
      }));
      localStorage.setItem(`recipes_${tenant.id}`, JSON.stringify([...allRecipes, ...newRecipeData]));

      const targetProduct = globalProducts.find(p => p.id === selectedProductId);
      if (targetProduct) {
        const payload = {
          id: targetProduct.id,
          tenantId: tenant.id,
          sku: targetProduct.sku || "",
          name: targetProduct.name,
          type: targetProduct.type,
          unit: targetProduct.unit || "UN",
          costPrice: Number(totalCost.toFixed(2)),
          sellPrice: Number(targetProduct.sellPrice) || 0,
          currentStock: Number(targetProduct.currentStock) || 0,
          minStock: Number(targetProduct.minStock) || 0
        };

        await updateProduct(payload);
        setGlobalProducts((prev: any) => prev.map((p: any) => p.id === targetProduct.id ? { ...p, costPrice: payload.costPrice } : p));
      }

      alert("Ficha Técnica salva e custo base atualizado com sucesso!");
    } catch (error: any) {
      alert(`Erro ao salvar no banco: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
            <ChefHat size={28} strokeWidth={2.5} />
          </div>
          Fichas Técnicas
        </h1>
        <p className="text-slate-500 font-medium ml-16">
          Monte as receitas dos seus produtos para calcular o custo exato de produção.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="flex flex-col gap-6 h-fit sticky top-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">
              <Package size={14} /> 1. Produto de Venda
            </label>
            <select 
              value={selectedProductId} 
              onChange={e => handleSelectProduct(e.target.value)} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer truncate"
            >
              <option value="">Selecione um produto...</option>
              {finalProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className={`p-8 rounded-[2rem] shadow-2xl transition-all duration-500 ${selectedProductId ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 opacity-50'}`}>
            <div className="flex items-center gap-3 mb-4 opacity-80">
              <Calculator size={24} />
              <h3 className="font-black uppercase tracking-wider text-sm">Custo Total da Receita</h3>
            </div>
            <p className="text-5xl font-black tracking-tighter mb-4">
              {formatCurrency(totalCost)}
            </p>
            {selectedProductId && (
              <p className="text-sm font-medium text-slate-400 leading-relaxed border-t border-slate-700 pt-4">
                Ao salvar, este valor se tornará o novo <strong className="text-white">Custo Base</strong> oficial do produto no seu catálogo.
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
          
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
            <label className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-wider">
              2. Ingredientes e Embalagens
            </label>
            <button 
              onClick={handleAddIngredient}
              disabled={!selectedProductId}
              className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-black flex items-center gap-2 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:grayscale active:scale-95"
            >
              <Plus size={18} strokeWidth={3} /> Nova Linha
            </button>
          </div>

          {!selectedProductId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-70">
              <ArrowRight size={48} strokeWidth={1} />
              <p className="font-bold text-lg">Selecione um produto ao lado para começar.</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {recipeItems.map((item, index) => {
                const selectedIng = globalProducts.find(p => p.id === item.ingredientId);
                const isKg = selectedIng?.unit === 'KG';
                const rowCost = (Number(selectedIng?.costPrice) || 0) * (Number(item.quantity) || 0);

                return (
                  <div key={index} className="flex flex-col md:flex-row md:items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 group animate-in slide-in-from-right-4 duration-200">
                    
                    <select 
                      value={item.ingredientId} 
                      onChange={e => handleUpdateIngredient(index, 'ingredientId', e.target.value)}
                      className="flex-1 p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">Selecione o insumo...</option>
                      {ingredients.map(ing => (
                        <option key={ing.id} value={ing.id}>{ing.name} ({formatCurrency(ing.costPrice)}/{ing.unit})</option>
                      ))}
                    </select>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-32 relative">
                        <input 
                          type="number" 
                          step={isKg ? "0.001" : "1"} 
                          min="0"
                          placeholder="Qtd"
                          value={item.quantity || ''} 
                          onChange={e => handleUpdateIngredient(index, 'quantity', e.target.value)}
                          className="w-full p-3 pl-4 pr-10 bg-white border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 text-right"
                        />
                        <span className="absolute right-3 top-3.5 text-[10px] font-black text-slate-400 uppercase">
                          {isKg ? 'KG' : 'UN'}
                        </span>
                      </div>

                      <div className="w-28 text-right bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-end">
                        <span className="text-sm font-black text-slate-700">{formatCurrency(rowCost)}</span>
                      </div>

                      <button 
                        onClick={() => handleRemoveIngredient(index)}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                        title="Remover linha"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {recipeItems.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-2xl">
                  Nenhum ingrediente adicionado.
                </div>
              )}
            </div>
          )}

          {selectedProductId && recipeItems.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <button 
                onClick={handleSaveRecipe}
                disabled={isSaving}
                className="w-full md:w-auto md:ml-auto py-4 px-10 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-xl shadow-xl shadow-emerald-500/20 transition-all flex justify-center items-center gap-3 disabled:opacity-50 active:scale-95"
              >
                <Save size={24} /> {isSaving ? 'Salvando...' : 'Salvar Ficha Técnica'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}