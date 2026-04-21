# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { insertTenant, updateProduct, updateProductStrategy, insertMovement, upsertPricingConfig, insertRecipeItem, deleteRecipeItem, insertRuptureLog, insertDailyContext, insertDemandPrediction } from '@konik/dataconnect';


// Operation InsertTenant:  For variables, look at type InsertTenantVars in ../index.d.ts
const { data } = await InsertTenant(dataConnect, insertTenantVars);

// Operation UpdateProduct:  For variables, look at type UpdateProductVars in ../index.d.ts
const { data } = await UpdateProduct(dataConnect, updateProductVars);

// Operation UpdateProductStrategy:  For variables, look at type UpdateProductStrategyVars in ../index.d.ts
const { data } = await UpdateProductStrategy(dataConnect, updateProductStrategyVars);

// Operation InsertMovement:  For variables, look at type InsertMovementVars in ../index.d.ts
const { data } = await InsertMovement(dataConnect, insertMovementVars);

// Operation UpsertPricingConfig:  For variables, look at type UpsertPricingConfigVars in ../index.d.ts
const { data } = await UpsertPricingConfig(dataConnect, upsertPricingConfigVars);

// Operation InsertRecipeItem:  For variables, look at type InsertRecipeItemVars in ../index.d.ts
const { data } = await InsertRecipeItem(dataConnect, insertRecipeItemVars);

// Operation DeleteRecipeItem:  For variables, look at type DeleteRecipeItemVars in ../index.d.ts
const { data } = await DeleteRecipeItem(dataConnect, deleteRecipeItemVars);

// Operation InsertRuptureLog:  For variables, look at type InsertRuptureLogVars in ../index.d.ts
const { data } = await InsertRuptureLog(dataConnect, insertRuptureLogVars);

// Operation InsertDailyContext:  For variables, look at type InsertDailyContextVars in ../index.d.ts
const { data } = await InsertDailyContext(dataConnect, insertDailyContextVars);

// Operation InsertDemandPrediction:  For variables, look at type InsertDemandPredictionVars in ../index.d.ts
const { data } = await InsertDemandPrediction(dataConnect, insertDemandPredictionVars);


```