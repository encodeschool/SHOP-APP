import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppBar from './components/AppBar';
import SearchBar from './components/SearchBar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <AppBar />
        {/* <Navbar /> */}
        <SearchBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            {/* Add other routes like /cart, /favorites, /login, etc. */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;