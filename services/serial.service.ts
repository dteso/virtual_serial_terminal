import { SerialPort } from 'serialport'
import { sendDataToClients } from '../servers/sockets/socket-server';
import { Esptool } from './esptools.service';

export class SerialService {

    dataBuffer = "";
    fullBuffer = "";
    port: any;

    public async getAvailablePorts() {
        const ports: any = await SerialPort.list();
        for (const port of ports) {
            port.device = await Esptool.getFlashId(port.path)
        }
        return ports;
    }

    public connect(comm: string, baudRate: number): Promise<any> {
        return new Promise<boolean>((resolve, reject) => {
            this.port = new SerialPort({ path: comm, baudRate }, (err) => {
                if (err) {
                    console.error('Error: ', err.message);
                    reject(false);
                } else {
                    console.log(`Serial port ${comm} is connected and working under ${baudRate} bauds.`);
                    resolve(this.port);
                }
            });

            this.port.on('data', (data: any) => {
                this.dataBuffer += data.toString();
                setTimeout(() => {
                    if (this.dataBuffer.includes('\n')) {
                        const lines = this.dataBuffer.split('\n')
                        lines.forEach((line: any) => {
                            if (line.trim() !== '') {
                                console.log(line.trim());
                                sendDataToClients(JSON.stringify({ time: Date.now(), data: line.trim() }));
                            } else {
                                console.log(line);
                                sendDataToClients(JSON.stringify({ time: Date.now(), data: line }));
                            }
                        });
                    }
                    this.fullBuffer += this.dataBuffer;
                    this.dataBuffer = '';
                }, 50);

            });

            this.port.on('error', (err: any) => {
                console.error(`Serial port error: ${err.message}`);
                reject(false);
            });
        });
    }


    getCurrentData = async () => {
        return this.fullBuffer;
    }

    public disconnect(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const _port = Esptool.currentPort ? Esptool.currentPort : this.port;
            if (_port) {
                _port.close((err: any) => {
                    if (err) {
                        console.error('Error closing serial port: ', err.message);
                        reject(false);
                    } else {
                        console.log('Serial port disconnected.');
                        resolve(true);
                    }
                });
            } else {
                resolve(false);
            }
        });
    }

    async disconnectAll(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const ports = await this.getAvailablePorts();
                for (const port of ports) {
                    const serialPort = new SerialPort({ path: port.path, baudRate: 115200 });
                    if (serialPort.isOpen)
                        serialPort.close();
                    console.log(`Desconectando ${port.path}`);
                }
                resolve(true);
            } catch (e) {
                reject();
            }
        })
    }


    public async writeData(data: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!this.port) {
                console.error('No serial port connected.');
                reject(false);
                return;
            }

            this.port.write(data, (err: any) => {
                if (err) {
                    console.error('Error writing data to serial port: ', err.message);
                    reject(false);
                } else {
                    console.log('Data written to serial port: ', data);
                    resolve(true);
                }
            });
        });
    }

}


