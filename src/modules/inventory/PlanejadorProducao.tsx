import { useState, useEffect } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { insertDemandPrediction, getDailyContexts, updateProduct, insertMovement } from '../../dataconnect/default-connector';
import { BrainCircuit, CloudRain, Calendar, Zap, TrendingUp, TrendingDown } from 'lucide-react';

export default function PlanejadorProducao() {
  const { tenant, globalProducts, globalMovements } = useTenant();
  
  const [targetDate, setTargetDate] = useState(() => { 
    const d = new Date(); d.setDate(d.getDate() + 1); 
    return d.toISOString().split('T')[0]; 
  });
  const [predictedWeather, setPredictedWeather] = useState('SUNNY');
  const [predictedEvent, setPredictedEvent] = useState('');
  const [historicalContexts, setHistoricalContexts] = useState<any[]>([]);
  const [forecastResults, setForecastResults] = useState<any[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!tenant?.id) return;
      try {
        const res = await getDailyContexts({ tenantId: tenant.id });
        setHistoricalContexts(res.data.dailyContexts || []);
      } catch (e) {}
    }
    load();
  }, [tenant]);

  const runForecast = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const results = globalProducts.filter(p => p.type === 'FINAL_GOOD').map(product => {
        
        const dailySales: Record<string, number> = {};
        const productSales = globalMovements.filter(m => m.productId === product.id && m.type === 'EXIT');
        
        productSales.forEach(m => {
          const dateStr = m.dateString.split('T')[0];
          dailySales[dateStr] = (dailySales[dateStr] || 0) + m.quantity;
        });

        let weightedSum = 0;
        let weightSum = 0;
        const now = new Date();
        now.setHours(0, 0, 0, 0); 

        Object.entries(dailySales).forEach(([dateStr, qty]) => {
          const [year, month, day] = dateStr.split('-');
          const moveDate = new Date(Number(year), Number(month) - 1, Number(day));
          const diffDays = Math.floor((now.getTime() - moveDate.getTime()) / (1000 * 3600 * 24));
          
          let weight = 1;
          if (diffDays <= 7) weight = 3;      
          else if (diffDays <= 14) weight = 2; 
          
          weightedSum += (qty * weight);
          weightSum += weight;
        });

        const baseDemand = weightSum > 0 ? (weightedSum / weightSum) : 0;

        const weatherDaysInSales = Object.keys(dailySales).filter(dateStr => {
          const ctx = historicalContexts.find(c => c.dateString === dateStr);
          return ctx && ctx.weather === predictedWeather;
        });
        
        let weatherMultiplier = 1.0;
        if (weatherDaysInSales.length > 0 && baseDemand > 0) {
          const sumWeather = weatherDaysInSales.reduce((acc, d) => acc + dailySales[d], 0);
          const avgOnWeather = sumWeather / weatherDaysInSales.length;
          weatherMultiplier = avgOnWeather / baseDemand;
        }

        let eventMultiplier = 1.0;
        if (predictedEvent.trim()) {
          const eventDaysInSales = Object.keys(dailySales).filter(dateStr => {
            const ctx = historicalContexts.find(c => c.dateString === dateStr);
            return ctx && ctx.event === predictedEvent.trim();
          });
          
          if (eventDaysInSales.length > 0 && baseDemand > 0) {
            const sumEvent = eventDaysInSales.reduce((acc, d) => acc + dailySales[d], 0);
            const avgOnEvent = sumEvent / eventDaysInSales.length;
            eventMultiplier = avgOnEvent / baseDemand;
          }
        }

        const finalMultiplier = Math.min(Math.max(weatherMultiplier * eventMultiplier, 0.5), 2.5);
        const finalSuggestion = baseDemand * finalMultiplier;
        
        const isKg = product.unit === 'KG';
        const quantity = isKg ? Number(finalSuggestion.toFixed(3)) : Math.ceil(finalSuggestion);

        return { 
          productId: product.id, 
          name: product.name, 
          predictedQuantity: quantity || 0, 
          multiplier: finalMultiplier,
          confidence: Object.keys(dailySales).length > 5 ? 90 : 50 
        };
      });

      setForecastResults(results.sort((a, b) => b.predictedQuantity - a.predictedQuantity));
      setIsCalculating(false);
    }, 800);
  };

  const handleSaveForecast = async () => {
    if (!tenant?.id) return;
    setIsSaving(true);
    const dateString = new Date().toISOString();
    try {
      for (const res of forecastResults) {
        if (res.predictedQuantity <= 0) continue;
        const prodId = `ia-${Date.now()}-${res.productId}`;
        const movId = `mov-${Date.now()}-${res.productId}`;

        await insertDemandPrediction({ id: prodId, tenantId: tenant.id, productId: res.productId, targetDate, predictedQuantity: res.predictedQuantity, confidenceScore: res.confidence });
        await insertMovement({ id: movId, tenantId: tenant.id, productId: res.productId, type: 'ENTRY', quantity: res.predictedQuantity, reason: 'Produção IA', dateString });
        
        const p = globalProducts.find(x => x.id === res.productId);
        if (p) {
          const newStock = Number(p.currentStock || 0) + res.predictedQuantity;
          const finalStock = p.unit === 'KG' ? Number(newStock.toFixed(3)) : newStock;

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

          await updateProduct(productPayload);
        }
      }
      alert("Plano de Produção efetivado!");
      setForecastResults([]);
    } catch (e: any) { 
      alert(`Erro: ${e.message}`); 
    } finally { 
      setIsSaving(false); 
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20"><BrainCircuit size={28} strokeWidth={2.5} /></div>
          Planejador Preditivo
        </h1>
        <p className="text-slate-500 font-medium ml-16">A IA utiliza Média Móvel Ponderada e Multiplicadores de Contexto para sugerir a produção.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex-1">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-2 uppercase tracking-wider"><Calendar size={14} /> Data da Produção</label>
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-all" />
          </div>
          
          <div className="flex-1">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-2 uppercase tracking-wider"><CloudRain size={14} /> Previsão do Tempo</label>
            <select value={predictedWeather} onChange={e => setPredictedWeather(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-all cursor-pointer">
              <option value="SUNNY">☀️ Ensolarado</option>
              <option value="CLOUDY">☁️ Nublado</option>
              <option value="RAINY">🌧️ Chuvoso</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-2 uppercase tracking-wider"><Zap size={14} /> Evento Especial (Opcional)</label>
            <select value={predictedEvent} onChange={e => setPredictedEvent(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-all cursor-pointer">
              <option value="">Nenhum Evento</option>
              {Array.from(new Set(historicalContexts.filter(c => c.event).map(c => c.event))).map(evt => (
                <option key={evt} value={evt}>{evt}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={runForecast} disabled={isCalculating} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70">
          {isCalculating ? "Calculando Projeções..." : "Gerar Plano de Produção"}
        </button>
      </div>

      {forecastResults.length > 0 && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
               <h2 className="font-black text-lg text-slate-800">Sugestões de Produção</h2>
               <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg uppercase tracking-widest">Análise de Tendência</span>
             </div>
             
             <div className="p-6 space-y-4">
               {forecastResults.map(r => (
                 <div key={r.productId} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group">
                   <div className="flex flex-col">
                     <span className="font-black text-slate-800 text-lg">{r.name}</span>
                     <div className="flex items-center gap-2 mt-1">
                       {r.multiplier > 1.05 && (
                         <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 flex items-center gap-1">
                           <TrendingUp size={12} strokeWidth={3} /> Alta Demanda
                         </span>
                       )}
                       {r.multiplier < 0.95 && (
                         <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 flex items-center gap-1">
                           <TrendingDown size={12} strokeWidth={3} /> Baixa Demanda
                         </span>
                       )}
                       {(r.multiplier >= 0.95 && r.multiplier <= 1.05) && (
                         <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                           Estável
                         </span>
                       )}
                       <span className="text-[10px] font-bold text-slate-400 ml-1">Confiança: {r.confidence}%</span>
                     </div>
                   </div>
                   <div className="text-right">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Produzir</span>
                     <strong className="text-3xl font-black text-slate-800">{r.predictedQuantity}</strong>
                   </div>
                 </div>
               ))}
             </div>
           </div>
           
           <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl h-fit">
             <h3 className="font-black text-2xl mb-4">Confirmar Plano</h3>
             <p className="text-sm text-slate-400 mb-8 leading-relaxed">Esta ação atualizará o estoque atual e registrará a produção no histórico para futuras análises de precisão da IA.</p>
             <button onClick={handleSaveForecast} disabled={isSaving} className="w-full py-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-95">
               {isSaving ? 'Gravando...' : 'Efetivar Produção'}
             </button>
           </div>
         </div>
      )}
    </div>
  );
}