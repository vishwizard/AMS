import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    roomNumber:{
        type:String,
        required:true,
        unique:true,
        maxLength:[10,'Room number cannot be more that 10 characters'],
    },

    type:{
        type:String,
        enum:['AC','Non AC'],
        default:'Non AC',
        message:'Room type is either AC or Non AC'
    },

    price:{
        type:Number,
        required:true,
        min:[100,'Price must atleast be 100Rs'],
        max:[10000,'Price must be at max 10000Rs'],
    },

    booking:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Booking',
        },
    ],
});

export default mongoose.model('Room', roomSchema);