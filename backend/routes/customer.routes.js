import express from 'express';
import upload from '../middlewares/upload.js';  // Import multer configuration

import {getCustomer, addCustomer, deleteCustomer,updateCustomer,searchCustomer, getRecentCustomers, getCustomersData} from '../controllers/customers.controller.js';
import authenticate from '../middlewares/authHandler.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

router.post('/',authenticate,addCustomer);
router.get('/',authenticate,getCustomer);
router.delete('/:id',authenticate,authorize('admin'),deleteCustomer);
router.put('/:id',authenticate,updateCustomer);
router.get('/search',authenticate,searchCustomer);
router.get('/recent',authenticate, getRecentCustomers);
router.get('/admin',authenticate,authorize('admin'),getCustomersData)

router.post('/upload', authenticate,upload.single('image'), (req, res) => {
    if (req.file) {
        // Image uploaded successfully, send back the image path or URL
        res.json({ message: 'Image uploaded successfully', file: req.file });
    } else {
        res.status(400).json({ message: 'Please upload a valid image file' });
    }
});

  

export default router;