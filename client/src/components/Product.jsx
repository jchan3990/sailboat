import { React, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { Store } from '../store.js';

import Rating from './Rating.jsx';

const Product = ({ product }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { cartItems } } = state;

  const addToCart = async (item) => {
    const itemExists = cartItems.find(x => x._id === product._id);
    const quantity = itemExists ? itemExists.quantity + 1 : 1;
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

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img className="card-img-top" src={`/${product.image}`} alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ?
          <Button variant='light' disabled>Out of Stock</Button>
          :
          <Button onClick={() => addToCart(product)}>Add to Cart</Button>
        }
      </Card.Body>
    </Card>
  )
}

export default Product;