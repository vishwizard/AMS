import Booking from '../models/booking.model.js';
import Room from '../models/room.model.js';
import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { z } from 'zod';

// Define a Zod schema for booking data validation
const bookingSchema = z.object({
  Customer: z.string().nonempty("Customer ID is required"),
  Rooms: z.array(z.string().nonempty("Room ID is required")).nonempty("At least one room is required"),
  CheckIn: z.date(),
  CheckOut: z.date().refine((date, ctx) => date > ctx.parent.CheckIn, {
    message: "CheckOut date must be after CheckIn date",
  }),
  PaymentDetails: z.object({
    method: z.enum(['Cash', 'Card', 'Online']),
    transactionId: z.string().optional(),
    status: z.boolean().optional(),
  }),
  Amount: z.number().positive("Amount must be positive"),
});

const addBooking = asyncHandler(async (req, res) => {
  console.log(req.body);
  try{
    bookingSchema.parse(req.body);
  }catch(err){
    console.log(err);
  }
  console.log("It was a parsing error");

  const { Customer, Rooms, CheckIn, CheckOut, PaymentDetails, Amount } = req.body;

  const booking = new Booking({
    Customer,
    Rooms,
    CheckIn,
    CheckOut,
    PaymentDetails,
    Amount,
  });

  const savedBooking = await booking.save();
  const populatedBooking = await savedBooking.populate([
    { path: "Rooms", select: "roomNumber price type" },
    { path: "Customer", select: "Name Age Gender Phone Email Address CoPassengers IDProof IDProofNumber Additional" }
  ]);

  await Room.updateMany(
    { _id: { $in: Rooms } },
    { $set: { booking: savedBooking._id } }
  );

  res.status(201).json(new ApiResponse(201, populatedBooking, "Booking added successfully"));
});

const getBookings = asyncHandler(async (req, res) => {
  const { startDate, endDate, page = 1, limit = 10 } = req.query;

  if (!startDate || !endDate) {
    throw new ApiError(400, {}, "startDate and endDate are required");
  }

  const filter = {
    CheckIn: { $lte: new Date(endDate) },
    CheckOut: { $gte: new Date(startDate) },
  };

  const bookings = await Booking.find(filter)
    .populate('Customer', 'Name Age Phone CoPassengers')
    .populate('Rooms', 'roomNumber type price')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean();

  const totalBookings = await Booking.countDocuments(filter);

  if (!bookings.length) {
    throw new ApiError(404, {}, "No bookings found for the given dates");
  }

  res.status(200).json(new ApiResponse(200, bookings, "Bookings retrieved successfully", {
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(totalBookings / limit),
      totalBookings,
    },
  }));
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('Customer', 'Name Age Gender Phone Email Address IDProof CoPassengers Additional ImageURL')
    .populate('Rooms', 'roomNumber type price')
    .lean();

  if (!booking) {
    throw new ApiError(404, {}, 'Booking not found');
  }

  res.json(new ApiResponse(200, booking, "Booking retrieved successfully"));
});

const updateBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(404, {}, "Booking Does Not Exist");
  }

  bookingSchema.partial().parse(req.body);

  const { Customer, Rooms, CheckIn, CheckOut, PaymentDetails, Amount } = req.body;

  if (Customer) booking.Customer = Customer;

  if (Rooms && Array.isArray(Rooms)) {
    await Room.updateMany(
      { _id: { $in: booking.Rooms } },
      { $set: { booking: '' } }
    );

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

  res.json(new ApiResponse(200, booking, "Booking updated successfully"));
});

const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(404, {}, "Booking Not Found");
  }

  await Room.updateMany(
    { _id: { $in: booking.Rooms } },
    { $set: { booking: '' } }
  );
  await booking.deleteOne();

  res.json(new ApiResponse(200, {}, "Booking deleted successfully"));
});

export { getBookings, getBookingById, addBooking, updateBooking, deleteBooking };