// src/screens/OrderScreen.jsx

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { useGetOrderDetailsQuery, usePayOrderMutation, useDeliverOrderMutation } from '../slices/orderApiSlice';
import { createRazorpayOrder } from '../utils/razorpayUtils'; // Import the function

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
    const [payOrder ] = usePayOrderMutation();
    const { userInfo } = useSelector((state) => state.auth);
    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();
    // Razorpay Payment Handler
    const handleRazorpayPayment = async () => {
        try {
            const razorpayOrder = await createRazorpayOrder(order.totalPrice);

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'YourStore',
                description: 'Complete your payment',
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    try {
                        const verifyResponse = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                order_id: razorpayOrder.id,
                                payment_id: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                            }),
                        });
                        const result = await verifyResponse.json();
                        if (result.status === 'success') {
                            await payOrder({ orderId, details: { payer:{}} });
                            refetch();
                            toast.success('Payment successful');
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (err) {
                        toast.error('Payment verification error');
                    }
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                    contact: '9999999999', // User's contact info
                },
                theme: {
                    color: '#F37254',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error('Razorpay payment failed');
        }
    };

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success('order Delivered');
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    }

    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
    ) : (
        <>
            <Meta title='Payment'/>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h3>Shipping</h3>
                            <p><strong>Name: </strong>{order.user.name}</p>
                            <p><strong>Contact: </strong>{order.shippingAddress.contact}</p>
                            <p><strong>Email: </strong>{order.user.email}</p>
                            <p><strong>Address: </strong>{order.shippingAddress.address}, {order.shippingAddress.city}, {' '}
                                {order.shippingAddress.state} {' '}<strong>Postal Code: </strong>{order.shippingAddress.postalCode}
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'>Delivered On: {order.deliveredAt}</Message>
                            ) : (
                                <Message variant='danger'>Not Delivered</Message>
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h3>Payment Method</h3>
                            <p><strong>Method: </strong>{order.paymentMethod}</p>
                            {order.isPaid ? (
                                <Message variant='success'>Paid On: {order.paidAt}</Message>
                            ) : (
                                <Message variant='danger'>Not Paid</Message>
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h3>Order Items</h3>
                            {order.orderItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                                        <Col md={4}>{item.qty} x ₹ {item.price.toLocaleString()} = ₹ {(item.qty * item.price).toLocaleString()}</Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3>Order Summary</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>₹ {order.itemsPrice.toLocaleString()}</Col>
                                </Row>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>₹ {order.shippingPrice.toLocaleString()}</Col>
                                </Row>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>₹ {order.taxPrice.toLocaleString()}</Col>
                                </Row>
                                <Row>
                                    <Col>Total Price:</Col>
                                    <Col>₹ {order.totalPrice.toLocaleString()}</Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    <Button onClick={handleRazorpayPayment}>Pay with Razorpay</Button>
                                </ListGroup.Item>
                            )}
                            {loadingDeliver && <Loader/>}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type='button' className='btn btn-block' onClick={deliverOrderHandler}>
                                        Mark as Delivered
                                    </Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderScreen;
