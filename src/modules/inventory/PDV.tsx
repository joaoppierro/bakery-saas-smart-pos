import { useState, useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { updateProduct, insertMovement } from '../../dataconnect/default-connector';
import { ShoppingCart, Search, Plus, Trash2, CreditCard, Package, ArrowRight, Tag } from 'lucide-react';

interface CartItem {
  productId: string;
  name: string;
  sellPrice: number;
  unit: string;
  quantity: string | number;
}

export default function PDV() {
  const { tenant, globalProducts, setGlobalProducts, setGlobalMovements } = useTenant();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const finalProducts = useMemo(() => {
    return globalProducts.filter(p => p.type === 'FINAL_GOOD');
  }, [globalProducts]);

  const filteredProducts = useMemo(() => {
    return finalProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [finalProducts, searchTerm]);

  const handleAddToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: Number(item.quantity) + 1 }
            : item
        );
      }
      return [...prev, { 
        productId: product.id, 
        name: product.name, 
        sellPrice: Number(product.sellPrice) || 0, 
        unit: product.unit || 'UN',
        quantity: 1 
      }];
    });
  };

  const handleUpdateQuantity = (productId: string, value: string) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        if (value === '') return { ...item, quantity: '' };
        if (item.unit === 'UN') {
          return { ...item, quantity: value.replace(/[.,]/g, '') };
        }
        return { ...item, quantity: value };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + ((Number(item.quantity) || 0) * item.sellPrice), 0);
  }, [cart]);

  const handleCheckout = async () => {
    if (!tenant?.id || cart.length === 0) return;
    setIsProcessing(true);

    try {
      const dateString = new Date().toISOString();
      const updatedProducts = [...globalProducts];
      const newMovements: any[] = []; // O TypeScript agora sabe que é um array

      for (const item of cart) {
        const qtyToDeduct = Number(item.quantity) || 0;
        if (qtyToDeduct <= 0) continue;

        const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
        if (productIndex === -1) continue;

        const p = updatedProducts[productIndex];
        const newStock = Number(p.currentStock || 0) - qtyToDeduct;
        const finalStock = p.unit === 'KG' ? Number(newStock.toFixed(3)) : newStock;

        const movId = `mov-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const movementPayload = {
          id: movId,
          tenantId: tenant.id,
          productId: p.id,
          type: 'EXIT' as const,
          quantity: qtyToDeduct,
          reason: 'Venda PDV',
          dateString
        };

        const productPayload = {
          id: p.id,
          tenantId: tenant.id,
          sku: p.sku || "",
          name: p.name,
          type: p.type,
          unit: p.unit || "UN",
          costPrice: Number(p.costPrice) || 0,
          sellPrice: Number(p.sellPrice) || 0,
          currentStock: finalStock,
          minStock: Number(p.minStock) || 0
        };

        await insertMovement(movementPayload);
        await updateProduct(productPayload);

        updatedProducts[productIndex] = { ...p, currentStock: finalStock };
        newMovements.push(movementPayload);
      }

      setGlobalProducts(updatedProducts);
      setGlobalMovements((prev: any) => [...newMovements, ...prev]);

      alert("Venda finalizada com sucesso!");
      setCart([]);
      setSearchTerm('');
    } catch (error: any) {
      alert(`Erro ao finalizar venda: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-6rem)] max-w-7xl mx-auto animate-in fade-in duration-500">
      
      <div className="flex-1 flex flex-col bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="p-6 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20">
                <ShoppingCart size={24} strokeWidth={2.5} />
              </div>
              Frente de Caixa (PDV)
            </h1>
            <p className="text-slate-500 font-medium ml-14 text-sm">
              Selecione os produtos para adicionar ao carrinho.
            </p>
          </div>

          <div className="relative group">
            <Search size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar produto por nome ou código..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-70">
              <Package size={64} strokeWidth={1} className="mb-4" />
              <p className="font-bold text-lg">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(p => (
                <button 
                  key={p.id}
                  onClick={() => handleAddToCart(p)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-left flex flex-col justify-between h-36 group active:scale-95"
                >
                  <div>
                    <h3 className="font-black text-slate-800 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors">{p.name}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 block">Estoque: {p.currentStock} {p.unit}</span>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <span className="font-black text-lg text-emerald-600">{formatCurrency(p.sellPrice || 0)}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <Plus size={18} strokeWidth={3} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[400px] flex flex-col bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden shrink-0 relative">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center relative z-10 shrink-0">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Tag size={20} className="text-blue-400" /> Cupom Fiscal
          </h2>
          <span className="bg-slate-800 text-slate-300 px-3 py-1 text-xs font-black rounded-lg">
            {cart.length} {cart.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative z-10">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
              <ShoppingCart size={48} strokeWidth={1} className="opacity-50" />
              <p className="font-medium text-sm">Carrinho vazio</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col gap-3 animate-in slide-in-from-right-4">
                
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-white leading-tight">{item.name}</span>
                  <button 
                    onClick={() => handleRemoveFromCart(item.productId)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="relative w-28">
                    <input 
                      type="number"
                      step={item.unit === 'KG' ? "0.001" : "1"}
                      min="0"
                      value={item.quantity}
                      onChange={e => handleUpdateQuantity(item.productId, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 text-white font-black text-center p-2 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                    <span className="absolute -top-2.5 left-3 bg-slate-800 px-1 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded">
                      {item.unit}
                    </span>
                  </div>

                  <div className="text-right flex flex-col">
                    <span className="text-xs font-bold text-slate-400">{formatCurrency(item.sellPrice)} / {item.unit}</span>
                    <span className="font-black text-emerald-400">{formatCurrency((Number(item.quantity) || 0) * item.sellPrice)}</span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-950 border-t border-slate-800 shrink-0 relative z-10">
          <div className="flex justify-between items-end mb-6">
            <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Total a Pagar</span>
            <span className="text-4xl font-black text-white tracking-tighter">{formatCurrency(cartTotal)}</span>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-white py-5 rounded-xl font-black text-lg shadow-xl shadow-emerald-500/10 transition-all active:scale-95 flex justify-center items-center gap-3"
          >
            {isProcessing ? 'Processando...' : <><CreditCard size={24} /> Finalizar Venda <ArrowRight size={20} /></>}
          </button>
        </div>
      </div>

    </div>
  );
}