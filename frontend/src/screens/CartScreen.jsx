import { useNavigate, Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem} from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../components/Message.jsx';
import '../assets/styles/index.css';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart; 

    const addToCartHandler = async (product,qty) => {
        dispatch(addToCart({...product,qty}));
    }
    
    const removeFromCartHandler = async (id) => {
        dispatch(removeFromCart(id));
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    }

  return (
    <Row>
        <Col md={8}>
        <h2 style={{marginBottom:'20px'}}>Your Cart</h2>
        {cartItems.length === 0 ? (
            <Message>
                Your Cart is Empty <Link to='/'>Go Back</Link>
            </Message>
        ) : (
            <ListGroup variant='flush'>
                {cartItems.map((item) => (
                    <ListGroupItem key={item._id}>
                        <Row>
                            <Col md={2}>
                            <Link to={`/product/${item._id}`}><Image src={item.image} alt={item.name} fluid rounded/></Link>
                            </Col>
                            <Col md={4}>
                            <Link style={{textDecoration:'none'}} to={`/product/${item._id}`}>{item.name}</Link>
                            </Col>
                            <Col md={2}>₹ {item.price.toLocaleString()}</Col>
                            <Col md={2}>
                            <Form.Control
                                    as ='select'
                                    value = {item.qty}
                                    onChange={(e) => addToCartHandler(item,Number(e.target.value))} style={{width:'5vw', backgroundColor:'lightgrey'}}>
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x+1} value={x+1}>
                                                {x+1}
                                            </option>
                                        ))}
                                        
                                    </Form.Control>
                            </Col>
                            <Col md={2}>
                            <Button type='button' variant='light' className='custom-button' onClick={() => removeFromCartHandler(item._id)}>
                                <FaTimes className='fa-times'/>
                            </Button>
                            </Col>
                        </Row>
                    </ListGroupItem>
                ))}
            </ListGroup>
        ) }
        </Col>
        <Col md={4}>
        <Card>
            <ListGroup>
                <ListGroupItem>
                    <h3>SubTotal ({cartItems.reduce((acc,item) => acc+item.qty,0)}) Items</h3>
                    ₹ {cartItems.reduce((acc,item) => acc+item.qty * item.price, 0).toFixed(2)}
                </ListGroupItem>
                <ListGroupItem>
                    <Button className='btn-block' type='button' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                        Proceed To Checkout
                    </Button>
                </ListGroupItem>
            </ListGroup>
        </Card>
        </Col>

    </Row>
  )
}

export default CartScreen