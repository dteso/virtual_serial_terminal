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
const serial_service_1 = require("../../services/serial.service");
const esptools_service_1 = require("../../services/esptools.service");
// import { connect } from "../../services/esptools.service";
class SerialController {
    constructor() {
        this.serialService = new serial_service_1.SerialService();
        /**
         * [C]
         * Crear Permission / CREATE
         *
         * @param req
         * @param res
         */
        this.getAvailablePorts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Getting available ports");
                res.json({
                    status: 'ok',
                    ports: yield this.serialService.getAvailablePorts()
                });
            }
            catch (e) {
                console.log("Error:", e);
                res.status(500).json({ error: e.message });
            }
        });
        this.connect = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Getting available ports");
                const connected = yield this.serialService.connect(req.params.port, +req.params.baudrate);
                if (connected) {
                    esptools_service_1.Esptool.currentPort = connected;
                    res.json({
                        status: 'ok',
                        message: `Connected to port [${req.params.port}]. Listening for data...`
                    });
                }
                else {
                    res.json({
                        status: 'ko',
                        message: `Unable to reach connection with port [${req.params.port}] and baudrate [${req.params.baudrate}].`
                    });
                }
            }
            catch (e) {
                console.log(`ERROR: Unable to reach connection with port [${req.params.port}] and baudrate [${req.params.baudrate}].: connected [${e}]`);
                res.status(400).json({
                    status: 'ko',
                    message: `ERROR: Unable to reach connection with port [${req.params.port}] and baudrate [${req.params.baudrate}].`
                });
            }
        });
        this.getCurrentData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.json({
                status: 'ok',
                data: yield this.serialService.getCurrentData()
            });
        });
        this.disconnect = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const disconnection = yield this.serialService.disconnect();
                res.json({
                    status: 'ok',
                    data: 'Disconnected'
                });
            }
            catch (e) {
                res.status(400).json({
                    status: 'ko',
                    message: `ERROR: Unable to disconnect.`
                });
            }
        });
        this.write = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dataWritting = yield this.serialService.writeData(req.body.data);
                res.json({
                    status: 'ok',
                    data: 'Disconnected'
                });
            }
            catch (e) {
                res.status(400).json({
                    status: 'ko',
                    message: `ERROR: Unable to disconnect.`
                });
            }
        });
        this.espConnect = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const esptool = connect('COM3', 115200);
                res.json({
                    status: 'ok',
                    data: 'Disconnected'
                });
            }
            catch (e) {
                res.status(400).json({
                    status: 'ko',
                    message: `ERROR: Unable to disconnect.`
                });
            }
        });
    }
}
exports.default = SerialController;
//# sourceMappingURL=serial.controller.js.map