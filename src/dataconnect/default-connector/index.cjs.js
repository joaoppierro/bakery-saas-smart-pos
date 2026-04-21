const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'sistemas-integrado',
  location: 'southamerica-east1'
};
exports.connectorConfig = connectorConfig;

const insertTenantRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertTenant', inputVars);
}
insertTenantRef.operationName = 'InsertTenant';
exports.insertTenantRef = insertTenantRef;

exports.insertTenant = function insertTenant(dcOrVars, vars) {
  return executeMutation(insertTenantRef(dcOrVars, vars));
};

const updateProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProduct', inputVars);
}
updateProductRef.operationName = 'UpdateProduct';
exports.updateProductRef = updateProductRef;

exports.updateProduct = function updateProduct(dcOrVars, vars) {
  return executeMutation(updateProductRef(dcOrVars, vars));
};

const updateProductStrategyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProductStrategy', inputVars);
}
updateProductStrategyRef.operationName = 'UpdateProductStrategy';
exports.updateProductStrategyRef = updateProductStrategyRef;

exports.updateProductStrategy = function updateProductStrategy(dcOrVars, vars) {
  return executeMutation(updateProductStrategyRef(dcOrVars, vars));
};

const insertMovementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertMovement', inputVars);
}
insertMovementRef.operationName = 'InsertMovement';
exports.insertMovementRef = insertMovementRef;

exports.insertMovement = function insertMovement(dcOrVars, vars) {
  return executeMutation(insertMovementRef(dcOrVars, vars));
};

const upsertPricingConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPricingConfig', inputVars);
}
upsertPricingConfigRef.operationName = 'UpsertPricingConfig';
exports.upsertPricingConfigRef = upsertPricingConfigRef;

exports.upsertPricingConfig = function upsertPricingConfig(dcOrVars, vars) {
  return executeMutation(upsertPricingConfigRef(dcOrVars, vars));
};

const insertRecipeItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertRecipeItem', inputVars);
}
insertRecipeItemRef.operationName = 'InsertRecipeItem';
exports.insertRecipeItemRef = insertRecipeItemRef;

exports.insertRecipeItem = function insertRecipeItem(dcOrVars, vars) {
  return executeMutation(insertRecipeItemRef(dcOrVars, vars));
};

const deleteRecipeItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteRecipeItem', inputVars);
}
deleteRecipeItemRef.operationName = 'DeleteRecipeItem';
exports.deleteRecipeItemRef = deleteRecipeItemRef;

exports.deleteRecipeItem = function deleteRecipeItem(dcOrVars, vars) {
  return executeMutation(deleteRecipeItemRef(dcOrVars, vars));
};

const insertRuptureLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertRuptureLog', inputVars);
}
insertRuptureLogRef.operationName = 'InsertRuptureLog';
exports.insertRuptureLogRef = insertRuptureLogRef;

exports.insertRuptureLog = function insertRuptureLog(dcOrVars, vars) {
  return executeMutation(insertRuptureLogRef(dcOrVars, vars));
};

const insertDailyContextRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertDailyContext', inputVars);
}
insertDailyContextRef.operationName = 'InsertDailyContext';
exports.insertDailyContextRef = insertDailyContextRef;

exports.insertDailyContext = function insertDailyContext(dcOrVars, vars) {
  return executeMutation(insertDailyContextRef(dcOrVars, vars));
};

const insertDemandPredictionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertDemandPrediction', inputVars);
}
insertDemandPredictionRef.operationName = 'InsertDemandPrediction';
exports.insertDemandPredictionRef = insertDemandPredictionRef;

exports.insertDemandPrediction = function insertDemandPrediction(dcOrVars, vars) {
  return executeMutation(insertDemandPredictionRef(dcOrVars, vars));
};

const listProductsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProducts', inputVars);
}
listProductsRef.operationName = 'ListProducts';
exports.listProductsRef = listProductsRef;

exports.listProducts = function listProducts(dcOrVars, vars) {
  return executeQuery(listProductsRef(dcOrVars, vars));
};

const listMovementsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMovements', inputVars);
}
listMovementsRef.operationName = 'ListMovements';
exports.listMovementsRef = listMovementsRef;

exports.listMovements = function listMovements(dcOrVars, vars) {
  return executeQuery(listMovementsRef(dcOrVars, vars));
};

const getDemandPredictionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDemandPredictions', inputVars);
}
getDemandPredictionsRef.operationName = 'GetDemandPredictions';
exports.getDemandPredictionsRef = getDemandPredictionsRef;

exports.getDemandPredictions = function getDemandPredictions(dcOrVars, vars) {
  return executeQuery(getDemandPredictionsRef(dcOrVars, vars));
};

const getDailyContextsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDailyContexts', inputVars);
}
getDailyContextsRef.operationName = 'GetDailyContexts';
exports.getDailyContextsRef = getDailyContextsRef;

exports.getDailyContexts = function getDailyContexts(dcOrVars, vars) {
  return executeQuery(getDailyContextsRef(dcOrVars, vars));
};

const getRuptureLogsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRuptureLogs', inputVars);
}
getRuptureLogsRef.operationName = 'GetRuptureLogs';
exports.getRuptureLogsRef = getRuptureLogsRef;

exports.getRuptureLogs = function getRuptureLogs(dcOrVars, vars) {
  return executeQuery(getRuptureLogsRef(dcOrVars, vars));
};
