import { Request, Response } from "express"
import { SerialService } from "../../services/serial.service";
import { Esptool } from "../../services/esptools.service";
// import { connect } from "../../services/esptools.service";

class SerialController {

    serialService = new SerialService();
    /**
     * [C]
     * Crear Permission / CREATE
     * 
     * @param req 
     * @param res 
     */
    getAvailablePorts = async (req: Request, res: Response) => {
        try {
            console.log("Getting available ports");
            res.json({
                status: 'ok',
                ports: await this.serialService.getAvailablePorts()
            });
        } catch (e: any) {
            console.log("Error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    connect = async (req: Request, res: any) => {
        try {
            console.log("Getting available ports");
            const connected = await this.serialService.connect(req.params.port, +req.params.baudrate);
            if (connected) {
                Esptool.currentPort = connected;
                res.json({
                    status: 'ok',
                    message: `Connected to port [${req.params.port}]. Listening for data...`
                });
            } else {
                res.json({
                    status: 'ko',
                    message: `Unable to reach connection with port [${req.params.port}] and baudrate [${req.params.baudrate}].`
                });
            }
        } catch (e: any) {
            console.log(`ERROR: Unable to reach connection with port [${req.params.port}] and baudrate [${req.params.baudrate}].: connected [${e}]`);
            res.status(400).json({
                status: 'ko',
                message: `ERROR: Unable to reach connection with port [${req.params.port}] and baudrate [${req.params.baudrate}].`
            });
        }
    }

    getCurrentData = async (req: Request, res: Response) => {
        res.json({
            status: 'ok',
            data: await this.serialService.getCurrentData()
        })
    }

    disconnect = async (req: Request, res: Response) => {
        try {
            const disconnection = await this.serialService.disconnect();
            res.json({
                status: 'ok',
                data: 'Disconnected'
            })
        } catch (e) {
            res.status(400).json({
                status: 'ko',
                message: `ERROR: Unable to disconnect.`
            });
        }

    }

    write = async (req: Request, res: Response) => {
        try {
            const dataWritting = await this.serialService.writeData(req.body.data);
            res.json({
                status: 'ok',
                data: 'Disconnected'
            })
        } catch (e) {
            res.status(400).json({
                status: 'ko',
                message: `ERROR: Unable to disconnect.`
            });
        }

    }

    espConnect = async (req: Request, res: Response) => {
        try {
            // const esptool = connect('COM3', 115200);
            res.json({
                status: 'ok',
                data: 'Disconnected'
            })
        } catch (e) {
            res.status(400).json({
                status: 'ko',
                message: `ERROR: Unable to disconnect.`
            });
        }

    }

}

export default SerialController;
