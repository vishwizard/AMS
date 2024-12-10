import Booking from '../models/booking.model.js';
import Customer from '../models/customer.model.js';
import Room from '../models/room.model.js';


const addBooking = async (req, res) => {
    const { Customer, Rooms, CheckIn, CheckOut, PaymentDetails, Amount } = req.body;

    try {
        // Create the booking
        const booking = new Booking({
            Customer,
            Rooms,
            CheckIn,
            CheckOut,
            PaymentDetails,
            Amount,
        });

        const savedBooking = await booking.save();

        // Update rooms in a batch to associate them with the booking
        await Room.updateMany(
            { _id: { $in: Rooms } },
            { $set: { booking: savedBooking._id } }
        );

        res.status(201).json(savedBooking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getBookings = async (req, res) => {
    try {
        const { startDate, endDate, page = 1, limit = 10 } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "startDate and endDate are required" });
        }

        const filter = {
            checkIn: { $lte: new Date(endDate) }, // Check-in date is on or before the end date
            checkOut: { $gte: new Date(startDate) }, // Check-out date is on or after the start date
        };

        const bookings = await Booking.find(filter)
            .populate('Customer', 'Name Phone CoPassengers')
            .populate('Rooms', 'roomNumber type price')
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalBookings = await Booking.countDocuments(filter);

        res.status(200).json({
            data: bookings,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalBookings / limit),
                totalBookings,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('Customer', 'Name Age Gender Phone Email Address IDProof CoPassengers Additional ImageURL')
            .populate('Rooms', 'roomNumber type price');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
//Implement Search Funcationalities

const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking Does Not Exist" });
        }

        const { Customer, Rooms, CheckIn, CheckOut, PaymentDetails, Amount } = req.body;

        if (Customer) booking.Customer = Customer;

        if (Rooms && Array.isArray(Rooms)) {
            // Free previously booked rooms
            await Room.updateMany(
                { _id: { $in: booking.Rooms } },
                { $set: { booking: '' } }
            );

            // Assign the new rooms to the booking
            //Handle room availability in the frontend or before it hits the backend
            await Room.updateMany(
                { _id: { $in: Rooms } },
                { $set: { booking: req.params.id } }
            );

            booking.Rooms = Rooms;
        }

        if (CheckIn) booking.CheckIn = CheckIn;
        if (CheckOut) booking.CheckOut = CheckOut;
        if (Amount) booking.Amount = Amount;
        if (PaymentDetails) booking.PaymentDetails = PaymentDetails;

        await booking.save();

        res.json({ message: "Updated Successfully" });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteBooking = async(req,res)=>{
    try{
        const booking = await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).json({message:"Booking Not Found"});
        }

        await Room.updateMany(
            { _id: { $in: booking.Rooms } },
            { $set: { booking: '' } }
        );
        await booking.deleteOne();
        res.json({message:"Deleted Booking"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export {getBookings, getBookingById, addBooking, updateBooking, deleteBooking};