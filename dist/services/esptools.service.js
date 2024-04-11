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
exports.Esptool = void 0;
const child_process_1 = require("child_process");
const socket_server_1 = require("../servers/sockets/socket-server");
const serial_service_1 = require("./serial.service");
// // Ruta al binario generado que deseas volcar en el ESP
// const binaryPath = '/ruta/al/binario.bin';
// // Comando para volcar el binario en el ESP utilizando esptool
// const esptoolCommand = `esptool.py --port /ruta/al/puerto --baud 115200 write_flash 0x00000 ${binaryPath}`;
// // Ejecutar el comando utilizando child_process
// exec(esptoolCommand, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error: ${error.message}`);
//     return;
//   }
//   if (stderr) {
//     console.error(`stderr: ${stderr}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
// });
const CHIP_IS_TEXT = "Chip is";
const FEATURES = "Features";
class Esptool {
    static getFlashId(comm) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const esptoolCommand = `.\\libs\\esptool\\esptool.py --port ${comm} flash_id`;
                (0, child_process_1.exec)(esptoolCommand, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error: ${error.message}`);
                        resolve("UNKNOWN");
                    }
                    if (stderr) {
                        console.error(`stderr: ${stderr}`);
                        reject(`stderr: ${stderr}`);
                    }
                    const chipType = stdout.substring(stdout.indexOf(CHIP_IS_TEXT) + CHIP_IS_TEXT.length, stdout.indexOf("Features") - 2);
                    (0, socket_server_1.sendDataToClients)(JSON.stringify({ time: Date.now(), data: `[ESP-TOOL-INFO] CHIP_TYPE: ${chipType}` }));
                    resolve(chipType);
                });
            });
        });
    }
    static uploadFirmware(comm, board) {
        return __awaiter(this, void 0, void 0, function* () {
            const serialService = new serial_service_1.SerialService();
            const storedPort = comm;
            const storedBaudrate = 115200; // TODO: As param 
            yield serialService.disconnect();
            return new Promise((resolve, reject) => {
                const esptoolCommandEsp32 = `.\\libs\\esptool\\esptool.py --chip esp32 --port ${comm} --baud 460800  --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 40m --flash_size 4MB 0x1000 .\\public\\esp_32\\bootloader_dio_40m.bin 0x8000 .\\public\\esp_32\\partitions.bin 0xe000 .\\public\\esp_32\\boot_app0.bin 0x10000 .\\public\\esp_32\\firmware.bin`;
                const esptoolCommandEsp8266 = `.\\libs\\esptool\\esptool\.py --before default_reset --after hard_reset --chip esp8266 --port ${comm} --baud 115200 write_flash 0x0 .\\public\\kurage_d1_mini\\firmware.bin`;
                (0, child_process_1.exec)(board === 'ESP8266' ? esptoolCommandEsp8266 : esptoolCommandEsp32, (error, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.error(`Error: ${error.message}`);
                        resolve("UNKNOWN");
                    }
                    if (stderr) {
                        console.error(`stderr: ${stderr}`);
                        reject(`stderr: ${stderr}`);
                    }
                    console.log(`stdout: ${stdout}`);
                    (0, socket_server_1.sendDataToClients)(JSON.stringify({ data: `[ESP-TOOL-INFO] Uploading firmware on board ${board}` }));
                    Esptool.currentPort = yield serialService.connect(storedPort, storedBaudrate);
                    resolve(board);
                }));
            });
        });
    }
}
exports.Esptool = Esptool;
//# sourceMappingURL=esptools.service.js.map