import type { Product, Movement } from '../types';

export const forecastEngine = {
  calculateAverageDailyDemand: (movements: Movement[], daysToAnalyze: number = 30): number => {
    if (!movements || movements.length === 0) return 0;
    
    const sales = movements.filter(m => m.type === 'EXIT');
    const totalSold = sales.reduce((acc, sale) => acc + sale.quantity, 0);
    
    return totalSold / daysToAnalyze;
  },

  explodeRecipeDemand: (finalProducts: Product[], forecastedSales: Record<string, number>): Record<string, number> => {
    const rawMaterialDemand: Record<string, number> = {};

    finalProducts.forEach(product => {
      if (product.type !== 'FINAL_GOOD' || !product.recipe) return;

      const dailySaleOfFinalProduct = forecastedSales[product.id] || 0;

      product.recipe.forEach(item => {
        const materialId = item.rawMaterialId;
        
        if (!rawMaterialDemand[materialId]) {
          rawMaterialDemand[materialId] = 0;
        }
        
        rawMaterialDemand[materialId] += (dailySaleOfFinalProduct * item.quantityNeeded);
      });
    });

    return rawMaterialDemand; // Ex: { "id_do_queijo": 1.5, "id_do_pao": 30 }
  },

  generatePurchasingAlerts: (rawMaterials: Product[], explodedDemand: Record<string, number>) => {
    const alerts = [];

    for (const material of rawMaterials) {
      if (material.type !== 'RAW_MATERIAL') continue;

      const dailyDemand = explodedDemand[material.id] || 0;
      
      const leadTimeDays = 2;
      const reorderPoint = (dailyDemand * leadTimeDays) + material.minStock;

      if (material.currentStock <= reorderPoint && dailyDemand > 0) {
        alerts.push({
          productId: material.id,
          name: material.name,
          currentStock: material.currentStock,
          reorderPoint: reorderPoint,
          suggestedOrder: reorderPoint - material.currentStock + (dailyDemand * 5) // Compra pra 5 dias
        });
      }
    }

    return alerts.sort((a, b) => b.suggestedOrder - a.suggestedOrder);
  }
};