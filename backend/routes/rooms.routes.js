import express from 'express';

import {getRooms, getRoomsByType, addRoom, deleteRoom, updateRoom,getRoomById} from '../controllers/rooms.controller.js';

const router = express.Router();

router.get('/',getRooms);
router.get('/type/:type',getRoomsByType);
router.get('/:id',getRoomById);
router.post('/',addRoom);
router.delete('/:id',deleteRoom);
router.put('/:id',updateRoom);

export default router;