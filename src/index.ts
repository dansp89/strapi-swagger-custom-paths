import fs from "fs";
import path from "path";
import { defaultErrors } from "./responses";

/**
 * Reads all src/api/<content-type>/routes/01-custom.js files and returns an OpenAPI paths object.
 */
export function getCustomSwaggerPaths(): Record<string, any> {
  const routesDir = path.resolve(process.cwd(), "dist/src/api");
  const apis = fs.existsSync(routesDir) ? fs.readdirSync(routesDir) : [];
  const customPaths: Record<string, any> = {};

  const defaultResponses = {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: { type: 'object' }
        }
      }
    },
    ...defaultErrors
  };

  apis.forEach(api => {
    const customRoutePath = path.join(routesDir, api, "routes", "01-custom.js");
    if (fs.existsSync(customRoutePath)) {
      const routeModule = require(customRoutePath);
      const route = routeModule.default || routeModule;
      if (route && Array.isArray(route.routes)) {
        route.routes.forEach((r: any) => {
          if (r.config && r.config.swagger) {
            const method = r.method.toLowerCase();
            const openApiPath = r.path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
            if (!customPaths[openApiPath]) customPaths[openApiPath] = {};
            const swaggerObj = { ...r.config.swagger };
            if (!swaggerObj.operationId) {
              swaggerObj.operationId = r.handler
                ? r.handler.replace(/\./g, '_') + '_' + method
                : (api + '_' + method + '_' + openApiPath.replace(/[\/{\}]/g, '_'));
            }
            if (!swaggerObj.responses) {
              swaggerObj.responses = JSON.parse(JSON.stringify(defaultResponses));
            } else {
              swaggerObj.responses = {
                ...JSON.parse(JSON.stringify(defaultResponses)),
                ...swaggerObj.responses
              };
            }
            customPaths[openApiPath][method] = swaggerObj;
          }
        });
      }
    }
  });

  return customPaths;
}