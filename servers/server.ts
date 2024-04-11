
/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import serialRoutes from '../api/routes/serial.routes';
import esptoolRoutes from '../api/routes/esptool.routes';
import cors from 'cors';
import { swaggerDocs as V1SwaggerDocs } from '../api/swagger'
import { startSockets } from './sockets/socket-server';

const app = express();

class Server {
    private apiPaths = {
        serial: '/api/serial',
        esptool: '/api/esptool'
    }

    constructor() {
        this.middlewares();
        this.routes();
    }

    middlewares() {
        // CORS
        app.use(cors());
        // Lectura del body
        app.use(express.json()); // Permite que veamos en las peticiones que lleven body el propio body. Sin esto no se parsea en body en la request
        // Carpeta pública
        app.use(express.static('public'));
    }

    routes() {
        app.use(this.apiPaths.serial, serialRoutes);
        app.use(this.apiPaths.esptool, esptoolRoutes);
    }

    listen() {
        const port = process.env.PORT || '4410';
        let server = app.listen(port, () => {
            console.log('[SUCCESS] SERVER RUNNING ON PORT: ' + port);
            V1SwaggerDocs(app, port);
        });
        startSockets(server);
    }
}



export default Server;