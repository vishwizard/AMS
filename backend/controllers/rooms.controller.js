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
    const isBooked = room.bookings.some((bkg) => {
      const bookingStart = new Date(bkg.CheckIn);
      const bookingEnd = new Date(bkg.CheckOut);
   
      return start <= bookingEnd && end >= bookingStart;
    });
    return { ...room, isBooked };
  });

  res.status(200).json(new ApiResponse(200, markedRooms, 'Rooms retrieved successfully'));
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
    Rooms: room._id,
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

const getRoomData = asyncHandler(async (req,res)=>{
  const result = await Room.aggregate([
    {
      $group:{
        _id:null,
        totalRooms:{$sum:1}
      }
    }
  ]);
  res.status(200).json(new ApiResponse(200,result[0].totalRooms,'Data fetched successfully'));
});

export { getRooms, getRoomsByType, addRoom, deleteRoom, updateRoom, getRoomById, getRoomData };
