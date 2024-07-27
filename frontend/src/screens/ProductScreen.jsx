import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import {Form, Row, Col, Image, ListGroup, Card, Button, ListGroupItem} from 'react-bootstrap';
import { useDispatch } from "react-redux";
import Rating from "../components/Rating";
import { useGetProductDetailsQuery } from '../slices/productsApiSlice.js';
import { addToCart } from "../slices/cartSlice.js";

const ProductScreen = () => {
    const {id:productID} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {data: product, isLoading, error} = useGetProductDetailsQuery(productID);
    const [qty, setQty] = useState(1);
    
    const addToCartHandler = () => {
        dispatch(addToCart({...product, qty}));
        navigate('/cart')
    }
  return (
    <>
    <Link className="btn btn-light my-3" to='/'>
    Go Back
    </Link>
    {isLoading ? (<Loader/>) : error ? (<Message>{error?.data?.message || error.error}</Message>) : (<>
    <Row>
        <Col md={5}>
         <Image src={product.image} alt={product.name} fluid />
        </Col>

        <Col md={3}>
            <ListGroup variant="flush">
                <ListGroupItem>
                    <h2>{product.name}</h2>
                </ListGroupItem>
                <ListGroupItem>
                    <Rating value={product.rating} text={`${product.numReviews} Reviews`}/>
                </ListGroupItem>
                <ListGroupItem>
                    <Card.Text>Description: {product.description}</Card.Text>
                </ListGroupItem>
            </ListGroup>
        </Col>
       
        <Col md={3}>
        <Card>
            <ListGroup variant="flush">
                <ListGroupItem>
                    <Row>
                        <Col>Price:</Col>
                        <Col>
                            <strong>{product.price.toLocaleString()}</strong>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col>Status:</Col>
                        <Col>
                            <strong className={product.countInStock > 0 ? 'InStock' : 'Outofstock'}>
                                {product.countInStock>0 ? 'Available!' : 'Out Of Stock'}
                            </strong>
                        </Col>
                    </Row>
                </ListGroupItem>
                {product.countInStock > 0 && (
                    <ListGroupItem>
                        <Row>
                            <Col>Qty</Col>
                            <Col>
                                <Form.Control
                                    as ='select'
                                    value = {qty}
                                    onChange={(e) => setQty(Number(e.target.value))}>
                                        {[...Array(product.countInStock).keys()].map((x) => (
                                            <option key={x+1} value={x+1}>
                                                {x+1}
                                            </option>
                                        ))}
                                    </Form.Control>
                            </Col>
                        </Row>
                    </ListGroupItem>
                )}
                <ListGroupItem>
                    <Button className="btn-block" type="button" disabled={product.countInStock === 0} onClick={addToCartHandler}>
                    Add To Cart
                    </Button>
                </ListGroupItem>
            </ListGroup>
        </Card>
        </Col>

    </Row>
    </>) }
    
    </>
  )
}

export default ProductScreen