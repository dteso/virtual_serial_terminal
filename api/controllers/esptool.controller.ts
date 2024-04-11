import { Request, Response } from "express"
import { Esptool } from "../../services/esptools.service";
// import { connect } from "../../services/esptools.service";

export class EsptoolController {

    /**
     * [C]
     * Crear Permission / CREATE
     * 
     * @param req 
     * @param res 
     */
    getFlashId = async (req: Request, res: Response) => {
        const port = req.params.port;
        try {
            console.log("Getting ports info");
            res.json({
                status: 'ok',
                result: await Esptool.getFlashId(port)
            });
        } catch (e: any) {
            console.log("Error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    /**
 * [C]
 * Crear Permission / CREATE
 * 
 * @param req 
 * @param res 
 */
    uploadFirmware = async (req: Request, res: Response) => {
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
                result: await Esptool.uploadFirmware(port, board)
            });
        } catch (e: any) {
            console.log("Error:", e);
            res.status(500).json({ error: e.message });
        }
    }
}