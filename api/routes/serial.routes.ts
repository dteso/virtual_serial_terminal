
/**
 * @swagger
 * components:
 *   schemas:
 *     Port:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *            type: string
 *            description: The port name.
 * 
 *     Data:
 *       type: object
 *       required:
 *         - data
 *       properties:
 *         data:
 *            type: string
 *            description: The port name.
 */

import { Router } from 'express';
import SerialController from '../controllers/serial.controller';
import { SerialValidator } from '../middlewares/serial-validator';

const router = Router();
const controller = new SerialController();

/**
* @swagger
* tags:
*   name: Serial
*   description: The Permission managing API
* 
* /api/serial/get-available-ports:
*   get:
*     summary: Retreives available ports
*     tags: [Serial]
*     responses:
*       200:
*         description: The available port
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Port' 
*
* /api/serial/connect/{port}/{baudrate}:
*   get:
*     summary: Connects to a indicated port
*     tags: [Serial]
*     parameters:
*        - in: path
*          name: port
*          required: true
*          type: string 
*        - in: path
*          name: baudrate
*          required: true
*          type: number 
*     responses:
*       200:
*         description: The available port
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Port'
* 
* /api/serial/get-data:
*   get:
*     summary: Get data from current serial connection
*     tags: [Serial]
*     responses:
*       200:
*         description: The available port
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Port'
*  
* /api/serial/disconnect:
*   get:
*     summary: Closes current serial connection
*     tags: [Serial]
*     responses:
*       200:
*         description: The available port
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Port'
* 
* /api/serial/write:
*   post:
*     summary: Create a new role
*     tags: [Serial]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Data'
*     responses:
*       200:
*         description: The created Role.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Data'
*       500:
*         description: Some server error
* 
* 
* /api/serial/esp-connect:
*   post:
*     summary: Tries an esp connection through esptool
*     tags: [Serial]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Data'
*     responses:
*       200:
*         description: The created Role.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Data'
*       500:
*         description: Some server error
*/
router.get('/get-available-ports', [], controller.getAvailablePorts);
router.get('/connect/:port/:baudrate', [SerialValidator.checkParams], controller.connect);
router.get('/get-data', [], controller.getCurrentData);
router.get('/disconnect', [], controller.disconnect);
router.post('/write', [], controller.write);
router.post('/esp-connect', [], controller.espConnect);

export default router;
