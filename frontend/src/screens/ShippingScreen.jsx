import { useState } from "react";
import {Form, Button} from "react-bootstrap";
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const {shippingAddress} = cart;

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [state, setState] = useState(shippingAddress?.state || '');
    const [contact, setContact] =  useState(shippingAddress?.contact || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler =  (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address, contact, city, postalCode, state}));
        navigate('/payment')
    };

  return (
    <FormContainer>
        <CheckoutSteps step1 step2/>
        <h1>Shipping</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId="address" className="my-2">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" placeholder="Enter Address" value={address} onChange={(e) => setAddress(e.target.value)}>
            </Form.Control>
            </Form.Group>

            <Form.Group controlId="contact" className="my-2">
            <Form.Label>Contact No.</Form.Label>
            <Form.Control type="text" placeholder="Enter Mobile Number" value={contact} onChange={(e) => setContact(e.target.value)}>
            </Form.Control>
            </Form.Group>

            <Form.Group controlId="city" className="my-2">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" placeholder="Enter City" value={city} onChange={(e) => setCity(e.target.value)}>
            </Form.Control>
            </Form.Group>

            <Form.Group controlId="postalCode" className="my-2">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control type="text" placeholder="Enter Postal code " value={postalCode} onChange={(e) => setPostalCode(e.target.value)}>
            </Form.Control>
            </Form.Group>

            <Form.Group controlId="state" className="my-2">
            <Form.Label>State</Form.Label>
            <Form.Control type="text" placeholder="Enter State" value={state} onChange={(e) => setState(e.target.value)}>
            </Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2" >Continue</Button>
        </Form>
    </FormContainer>
  )
}

export default ShippingScreen;