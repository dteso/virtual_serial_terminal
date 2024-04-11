"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "VIRTUAL SERIAL TERMINAL API",
            version: "1.0.0",
            description: "This API allows to manage usb connections.",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "David Teso",
                url: "https://yourdomain.com",
                email: "dtesodev@gmail.com",
            },
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
                bearerAuth: []
            }],
        servers: [{}]
    },
    apis: ["./api/routes/*.ts"],
};
const swaggerDocs = (app, port) => {
    options.definition.servers = [
        {
            url: "http://localhost:" + port,
        },
    ];
    const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
    app.use('/api/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, { explorer: true }));
    app.use('/api/v1/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    console.log(`[INFO] Swagger Docs available at http://localhost:${port}/api/v1/docs`);
};
exports.swaggerDocs = swaggerDocs;
//# sourceMappingURL=swagger.js.map