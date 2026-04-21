import type { Product, RecipeItem } from '../types';

interface PricingParameters {
  fixedCostPct: number;
  variableCostPct: number;
  taxPct: number;
  desiredMarginPct: number;
}

export const pricingEngine = {
  calculateRealCost: (product: Product): number => {
    if (product.type === 'RAW_MATERIAL') {
      return product.costPrice;
    }

    if (!product.recipe || product.recipe.length === 0) {
      return product.costPrice;
    }

    return product.recipe.reduce((totalCost, item: RecipeItem) => {
      const ingredientUnitCost = item.rawMaterial?.costPrice || 0;
      return totalCost + (ingredientUnitCost * item.quantityNeeded);
    }, 0);
  },

  calculateSuggestedPrice: (realCost: number, params: PricingParameters): number => {
    if (realCost <= 0) return 0;

    const totalDiscountsPct = params.fixedCostPct + params.variableCostPct + params.taxPct + params.desiredMarginPct;
    const divisor = 1 - (totalDiscountsPct / 100);

    if (divisor <= 0) {
      throw new Error("Parâmetros financeiros inválidos. Os descontos e margens ultrapassam 100%.");
    }

    return realCost / divisor;
  }
};