import crypto from 'crypto';
import axios from 'axios';

const initiatePayment = async (req, res) => {
    try {
        const merchantTransactionId = req.body.transactionId;
        const data = {
            merchantId: process.env.MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: req.body.MUID,
            name: req.body.name,
            amount: req.body.amount * 100,
            redirectUrl: `http://localhost:5000/api/status/${merchantTransactionId}`,
            redirectMode: 'POST',
            mobileNumber: req.body.number,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        console.log({ Data: data });

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + process.env.SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

        const response = await axios.post(prod_URL, {
            request: payloadMain
        }, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            }
        });

        console.log(response.data);
        console.log(response.data.data.instrumentResponse.redirectInfo.url);
        res.status(200).json(response.data.data.instrumentResponse.redirectInfo.url);

    } catch (error) {
        console.error({'Error':error});
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
};

const checkStatus = async (req, res) => {
    try {
        const merchantTransactionId = req.body.transactionId;
        const merchantId = req.body.merchantId;

        const keyIndex = 1;
        const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + "###" + keyIndex;

        const url = `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`;

        const response = await axios.get(url, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': merchantId
            }
        });

        if (response.data.success) {
            res.redirect('http://localhost:5173/success');
        } else {
            res.redirect('http://localhost:5173/failure');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
};

export { initiatePayment, checkStatus };
