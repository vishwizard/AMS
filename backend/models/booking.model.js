const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    Customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
        required:true,
    },
    Room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room',
        required:true,
    },
    CheckIn:{
        type:Date,
        required:true,
    },
    CheckOut:{
        type:Date,
        required:true,
    },
    PaymentStatus:{
        type:String,
        enum:['Pending','Paid'],
        default:'Pending',
    },
    Amount:{
        type:Number,
        required:true,
    },
});

module.exports = mongoose.model('Booking',bookingSchema);