import { React, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, ListGroup, Button } from 'react-bootstrap';
import { Store } from '../Store.js';
import { Link } from 'react-router-dom';

import CheckoutSteps from '../components/CheckoutSteps.jsx';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: {cartItems, shippingAddress, paymentMethod } } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
  const shippingPrice = itemsPrice > 100 ? round2(0) : round2(10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const handlePlaceOrder = async() => {

  }

  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
    
  }, [paymentMethod, navigate])

  return (
    <div>
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 step4 />
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {shippingAddress.fullName} <br />
                <strong>Address:</strong> {shippingAddress.address}, {' '}
                {shippingAddress.city}, {' '}
                {shippingAddress.postalCode}, {' '}
                {shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment Method</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cartItems.map(item => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          className="img-fluid rounded img-thumbnail"
                          src={item.image}
                          alt={item.name}
                          ></img> {' '}
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}><span>{item.quantity}</span></Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col><strong>Order Total</strong></Col>
                    <Col><strong>${totalPrice.toFixed(2)}</strong></Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={cartItems.length === 0}
                    >
                      Place Order
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
};

export default PlaceOrderPage;