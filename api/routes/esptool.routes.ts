
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
import { EsptoolController } from '../controllers/esptool.controller';


const router = Router();
const controller = new EsptoolController();

/**
* @swagger
* tags:
*   name: Esptool
*   description: The Permission managing API
* 
* /api/esptool/chip-info/{port}:
*   get:
*     summary: Connects to a indicated port
*     tags: [Esptool]
*     parameters:
*        - in: path
*          name: port
*          required: true
*          type: string 
*     responses:
*       200:
*         description: The available port
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Port'
* 
* /api/esptool/upload-firmware/{port}/{board}:
*   get:
*     summary: Connects to a indicated port
*     tags: [Esptool]
*     parameters:
*        - in: path
*          name: port
*          required: true
*          type: string 
*        - in: path
*          name: board
*          required: true
*          type: string 
*     responses:
*       200:
*         description: The available port
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Port'
*/
router.get('/chip-info/:port', [], controller.getFlashId);
router.get('/upload-firmware/:port/:board', [], controller.uploadFirmware);

export default router;
