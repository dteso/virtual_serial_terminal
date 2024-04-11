import { exec, spawn } from 'child_process';
import { sendDataToClients } from '../servers/sockets/socket-server';
import { SerialService } from './serial.service';
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

const CHIP_IS_TEXT = "Chip is"
const FEATURES = "Features"



export class Esptool {

    public static currentPort: any;

    public static async getFlashId(comm: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const esptoolCommand = `.\\libs\\esptool\\esptool.py --port ${comm} flash_id`;
            exec(esptoolCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    resolve("UNKNOWN");
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    reject(`stderr: ${stderr}`);
                }
                const chipType = stdout.substring(stdout.indexOf(CHIP_IS_TEXT) + CHIP_IS_TEXT.length, stdout.indexOf("Features") - 2);
                sendDataToClients(JSON.stringify({ time: Date.now(), data: `[ESP-TOOL-INFO] CHIP_TYPE: ${chipType}` }));
                resolve(chipType);
            });
        })
    }


    public static async uploadFirmware(comm: string, board: string): Promise<string> {

        const serialService = new SerialService();

        const storedPort = comm;
        const storedBaudrate = 115200; // TODO: As param 
        await serialService.disconnect();
        return new Promise<string>((resolve, reject) => {

            const esptoolCommandEsp32 = `.\\libs\\esptool\\esptool.py --chip esp32 --port ${comm} --baud 460800  --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 40m --flash_size 4MB 0x1000 .\\public\\esp_32\\bootloader_dio_40m.bin 0x8000 .\\public\\esp_32\\partitions.bin 0xe000 .\\public\\esp_32\\boot_app0.bin 0x10000 .\\public\\esp_32\\firmware.bin`;

            const esptoolCommandEsp8266 = `.\\libs\\esptool\\esptool\.py --before default_reset --after hard_reset --chip esp8266 --port ${comm} --baud 115200 write_flash 0x0 .\\public\\kurage_d1_mini\\firmware.bin`;

            exec(board === 'ESP8266' ? esptoolCommandEsp8266 : esptoolCommandEsp32, async (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    resolve("UNKNOWN");
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    reject(`stderr: ${stderr}`);
                }
                console.log(`stdout: ${stdout}`);
                sendDataToClients(JSON.stringify({ data: `[ESP-TOOL-INFO] Uploading firmware on board ${board}` }));
                Esptool.currentPort = await serialService.connect(storedPort, storedBaudrate);
                resolve(board);
            });
        })
    }

}




