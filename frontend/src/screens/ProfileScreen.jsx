
import React from 'react'
import { useEffect, useState } from 'react';
import {Table, Form, Button, Row, Col} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {FaTimes} from 'react-icons/fa';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';
const ProfileScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");

    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.auth);

    useEffect(() => {
        if(userInfo){
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    },[userInfo, userInfo.name, userInfo.email]);
    
const [UpdateProfile, {isLoading: loadingupdateprofile}] = useProfileMutation();
const {data: orders, isLoading, error} = useGetMyOrdersQuery();
    const submitHandler = async(e) => {
        e.preventDefault();
        if(password !== confirmpassword){
            toast.error('Password do not match');
        }
        else{
            try {
                const res = await UpdateProfile({_id:userInfo._id, name, email, password}).unwrap();
                dispatch(setCredentials(res));
                toast.success('Profile Update Successfully');
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }
  return (
    <Row>
        <Col md={3}>
            <h2>User Profile</h2>

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='name'
                        placeholder='Enter Your Name'
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='email' className='my-2'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter Your Email'
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='password' className='my-2'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Your Password'
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='confirmpassword' className='my-2'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='confirmpassword'
                        placeholder='Re-Enter Your Password'
                        value={confirmpassword}
                        onChange={(e)=> setConfirmpassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary' className='my-2'>Update</Button>
                {loadingupdateprofile && <Loader/>}
            </Form>
        </Col>


        <Col md={9}>
            <h2>My Orders</h2>
            {isLoading ? <Loader/> : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>):(
                <Table striped hover responsive className='table-sm'> 
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.createdAt.substring(0,19)}</td>
                            <td>₹{order.totalPrice}</td>
                            <td>
                                {order.isPaid ? (
                                    order.paidAt.substring(0,10)
                                ) : (<FaTimes style={{color: 'red'}}/>)
                                }
                            </td>
                            <td>
                                {order.isDelivered ? (
                                    order.deliveredAt.substring(0,10)
                                ) : (<FaTimes style={{color: 'red'}}/>)
                                }
                            </td>
                            <td>
                                <LinkContainer to={`/order/${order._id}`}>
                                <Button className='btn-sm' variant='light'>Details</Button>
                                </LinkContainer>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </Table>
            )}
        </Col>
    </Row>
  )
}

export default ProfileScreen;