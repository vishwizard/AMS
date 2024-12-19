import {initiatePayment,checkStatus} from '../controllers/payment.controller.js';
import express from 'express';
const router = express();

router.post('/', initiatePayment);
router.post('/status/:txnId', checkStatus);

export default router;