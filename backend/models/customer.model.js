import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    maxLength: [50, 'Name cannot exceed 50 characters'],
  },
  Age: {
    type: Number,
    min: [18, 'Cannot book room below 18 years'],
  },
  Gender: {
    type: String,
    enum: ['M', 'F', 'O'],
  },
  Phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  Email: {
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  Address: {
    type: String,
    maxLength: [100, 'Address Length cannot exceed 100 characters'],
  },
  IDProof: {
    type: String,
    required: true,
  },
  IDProofNumber: {
    type: String,
    required: true,
    unique: true,
    maxLength: [50, "ID Proof Number cannot exceed 50 characters"],
  },
  CoPassengers: [
    {
      Name: { type: String, required: true, maxLength: [50, 'Name cannot exceed 50 characters'] },
      Age: { type: Number, required: true, min: [0, 'Age cannot be negative'], max: [150, 'Age exceeds realistic limits'] },
      Gender: { type: String, enum: ['M', 'F', 'O'] },
    },
  ],
  Additional: {
    type: String,
    maxLength: [200, 'Additional information cannot exceed 200 characters'],
  },
  CreationDate: {
    type: Date,
    default: Date.now,
  },
  ImageURL: {
    type: String,
  },
});

export default mongoose.model('Customer', customerSchema);