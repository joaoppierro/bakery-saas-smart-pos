import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'sistemas-integrado',
  location: 'southamerica-east1'
};

export const insertTenantRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertTenant', inputVars);
}
insertTenantRef.operationName = 'InsertTenant';

export function insertTenant(dcOrVars, vars) {
  return executeMutation(insertTenantRef(dcOrVars, vars));
}

export const updateProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProduct', inputVars);
}
updateProductRef.operationName = 'UpdateProduct';

export function updateProduct(dcOrVars, vars) {
  return executeMutation(updateProductRef(dcOrVars, vars));
}

export const updateProductStrategyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProductStrategy', inputVars);
}
updateProductStrategyRef.operationName = 'UpdateProductStrategy';

export function updateProductStrategy(dcOrVars, vars) {
  return executeMutation(updateProductStrategyRef(dcOrVars, vars));
}

export const insertMovementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertMovement', inputVars);
}
insertMovementRef.operationName = 'InsertMovement';

export function insertMovement(dcOrVars, vars) {
  return executeMutation(insertMovementRef(dcOrVars, vars));
}

export const upsertPricingConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPricingConfig', inputVars);
}
upsertPricingConfigRef.operationName = 'UpsertPricingConfig';

export function upsertPricingConfig(dcOrVars, vars) {
  return executeMutation(upsertPricingConfigRef(dcOrVars, vars));
}

export const insertRecipeItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertRecipeItem', inputVars);
}
insertRecipeItemRef.operationName = 'InsertRecipeItem';

export function insertRecipeItem(dcOrVars, vars) {
  return executeMutation(insertRecipeItemRef(dcOrVars, vars));
}

export const deleteRecipeItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteRecipeItem', inputVars);
}
deleteRecipeItemRef.operationName = 'DeleteRecipeItem';

export function deleteRecipeItem(dcOrVars, vars) {
  return executeMutation(deleteRecipeItemRef(dcOrVars, vars));
}

export const insertRuptureLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertRuptureLog', inputVars);
}
insertRuptureLogRef.operationName = 'InsertRuptureLog';

export function insertRuptureLog(dcOrVars, vars) {
  return executeMutation(insertRuptureLogRef(dcOrVars, vars));
}

export const insertDailyContextRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertDailyContext', inputVars);
}
insertDailyContextRef.operationName = 'InsertDailyContext';

export function insertDailyContext(dcOrVars, vars) {
  return executeMutation(insertDailyContextRef(dcOrVars, vars));
}

export const insertDemandPredictionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertDemandPrediction', inputVars);
}
insertDemandPredictionRef.operationName = 'InsertDemandPrediction';

export function insertDemandPrediction(dcOrVars, vars) {
  return executeMutation(insertDemandPredictionRef(dcOrVars, vars));
}

export const listProductsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProducts', inputVars);
}
listProductsRef.operationName = 'ListProducts';

export function listProducts(dcOrVars, vars) {
  return executeQuery(listProductsRef(dcOrVars, vars));
}

export const listMovementsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMovements', inputVars);
}
listMovementsRef.operationName = 'ListMovements';

export function listMovements(dcOrVars, vars) {
  return executeQuery(listMovementsRef(dcOrVars, vars));
}

export const getDemandPredictionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDemandPredictions', inputVars);
}
getDemandPredictionsRef.operationName = 'GetDemandPredictions';

export function getDemandPredictions(dcOrVars, vars) {
  return executeQuery(getDemandPredictionsRef(dcOrVars, vars));
}

export const getDailyContextsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDailyContexts', inputVars);
}
getDailyContextsRef.operationName = 'GetDailyContexts';

export function getDailyContexts(dcOrVars, vars) {
  return executeQuery(getDailyContextsRef(dcOrVars, vars));
}

export const getRuptureLogsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRuptureLogs', inputVars);
}
getRuptureLogsRef.operationName = 'GetRuptureLogs';

export function getRuptureLogs(dcOrVars, vars) {
  return executeQuery(getRuptureLogsRef(dcOrVars, vars));
}

