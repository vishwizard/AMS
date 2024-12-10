import Booking from '../models/booking.model.js';
import Room from '../models/room.model.js';

const getRooms = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      const rooms = await Room.find().populate('booking');
  
      // Mark rooms as booked or available based on the date range
      const availableRooms = rooms.map((room) => {
        // Check if any booking conflicts with the given date range
        const isBooked = room.booking.some((bkg) => {
          return start <= bkg.endDate && end >= bkg.startDate;
        });
  
        return {
          ...room.toObject(), // Convert Mongoose doc to plain object
          isBooked: isBooked,
        };
      });
  
      res.json(availableRooms);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

const getRoomsByType = async (req,res)=>{
    try{
        const type = req.params.type;
        //use %20 for space
        console.log(type);
        if(!type){
            return res.status(400).json({message:'Room Type is required'});
        } 
        const rooms = await Room.find({type});
        res.status(200).json(rooms);

    }catch(err){
        console.log(err);
        res.status(500).json({message:'Internal Server Error'});
    }
}

const addRoom = async (req,res) =>{
    // console.log(req);
    const {roomNumber, type, price} = req.body;
    try{
        const room = new Room({roomNumber, type,price});
        await room.save();
        res.status(201).json({room});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const deleteRoom = async (req, res) => {
    try {
      // First, check if the room exists
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
  
      // Check if there are any bookings associated with this room
      const bookings = await Booking.find({ room: room._id });
      if (bookings.length > 0) {
        return res.status(400).json({ message: "Room cannot be deleted as it has active bookings." });
      }
  
      // Proceed with deletion if no bookings are found
      await Room.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Room successfully deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };  

const updateRoom = async (req,res)=>{
    try{
        const {type, price} = req.body;
        //Room can only be deleted, Room number cannot be updated
        const room = await Room.findById(req.params.id);
        if(!room){
            return res.status(404).json({message:'Room Not Found'});
        }
        if(type) room.type = type;
        if(price) room.price = price;
        await room.save();
        res.json({message:"Booking Updated Successfully"});
    }catch(err){
      console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
}

//needs to be updated
const getRoomById = async(req,res)=>{
    try{
        const room = await Room.findById(req.params.id);
        if(!room){
            return res.status(404).json({message:"Room Not Found"});
        }
        res.json(room);
    }catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
}

export {getRooms, getRoomsByType, addRoom, deleteRoom, updateRoom,getRoomById};

