import express from 'express';
import upload from '../middlewares/upload.js';  // Import multer configuration

import {getCustomer, addCustomer, deleteCustomer,updateCustomer,searchCustomer} from '../controllers/customers.controller.js';

const router = express.Router();

router.post('/',addCustomer);
router.get('/',getCustomer);
router.delete('/:id',deleteCustomer);
router.put('/:id',updateCustomer);
router.get('/search',searchCustomer);

router.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        // Image uploaded successfully, send back the image path or URL
        res.json({ message: 'Image uploaded successfully', file: req.file });
    } else {
        res.status(400).json({ message: 'Please upload a valid image file' });
    }
});

export default router;