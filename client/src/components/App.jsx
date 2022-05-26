import { React, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container, Nav, Badge, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from '../store.js';

import Home from './Home.jsx';
import ProductPage from './ProductPage.jsx';
import CartPage from './CartPage.jsx';
import SignInPage from './SignInPage.jsx';


const App = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const handleSignOut = () => {
    ctxDispatch({ type: 'USER_SIGNOUT'});
    localStorage.removeItem('userInfo');
  }

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>sailboat</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
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
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/signin" element={<SignInPage />} />
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
