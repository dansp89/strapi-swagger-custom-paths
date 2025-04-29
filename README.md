<div align="center">

<img src="https://raw.githubusercontent.com/dansp89/strapi-swagger-custom-paths/main/assets/logo-openapi-strapi.png" alt="Strapi Swagger Custom Paths" width="140" />

# strapi-swagger-custom-paths

[![NPM Version](https://img.shields.io/npm/v/strapi-swagger-custom-paths?color=cb3837&label=npm&logo=npm)](https://www.npmjs.com/package/strapi-swagger-custom-paths)
[![GitHub stars](https://img.shields.io/github/stars/dansp89/strapi-swagger-custom-paths?style=social)](https://github.com/dansp89/strapi-swagger-custom-paths)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-brightgreen?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Strapi](https://img.shields.io/badge/Strapi-4.x%20%7C%205.x-purple?logo=strapi)](https://strapi.io/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green?logo=openapi-initiative)](https://swagger.io/specification/)

</div>

<div align="center">
  <a href="https://www.npmjs.com/package/strapi-swagger-custom-paths"><img src="https://img.shields.io/npm/dm/strapi-swagger-custom-paths.svg?style=flat-square" alt="NPM downloads"></a>
  <a href="https://github.com/dansp89/strapi-swagger-custom-paths"><img src="https://img.shields.io/github/issues/dansp89/strapi-swagger-custom-paths.svg?style=flat-square" alt="GitHub issues"></a>
</div>

---

Easily generate OpenAPI `paths` for the Strapi documentation plugin by automatically reading all your custom route definitions (`01-custom.js`) from each API.<br>
Supports both TypeScript and JavaScript Strapi projects.

- [NPM Package](https://www.npmjs.com/package/strapi-swagger-custom-paths)
- [GitHub Repository](https://github.com/dansp89/strapi-swagger-custom-paths)

---

## Features

- Reads all `src/api/<content-type>/routes/01-custom.js` files in your Strapi project.
- Returns a valid OpenAPI `paths` object for use in Strapi's documentation plugin.
- Works with both TypeScript and JavaScript projects.
- Minimal configuration: just add your custom route files and reference the utility in your documentation config.

---

## Installation

Install with your favorite package manager:

```bash
# npm
npm install strapi-swagger-custom-paths
```
```bash
# yarn
yarn add strapi-swagger-custom-paths
```
```bash
# pnpm
pnpm add strapi-swagger-custom-paths
```
```bash
# bun
bun add strapi-swagger-custom-paths
```

---

## More information about Strapi documentation

For more details about how Strapi's documentation plugin works, see the official docs:
[https://docs.strapi.io/cms/plugins/documentation](https://docs.strapi.io/cms/plugins/documentation)

---

## How it works

- The function `getCustomSwaggerPaths()` will scan your Strapi project's `src/api` folder for all `routes/01-custom.js` files.
- It will merge all Swagger/OpenAPI route definitions and return a single `paths` object ready to use in your documentation plugin config.

### Where does the Swagger data come from?

This package automatically collects Swagger/OpenAPI documentation from each custom route file in your Strapi project. 

- It looks for files named `01-custom.js` or `01-custom.ts` inside each API folder: `src/api/<content-type>/routes/01-custom.js`.
- Each route object should include a `config.swagger` property, which follows the OpenAPI specification for that HTTP method and path.
- All `swagger` objects are merged into the `paths` section of your final OpenAPI documentation.

You can include any valid OpenAPI fields (summary, description, parameters, requestBody, responses, etc.) inside `config.swagger`.

---

## Example: Custom Route File

### JavaScript (`src/api/my-content-type/routes/01-custom.js`)

```js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/my-content-type/current',
      handler: 'my-content-type.getCurrent',
      config: {
        tags: ['MyContentType'],
        swagger: {
          summary: 'Get current MyContentType',
          description: 'Retrieve the current MyContentType',
          operationId: 'getCurrent',
          tags: ['MyContentType'],
        },
      },
    },
  ],
};
```

### TypeScript (`src/api/my-content-type/routes/01-custom.ts`)

```typescript
export default {
  routes: [
    {
      method: 'GET',
      path: '/my-content-type/current',
      handler: 'my-content-type.getCurrent',
      config: {
        tags: ['MyContentType'],
        swagger: {
          summary: 'Get current MyContentType',
          description: 'Retrieve the current MyContentType',
          operationId: 'getCurrent',
          tags: ['MyContentType'],
        },
      },
    },
  ],
};
```

---

## Usage in Strapi plugins config

### TypeScript Example (`config/plugins.ts`)

```typescript
import { getCustomSwaggerPaths } from 'strapi-swagger-custom-paths'; // Add this line

export default () => ({
  documentation: {
    enabled: true,
    config: {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "Documentation",
        description: "",
        termsOfService: "YOUR_TERMS_OF_SERVICE_URL",
        contact: {
          name: "Team",
          email: "contact-email@something.io",
          url: "mywebsite.io"
        },
        license: {
          name: "Apache 2.0",
          url: "https://www.apache.org/licenses/LICENSE-2.0.html"
        }
      },
      "x-strapi-config": {
        plugins: ["upload", "users-permissions"],
        path: "/documentation"
      },
      servers: [
        {
          url: "http://localhost:1337/api",
          description: "Development server"
        }
      ],
      externalDocs: {
        description: "Find out more",
        url: "https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html"
      },
      security: [
        {
          bearerAuth: []
        }
      ],
      paths: getCustomSwaggerPaths(), // Add this line
    }
  },
});
```

### JavaScript Example (`config/plugins.js`)

```js
const { getCustomSwaggerPaths } = require('strapi-swagger-custom-paths'); // Add this line

module.exports = () => ({
  documentation: {
    enabled: true,
    config: {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "Documentation",
        description: "",
        termsOfService: "YOUR_TERMS_OF_SERVICE_URL",
        contact: {
          name: "Team",
          email: "contact-email@something.io",
          url: "mywebsite.io"
        },
        license: {
          name: "Apache 2.0",
          url: "https://www.apache.org/licenses/LICENSE-2.0.html"
        }
      },
      "x-strapi-config": {
        plugins: ["upload", "users-permissions"],
        path: "/documentation"
      },
      servers: [
        {
          url: "http://localhost:1337/api",
          description: "Development server"
        }
      ],
      externalDocs: {
        description: "Find out more",
        url: "https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html"
      },
      security: [
        {
          bearerAuth: []
        }
      ],
      paths: getCustomSwaggerPaths(), // Add this line
    }
  },
});
```

---

## Requirements

- **Node.js:** >= 16.x
- **Strapi:** v4.x or v5.x
- Works with both JavaScript and TypeScript Strapi projects.

---

## Tested versions

- **Node.js:** 16.x, 18.x, 20.x
- **Strapi:** 4.15.0, 5.12.5

---

## License

MIT

---

## Contributing

Pull requests and issues are welcome!
Please open an issue or PR on [GitHub](https://github.com/dansp89/strapi-swagger-custom-paths).

---


You can include any valid OpenAPI fields (summary, description, parameters, requestBody, responses, etc.) inside `config.swagger`.

---



## Author

DanSP89 (https://github.com/dansp89)
