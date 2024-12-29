import Customer from '../models/customer.model.js';
import deleteImage from './images.controller.js';
import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { z } from 'zod';

// Define a Zod schema for customer data validation
const customerSchema = z.object({
  Name: z.string().max(50, "Name cannot exceed 50 characters"),
  Age: z.number().min(18, "Cannot make a booking below 18 years").optional(),
  Gender: z.enum(['M', 'F', 'O']).optional(),
  Phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
  Email: z.string().email("Invalid email address").optional(),
  Address: z.string().max(100, "Address should be within 100 characters").optional(),
  IDProof: z.string(),
  IDProofNumber: z.string().max(50, "ID Proof Number cannot exceed 50 characters"),
  CoPassengers: z.array(z.object({
    Name: z.string().max(50, "Name cannot exceed 50 characters"),
    Age: z.number().min(0, "Age cannot be negative").max(150, "Age exceeds realistic limits"),
    Gender: z.enum(['M', 'F', 'O']).optional(),
  })).optional(),
  Additional: z.string().max(200, "Max Limit 200 characters for additional data").optional(),
  ImageURL: z.string().optional()
});

const addCustomer = asyncHandler(async (req, res) => {
  console.log(req.body);
  customerSchema.parse(req.body);

  const { Phone, Email, IDProof, IDProofNumber } = req.body;
  console.log("hello");
  console.log(req.body);
  const existingCustomer = await Customer.findOne({
    $or: [
      { Phone },
      { Email },
      { IDProof, IDProofNumber }
    ]
  });

  if (existingCustomer) {
    throw new ApiError(400, {}, "Customer with the same Phone, Email, or ID already exists");
  }

  const customer = new Customer(req.body);
  await customer.save();
  res.status(201).json(new ApiResponse(201, customer, "Customer added successfully"));
});

const getCustomer = asyncHandler(async (req, res) => {
  const customers = await Customer.find().lean();
  res.json(new ApiResponse(200, customers));
});

const getRecentCustomers = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const recentCustomers = await Customer.find()
    .sort({ CreationDate: -1 })
    .limit(limit)
    .lean();
  res.json(new ApiResponse(200, recentCustomers));
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndDelete({ _id: req.params.id });
  if (!customer) {
    throw new ApiError(404, {}, 'Customer Not Found');
  }
  if (customer.ImageURL) {
    deleteImage(customer.ImageURL);
  }
  res.json(new ApiResponse(200, {}, 'Customer Deleted'));
});

const updateCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    throw new ApiError(404, {}, 'Customer Does Not Exist');
  }

  customerSchema.partial().parse(req.body);
  Object.assign(customer, req.body);

  if (req.body.ImageURL !== customer.ImageURL && customer.ImageURL) {
    deleteImage(customer.ImageURL);
  }

  await customer.save();
  res.json(new ApiResponse(200, customer, "Customer Updated Successfully"));
});

const searchCustomer = asyncHandler(async (req, res) => {
  const { Phone, Email, IDProof, IDProofNumber } = req.query;
  const query = {};

  if (Phone) query.Phone = Phone;
  if (Email) query.Email = Email;
  if (IDProof && IDProofNumber) {
    query.IDProof = IDProof;
    query.IDProofNumber = IDProofNumber;
  }

  const customer = await Customer.find(query).lean();

  if (customer.length === 0) {
    throw new ApiError(404, {}, "Customer Not Found");
  }

  res.status(200).json(new ApiResponse(200, customer));
});

const getCustomersData = asyncHandler(async (req, res) => {
  const response = await Customer.aggregate([
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 }
      }
    }
  ]);
  res.status(200).json(new ApiResponse(200,response[0].totalCustomers,"Data Fetched Successfully"));

});

export { getCustomer, addCustomer, deleteCustomer, updateCustomer, searchCustomer, getRecentCustomers, getCustomersData };
