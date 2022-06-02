import { React, useEffect, useReducer } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

import Product from '../components/Product.jsx';
import LoadingBox from '../components/LoadingBox.jsx';
import MessageBox from '../components//MessageBox.jsx';

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
      const response = await fetch(`/api/products`);
      const data = await response.json();
      console.log(data)
      
      if (response.status >= 400 && response.status < 600) {
        dispatch({ type: 'FETCH_FAIL', payload: data })
      } else {
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
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
              <LoadingBox />
              :
              error ? <MessageBox variant="danger">{error}</MessageBox>
                :
                <Row>
                  {products.map(product => (
                    <Col sm={6} md={4} lg={3} className="mb-3" key={product.slug}>
                      <Product product={product} />
                    </Col>
                  ))}
                </Row>
            }
          </div>
    </div>
  )
}

export default Home;