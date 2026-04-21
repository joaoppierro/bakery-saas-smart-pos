import { useState, useEffect, useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { updateProduct, updateProductStrategy } from '../../dataconnect/default-connector';
import { TrendingUp, Save, AlertTriangle, CheckCircle, Sparkles, Info, Lock, Unlock } from 'lucide-react';

export default function MixVendas() {
  const { tenant, globalProducts, pricingConfig, setGlobalProducts } = useTenant();
  const [simulations, setSimulations] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const targetMargin = useMemo(() => {
    if (!pricingConfig) return 0;
    return (
      (pricingConfig.taxesPercent || 0) +
      (pricingConfig.cardFeesPercent || 0) +
      (pricingConfig.fixedCostsPercent || 0) +
      (pricingConfig.profitMarginPercent || 0)
    );
  }, [pricingConfig]);

  useEffect(() => {
    if (!tenant?.id || globalProducts.length === 0) return;
    const savedDemands = JSON.parse(localStorage.getItem(`mix_demands_${tenant.id}`) || '{}');
    const finals = globalProducts
      .filter(p => p.type === 'FINAL_GOOD')
      .map(p => ({
        ...p,
        strategicRole: p.strategicRole || 'PROFIT',
        projectedVolume: savedDemands[p.id] || 100,
        isLocked: false 
      }));
    setSimulations(finals);
  }, [tenant, globalProducts]);

  const handleUpdateSim = (id: string, field: string, value: any) => {
    setSimulations(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'sellPrice') {
          updated.isLocked = true; 
        }
        return updated;
      }
      return item;
    }));
  };

  const toggleLock = (id: string) => {
    setSimulations(prev => prev.map(item => 
      item.id === id ? { ...item, isLocked: !item.isLocked } : item
    ));
  };

  const handleAutoPrice = () => {
    if (simulations.length === 0) return;

    const safeTargetMargin = Math.min(targetMargin / 100, 0.85); 
    const ISCA_MARGIN = 0.12; 

    let totalTargetRevenue = 0;
    let fixedRevenue = 0; 
    let unlockedProfitBaseRevenue = 0; 

    const updatedSimulations = simulations.map(p => ({ ...p }));

    updatedSimulations.forEach(p => {
      const cost = Math.max(Number(p.costPrice) || 0, 0.01);
      const vol = Number(p.projectedVolume) || 0;
      const idealPrice = cost / (1 - safeTargetMargin);
      
      totalTargetRevenue += (idealPrice * vol);

      if (p.isLocked) {
        fixedRevenue += (Number(p.sellPrice) * vol);
      } 
      else if (p.strategicRole === 'TRAFFIC') {
        const iscaPrice = cost / (1 - ISCA_MARGIN);
        p.tempPrice = iscaPrice;
        fixedRevenue += (iscaPrice * vol);
      } 
      else {
        unlockedProfitBaseRevenue += (idealPrice * vol);
      }
    });

    const deficit = totalTargetRevenue - fixedRevenue - unlockedProfitBaseRevenue;
    let premiumFactor = 0;
    
    if (unlockedProfitBaseRevenue > 0 && deficit > 0) {
      premiumFactor = deficit / unlockedProfitBaseRevenue;
      premiumFactor = Math.min(premiumFactor, 1.2); 
    }

    updatedSimulations.forEach(p => {
      if (p.isLocked) return; 

      const cost = Math.max(Number(p.costPrice) || 0, 0.01);
      const idealPrice = cost / (1 - safeTargetMargin);

      if (p.strategicRole === 'TRAFFIC') {
        p.sellPrice = Math.ceil((p.tempPrice || cost) * 10) / 10;
      } else {
        let finalPrice = idealPrice * (1 + premiumFactor);
        finalPrice = Math.max(finalPrice, idealPrice); 
        p.sellPrice = Math.ceil(finalPrice * 10) / 10;
      }
    });

    setSimulations(updatedSimulations);
  };

  const metrics = useMemo(() => {
    let projectedRevenue = 0;
    let projectedCost = 0;
    simulations.forEach(p => {
      const vol = Number(p.projectedVolume) || 0;
      const price = Number(p.sellPrice) || 0;
      const cost = Number(p.costPrice) || 0;
      projectedRevenue += (vol * price);
      projectedCost += (vol * cost);
    });
    
    const grossProfit = projectedRevenue - projectedCost;
    const simulatedMarginPercent = projectedRevenue > 0 ? (grossProfit / projectedRevenue) * 100 : 0;
    const isHealthy = simulatedMarginPercent >= (targetMargin - 0.5); 
    
    return { projectedRevenue, projectedCost, grossProfit, simulatedMarginPercent, isHealthy };
  }, [simulations, targetMargin]);

  const handleSaveAll = async () => {
    if (!tenant?.id) return;
    setIsSaving(true);
    try {
      for (const p of simulations) {
        await updateProduct({
          id: p.id, tenantId: tenant.id, sku: p.sku || "", name: p.name, type: p.type, 
          unit: p.unit || "UN", costPrice: Number(p.costPrice) || 0, sellPrice: Number(p.sellPrice) || 0, 
          currentStock: Number(p.currentStock) || 0, minStock: Number(p.minStock) || 0
        });
        await updateProductStrategy({ id: p.id, strategicRole: p.strategicRole, targetMargin: p.targetMargin || 0 });
      }
      
      const demandsToSave: Record<string, number> = {};
      simulations.forEach(p => { demandsToSave[p.id] = p.projectedVolume; });
      localStorage.setItem(`mix_demands_${tenant.id}`, JSON.stringify(demandsToSave));
      
      setGlobalProducts((prev: any) => prev.map((p: any) => {
        const sim = simulations.find(s => s.id === p.id);
        return sim ? { ...p, sellPrice: sim.sellPrice, strategicRole: sim.strategicRole } : p;
      }));
      
      alert("Estratégia salva com sucesso!");
    } catch (e: any) { alert(`Erro: ${e.message}`); } finally { setIsSaving(false); }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20"><TrendingUp size={28} strokeWidth={2.5} /></div>
            Simulador de Mix
          </h1>
          <p className="text-slate-500 font-medium ml-16 text-sm">Acompanhe o Preço Alvo de cada item para basear as suas decisões de estratégia.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={handleAutoPrice} className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95">
            <Sparkles size={20} className="text-amber-400" /> Otimizar Livres (IA)
          </button>
          <button onClick={handleSaveAll} disabled={isSaving} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50">
            <Save size={20} /> {isSaving ? 'Salvando...' : 'Salvar Mix'}
          </button>
        </div>
      </div>

      {!metrics.isHealthy && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-800 text-sm font-bold animate-pulse">
          <Info size={20} />
          <span>Atenção: Com as âncoras (preços trancados) e os descontos atuais, os produtos livres não conseguem atingir a meta global. Destranque alguns preços ou aumente o volume de lucro.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Meta Global Alvo</p>
          <p className="text-4xl font-black text-slate-800">{targetMargin.toFixed(1)}%</p>
        </div>

        <div className={`p-6 md:p-8 rounded-[2rem] border shadow-sm col-span-1 md:col-span-2 flex items-center justify-between transition-colors ${metrics.isHealthy ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${metrics.isHealthy ? 'text-emerald-600' : 'text-rose-600'}`}>Margem Ponderada Real</p>
            <p className={`text-5xl font-black tracking-tighter ${metrics.isHealthy ? 'text-emerald-700' : 'text-rose-700'}`}>{metrics.simulatedMarginPercent.toFixed(1)}%</p>
          </div>
          <div className="hidden sm:block">
            {metrics.isHealthy ? (
              <div className="flex items-center gap-2 text-emerald-700 font-black bg-emerald-100/50 border border-emerald-200 px-5 py-3 rounded-xl text-sm"><CheckCircle size={20} /> Equilibrado</div>
            ) : (
              <div className="flex items-center gap-2 text-rose-700 font-black bg-rose-100/50 border border-rose-200 px-5 py-3 rounded-xl text-sm"><AlertTriangle size={20} /> Meta Não Batida</div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lucro Bruto</p>
          <p className="text-3xl font-black text-emerald-400">{formatCurrency(metrics.grossProfit)}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1000px]">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="p-6">Produto</th>
              <th className="p-6 text-center">Estratégia</th>
              <th className="p-6 text-center w-32">Vol. Projetado</th>
              <th className="p-6 text-right">Custo Unit.</th>
              <th className="p-6 text-right w-32">
                Preço Alvo (Mín.)
              </th>
              <th className="p-6 text-center w-48">Preço de Venda</th>
              <th className="p-6 text-right">Margem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {simulations.map(p => {
              const cost = Number(p.costPrice) || 0;
              const price = Number(p.sellPrice) || 0;
              const itemMargin = price > 0 ? ((price - cost) / price) * 100 : 0;
              
              const safeTargetMarginDisplay = Math.min(targetMargin / 100, 0.85);
              const targetPrice = cost > 0 ? cost / (1 - safeTargetMarginDisplay) : 0;

              return (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 font-black text-slate-800 text-base">{p.name}</td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      <select value={p.strategicRole} onChange={e => handleUpdateSim(p.id, 'strategicRole', e.target.value)}
                        className={`p-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 outline-none cursor-pointer ${p.strategicRole === 'TRAFFIC' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}
                      >
                        <option value="TRAFFIC">🧲 Isca (Fluxo)</option>
                        <option value="PROFIT">💰 Lucro (Margem)</option>
                      </select>
                    </div>
                  </td>
                  <td className="p-6">
                    <input type="number" value={p.projectedVolume} onChange={e => handleUpdateSim(p.id, 'projectedVolume', e.target.value)} 
                      className="w-full p-3 text-center bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-all" />
                  </td>
                  <td className="p-6 text-right font-bold text-slate-500">{formatCurrency(cost)}</td>
                  
                  <td className="p-6 text-right">
                    <span className="block font-black text-slate-400">{formatCurrency(targetPrice)}</span>
                  </td>

                  <td className="p-6">
                    <div className="relative flex items-center group">
                      <span className="absolute left-3 text-slate-400 font-black text-xs z-10">R$</span>
                      <input 
                        type="number" step="0.01" 
                        value={p.sellPrice} 
                        onChange={e => handleUpdateSim(p.id, 'sellPrice', e.target.value)} 
                        className={`w-full p-3 pl-9 pr-10 text-right border rounded-xl font-black text-lg outline-none transition-all shadow-sm ${p.isLocked ? 'bg-amber-50 border-amber-300 text-amber-700 focus:ring-4 focus:ring-amber-500/20' : 'bg-white border-blue-200 text-blue-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`} 
                      />
                      <button 
                        onClick={() => toggleLock(p.id)}
                        className="absolute right-3 p-1 rounded hover:bg-slate-200/50 transition-colors"
                        title={p.isLocked ? "Destrancar para a IA alterar" : "Trancar preço (Impedir IA)"}
                      >
                        {p.isLocked ? <Lock size={16} className="text-amber-500" /> : <Unlock size={16} className="text-slate-300 group-hover:text-blue-500" />}
                      </button>
                    </div>
                  </td>

                  <td className="p-6 text-right">
                    <span className={`font-black text-sm px-4 py-2 rounded-xl ${itemMargin >= (targetMargin - 0.5) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {itemMargin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}