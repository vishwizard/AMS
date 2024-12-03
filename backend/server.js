const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json());

app.get('/', (req,res)=>{
    res.send('API is running')
});

//API Routes
app.use('/api/rooms',require('./routes/rooms.routes'));
app.use('/api/customers',require('./routes/customer.routes'));
app.use('/api/bookings',require('./routes/bookings.routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    // console.log(`Server is Listening on port ${PORT}`)
});