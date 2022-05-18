import { React, useEffect, useReducer, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Card, Badge, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Store } from '../store.js';

import Rating from './Rating.jsx';
import LoadingBox from './LoadingBox.jsx';
import MessageBox from './MessageBox.jsx';

const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {...state, product: action.payload, loading: false};
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload};
    default:
      return state;
  }
}

const ProductPage = () => {
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    product: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      const response = await fetch(`/api/products/slug/${slug}`);
      const data = await response.json();
      
      if (response.status >= 400 && response.status < 600) {
        dispatch({ type: 'FETCH_FAIL', payload: data.message })
      } else {
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      }
    }

    fetchProducts();
  }, [slug])

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const addToCart = () => {
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: {...product, quantity: 1}
    });
  }

  return loading ? (
    <LoadingBox />
    ) : error ? (
      <MessageBox variant="danger">{error}</MessageBox>
    ) : (
      <div>
        <Row>
          <Col md={6}>
            <img className="img-large" src={`/${product.image}`} alt={product.name}></img>
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <h1>{product.name}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating rating={product.rating} numReviews={product.numReviews} />
              </ListGroup.Item>
              <ListGroup.Item>
                Price : ${product.price}
              </ListGroup.Item>
              <ListGroup.Item>
                Description:
                <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>${product.price}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 
                          <Badge bg="success">In Stock</Badge>
                          :
                          <Badge bg="danger">Unavailable</Badge>
                        }
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button onClick={addToCart} variant="primary">
                          Add to Cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    )
};

export default ProductPage;