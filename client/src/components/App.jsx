import { React, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container, Nav, Badge, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from '../store.js';

import Home from '../pages/Home.jsx';
import ProductPage from '../pages/ProductPage.jsx';
import CartPage from '../pages/CartPage.jsx';
import SignInPage from '../pages/SignInPage.jsx';
import ShippingPage from '../pages/ShippingPage.jsx';
import SignUpPage from '../pages/SignUpPage.jsx';
import PaymentPage from '../pages/PaymentPage.jsx';
import PlaceOrderPage from '../pages/PlaceOrderPage.jsx';
import OrderPage from '../pages/OrderPage.jsx';
import OrderHistoryPage from '../pages/OrderHistoryPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import SearchBar from './SearchBar.jsx';
import SearchPage from '../pages/SearchPage.jsx';

const App = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const handleSignOut = () => {
    ctxDispatch({ type: 'USER_SIGNOUT'});
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin'
  }

  const [sidebarIsOpen, setSidebarIsOpen] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`/api/products/categories`);
      
      if (response.status >= 400 && response.status < 600) {
        // alert('Error fetching categories');
      } else {
        const data = await response.json();
        setCategories(data);
      }
    };

    fetchCategories();
  }, [])

  return (
    <BrowserRouter>
      <div className={sidebarIsOpen
        ? "d-flex flex-column site-container active-cont"
        : "d-flex flex-column site-container"
      }
      >
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}  
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>sailboat</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBar />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                      <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                        <LinkContainer to="/profile">
                          <NavDropdown.Item>User Profile</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/orderHistory">
                          <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <Link
                          className="dropdown-item"
                          to="#signout"
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </Link>
                      </NavDropdown>
                    ) : (
                      <Link className="nav-link" to="/signin">
                        Sign In
                      </Link>
                    )
                  }
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div className={sidebarIsOpen
          ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
          : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
        }>
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map(category => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(0)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>  
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route path="/order/:id" element={<OrderPage/>} />
              <Route path="/orderhistory" element={<OrderHistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/search" element = {<SearchPage />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All Rights Reservered</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
