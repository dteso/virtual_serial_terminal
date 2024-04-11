"use strict";
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
exports.SerialService = void 0;
const serialport_1 = require("serialport");
const socket_server_1 = require("../servers/sockets/socket-server");
const esptools_service_1 = require("./esptools.service");
class SerialService {
    constructor() {
        this.dataBuffer = "";
        this.fullBuffer = "";
        this.getCurrentData = () => __awaiter(this, void 0, void 0, function* () {
            return this.fullBuffer;
        });
    }
    getAvailablePorts() {
        return __awaiter(this, void 0, void 0, function* () {
            const ports = yield serialport_1.SerialPort.list();
            for (const port of ports) {
                port.device = yield esptools_service_1.Esptool.getFlashId(port.path);
            }
            return ports;
        });
    }
    connect(comm, baudRate) {
        return new Promise((resolve, reject) => {
            this.port = new serialport_1.SerialPort({ path: comm, baudRate }, (err) => {
                if (err) {
                    console.error('Error: ', err.message);
                    reject(false);
                }
                else {
                    console.log(`Serial port ${comm} is connected and working under ${baudRate} bauds.`);
                    resolve(this.port);
                }
            });
            this.port.on('data', (data) => {
                this.dataBuffer += data.toString();
                setTimeout(() => {
                    if (this.dataBuffer.includes('\n')) {
                        const lines = this.dataBuffer.split('\n');
                        lines.forEach((line) => {
                            if (line.trim() !== '') {
                                console.log(line.trim());
                                (0, socket_server_1.sendDataToClients)(JSON.stringify({ time: Date.now(), data: line.trim() }));
                            }
                            else {
                                console.log(line);
                                (0, socket_server_1.sendDataToClients)(JSON.stringify({ time: Date.now(), data: line }));
                            }
                        });
                    }
                    this.fullBuffer += this.dataBuffer;
                    this.dataBuffer = '';
                }, 50);
            });
            this.port.on('error', (err) => {
                console.error(`Serial port error: ${err.message}`);
                reject(false);
            });
        });
    }
    disconnect() {
        return new Promise((resolve, reject) => {
            const _port = esptools_service_1.Esptool.currentPort ? esptools_service_1.Esptool.currentPort : this.port;
            if (_port) {
                _port.close((err) => {
                    if (err) {
                        console.error('Error closing serial port: ', err.message);
                        reject(false);
                    }
                    else {
                        console.log('Serial port disconnected.');
                        resolve(true);
                    }
                });
            }
            else {
                resolve(false);
            }
        });
    }
    disconnectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const ports = yield this.getAvailablePorts();
                    for (const port of ports) {
                        const serialPort = new serialport_1.SerialPort({ path: port.path, baudRate: 115200 });
                        if (serialPort.isOpen)
                            serialPort.close();
                        console.log(`Desconectando ${port.path}`);
                    }
                    resolve(true);
                }
                catch (e) {
                    reject();
                }
            }));
        });
    }
    writeData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (!this.port) {
                    console.error('No serial port connected.');
                    reject(false);
                    return;
                }
                this.port.write(data, (err) => {
                    if (err) {
                        console.error('Error writing data to serial port: ', err.message);
                        reject(false);
                    }
                    else {
                        console.log('Data written to serial port: ', data);
                        resolve(true);
                    }
                });
            });
        });
    }
}
exports.SerialService = SerialService;
//# sourceMappingURL=serial.service.js.map