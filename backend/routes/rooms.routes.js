const express = require('express');

const {getRooms, addRoom, deleteRoom, updateRoom,getRoomById} = require('../controllers/rooms.controller');

const router = express.Router();

router.get('/',getRooms);
router.get('/:id',getRoomById);
router.post('/',addRoom);
router.delete('/:id',deleteRoom);
router.put('/:id',updateRoom);

module.exports = router;
