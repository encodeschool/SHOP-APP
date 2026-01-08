import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppBar from './components/AppBar';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';
import NewsletterFooter from './components/NewsletterFooter';
import { LoadingProvider } from './contexts/LoadingContext';
import ProductDetail from './pages/ProductDetail';
import { LanguageProvider } from './contexts/LanguageContext';
import CartView from './pages/CartView';
import Checkout from './pages/Checkout';
import ProtectedRoute from './services/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PrivateRoute from './api/PrivateRoutes';
import CategoryPage from './pages/CategoryPage';
import OrderConfirmation from './pages/OrderConfirmation';
import FilterPage from './pages/FilterPage';
import Compare from './pages/Compare';
import Favorites from './pages/Favorites';
import TrackOrder from './pages/TrackOrder';
import {ToastContainer} from 'react-toastify';
import SearchResults from './pages/SearchResults';
import About from './pages/About';
import Quality from './pages/Quality';
import Delivery from './pages/Delivery';
import Contact from './pages/Contact';
import DeleteAccount from './pages/DeleteAccount';
import AiHelpScreen from './pages/AiHelpScreen';

function App() {
    return (
        <LoadingProvider>
            <LanguageProvider>
                <div className="flex flex-col min-h-screen">
                    <AppBar />
                    <CategoryBar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path='/cart' element={< CartView />} />
                            <Route
                                path="/checkout"
                                element={
                                <ProtectedRoute>
                                    <Checkout />
                                </ProtectedRoute>
                                }
                            />
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
                            <Route path="/search" element={<SearchResults />} />
                            <Route path="/category/:categoryId" element={<CategoryPage />} />
                            <Route path='/about' element={<About />} />
                            {/* <Route path='/terms' element={<TermCondition />} /> */}
                            <Route path='/order-confirmation' element={< OrderConfirmation />} />
                            <Route path="/filtered" element={<FilterPage />} />
                            <Route path='/quality' element={<Quality />} />
                            <Route path='/delivery' element={<Delivery />} />
                            <Route path='/ai' element={<AiHelpScreen />} />
                            <Route path="/compare" element={<Compare />} />
                            <Route path="/delete-account" element={<DeleteAccount />} />
                            {/* <Route path="/search" element={<SearchResults />} /> */}
                            
                            <Route path='/favorites' element={< Favorites />} />
                            <Route path='/track' element={<TrackOrder />} />
                            <Route path='/contact' element={<Contact />} />
                        </Routes>
                    </main>
                    <NewsletterFooter />
                    <Footer />
                    <ToastContainer position="top-right" autoClose={2000} />
                </div>
            </LanguageProvider>
        </LoadingProvider>
    )
}

export default App;