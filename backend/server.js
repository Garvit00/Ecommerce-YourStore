import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import { notfound, errorhandler } from './middleware/errorMiddleware.js';
import express from 'express';
import productRoutes from './Routes/productRoutes.js';
import userRoutes from './Routes/userRouters.js';
import orderRoutes from './Routes/orderRoutes.js';
import paymentRoutes from './Routes/paymentRoutes.js';
import uploadRoutes from './Routes/uploadRoutes.js'
import cookieParser from 'cookie-parser';
import Razorpay from 'razorpay';
import cors from 'cors';

// Database Connection
connectDB();

// Server Setup
const port = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Routes


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes); 
app.use('/api/upload', uploadRoutes);

// Razorpay Instance
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Razorpay Config Route
app.get('/api/config/razorpay', (req, res) => 
  res.send({ key_id: process.env.RAZORPAY_KEY_ID })
);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if(process.env.NODE_ENV === 'production'){
  // set static folder
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // any route that is not api will be redirected to index.html
  app.get('*', (req,res) => 
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else{
  app.get('/', (req, res) => {
    res.send("API is running...");
  });
}

// Error Handling Middleware
app.use(notfound);
app.use(errorhandler);

// Start the Server
app.listen(port, () => console.log(`Server is running at port ${port}`));
