"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialValidator = void 0;
class SerialValidator {
    static checkParams(req, res, next) {
        const comm = req.params.port !== '{port}' ? req.params.port : null;
        const baudrate = +req.params.baudrate;
        if (!comm) {
            return res.status(422).json({
                param: 'port',
                message: 'Port is required'
            });
        }
        else if (comm.length > 4) {
            return res.status(422).json({
                param: 'port',
                message: 'Port name can not be longer than 4.'
            });
        }
        if (!baudrate) {
            return res.status(422).json({
                param: 'baudrate',
                message: 'Baudrate is required'
            });
        }
        if (typeof baudrate !== 'number')
            return res.status(422).json({
                param: 'baudrate',
                message: 'Baud rate must be a number.'
            });
        next();
    }
}
exports.SerialValidator = SerialValidator;
//# sourceMappingURL=serial-validator.js.map