import { React, useReducer, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import LoadingBox from '../components/LoadingBox.jsx';
import MessageBox from '../components/MessageBox.jsx';
import Product from '../components/Product.jsx';
import Rating from '../components/Rating.jsx';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true};
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: '$1 to $50',
    value: '1-50'
  },
  {
    name: '$51 to $200',
    value: '51-200'
  },
  {
    name: '$201 to $1000',
    value: '201-1000'
  }
];

const ratings = [
  {
    name: '4 stars and up',
    rating: 4
  },
  {
    name: '3 stars and up',
    rating: 3
  },
  {
    name: '2 stars and up',
    rating: 2
  },
  {
    name: '1 star and up',
    rating: 1
  },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const category = searchParams.get('category') || 'all';
  const query = searchParams.get('query') || 'all';
  const price = searchParams.get('price') || 'all';
  const rating = searchParams.get('rating') || 'all';
  const order = searchParams.get('order') || 'newest';
  const page = searchParams.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`);
    
      if (response.status >= 400 && response.status < 600) {
        dispatch({ type: 'FETCH_FAIL', payload: error });
      } else {
        const data = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      }
    };

    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`/api/products/categories`);

      if (response.status >= 400 && response.status < 600) {
        console.log(response.status)
      } else {
        const data = await response.json();
        setCategories(data);
      }
    };

    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = filter => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;

    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`
  }

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <div>
            <h3>Department</h3>
            <ul>
              <li>
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Any
                </Link>
              </li>
              {categories.map(c => (
                <li key={c}>
                  <Link
                    className={c === category ? 'text-bold': ''}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={getFilterUrl({ price: 'all' })}
                >
                  Any
                </Link>
              </li>
              {prices.map(p => (
                <li key={p.value}>
                  <Link
                    className={p.value === price ? 'text-bold' : ''}
                    to={getFilterUrl({ price: p.value })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map(r => (
                <li key={r.name}>
                  <Link
                    className={`${r.rating}` === `${rating}` ? 'text-bold': ''}
                    to={getFilterUrl({ rating: r.rating })}
                  >
                    <Rating caption={' & up'} rating={r.rating} />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className={rating === 'all' ? 'text-bold' : ''}
                  to={getFilterUrl({ rating: 'all' })}
                >
                  <Rating caption={' & up'} rating={0} />
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{Error}</MessageBox>
          ): (
            <>
            <Row className="justify-content-bewtween mb-3">
              <Col md={6}>
                <div>
                  {countProducts === 0 ? 'No': countProducts} Results
                  {query !== 'all' && ' : ' + query}
                  {category !== 'all' && ' : ' + category}
                  {price !== 'all' && ' : ' + price}
                  {rating !== 'all' && ' : ' + rating}
                  {query !== 'all' ||
                  category !== 'all' ||
                  rating !== 'all' ||
                  price !== 'all' ? (
                    <Button
                      variant="light"
                      onClick={() => navigate('/search')}
                    >
                      <i className="fas fa-tmes-circle"></i>
                    </Button>
                  ) : null}
                </div>
              </Col>
              <Col className="text-end">
                Sort by{' '}
                <select
                  value={order}
                  onChange={e => {
                    navigate(getFilterUrl({ order: e.target.value }))
                  }}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="lowest">Price: Low to High</option>
                  <option value="highest">Price: High to Low</option>
                  <option value="topRated">Avg. Customer Reviews</option>
                </select>
              </Col>
            </Row>
            {products.length === 0 && (<MessageBox>No Product Found</MessageBox>)}
            <Row>
              {products.map(product => (
                <Col sm={6} lg={4} className="mb-3" key={product._id}>
                  <Product product={product}></Product>
                </Col>
              ))}
            </Row>
            <div>
              {[ ...Array(pages).keys()].map(x => (
                <LinkContainer
                  key={x + 1}
                  className="mx-1"
                  to={getFilterUrl({ page: x + 1 })}
                >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                </LinkContainer>
              ))}
            </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  )
};

export default SearchPage;