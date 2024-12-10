import express from 'express';
import { 
    getBookings, 
    getBookingById, 
    addBooking, 
    updateBooking, 
    deleteBooking, 
    // searchBookings, 
    // filterBookings, 
    // paginateBookings 
} from '../controllers/bookings.controller.js';

const router = express.Router();

// Routes
router.get('/', getBookings); // Default route to fetch all bookings
router.get('/:id', getBookingById); // Fetch booking by ID
router.post('/', addBooking); // Add new booking
router.delete('/:id', deleteBooking); // Delete booking by ID
router.put('/:id', updateBooking); // Update booking by ID

// Search, Filters, and Pagination
// router.get('/search', searchBookings); // Search by Phone, Email, or ID Proof + ID Proof Number
// router.get('/filter', filterBookings); // Filter bookings by date range or other criteria
// router.get('/paginate', paginateBookings); // Paginated list of bookings

export default router;