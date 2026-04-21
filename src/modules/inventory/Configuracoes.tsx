import { useState, useEffect } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { upsertPricingConfig } from '../../dataconnect/default-connector';
import { Calculator, Save, Percent, DollarSign, TrendingUp, CreditCard, Building, Settings } from 'lucide-react';

export default function Configuracoes() {
  const { tenant, pricingConfig, setPricingConfig } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  
  const [config, setConfig] = useState({
    taxesPercent: 0,
    cardFeesPercent: 0,
    fixedCostsPercent: 0,
    profitMarginPercent: 0
  });

  useEffect(() => {
    if (pricingConfig) {
      setConfig({
        taxesPercent: pricingConfig.taxesPercent || 0,
        cardFeesPercent: pricingConfig.cardFeesPercent || 0,
        fixedCostsPercent: pricingConfig.fixedCostsPercent || 0,
        profitMarginPercent: pricingConfig.profitMarginPercent || 0
      });
    }
  }, [pricingConfig]);

  const handleUpdate = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleSave = async () => {
    if (!tenant?.id) return;
    setIsSaving(true);

    try {
      const payload = {
        id: tenant.id, 
        tenantId: tenant.id, 
        taxesPercent: Number(config.taxesPercent) || 0,
        cardFeesPercent: Number(config.cardFeesPercent) || 0,
        fixedCostsPercent: Number(config.fixedCostsPercent) || 0,
        profitMarginPercent: Number(config.profitMarginPercent) || 0
      };

      await upsertPricingConfig(payload);
      setPricingConfig(payload);
      
      alert("Parâmetros globais salvos com sucesso!");
    } catch (error: any) {
      alert(`Erro ao salvar configurações: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const targetMarkup = config.taxesPercent + config.cardFeesPercent + config.fixedCostsPercent + config.profitMarginPercent;

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
              <Settings size={28} strokeWidth={2.5} />
            </div>
            Parâmetros Globais
          </h1>
          <p className="text-slate-500 font-medium ml-16">
            Defina as taxas padrão para o cálculo automático de preços e metas do seu negócio.
          </p>
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-black shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save size={20} /> {isSaving ? 'Salvando...' : 'Salvar Mudanças'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
              <DollarSign size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-slate-800">Custos e Despesas Variáveis</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-2 uppercase tracking-wider">
                <Building size={14} /> Impostos (Simples, ICMS, etc)
              </label>
              <div className="relative group">
                <input type="number" step="0.1" value={config.taxesPercent} onChange={e => handleUpdate('taxesPercent', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg" />
                <Percent size={20} className="absolute right-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-2 uppercase tracking-wider">
                <CreditCard size={14} /> Taxas de Cartão / Adquirente
              </label>
              <div className="relative group">
                <input type="number" step="0.1" value={config.cardFeesPercent} onChange={e => handleUpdate('cardFeesPercent', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg" />
                <Percent size={20} className="absolute right-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-2 uppercase tracking-wider">
                <Building size={14} /> Rateio de Custo Fixo (Aluguel, Luz)
              </label>
              <div className="relative group">
                <input type="number" step="0.1" value={config.fixedCostsPercent} onChange={e => handleUpdate('fixedCostsPercent', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg" />
                <Percent size={20} className="absolute right-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                <TrendingUp size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-black text-slate-800">Metas de Lucratividade</h2>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 mb-2 uppercase tracking-wider">
                Margem de Lucro Desejada (Líquida)
              </label>
              <div className="relative group">
                <input type="number" step="0.1" value={config.profitMarginPercent} onChange={e => handleUpdate('profitMarginPercent', e.target.value)} className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-xl font-black text-emerald-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all text-lg" />
                <Percent size={20} className="absolute right-4 top-4 text-emerald-600 group-focus-within:text-emerald-700 transition-colors" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
            
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calculator size={16} /> Markup Global Calculado (Alvo)
            </h3>
            
            <div className="flex items-baseline gap-2 mb-6 relative z-10">
              <span className="text-6xl font-black text-emerald-400 tracking-tighter">{targetMarkup.toFixed(1)}</span>
              <span className="text-2xl font-black text-emerald-400/50">%</span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">
              O sistema usará <strong className="text-white bg-slate-800 px-2 py-0.5 rounded">{targetMarkup.toFixed(1)}%</strong> como alvo no seu Simulador de Mix de Vendas. Essa é a margem média que o seu cardápio precisa atingir para garantir que todas as contas sejam pagas.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}