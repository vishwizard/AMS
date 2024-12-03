const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber:{
        type:String,
        required:true,
        unique:true,
    },

    type:{
        type:String,
    },

    price:{
        type:Number,
        required:true,
    },

    available:{
        type:Boolean,
        default:true
    },
});

module.exports = mongoose.model('Room', roomSchema);