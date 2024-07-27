import mongoose from "mongoose";
import dotenv from "dotenv";
import products from "./data/products.js";
import users from "./data/users.js";
import Order from "./models/orderModels.js";
import Product from "./models/productModels.js";
import User from "./models/userModels.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importdata = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;
        const sampleproducts = products.map((product) => {
            return {...product, user: adminUser};
        });

        await Product.insertMany(sampleproducts);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${errormessage}`);
        process.exit(1);
        
    }
};
 
const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error.message}`);
        process.exit(1);
        
    }
};

if(process.argv[2] === '-d'){
    destroyData();
}
else{
    importdata();
}
