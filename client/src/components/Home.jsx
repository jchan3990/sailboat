import { React, useEffect, useReducer } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

import Product from './Product.jsx';

const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {...state, products: action.payload, loading: false};
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload};
    default:
      return state;
  }
}

const Home = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message })
      }
    }

    fetchProducts();
  }, [])

  return (
    <div>
      <Helmet>
        <title>Sailboat</title>
      </Helmet>
      <h1>Featured Products</h1>
          <div className="products">
            {loading 
              ? 
              (<div>Loading...</div>)
              :
              error 
                ? (<div>{error}</div>)
                :
                (<Row>
                  {products.map(product => (
                    <Col sm={6} md={4} lg={3} className="mb-3" key={product.slug}>
                      <Product product={product} />
                    </Col>
                  ))}
                </Row>
            )}
          </div>
    </div>
  )
}

export default Home;