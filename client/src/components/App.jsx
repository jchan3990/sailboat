import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Home from './Home.jsx';
import Product from './Product.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>sailboat</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:slug" element={<Product />} />
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
