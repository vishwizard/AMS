import Customer from '../models/customer.model.js';
import deleteImage from './images.controller.js';

const addCustomer = async (req,res) =>{
    const {Name,Age,Gender,Phone,Email,Address,IDProof,IDProofNumber,CoPassengers,Additional,ImageURL} = req.body;

    try{

        const existingCustomer = await Customer.findOne({
            $or: [
                { Phone },
                { Email },
                { IDProof, IDProofNumber }
            ]
        });

        if (existingCustomer) {
            return res.status(400).json({ message: "Customer with the same Phone, Email, or ID already exists" , code:0});
        }

        const customer = new Customer(req.body);
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
        if(customer.ImageURL){
            deleteImage(customer.ImageURL);
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
        const {Name,Age,Gender,Phone,Email,Address,IDProof,IDProofNumber,CoPassengers,Additional,ImageURL} = req.body;
        if(Name) customer.Name = Name;
        if(Phone) customer.Phone = Phone;
        if(Email) customer.Email = Email;
        if(Address) customer.Address = Address;
        if(Age) customer.Age = Age;
        if(Gender) customer.Gender = Gender;
        if(IDProof) customer.IDProof = IDProof;
        if(IDProofNumber) customer.IDProofNumber = IDProofNumber;
        if(CoPassengers) customer.CoPassengers = CoPassengers;
        if(Additional!==undefined) customer.Additional = Additional;
        if((ImageURL!==customer.ImageURL) && (customer.ImageURL!=='')){
            deleteImage(customer.ImageURL);
        }
        if(ImageURL!==undefined) customer.ImageURL = ImageURL;
        // console.log(req.body);

        await customer.save();
        res.json({message:"Customer Updated Successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const searchCustomer = async ()=>{
try{
    const {Phone, Email, IDProof, IDProofNumber} = req.query;
    const query= {};
    if(Phone) query.Phone = Phone;
    if(Email) query.Email = Email;
    if(IDProof && IDProofNumber){
        query.IDProof = IDProof;
        query.IDProofNumber = IDProofNumber;
    }
    const customer = await Customer.find(query);
    if(!customer){
        return res.status(404).json({message:"Customer Not Found"});
    }
    res.status(200).json(customer);

}catch(err){
    console.log(err);
    res.status(500).json({message:"Internal Server Error"});
}
};

export {getCustomer, addCustomer, deleteCustomer,updateCustomer,searchCustomer};

