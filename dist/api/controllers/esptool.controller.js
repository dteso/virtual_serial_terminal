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
exports.EsptoolController = void 0;
const esptools_service_1 = require("../../services/esptools.service");
// import { connect } from "../../services/esptools.service";
class EsptoolController {
    constructor() {
        /**
         * [C]
         * Crear Permission / CREATE
         *
         * @param req
         * @param res
         */
        this.getFlashId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const port = req.params.port;
            try {
                console.log("Getting ports info");
                res.json({
                    status: 'ok',
                    result: yield esptools_service_1.Esptool.getFlashId(port)
                });
            }
            catch (e) {
                console.log("Error:", e);
                res.status(500).json({ error: e.message });
            }
        });
        /**
     * [C]
     * Crear Permission / CREATE
     *
     * @param req
     * @param res
     */
        this.uploadFirmware = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const port = req.params.port;
            const board = req.params.board;
            if (board !== 'ESP32' && board !== 'ESP8266') {
                console.log("Error: Board must be ESP32 or ESP8266");
                return res.status(500).json({ error: "Error: Board must be ESP32 or ESP8266" });
            }
            try {
                console.log("Trying to upload firmware");
                res.json({
                    status: 'ok',
                    result: yield esptools_service_1.Esptool.uploadFirmware(port, board)
                });
            }
            catch (e) {
                console.log("Error:", e);
                res.status(500).json({ error: e.message });
            }
        });
    }
}
exports.EsptoolController = EsptoolController;
//# sourceMappingURL=esptool.controller.js.map