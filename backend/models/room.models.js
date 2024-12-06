const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber:{
        type:String,
        required:true,
        unique:true,
    },

    type:{
        type:String,
        enum:['AC','Non AC'],
        default:'Non AC'
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