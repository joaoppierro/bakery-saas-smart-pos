export interface Tenant {
  id: string;
  name: string;
  hasInventory: boolean;
  hasDemandForecast: boolean;
  hasSmartPricing: boolean;
  createdAt: string | Date;
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'OPERATOR';

export interface User {
  id: string; // auth_uid do Firebase
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export type ProductType = 'FINAL_GOOD' | 'RAW_MATERIAL';

export interface Product {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  categoryId?: string;
  type: ProductType;
  
  costPrice: number;
  sellPrice: number;
  
  // Estoque Físico (Usado pelo Estoque e Demanda)
  currentStock: number;
  minStock: number;
  
  isActive: boolean;
  
  recipe?: RecipeItem[];
}


export interface RecipeItem {
  id: string;
  tenantId: string;
  finalProductId: string;
  rawMaterialId: string;
  quantityNeeded: number; // Ex: 0.150 (150g), 2 (2 unidades)
  rawMaterial?: Product; 
}


export type MovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT';

export interface Movement {
  id: string;
  tenantId: string;
  productId: string;
  userId: string;
  
  type: MovementType;
  quantity: number;
  reason?: string;
  createdAt: string | Date;
  
  product?: Partial<Product>;
  user?: Partial<User>;
}


export interface DemandForecast {
  id: string;
  tenantId: string;
  productId: string;
  
  targetDate: string | Date;
  predictedQuantity: number;
  actualQuantity?: number;
  errorMargin?: number;
  
  createdAt: string | Date;
  
  product?: Partial<Product>;
}

export interface DashboardMetrics {
  totalActiveProducts: number;
  lowStockItems: Product[];
  recentMovements: Movement[];
  upcomingDemandAlerts: DemandForecast[];
}