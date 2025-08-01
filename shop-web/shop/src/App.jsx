import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppBar from './components/AppBar';
import SearchBar from './components/SearchBar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';

import CartView from './pages/CartView';
import NewsletterFooter from './components/NewsletterFooter';

function App() {
  return (
      <div className="flex flex-col min-h-screen">
        <AppBar />
        {/* <Navbar /> */}
        <SearchBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path='/cart' element={< CartView />} />
            <Route path='/checkout' element={<Checkout />} />
            {/* <Route path="/category/:id" element={<CategoryPage />} /> */}
            {/* Add other routes like /cart, /favorites, /login, etc. */}
          </Routes>
        </main>
        <NewsletterFooter />
        <Footer />
      </div>
  );
}

export default App;