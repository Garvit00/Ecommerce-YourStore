import asyncHandler from "../middleware/asyncHandler.js";
import { instance } from "../server.js";
import Order from "../models/orderModels.js";
import dotenv from 'dotenv';
dotenv.config();
//@desc create new order
//@route POST /api/orders
//@access private

const addOrderItems = asyncHandler(async (req,res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;
    if(orderItems && orderItems.length === 0){
        res.status(400);
        throw new Error('orders not found!');
    } else{
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

//@desc get logged in user orders
//@route GET /api/orders/myorders
//@access private

const getMyOrders = asyncHandler(async (req,res) => {
    const orders = await Order.find({user: req.user._id});
    res.status(200).json(orders);
});

//@desc get order by id
//@route GET /api/orders/:id
//@access private

const getOrderbyId = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if(order){
        res.status(200).json(order);
    }else{
        res.status(404);
        throw new Error("Order not found!");
    }
});

//@desc update order to paid
//@route PUT /api/orders/:id/pay
//@access private

const updateOrderToPaid = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id);
    if(order){
        order.isPaid = true,
        order.paidAt = Date.now(),
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: "abc@email.com"

        }
        const updateOrder = order.save();
        res.status(200).json(updateOrder)
    }else{
        res.status(404);
        throw new Error("order not found")
    }
});

//@desc order delivered
//@route PUT /api/orders/:id/deliver
//@access private/Admin

const updateOrderToDelivered = asyncHandler(async (req,res) => {
   const order = await Order.findById(req.params.id);

   if(order){
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
   }else{
    res.status(404);
    throw new Error('Order not found');
   }
});

//@desc get all orders
//@route GET /api/orders
//@access private/Admin

const getOrders = asyncHandler(async (req,res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
});


//chatgpt code


// @desc Create Razorpay Order
// @route POST /api/payment/order
// @access Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
    try {
        const orderOptions = {
            amount: req.body.amount * 100, // Amount in paise
            currency: "INR",
            receipt: "receipt_order_" + Math.random().toString(36).substring(7),
        };

        const order = await instance.orders.create(orderOptions);
        console.log(order)
        res.status(201).json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Error creating Razorpay order" });
    }
});

export {addOrderItems, getMyOrders, getOrderbyId, updateOrderToPaid,updateOrderToDelivered, getOrders, createRazorpayOrder};