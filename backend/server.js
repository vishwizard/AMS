import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);


app.get('/', (req,res)=>{
    res.send('API is running')
});

//Importing API Routes
import roomsRoutes from './routes/rooms.routes.js';
import customerRoutes from './routes/customer.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import paymentRoutes from './routes/payments.routes.js';
import authRoutes from './routes/auth.routes.js';

//Handling API Routes
app.use('/api/rooms',roomsRoutes);
app.use('/api/customers',customerRoutes);
app.use('/api/bookings',bookingsRoutes);
app.use('/api/payment',paymentRoutes);

//Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is Listening on port ${PORT}`)
});