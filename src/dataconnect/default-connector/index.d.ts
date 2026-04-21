import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface DailyContext_Key {
  id: string;
  __typename?: 'DailyContext_Key';
}

export interface DeleteRecipeItemData {
  recipeItem_delete?: RecipeItem_Key | null;
}

export interface DeleteRecipeItemVariables {
  id: string;
}

export interface DemandPrediction_Key {
  id: string;
  __typename?: 'DemandPrediction_Key';
}

export interface GetDailyContextsData {
  dailyContexts: ({
    id: string;
    dateString: string;
    weather: string;
    event?: string | null;
  } & DailyContext_Key)[];
}

export interface GetDailyContextsVariables {
  tenantId: string;
}

export interface GetDemandPredictionsData {
  demandPredictions: ({
    id: string;
    productId: string;
    targetDate: string;
    predictedQuantity: number;
    confidenceScore: number;
  } & DemandPrediction_Key)[];
}

export interface GetDemandPredictionsVariables {
  tenantId: string;
}

export interface GetRuptureLogsData {
  ruptureLogs: ({
    id: string;
    productId: string;
    dateString: string;
    lostQuantity: number;
  } & RuptureLog_Key)[];
}

export interface GetRuptureLogsVariables {
  tenantId: string;
}

export interface InsertDailyContextData {
  dailyContext_insert: DailyContext_Key;
}

export interface InsertDailyContextVariables {
  id: string;
  tenantId: string;
  dateString: string;
  weather: string;
  event?: string | null;
}

export interface InsertDemandPredictionData {
  demandPrediction_insert: DemandPrediction_Key;
}

export interface InsertDemandPredictionVariables {
  id: string;
  tenantId: string;
  productId: string;
  targetDate: string;
  predictedQuantity: number;
  confidenceScore: number;
}

export interface InsertMovementData {
  movement_insert: Movement_Key;
}

export interface InsertMovementVariables {
  id: string;
  tenantId: string;
  productId: string;
  type: string;
  quantity: number;
  reason?: string | null;
  dateString: string;
}

export interface InsertRecipeItemData {
  recipeItem_insert: RecipeItem_Key;
}

export interface InsertRecipeItemVariables {
  id: string;
  tenantId: string;
  productId: string;
  ingredientId: string;
  quantity: number;
}

export interface InsertRuptureLogData {
  ruptureLog_insert: RuptureLog_Key;
}

export interface InsertRuptureLogVariables {
  id: string;
  tenantId: string;
  productId: string;
  dateString: string;
  lostQuantity: number;
  notes?: string | null;
}

export interface InsertTenantData {
  tenant_insert: Tenant_Key;
}

export interface InsertTenantVariables {
  id: string;
  name: string;
}

export interface ListMovementsData {
  movements: ({
    id: string;
    productId: string;
    type: string;
    quantity: number;
    reason?: string | null;
    dateString: string;
  } & Movement_Key)[];
}

export interface ListMovementsVariables {
  tenantId: string;
}

export interface ListProductsData {
  products: ({
    id: string;
    sku?: string | null;
    name: string;
    type: string;
    unit?: string | null;
    costPrice: number;
    sellPrice: number;
    currentStock: number;
    minStock: number;
    strategicRole?: string | null;
  } & Product_Key)[];
}

export interface ListProductsVariables {
  tenantId: string;
}

export interface Movement_Key {
  id: string;
  __typename?: 'Movement_Key';
}

export interface PricingConfig_Key {
  id: string;
  __typename?: 'PricingConfig_Key';
}

export interface Product_Key {
  id: string;
  __typename?: 'Product_Key';
}

export interface RecipeItem_Key {
  id: string;
  __typename?: 'RecipeItem_Key';
}

export interface RuptureLog_Key {
  id: string;
  __typename?: 'RuptureLog_Key';
}

export interface Tenant_Key {
  id: string;
  __typename?: 'Tenant_Key';
}

export interface UpdateProductData {
  product_upsert: Product_Key;
}

export interface UpdateProductStrategyData {
  product_update?: Product_Key | null;
}

export interface UpdateProductStrategyVariables {
  id: string;
  strategicRole?: string | null;
  targetMargin?: number | null;
}

export interface UpdateProductVariables {
  id: string;
  tenantId: string;
  sku?: string | null;
  name: string;
  type: string;
  unit?: string | null;
  costPrice: number;
  sellPrice: number;
  currentStock: number;
  minStock: number;
}

export interface UpsertPricingConfigData {
  pricingConfig_upsert: PricingConfig_Key;
}

