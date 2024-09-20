import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Row, Col, Image, Card, ListGroup } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
import { clearCartItems } from '../slices/cartSlice';
const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const placeOrderHandler = async () => {
        try {
            // Step 1: Create the order in your backend
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();
            // Step 2: Clear cart items
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping Details</h2>
                            <p>
                                <strong>Deliver Address: </strong>
                                {cart.shippingAddress.address},{cart.shippingAddress.city}, 
                                {cart.shippingAddress.state} 
                                <br></br><strong>Contact: </strong> {cart.shippingAddress.contact}<br></br>
                                <strong>Postal Code: </strong>{cart.shippingAddress.postalCode}
                            </p>
                            <strong>Payment Method: </strong>
                            {cart.paymentMethod}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Ordered Items</h2>
                            {cart.cartItems.length === 0 ? (
                                <Message>Your Cart is Empty</Message>
                            ) : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                                                <Col><Link to={`/products/${item.product}`}>{item.name}</Link></Col>
                                                <Col md={4}>{item.qty} x {item.price.toLocaleString()} = ₹{((item.qty * (item.price) * 100) / 100).toLocaleString()}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item><h3>Order Summary</h3></ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items Price: </Col>
                                    <Col>₹ {Number(cart.itemsPrice).toLocaleString()}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax: </Col>
                                    <Col>₹ {Number(cart.taxPrice).toLocaleString()}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping Price: </Col>
                                    <Col>₹ {Number(cart.shippingPrice).toLocaleString()}</Col>
                                    <Row><Col><span className='shippmsg'>Shipping is free on orders above 499</span></Col></Row>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total Price: </Col>
                                    <Col>₹ {Number(cart.totalPrice).toLocaleString()}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant='danger'>{error?.data?.message}</Message>}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button type='button' className='btn-block' disabled={cart.cartItems.length === 0} onClick={placeOrderHandler}>
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                            {isLoading && <Loader />}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrderScreen;
