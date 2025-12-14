// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import SearchPage from './pages/SearchPage';
import AllProductsPage from './pages/AllProductsPage';
import Address from './pages/Address';
import Payment from './pages/Payment';
import OrderDetails from './pages/OrderDetails';
import LegalPage from './pages/LegalPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<AllProductsPage />} />
            <Route path="shoes" element={<AllProductsPage initialCategory="shoes" />} />
            <Route path="shoes/loafers" element={<AllProductsPage initialCategory="loafers" />} />
            <Route path="shoes/boots" element={<AllProductsPage initialCategory="boots" />} />
            <Route path="shoes/sneakers" element={<AllProductsPage initialCategory="sneakers" />} />
            <Route path="shoes/sandals" element={<AllProductsPage initialCategory="sandals" />} />
            <Route path="apparel" element={<Navigate to="/products?category=t-shirts" replace />} />
            <Route path="product/:slug" element={<ProductDetails />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout/address" element={<Address />} />
            <Route path="checkout/payment" element={<Payment />} />
            <Route path="orders" element={<OrderDetails />} />
            <Route path="legal" element={<Navigate to="/legal/privacy-policy" replace />} />
            <Route path="legal/:section" element={<LegalPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="faq" element={<ContactPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="product" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
