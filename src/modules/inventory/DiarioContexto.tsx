import { useState, useEffect } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { insertDailyContext, getDailyContexts } from '../../dataconnect/default-connector';
import { CloudRain, Sun, Cloud, Calendar, Save, AlertCircle, Info, History } from 'lucide-react';

export default function DiarioContexto() {
  const { tenant } = useTenant();
  const [history, setHistory] = useState<any[]>([]);
  const [dateString, setDateString] = useState(new Date().toISOString().split('T')[0]);
  const [weather, setWeather] = useState('SUNNY');
  const [event, setEvent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!tenant?.id) return;
      setIsLoading(true);
      try {
        const res = await getDailyContexts({ tenantId: tenant.id });
        const sorted = (res.data.dailyContexts || []).sort((a: any, b: any) => b.dateString.localeCompare(a.dateString));
        setHistory(sorted);
      } catch (e) {
        console.error("Erro ao carregar contextos:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [tenant]);

  const handleSave = async () => {
    if (!tenant?.id) return;
    setIsSaving(true);
    try {
      const payload = {
        id: `ctx-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        tenantId: tenant.id,
        dateString,
        weather,
        event: event.trim()
      };
      
      await insertDailyContext(payload);
      
      setHistory(prev => [payload, ...prev].sort((a: any, b: any) => b.dateString.localeCompare(a.dateString)));
      alert("Anotação salva! O sistema já está processando os impactos.");
      setEvent('');
    } catch (error: any) {
      alert(`Erro ao salvar no diário: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getWeatherIcon = (w: string, size = 20) => {
    if (w === 'SUNNY') return <Sun className="text-amber-500" size={size} strokeWidth={2.5} />;
    if (w === 'RAINY') return <CloudRain className="text-blue-500" size={size} strokeWidth={2.5} />;
    return <Cloud className="text-slate-400" size={size} strokeWidth={2.5} />;
  };

  const getWeatherLabel = (w: string) => {
    if (w === 'SUNNY') return 'Ensolarado';
    if (w === 'RAINY') return 'Chuvoso';
    return 'Nublado';
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
            <CloudRain size={28} strokeWidth={2.5} />
          </div>
          Diário de Contexto
        </h1>
        <p className="text-slate-500 font-medium ml-16">
          Registre o clima e eventos atípicos. O sistema calculará o impacto nas vendas automaticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm h-fit space-y-8 sticky top-6">
          
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">
              <Calendar size={14} /> Data do Registro
            </label>
            <input 
              type="date" 
              value={dateString} 
              onChange={e => setDateString(e.target.value)} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Como está o tempo?</label>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setWeather('SUNNY')} 
                className={`p-4 rounded-2xl border-2 font-black flex flex-col items-center gap-2 transition-all active:scale-95 ${weather === 'SUNNY' ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                <Sun size={28} /> <span className="text-[10px]">SOL</span>
              </button>
              <button 
                onClick={() => setWeather('CLOUDY')} 
                className={`p-4 rounded-2xl border-2 font-black flex flex-col items-center gap-2 transition-all active:scale-95 ${weather === 'CLOUDY' ? 'bg-slate-100 border-slate-300 text-slate-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                <Cloud size={28} /> <span className="text-[10px]">NUBLADO</span>
              </button>
              <button 
                onClick={() => setWeather('RAINY')} 
                className={`p-4 rounded-2xl border-2 font-black flex flex-col items-center gap-2 transition-all active:scale-95 ${weather === 'RAINY' ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                <CloudRain size={28} /> <span className="text-[10px]">CHUVA</span>
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">
              <Info size={14} /> Feriado ou Evento Especial?
            </label>
            <input 
              type="text" 
              placeholder="Ex: Véspera de feriado, Greve, Jogo..." 
              value={event} 
              onChange={e => setEvent(e.target.value)} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all placeholder:text-slate-300" 
            />
          </div>

          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl shadow-xl shadow-blue-600/20 transition-all flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Save size={24} /> {isSaving ? 'Salvando...' : 'Salvar no Diário'}
          </button>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
          
          <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <History size={24} className="text-slate-400" /> Histórico Recente
            </h2>
            <span className="text-xs font-black text-slate-400 bg-slate-200/50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
              Linha do Tempo
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 custom-scrollbar">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-70">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin"></div>
                <p className="font-bold uppercase tracking-widest text-[10px]">Carregando anotações...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-70">
                <AlertCircle size={64} strokeWidth={1} />
                <p className="font-bold text-lg text-center">Nenhum contexto registrado.<br/>Comece anotando como foi o dia de hoje.</p>
              </div>
            ) : (
              history.map(item => (
                <div key={item.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between hover:border-blue-200 hover:shadow-md transition-all group animate-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:scale-110 transition-transform">
                      {getWeatherIcon(item.weather, 28)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.dateString}</p>
                      <p className="font-black text-slate-800 text-lg leading-tight">
                        {getWeatherLabel(item.weather)}
                        {item.event && item.event.trim() !== "" && (
                          <span className="text-blue-600 ml-2 font-bold">
                             — {item.event}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Anotado</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}