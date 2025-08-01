import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppBar from './components/AppBar';
import SearchBar from './components/SearchBar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import About from './pages/About';

import CartView from './pages/CartView';
import CategoryPage from './pages/CategoryPage';
import TermCondition from './pages/termCondition';
import NewsletterFooter from './components/NewsletterFooter';
import FilterPage from './pages/FilterPage';
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from './api/PrivateRoutes';
import Profile from './pages/Profile';
import {ToastContainer} from 'react-toastify';

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
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path='/about' element={<About />} />
            <Route path='/terms' element={<TermCondition />} />
            {/* <Route path="/filtered" element={<FilterPage />} /> */}
            <Route path='/login' element={< Login />} />
            <Route path='/register' element={< Register />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            {/* <Route path="/category/:id" element={<CategoryPage />} /> */}
            {/* Add other routes like /cart, /favorites, /login, etc. */}
          </Routes>
        </main>
        <NewsletterFooter />
        <Footer />
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
  );
}

export default App;