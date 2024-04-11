"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const serial_routes_1 = __importDefault(require("../api/routes/serial.routes"));
const esptool_routes_1 = __importDefault(require("../api/routes/esptool.routes"));
const cors_1 = __importDefault(require("cors"));
const swagger_1 = require("../api/swagger");
const socket_server_1 = require("./sockets/socket-server");
const app = (0, express_1.default)();
class Server {
    constructor() {
        this.apiPaths = {
            serial: '/api/serial',
            esptool: '/api/esptool'
        };
        this.middlewares();
        this.routes();
    }
    middlewares() {
        // CORS
        app.use((0, cors_1.default)());
        // Lectura del body
        app.use(express_1.default.json()); // Permite que veamos en las peticiones que lleven body el propio body. Sin esto no se parsea en body en la request
        // Carpeta pública
        app.use(express_1.default.static('public'));
    }
    routes() {
        app.use(this.apiPaths.serial, serial_routes_1.default);
        app.use(this.apiPaths.esptool, esptool_routes_1.default);
    }
    listen() {
        const port = process.env.PORT || '4410';
        let server = app.listen(port, () => {
            console.log('[SUCCESS] SERVER RUNNING ON PORT: ' + port);
            (0, swagger_1.swaggerDocs)(app, port);
        });
        (0, socket_server_1.startSockets)(server);
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map