export interface UpsertPricingConfigVariables {
  id: string;
  tenantId: string;
  taxesPercent: number;
  cardFeesPercent: number;
  fixedCostsPercent: number;
  profitMarginPercent: number;
}

interface InsertTenantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertTenantVariables): MutationRef<InsertTenantData, InsertTenantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertTenantVariables): MutationRef<InsertTenantData, InsertTenantVariables>;
  operationName: string;
}
export const insertTenantRef: InsertTenantRef;

export function insertTenant(vars: InsertTenantVariables): MutationPromise<InsertTenantData, InsertTenantVariables>;
export function insertTenant(dc: DataConnect, vars: InsertTenantVariables): MutationPromise<InsertTenantData, InsertTenantVariables>;

interface UpdateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  operationName: string;
}
export const updateProductRef: UpdateProductRef;

export function updateProduct(vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;
export function updateProduct(dc: DataConnect, vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;

interface UpdateProductStrategyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductStrategyVariables): MutationRef<UpdateProductStrategyData, UpdateProductStrategyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductStrategyVariables): MutationRef<UpdateProductStrategyData, UpdateProductStrategyVariables>;
  operationName: string;
}
export const updateProductStrategyRef: UpdateProductStrategyRef;

export function updateProductStrategy(vars: UpdateProductStrategyVariables): MutationPromise<UpdateProductStrategyData, UpdateProductStrategyVariables>;
export function updateProductStrategy(dc: DataConnect, vars: UpdateProductStrategyVariables): MutationPromise<UpdateProductStrategyData, UpdateProductStrategyVariables>;

interface InsertMovementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertMovementVariables): MutationRef<InsertMovementData, InsertMovementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertMovementVariables): MutationRef<InsertMovementData, InsertMovementVariables>;
  operationName: string;
}
export const insertMovementRef: InsertMovementRef;

export function insertMovement(vars: InsertMovementVariables): MutationPromise<InsertMovementData, InsertMovementVariables>;
export function insertMovement(dc: DataConnect, vars: InsertMovementVariables): MutationPromise<InsertMovementData, InsertMovementVariables>;

interface UpsertPricingConfigRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPricingConfigVariables): MutationRef<UpsertPricingConfigData, UpsertPricingConfigVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertPricingConfigVariables): MutationRef<UpsertPricingConfigData, UpsertPricingConfigVariables>;
  operationName: string;
}
export const upsertPricingConfigRef: UpsertPricingConfigRef;

export function upsertPricingConfig(vars: UpsertPricingConfigVariables): MutationPromise<UpsertPricingConfigData, UpsertPricingConfigVariables>;
export function upsertPricingConfig(dc: DataConnect, vars: UpsertPricingConfigVariables): MutationPromise<UpsertPricingConfigData, UpsertPricingConfigVariables>;

interface InsertRecipeItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertRecipeItemVariables): MutationRef<InsertRecipeItemData, InsertRecipeItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertRecipeItemVariables): MutationRef<InsertRecipeItemData, InsertRecipeItemVariables>;
  operationName: string;
}
export const insertRecipeItemRef: InsertRecipeItemRef;

export function insertRecipeItem(vars: InsertRecipeItemVariables): MutationPromise<InsertRecipeItemData, InsertRecipeItemVariables>;
export function insertRecipeItem(dc: DataConnect, vars: InsertRecipeItemVariables): MutationPromise<InsertRecipeItemData, InsertRecipeItemVariables>;

interface DeleteRecipeItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteRecipeItemVariables): MutationRef<DeleteRecipeItemData, DeleteRecipeItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteRecipeItemVariables): MutationRef<DeleteRecipeItemData, DeleteRecipeItemVariables>;
  operationName: string;
}
export const deleteRecipeItemRef: DeleteRecipeItemRef;

export function deleteRecipeItem(vars: DeleteRecipeItemVariables): MutationPromise<DeleteRecipeItemData, DeleteRecipeItemVariables>;
export function deleteRecipeItem(dc: DataConnect, vars: DeleteRecipeItemVariables): MutationPromise<DeleteRecipeItemData, DeleteRecipeItemVariables>;

interface InsertRuptureLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertRuptureLogVariables): MutationRef<InsertRuptureLogData, InsertRuptureLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertRuptureLogVariables): MutationRef<InsertRuptureLogData, InsertRuptureLogVariables>;
  operationName: string;
}
export const insertRuptureLogRef: InsertRuptureLogRef;

