import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Home from './Home.jsx';
import Product from './Product.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Link to="/">Sailboat</Link>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<Product />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
