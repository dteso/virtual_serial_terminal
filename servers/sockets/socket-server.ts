
/*
 * -------- websocket io connection---------*/
/**
 * 
 *    W E B    S O C K E T S 
 * 
 */

import { Server as WebSocketServer } from 'ws';

let _wss: WebSocketServer;

export const startSockets = async (server: any) => {

  // const socketService = new SocketService();

  // socketService.currentRooms = await socketService.buildInitialRooms();
  // displayInitialRooms(socketService);

  // const wss = new WebSocketServer({ port: process.env.WS_PORT });
  const _port: number = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 4412;
  const wss = new WebSocketServer({ port: _port });
  console.log("[WS_RUNNING] Sockets Server corriendo en el puerto " + _port)

  _wss = wss;

  wss.on('connection', function connection(ws: any, req: any) {

    ws.on('message', async function message(data: any) {
      try {
        const jsonData = JSON.parse(data);
        console.log('[WS_MSG_RECEIVED] FROM : [' + jsonData.data.name + ']=>' + JSON.stringify(jsonData, null, 2));
        // const isValid = await socketService.manageConnection(jsonData, ws);

        // if (isValid && ((jsonData.event === 'MESSAGE' || jsonData.event === 'CONNECTION') && jsonData.data.appKey) || jsonData.event === 'USER_COMMAND' || jsonData.event === 'REQUEST' || jsonData.event === 'COMMAND_RESPONSE') {
        //   socketService.broadcastByAppKey(jsonData, ws, `${data}`);
        // }
      } catch (error) {
        console.log("[WS_INTERNAL]: ERRROR MANAGGING CONNECTION -> " + error);
      }
    });

    ws.on('close', function close(data: any) {
      console.log('[WS_CONNECTION_CLOSED] A connection was closed. logged users', wss.clients.size);
      // socketService.broadcast(wss, `{"event": "CONNECTION", "data": "user disconnected", "logged-users":${wss.clients.size}}`);
    });

    // socketService.checkNewClient(wss);
  });

  wss.on('close', function close() {
    console.log('[WS_CONNECTION_CLOSED] Web Server Closed');
  });
}

export const sendDataToClients = (data: string) => {
  _wss.clients.forEach((client: any) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
};


function displayInitialRooms(socketService: any) {
  const displayRooms = JSON.parse(JSON.stringify(socketService.currentRooms));
  displayRooms.forEach((room: any) => {
    room.devices = room.devices.map((device: any) => `${device.MAC} - ${device.name}`);
    room.apps = room.apps.map((app: any) => `${app.user}`);
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