export function insertRuptureLog(vars: InsertRuptureLogVariables): MutationPromise<InsertRuptureLogData, InsertRuptureLogVariables>;
export function insertRuptureLog(dc: DataConnect, vars: InsertRuptureLogVariables): MutationPromise<InsertRuptureLogData, InsertRuptureLogVariables>;

interface InsertDailyContextRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertDailyContextVariables): MutationRef<InsertDailyContextData, InsertDailyContextVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertDailyContextVariables): MutationRef<InsertDailyContextData, InsertDailyContextVariables>;
  operationName: string;
}
export const insertDailyContextRef: InsertDailyContextRef;

export function insertDailyContext(vars: InsertDailyContextVariables): MutationPromise<InsertDailyContextData, InsertDailyContextVariables>;
export function insertDailyContext(dc: DataConnect, vars: InsertDailyContextVariables): MutationPromise<InsertDailyContextData, InsertDailyContextVariables>;

interface InsertDemandPredictionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertDemandPredictionVariables): MutationRef<InsertDemandPredictionData, InsertDemandPredictionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertDemandPredictionVariables): MutationRef<InsertDemandPredictionData, InsertDemandPredictionVariables>;
  operationName: string;
}
export const insertDemandPredictionRef: InsertDemandPredictionRef;

export function insertDemandPrediction(vars: InsertDemandPredictionVariables): MutationPromise<InsertDemandPredictionData, InsertDemandPredictionVariables>;
export function insertDemandPrediction(dc: DataConnect, vars: InsertDemandPredictionVariables): MutationPromise<InsertDemandPredictionData, InsertDemandPredictionVariables>;

interface ListProductsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductsVariables): QueryRef<ListProductsData, ListProductsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListProductsVariables): QueryRef<ListProductsData, ListProductsVariables>;
  operationName: string;
}
export const listProductsRef: ListProductsRef;

export function listProducts(vars: ListProductsVariables): QueryPromise<ListProductsData, ListProductsVariables>;
export function listProducts(dc: DataConnect, vars: ListProductsVariables): QueryPromise<ListProductsData, ListProductsVariables>;

interface ListMovementsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMovementsVariables): QueryRef<ListMovementsData, ListMovementsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListMovementsVariables): QueryRef<ListMovementsData, ListMovementsVariables>;
  operationName: string;
}
export const listMovementsRef: ListMovementsRef;

export function listMovements(vars: ListMovementsVariables): QueryPromise<ListMovementsData, ListMovementsVariables>;
export function listMovements(dc: DataConnect, vars: ListMovementsVariables): QueryPromise<ListMovementsData, ListMovementsVariables>;

interface GetDemandPredictionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDemandPredictionsVariables): QueryRef<GetDemandPredictionsData, GetDemandPredictionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDemandPredictionsVariables): QueryRef<GetDemandPredictionsData, GetDemandPredictionsVariables>;
  operationName: string;
}
export const getDemandPredictionsRef: GetDemandPredictionsRef;

export function getDemandPredictions(vars: GetDemandPredictionsVariables): QueryPromise<GetDemandPredictionsData, GetDemandPredictionsVariables>;
export function getDemandPredictions(dc: DataConnect, vars: GetDemandPredictionsVariables): QueryPromise<GetDemandPredictionsData, GetDemandPredictionsVariables>;

interface GetDailyContextsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDailyContextsVariables): QueryRef<GetDailyContextsData, GetDailyContextsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDailyContextsVariables): QueryRef<GetDailyContextsData, GetDailyContextsVariables>;
  operationName: string;
}
export const getDailyContextsRef: GetDailyContextsRef;

export function getDailyContexts(vars: GetDailyContextsVariables): QueryPromise<GetDailyContextsData, GetDailyContextsVariables>;
export function getDailyContexts(dc: DataConnect, vars: GetDailyContextsVariables): QueryPromise<GetDailyContextsData, GetDailyContextsVariables>;

interface GetRuptureLogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRuptureLogsVariables): QueryRef<GetRuptureLogsData, GetRuptureLogsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetRuptureLogsVariables): QueryRef<GetRuptureLogsData, GetRuptureLogsVariables>;
  operationName: string;
}
export const getRuptureLogsRef: GetRuptureLogsRef;

export function getRuptureLogs(vars: GetRuptureLogsVariables): QueryPromise<GetRuptureLogsData, GetRuptureLogsVariables>;
export function getRuptureLogs(dc: DataConnect, vars: GetRuptureLogsVariables): QueryPromise<GetRuptureLogsData, GetRuptureLogsVariables>;

