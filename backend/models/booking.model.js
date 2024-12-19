import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  Customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  Rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  }],
  CheckIn: {
    type: Date,
    required: true,
  },
  CheckOut: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.CheckIn;
      },
      message: 'CheckOut date must be after CheckIn date',
    },
  },
  PaymentDetails: {
    method: { type: String, enum: ['Cash', 'Card', 'Online'], default: 'Cash' },
    transactionId: { type: String },
    status: { type: Boolean, default: false },
  },
  Amount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

bookingSchema.index({ CheckIn: 1, CheckOut: 1 });

export default mongoose.model('Booking', bookingSchema);