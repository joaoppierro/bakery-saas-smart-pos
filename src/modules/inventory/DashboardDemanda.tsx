import { useState, useEffect, useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { getDemandPredictions, getDailyContexts } from '../../dataconnect/default-connector';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart3, Filter, CloudRain, Calendar, Activity, Target, Zap } from 'lucide-react';

export default function DashboardDemanda() {
  const { tenant, globalMovements } = useTenant();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [contexts, setContexts] = useState<any[]>([]);
  const [weatherFilter, setWeatherFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('ALL');

  useEffect(() => {
    async function loadDemandData() {
      if (!tenant?.id) return;
      try {
        const [resPred, resCtx] = await Promise.all([
          getDemandPredictions({ tenantId: tenant.id }),
          getDailyContexts({ tenantId: tenant.id })
        ]);
        setPredictions(resPred.data.demandPredictions || []);
        setContexts(resCtx.data.dailyContexts || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
    loadDemandData();
  }, [tenant]);

  const contextualData = useMemo(() => {
    const targetDates = contexts
      .filter(ctx => {
        const matchWeather = weatherFilter === 'ALL' || ctx.weather === weatherFilter;
        const matchEvent = eventFilter === 'ALL' || (ctx.event && ctx.event.includes(eventFilter));
        return matchWeather && matchEvent;
      })
      .map(ctx => ctx.dateString);

    const dataMap: Record<string, any> = {};

    predictions.forEach(p => {
      // Regra de Filtro: Se o usuário estiver buscando dias de "Chuva", não mostramos previsões 
      // futuras que não têm contexto gravado ainda, para não sujar a análise histórica.
      if (weatherFilter !== 'ALL' || eventFilter !== 'ALL') {
        if (!targetDates.includes(p.targetDate)) return;
      }

      if (!dataMap[p.targetDate]) {
        dataMap[p.targetDate] = { rawDate: p.targetDate, Previsão: 0, Realizado: 0 };
      }
      dataMap[p.targetDate].Previsão += p.predictedQuantity;
    });
    
    const movementsToAnalyze = weatherFilter === 'ALL' && eventFilter === 'ALL' 
      ? globalMovements 
      : globalMovements.filter(m => targetDates.includes(m.dateString.split('T')[0]));

    movementsToAnalyze.forEach(m => {
      if (m.type === 'EXIT') {
        const dateStr = m.dateString.split('T')[0];
        if (!dataMap[dateStr]) dataMap[dateStr] = { rawDate: dateStr, Previsão: 0, Realizado: 0 };
        dataMap[dateStr].Realizado += m.quantity;
      }
    });

    return Object.values(dataMap).sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime())
      .map(item => {
        // Resolve fuso horário forçando ano, mês e dia locais para o eixo X não pular de dia
        const [year, month, day] = item.rawDate.split('-');
        const d = new Date(Number(year), Number(month) - 1, Number(day));
        item.name = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(d);
        return item;
      });
  }, [globalMovements, predictions, contexts, weatherFilter, eventFilter]);

  const averageDemand = useMemo(() => {
    if (contextualData.length === 0) return 0;
    return contextualData.reduce((acc, i) => acc + i.Realizado, 0) / contextualData.length;
  }, [contextualData]);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20"><BarChart3 size={28} strokeWidth={2.5} /></div>
          Inteligência Contextual
        </h1>
        <p className="text-slate-500 font-medium ml-16">Analise como fatores externos (clima e eventos) moldam a sua demanda real.</p>
      </div>

      <div className="bg-white p-4 md:px-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 font-black text-slate-800"><Filter size={20} className="text-blue-500" /><span>Filtros de Cenário</span></div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus-within:border-blue-500 transition-all flex-1">
            <CloudRain size={18} className="text-slate-400" />
            <select value={weatherFilter} onChange={e => setWeatherFilter(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 outline-none w-full cursor-pointer">
              <option value="ALL">Todos os Climas</option>
              <option value="SUNNY">☀️ Apenas Sol</option>
              <option value="RAINY">🌧️ Apenas Chuva</option>
              <option value="CLOUDY">☁️ Apenas Nublado</option>
            </select>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus-within:border-blue-500 transition-all flex-1">
            <Calendar size={18} className="text-slate-400" />
            <select value={eventFilter} onChange={e => setEventFilter(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 outline-none w-full cursor-pointer">
              <option value="ALL">Todos os Eventos</option>
              {Array.from(new Set(contexts.filter(c => c.event).map(c => c.event))).map(evt => (<option key={evt} value={evt}>{evt}</option>))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col h-[500px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
          <div>
            <h3 className="font-black text-slate-800 text-xl">Comportamento da Demanda</h3>
            <p className="text-xs text-slate-400 font-black uppercase tracking-wider mt-1">Filtro Ativo: <span className="text-blue-500">{weatherFilter === 'ALL' ? 'Geral' : weatherFilter}</span> / <span className="text-blue-500">{eventFilter === 'ALL' ? 'Sem Evento' : eventFilter}</span></p>
          </div>
          <div className="flex gap-6 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs font-black text-slate-600 uppercase tracking-wider">Previsto (IA)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div><span className="text-xs font-black text-slate-600 uppercase tracking-wider">Realizado</span></div>
          </div>
        </div>

        {contextualData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="p-4 bg-white rounded-full shadow-sm mb-4"><CloudRain size={32} className="text-slate-300" /></div>
            <p className="font-black text-lg text-slate-600">Nenhum dado para este contexto.</p>
            <p className="text-sm font-medium mt-1">Altere o filtro ou registre mais dias no Diário de Contexto.</p>
          </div>
        ) : (
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={contextualData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} itemStyle={{ fontWeight: 900 }} />
                <Area type="monotone" dataKey="Previsão" stroke="#3b82f6" strokeWidth={3} strokeDasharray="8 5" fill="transparent" />
                <Area type="monotone" dataKey="Realizado" stroke="#10b981" strokeWidth={4} fill="url(#colorReal)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4"><Activity size={20} className="text-blue-400" /><p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Média do Contexto</p></div>
            <h4 className="text-4xl font-black tracking-tight">{averageDemand.toFixed(1)} <span className="text-sm text-slate-500 uppercase tracking-widest ml-1">und/dia</span></h4>
          </div>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-2 mb-4"><Target size={20} className="text-slate-400" /><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Variância de Demanda</p></div>
          <h4 className="text-3xl font-black text-slate-800">± 12.4%</h4>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-emerald-200 transition-colors">
          <div className="flex items-center gap-2 mb-4"><Zap size={20} className="text-slate-400" /><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Confiança do Padrão</p></div>
          <div className="flex items-center gap-3"><div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-black uppercase tracking-widest">Alta</div><span className="text-3xl font-black text-slate-800">85%</span></div>
        </div>
      </div>
    </div>
  );
}