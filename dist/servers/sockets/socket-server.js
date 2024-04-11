"use strict";
/*
 * -------- websocket io connection---------*/
/**
 *
 *    W E B    S O C K E T S
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDataToClients = exports.startSockets = void 0;
const ws_1 = require("ws");
let _wss;
const startSockets = (server) => __awaiter(void 0, void 0, void 0, function* () {
    // const socketService = new SocketService();
    // socketService.currentRooms = await socketService.buildInitialRooms();
    // displayInitialRooms(socketService);
    // const wss = new WebSocketServer({ port: process.env.WS_PORT });
    const _port = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 4412;
    const wss = new ws_1.Server({ port: _port });
    console.log("[WS_RUNNING] Sockets Server corriendo en el puerto " + _port);
    _wss = wss;
    wss.on('connection', function connection(ws, req) {
        ws.on('message', function message(data) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const jsonData = JSON.parse(data);
                    console.log('[WS_MSG_RECEIVED] FROM : [' + jsonData.data.name + ']=>' + JSON.stringify(jsonData, null, 2));
                    // const isValid = await socketService.manageConnection(jsonData, ws);
                    // if (isValid && ((jsonData.event === 'MESSAGE' || jsonData.event === 'CONNECTION') && jsonData.data.appKey) || jsonData.event === 'USER_COMMAND' || jsonData.event === 'REQUEST' || jsonData.event === 'COMMAND_RESPONSE') {
                    //   socketService.broadcastByAppKey(jsonData, ws, `${data}`);
                    // }
                }
                catch (error) {
                    console.log("[WS_INTERNAL]: ERRROR MANAGGING CONNECTION -> " + error);
                }
            });
        });
        ws.on('close', function close(data) {
            console.log('[WS_CONNECTION_CLOSED] A connection was closed. logged users', wss.clients.size);
            // socketService.broadcast(wss, `{"event": "CONNECTION", "data": "user disconnected", "logged-users":${wss.clients.size}}`);
        });
        // socketService.checkNewClient(wss);
    });
    wss.on('close', function close() {
        console.log('[WS_CONNECTION_CLOSED] Web Server Closed');
    });
});
exports.startSockets = startSockets;
const sendDataToClients = (data) => {
    _wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(data);
        }
    });
};
exports.sendDataToClients = sendDataToClients;
function displayInitialRooms(socketService) {
    const displayRooms = JSON.parse(JSON.stringify(socketService.currentRooms));
    displayRooms.forEach((room) => {
        room.devices = room.devices.map((device) => `${device.MAC} - ${device.name}`);
        room.apps = room.apps.map((app) => `${app.user}`);
    });
    console.log('Initial rooms:', JSON.stringify(displayRooms, null, 2));
}
/**
 * [{
 *  "ws": ws,
 *  "appKey": appKey,
 *  "deviceType" "APP" // ó DEV :
 *  "MAC": 12:34:56:78:90:AA
 * }]
 */
// [{
//   appKey: "",
//   devices: [
//     {
//        ws: ws,
//        appKey: "",
//        deviceType: "DEV",
//        MAC: "12:34:56:78:90:AA"
//     }
//   ],
//   apps:[
//     {
//        ws: ws,
//        appKey: "",
//        deviceType: "DEV",
//        user: "d_teso"
//     }
//   ],
// }]
//# sourceMappingURL=socket-server.js.map