export class SerialValidator {

    public static checkParams(req: any, res: any, next: any) {
        const comm = req.params.port !== '{port}' ? req.params.port : null;
        const baudrate = +req.params.baudrate;
        if (!comm) {
            return res.status(422).json({
                param: 'port',
                message: 'Port is required'
            })
        } else if (comm.length > 4) {
            return res.status(422).json({
                param: 'port',
                message: 'Port name can not be longer than 4.'
            })
        }

        if (!baudrate) {
            return res.status(422).json({
                param: 'baudrate',
                message: 'Baudrate is required'
            })
        }

        if (typeof baudrate !== 'number')
            return res.status(422).json({
                param: 'baudrate',
                message: 'Baud rate must be a number.'
            })
        next();
    }
}