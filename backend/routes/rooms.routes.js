import express from 'express';

import {getRooms, getRoomsByType, addRoom, deleteRoom, updateRoom,getRoomById, getRoomData} from '../controllers/rooms.controller.js';
import authenticate from '../middlewares/authHandler.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

router.get('/',getRooms, authenticate);
router.post('/',authenticate, authorize('admin'),addRoom);
router.delete('/:id',authenticate,authorize('admin'),deleteRoom);
router.put('/:id',authenticate,authorize('admin'),updateRoom);
router.get('/admin',authenticate,authorize('admin'),getRoomData);

router.get('/type/:type',getRoomsByType);
router.get('/:id',getRoomById);

export default router;