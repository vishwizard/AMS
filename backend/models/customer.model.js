    const mongoose = require('mongoose');

    const customerSchema = new mongoose.Schema({
        Name:{
            type:String,
            required:true,
            //add max length
        },
        Age:{
            type:Number,
        },
        Gender:{
            type:String,
            enum:['M','F','O'],
        },
        Phone:{
            type:String,
            required:true,
            unique:true,
            //validation using zod
        },
        Email:{
            type:String,
            requied:true,
            unique:true,
            //validation using zod
        },
        Address:{
            type:String,
            //length
        },
        CreationDate:{
            type:Date,
            default:Date.now(),
        },
    });

    

    module.exports = mongoose.model('Customer', customerSchema);