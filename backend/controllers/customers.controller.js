const Customer = require('../models/customer.model');

const addCustomer = async (req,res) =>{
    const {name,phone,email,address} = req.body;

    try{
        const customer = new Customer({Name:name,Phone:phone,Email:email,Address:address});
        await customer.save();
        res.status(201).json(customer);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to add Customer : Internal Server Error"});
    }
};

const getCustomer = async (req,res) =>{
    try{
        const customers = await Customer.find();
        res.json(customers);
    }catch(err){
        res.status(500).json({message:'Internal Server Error'});
    }
}

const deleteCustomer = async (req,res)=>{
    try{
        const customer = await Customer.findOneAndDelete(req.params.id);
        if(!customer){
            return res.status(404).json({message:'Customer Not Found'});
        }
        res.json({message:'Customer Deleted'});
    }catch(err){
        res.status(500).json({message:'Internal Server Error'});
    }
}

const updateCustomer = async(req,res)=>{
    try{
        const customer = await Customer.findById(req.params.id);
        if(!customer){
            return res.status(404).json({message:'Customer Does Not Exist'});
        }
        const {name,phone,email,address} = req.body;
        if(name) customer.Name = name;
        if(phone) customer.Phone = phone;
        if(email) customer.Email = email;
        if(address) customer.Address = address;
        await customer.save();
        res.json({message:"Customer Updated Successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

module.exports = {getCustomer, addCustomer, deleteCustomer,updateCustomer};

