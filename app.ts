import Server from './servers/server';
import dotenv from 'dotenv';
dotenv.config();

console.log("[INFO] STARTING NODE-TS SERVER");

const server = new Server();

server.listen();
