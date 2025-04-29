import fs from "fs";
import path from "path";

/**
 * Reads all src/api/<content-type>/routes/01-custom.js files and returns an OpenAPI paths object.
 */
export function getCustomSwaggerPaths(): Record<string, any> {
  const routesDir = path.resolve(process.cwd(), "dist/src/api");
  const apis = fs.existsSync(routesDir) ? fs.readdirSync(routesDir) : [];
  const customPaths: Record<string, any> = {};

  apis.forEach(api => {
    const customRoutePath = path.join(routesDir, api, "routes", "01-custom.js");
    if (fs.existsSync(customRoutePath)) {
      const routeModule = require(customRoutePath);
      const route = routeModule.default || routeModule;
      if (route && Array.isArray(route.routes)) {
        route.routes.forEach((r: any) => {
          if (r.config && r.config.swagger) {
            const method = r.method.toLowerCase();
            if (!customPaths[r.path]) customPaths[r.path] = {};
            customPaths[r.path][method] = r.config.swagger;
          }
        });
      }
    }
  });

  return customPaths;
}