import { React, useReducer, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Store } from '../store.js';
import { Helmet } from 'react-helmet-async';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}

const OrderPage = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: orderId } = params;

  const [{ loading, error, order, successPay, loadingPay }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          }
        ]
      })
      .then(orderID => orderID)
  }

  const onApprove = (data, actions) => {
    return actions.order.capture()
      .then(async (details) => {
        try {
          dispatch({ type: 'PAY_REQUEST' });
          const response = await fetch(`/api/orders/${order._id}/pay`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${userInfo.token}`
            },
            body: details
          });
          const data = await response.json();
          dispatch({ type: 'PAY_SUCCESS', payload: data });

          alert('Order is paid');
        } catch (err) {
          dispatch({type: 'PAY_FAIL', payload: err})
          alert(err);
        }
      })
  }

  const onError = err => {
    alert(err);

  }

  useEffect(() => {
    const fetchOrder = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();

      if (response.status >= 400 && response.status < 600) {
        dispatch({ type: 'FETCH_FAIL', payload: data })
      } else {
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      }
    }

    if (!userInfo) {
      return navigate('/login');
    }

    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) dispatch({ type: 'PAY_RESET' });
    } else {
      const loadPaypalScript = async () => {
        const response = await fetch('/api/keys/paypal', {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        });
        const data = await response.text();

        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': data,
            currency: 'USD'
          }
        });

        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      }

      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay])

  return (
    loading ? (
      <LoadingBox />
    ) : (
      error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <Helmet>
            <title>Order {orderId}</title>
          </Helmet>
          <h1 className="my-3"> Order {orderId}</h1>
          <Row>
            <Col md={8}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Shipping</Card.Title>
                  <Card.Text>
                    <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                    <strong>Address:</strong> {order.shippingAddress.address},{' '}
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.postalCode},{' '}
                    {order.shippingAddress.country}
                  </Card.Text>
                  {order.isDelivered ? (
                    <MessageBox variant="success">
                      Delivered at {order.deliveredAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Delivered</MessageBox>
                  )}
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Payment</Card.Title> 
                  <Card.Text>
                    <strong>Method:</strong> {order.paymentMethod}
                  </Card.Text>
                  {order.isPaid ? (
                    <MessageBox variant="success">
                      Paid at {order.paidAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Paid</MessageBox>
                  )}
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Items</Card.Title>
                  <ListGroup variant="flush">
                    {order.orderItems.map(item => (
                      <ListGroup.Item key={item._id}>
                        <Row className="align-items-center">
                          <Col md={6}>
                            <img
                              src={`/${item.image}`}
                              alt={item.name}
                              className="img=fluid rounded img-thumbnail"
                            ></img>{' '}
                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                          </Col>
                          <Col md={3}>
                            <span>{item.quantity}</span>
                          </Col>
                          <Col md={3}>${item.price}</Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Order Summary</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Items</Col>
                        <Col>${order.itemsPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>${order.shippingPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Tax</Col>
                        <Col>${order.taxPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col><strong>Order Total</strong></Col>
                        <Col><strong>${order.totalPrice.toFixed(2)}</strong></Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                  {!order.isPaid && (
                    <ListGroup.Item>
                      {isPending ? (
                        <LoadingBox />
                      ) : (
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          />
                        </div>
                      )}
                      {loadingPay && <LoadingBox />}
                    </ListGroup.Item>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )
    )
  )
};

export default OrderPage;