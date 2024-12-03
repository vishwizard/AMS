const Room = require('../models/room.models');

const getRooms = async (req, res) =>{
    try{
        const room  = await Room.find();
        res.json(room);
    }catch(err){
        res.status(500).json({message: "Internal Server Error"});
    }
};

const addRoom = async (req,res) =>{
    const {roomNumber, type, price} = req.body;

    try{
        const room = new Room({roomNumber, type,price});
        await room.save();
        res.status(201).json({room});
    }catch(err){
        res.status(500).json({message: "Internal Server Error"});
    }
};

const deleteRoom = async (req,res) =>{
    try{
        const room = await Room.findByIdAndDelete(req?.params?.id);
        if(!room){
            return res.status(404).json({message:"Room Gayab ha"});
        }
        res.json({message: "Room Deleted"});
    }catch(err){
        res.status(500).json({message: "Internal Server Error"});
    }
};

const updateRoom = async (req,res)=>{
    try{
        const {type, price} = req.body;
        //Room can only be deleted, Room number cannot be updated
        const room = await Room.findById(req.params.id);
        if(!room){
            return res.status(404).json({message:'Room Not Found'});
        }
        if(type) room.type = type;
        if(price) room.price = price;
        await room.save();
        res.json({message:"Booking Updated Successfully"});
    }catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
}

const getRoomById = async(req,res)=>{
    try{
        const room = await Room.findById(req.params.id);
        if(!room){
            return res.status(404).json({message:"Room Not Found"});
        }
        res.json(room);
    }catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
}

module.exports = {getRooms, addRoom, deleteRoom, updateRoom,getRoomById};

