const Booking = require('../models/booking.model');
const Room = require('../models/room.models');
const Customer = require('../models/customer.model');


const addBooking = async (req,res)=>{
    const {customerId, numAdults, numChildren, roomId, checkIn, checkOut, amount,PaymentStatus} = req.body;

    try{
        const customer = await Customer.findById(customerId);
        if(!customer){
            return res.status(400).json({message:'Customer Not Found'});
        }
        const room = await Room.findById(roomId);
        if(!room || !room.available){
            return res.status(400).json({message:'Room Not Available'});
        }

        const booking = new Booking({
            Customer:customerId,
            Room:roomId,
            CheckIn:checkIn,
            CheckOut:checkOut,
            PaymentStatus:PaymentStatus,
            Amount:amount,
            numAdults:numAdults,
            numChildren:numChildren
        });
        await booking.save();
        room.available = false;
        await room.save();
        res.status(201).json(booking);
    }catch(err){
        // console.log(err);
        res.status(500).json({message:'Internal Server Error'});
    }
};

const getBooking = async(req,res)=>{
    try{
        const bookings = await Booking.find().populate('Customer','Name, Phone, Email').populate('Room','roomNumber, type, price');
        res.json(bookings);
    }catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('Customer', 'Name Phone Email')
            .populate('Room', 'roomNumber type price');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
//Implement Search Funcationalities

const updateBooking = async (req,res)=>{
    try{
        const booking = await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).json({message:"Booking Does Not Exist"});
        }
        const {customerId, roomId, checkIn, checkOut, amount,PaymentStatus} = req.body;
        if(customerId) booking.Customer = customerId;
        if(roomId){
            //free current room and populate updated room
            booking.Room = roomId;
        } 
        if(checkIn) booking.CheckIn = checkIn;
        if(checkOut) booking.CheckOut = checkOut;
        if(amount) booking.Amount = amount;
        if(PaymentStatus) booking.PaymentStatus = PaymentStatus;
        await booking.save();
        res.json({message:"Updated Successfully"});
    }catch(err){
        res.status(500).json({message:'Internal Server Error'});
    }
};

const deleteBooking = async(req,res)=>{
    try{
        const booking = await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).json({message:"Booking Not Found"});
        }

        const room = await Room.findById(booking.Room);
        if(room){
            room.available = true;
            await room.save();
        }
        await booking.deleteOne();
        res.json({message:"Deleted Booking"});
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
};


module.exports = {getBooking, getBookingById, addBooking, updateBooking, deleteBooking};