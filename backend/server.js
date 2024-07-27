import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import { notfound,errorhandler } from './middleware/errorMiddleware.js';
import express, { urlencoded } from 'express';
import productRoutes from './Routes/productRoutes.js';
import userRoutes from './Routes/userRouters.js';
import cookieParser from 'cookie-parser';


connectDB();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//cookie parser middleware
app.use(cookieParser());

app.get('/', (req,res) =>{
    res.send("API is running...");
})



app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);



app.use(notfound);
app.use(errorhandler);

app.listen(port, ()=> console.log(`server is running at port ${port}`));