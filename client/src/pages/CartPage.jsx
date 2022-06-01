import { React, useContext } from 'react';
import { Row, Col, ListGroup, Button, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store.js';

import MessageBox from '../components/MessageBox.jsx';

const CartPage = () => {
  const navigate = useNavigate();
  
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { cartItems } } = state;

  const updateCart = async (item, quantity) => {
    const response = await fetch(`/api/products/${item._id}`);
    const data = await response.json();

    if (data.countInStock < quantity) {
      window.alert('Sorry, product is out of stock');
      return;
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: {...item, quantity: quantity}
    });
  }

  const removeItem = item => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  }

  const handleCheckout = () => {
    navigate('/signin?redirect=/shipping');
  }

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox> 
          ) : (
            <ListGroup>
              {cartItems.map(item => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img className="img-fluid rounded img-thumbnail" src={item.image} alt={item.name}></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        disabled={item.quantity === 1}
                        onClick={() => updateCart(item, item.quantity - 1)}
                        >
                        <i className="fas fa-minus-circle"></i>
                      </Button> {' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        disabled={item.quantity === item.countInStock}
                        onClick={() => updateCart(item, item.quantity + 1)}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button 
                        variant="light"
                        onClick={() => removeItem(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      disabled={cartItems.length === 0}
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CartPage;