import mongoose from 'mongoose';

const counterSchema = mongoose.Schema({
    invoiceNumber:{
    type:Number,
    default:1000        
    }
});

const Counter = mongoose.model('Counter',counterSchema);

export default Counter;