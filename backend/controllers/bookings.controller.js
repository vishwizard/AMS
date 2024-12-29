import Booking from '../models/booking.model.js';
import Room from '../models/room.model.js';
import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { z } from 'zod';
import Counter from "../models/counter.model.js"

// Define a Zod schema for booking data validation
const bookingSchema = z
  .object({
    Customer: z.string().nonempty("Customer ID is required"),

    Rooms: z
      .array(z.string().nonempty("Room ID is required"))
      .nonempty("At least one room is required"),

    CheckIn: z.preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    ),

    CheckOut: z.preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    ),

    PaymentDetails: z.object({
      method: z.enum(["Cash", "Card", "Online"], {
        errorMap: () => ({ message: "Payment method must be 'Cash', 'Card', or 'Online'" }),
      }),
      transactionId: z.string().optional(),
      status: z.boolean().optional(),
    }),

    Amount: z
      .number()
      .positive("Amount must be positive")
      .min(1, "Amount must be at least 1"),
  })
  .refine(
    (data) => data.CheckOut > data.CheckIn, // Ensure CheckOut is after CheckIn
    {
      path: ["CheckOut"],
      message: "CheckOut date must be after CheckIn date",
    }
  );

const getInvoiceNumber = async ()=>{
    const counter = await Counter.findOneAndUpdate({},
        {$inc : {invoiceNumber : 1}},
        {new : true, upsert : true}
    );

    return counter.invoiceNumber;
};

const addBooking = asyncHandler(async (req, res) => {
  try {
    bookingSchema.parse(req.body);
  } catch (err) {
    console.log(err);
    throw new ApiError(400, {}, "Invalid booking data");
  }

  const { Customer, Rooms, CheckIn, CheckOut, PaymentDetails, Amount } = req.body;

 const  invoiceNumber = await getInvoiceNumber();

  const booking = new Booking({
    Customer,
    Rooms,
    CheckIn,
    CheckOut,
    PaymentDetails,
    Amount,
    invoiceNumber,
  });

  const savedBooking = await booking.save();
  const populatedBooking = await savedBooking.populate([
    { path: "Rooms", select: "roomNumber price type" },
    { path: "Customer", select: "Name Age Gender Phone Email Address CoPassengers IDProof IDProofNumber Additional" }
  ]);

  await Room.updateMany(
    { _id: { $in: Rooms } },
    { $addToSet: { bookings: savedBooking._id } }
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

const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(404, {}, "Booking Does Not Exist");
  }

  bookingSchema.partial().parse(req.body);

  const { Customer, Rooms, CheckIn, CheckOut, PaymentDetails, Amount } = req.body;

  if (Customer) booking.Customer = Customer;

  if (Rooms && Array.isArray(Rooms)) {
    // Remove the booking ID from the current rooms
    await Room.updateMany(
      { _id: { $in: booking.Rooms } },
      { $pull: { bookings: booking._id } }
    );

    // Add the booking ID to the new rooms
    await Room.updateMany(
      { _id: { $in: Rooms } },
      { $addToSet: { bookings: booking._id } }
    );

    booking.Rooms = Rooms;
  }

  if (CheckIn) booking.CheckIn = CheckIn;
  if (CheckOut) booking.CheckOut = CheckOut;
  if (Amount) booking.Amount = Amount;
  if (PaymentDetails) booking.PaymentDetails = PaymentDetails;
  booking.invoiceNumber=getInvoiceNumber();

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
    { $pull: { bookings: booking._id } }
  );

  await booking.deleteOne();

  res.json(new ApiResponse(200, {}, "Booking deleted successfully"));
});

const getBookingsData = asyncHandler(async (req, res) => {
  console.log("Request : ",req);
  const result = await Booking.aggregate([
    {
      $group: {
        _id: null, // Group all documents together
        totalSales: { $sum: "$price" }, // Summing up the "price" field
        totalBookings: { $sum: 1 }, // Counting the number of documents
      },
    },
  ]);
  console.log("result : ",result);

  const totalSales = result.length > 0 ? result[0].totalSales : 0;
  const totalBookings = result.length > 0 ? result[0].totalBookings : 0;

  res.status(200).json(
    new ApiResponse(200, { totalSales, totalBookings }, "Stats fetched successfully")
  );
});



export { getBookings, getBookingById, addBooking, updateBooking, deleteBooking, getBookingsData };