const express = require('express');

const {getCustomer, addCustomer, deleteCustomer,updateCustomer} = require('../controllers/customers.controller.js');

const router = express.Router();

router.post('/',addCustomer);
router.get('/',getCustomer);
router.delete('/:id',deleteCustomer);
router.put('/:id',updateCustomer);

module.exports = router;
