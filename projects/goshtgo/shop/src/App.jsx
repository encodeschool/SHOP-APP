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
{/*                             
                            <Route path="/category/:categoryId" element={<CategoryPage />} />
                            <Route path='/about' element={<About />} />
                            <Route path='/terms' element={<TermCondition />} />
                            <Route path='/order-confirmation' element={< OrderConfirmation />} />
                            <Route path="/filtered" element={<FilterPage />} />
                            
                            <Route path="/compare" element={<Compare />} />
                            <Route path="/search" element={<SearchResults />} />
                            
                            <Route path='/favorites' element={< Favorites />} />
                            <Route path='/track' element={<TrackOrder />} />
                            <Route path='/contacts' element={<Contact />} /> */}
                        </Routes>
                    </main>
                    <NewsletterFooter />
                    <Footer />
                </div>
            </LanguageProvider>
        </LoadingProvider>
    )
}

export default App;