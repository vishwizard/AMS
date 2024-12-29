import express from 'express';
import authenticate from '../middlewares/authHandler.js';
import authorize from '../middlewares/authorize.js';

import { 
    getBookings, 
    getBookingById, 
    addBooking, 
    updateBooking, 
    deleteBooking, 
    getBookingsData
    // searchBookings, 
    // filterBookings, 
    // paginateBookings 
} from '../controllers/bookings.controller.js';

const router = express.Router();

// Routes
router.get('/',authenticate, getBookings); // Default route to fetch all bookings
router.get('/:id',authenticate, getBookingById); // Fetch booking by ID
router.post('/',authenticate, addBooking); // Add new booking
router.delete('/:id',authenticate,authorize('admin'), deleteBooking); // Delete booking by ID
router.put('/:id', authenticate,authorize('admin'),updateBooking); // Update booking by ID
router.get('/admin',authenticate,authorize('admin'),getBookingsData);

// Search, Filters, and Pagination
// router.get('/search', searchBookings); // Search by Phone, Email, or ID Proof + ID Proof Number
// router.get('/filter', filterBookings); // Filter bookings by date range or other criteria
// router.get('/paginate', paginateBookings); // Paginated list of bookings

export default router;