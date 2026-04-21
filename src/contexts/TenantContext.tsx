import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { listProducts, listMovements } from '../dataconnect/default-connector';

interface Tenant { id: string; name: string; }

interface TenantContextData {
  tenant: Tenant | null;
  globalProducts: any[];
  setGlobalProducts: React.Dispatch<React.SetStateAction<any[]>>;
  globalMovements: any[];
  setGlobalMovements: React.Dispatch<React.SetStateAction<any[]>>;
  pricingConfig: any;
  setPricingConfig: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const TenantContext = createContext<TenantContextData>({} as TenantContextData);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [globalProducts, setGlobalProducts] = useState<any[]>([]);
  const [globalMovements, setGlobalMovements] = useState<any[]>([]);
  const [pricingConfig, setPricingConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tenant = useMemo(() => {
    if (!user) return null;
    return { id: user.uid, name: user.email?.split('@')[0].toUpperCase() || "Minha Empresa" };
  }, [user]);

  const loadAllData = async () => {
    if (!tenant?.id) return;
    setIsLoading(true);
    try {
      const [resProducts, resMovements] = await Promise.all([
        listProducts({ tenantId: tenant.id }),
        listMovements({ tenantId: tenant.id })
      ]);
      setGlobalProducts(resProducts.data.products || []);
      setGlobalMovements(resMovements.data.movements || []);
      setPricingConfig({ taxesPercent: 5, cardFeesPercent: 2, fixedCostsPercent: 10, profitMarginPercent: 15, globalTargetMargin: 20 });
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadAllData();
    else { setGlobalProducts([]); setGlobalMovements([]); setIsLoading(false); }
  }, [user, tenant?.id]);

  return (
    <TenantContext.Provider value={{ tenant, globalProducts, setGlobalProducts, globalMovements, setGlobalMovements, pricingConfig, setPricingConfig, isLoading, refreshData: loadAllData }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);