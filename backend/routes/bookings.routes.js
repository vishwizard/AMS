const express = require('express');

const {getBooking, getBookingById, addBooking, updateBooking, deleteBooking} = require('../controllers/bookings.controller');

const router = express.Router();

// console.log("This file was called");
router.get('/',getBooking);
router.get('/:id',getBookingById);
router.post('/',addBooking);
router.delete('/:id',deleteBooking);
router.put('/:id',updateBooking);

module.exports = router;