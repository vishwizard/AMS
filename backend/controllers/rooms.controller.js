import Booking from '../models/booking.model.js';
import Room from '../models/room.model.js';
import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { z } from 'zod';

// Define a Zod schema for room data validation
const roomSchema = z.object({
  roomNumber:z.string().max(10,"Room Number cannot be more than 10 characters"),
  type:z.enum(['AC','Non AC']),
  price:z.number().min(1,"Price cannot be less than 1").max(10000,"Price must be at most 10000"),
})

const getRooms = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    throw new ApiError(400, {}, 'Invalid date range');
  }

  const rooms = await Room.find().populate('bookings').lean();
  const markedRooms = rooms.map((room) => {
    const isBooked = room?.bookings?.some((bkg) => {
      return start <= bkg.endDate && end >= bkg.startDate;
    }) || false;
    return { ...room, isBooked };
  });

  res.status(200).json(new ApiResponse(200, markedRooms));
});

const getRoomsByType = asyncHandler(async (req, res) => {
  const type = req.params.type;
  if (!type) {
    throw new ApiError(400, {}, 'Invalid Room Type');
  }
  const rooms = await Room.find({ type }).lean();
  res.status(200).json(new ApiResponse(200, rooms));
});

const addRoom = asyncHandler(async (req, res) => {
  const { roomNumber, type, price } = req.body;

  try {
    roomSchema.parse({ roomNumber, type, price });
  } catch (error) {
    throw new ApiError(400, {}, error.errors.map(e => e.message).join(', '));
  }

  const room = new Room({ roomNumber, type, price });
  const createdRoom = await room.save();
  res.status(201).json(new ApiResponse(201, createdRoom, 'Room Added Successfully'));
});

const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    throw new ApiError(404, {}, 'Room not found');
  }
  const bookings = await Booking.find({
    room: room._id,
    date: { $gte: new Date() }
  });

  if (bookings.length > 0) {
    throw new ApiError(400, {}, 'Room cannot be deleted as it has an active booking');
  }

  await Room.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, 'Room Deleted Successfully'));
});

const updateRoom = asyncHandler(async (req, res) => {
  const { _id, type, price } = req.body;
  const room = await Room.findById(_id);
  if (!room) {
    throw new ApiError(404, {}, 'Room Not Found');
  }

  if (type) room.type = type;
  if (price) room.price = price;

  const updatedRoom = await room.save();
  res.status(200).json(new ApiResponse(200, updatedRoom, 'Room Updated Successfully'));
});

const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params._id).lean();
  if (!room) throw new ApiError(404, {}, 'Room not found');
  res.status(200).json(new ApiResponse(200, room));
});

export { getRooms, getRoomsByType, addRoom, deleteRoom, updateRoom, getRoomById };

  // const getRooms = async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;
  
//       const start = new Date(startDate);
//       const end = new Date(endDate);
  
//       const rooms = await Room.find().populate('booking');
  
//       // Mark rooms as booked or available based on the date range
//       const availableRooms = rooms.map((room) => {
//         // Check if any booking conflicts with the given date range
//         const isBooked = room.booking.some((bkg) => {
//           return start <= bkg.endDate && end >= bkg.startDate;
//         });
  
//         return {
//           ...room.toObject(), // Convert Mongoose doc to plain object
//           isBooked: isBooked,
//         };
//       });
  
//       res.json(availableRooms);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };

// const getRoomsByType = async (req,res)=>{
//     try{
//         const type = req.params.type;
//         //use %20 for space
//         console.log(type);
//         if(!type){
//             return res.status(400).json({message:'Room Type is required'});
//         } 
//         const rooms = await Room.find({type});
//         res.status(200).json(rooms);

//     }catch(err){
//         console.log(err);
//         res.status(500).json({message:'Internal Server Error'});
//     }
// }


// const addRoom = async (req,res) =>{
//     // console.log(req);
//     const {roomNumber, type, price} = req.body;
//     try{
//         const room = new Room({roomNumber, type,price});
//         await room.save();
//         res.status(201).json({room});
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }
// };



// const deleteRoom = async (req, res) => {
//     try {
//       // First, check if the room exists
//       const room = await Room.findById(req.params.id);
//       if (!room) {
//         return res.status(404).json({ message: "Room not found" });
//       }
  
//       // Check if there are any bookings associated with this room
//       const bookings = await Booking.find({ room: room._id });
//       if (bookings.length > 0) {
//         return res.status(400).json({ message: "Room cannot be deleted as it has active bookings." });
//       }
  
//       // Proceed with deletion if no bookings are found
//       await Room.findByIdAndDelete(req.params.id);
//       res.status(200).json({ message: "Room successfully deleted" });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };



 

// const updateRoom = async (req,res)=>{
//     try{
//         const {type, price} = req.body;
//         //Room can only be deleted, Room number cannot be updated
//         const room = await Room.findById(req.params.id);
//         if(!room){
//             return res.status(404).json({message:'Room Not Found'});
//         }
//         if(type) room.type = type;
//         if(price) room.price = price;
//         await room.save();
//         res.json({message:"Booking Updated Successfully"});
//     }catch(err){
//       console.log(err);
//         res.status(500).json({message:"Internal Server Error"});
//     }
// }



//needs to be updated
// const getRoomById = async(req,res)=>{
//     try{
//         const room = await Room.findById(req.params.id);
//         if(!room){
//             return res.status(404).json({message:"Room Not Found"});
//         }
//         res.json(room);
//     }catch(err){
//         res.status(500).json({message:"Internal Server Error"});
//     }
// }




