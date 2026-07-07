import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated } from "./lib/auth";

// Pages Imports
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import AddProducts from "./pages/AddProducts";
import Categories from "./pages/Categories";
import DealsPromotions from "./pages/DealsPromotions";
import FeaturedProducts from "./pages/FeaturedProducts";
import Customers from "./pages/Customers";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import ContactMessages from "./pages/ContactMessages";
import StaticPages from "./pages/StaticPages";
import EditProduct from "./pages/EditProduct";
import ProductView from "./pages/ProductView";
import HeroBanner from "./pages/HeroBanner";
import DealsOfDay from "./pages/DealsOfDay";
import PopularProduct from "./pages/PopularProduct";
import OrderDetails from "./pages/OrderDetails";
import Coupon from "./pages/Coupon";
import Admin from "./pages/Admin";
import EmailCampaign from "./pages/EmailCampaign";
import FacebookInbox from "./pages/Facebook";
import InstagramInbox from "./pages/Instagram";
import WhatsAppInbox from "./pages/Whatsapp";
import Blogs from './pages/Blogs'
import BlogCreate from './pages/CreateBlogPage'
import ViewBlogs from "./pages/ViewBlogs";
import EditBlogs from "./pages/EditBlogs";

// Helper component to prevent logged-in users from seeing login page
const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/admin/overview" replace />
  );
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* 1. LOGIN ROUTE (Public) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute> 
            }
          />

          {/* 2. DEFAULT REDIRECT */}
          <Route path="/" element={<Navigate to="/admin/overview" replace />} />

          {/* 3. PROTECTED ADMIN ROUTES */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="overview" element={<Dashboard />} />
              <Route path="admin-managemenet" element={<Admin />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="products" element={<Products />} />
              <Route path="addproducts" element={<AddProducts />} />
              <Route path="categories" element={<Categories />} />
              {/* <Route path="dealpromotion" element={<DealsPromotions />} /> */}
              {/* <Route path="features" element={<FeaturedProducts />} /> */}
              <Route path="customer" element={<Customers />} />
              <Route path="review" element={<Reviews />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="blogs/create" element={<BlogCreate />} />
              <Route path="blogs/view/:id" element={<ViewBlogs />} />
              <Route path="blogs/edit/:id" element={<EditBlogs />} />
              {/* <Route path="settings" element={<Settings />} /> */}
              {/* <Route path="contactmessages" element={<ContactMessages />} /> */}
              {/* <Route path="staticpage" element={<StaticPages />} /> */}
              {/* <Route path="hero-banner" element={<HeroBanner />} /> */}
              {/* <Route path="deals-of-day" element={<DealsOfDay />} /> */}
              {/* <Route path="popular-products" element={<PopularProduct />} /> */}
              <Route path="coupons" element={<Coupon />} />
              {/* <Route path="email-campaign" element={<EmailCampaign />} /> */}

              {/* Nested Edit Route */}
              <Route path="product/edit/:id" element={<EditProduct />} />
              <Route path="product/view/:id" element={<ProductView />} />
              {/* <Route path="/admin/leads/facebook" element={<FacebookInbox />} />
              <Route path="/admin/leads/instagram" element={<InstagramInbox />} />
              <Route path="/admin/leads/whatsapp" element={<WhatsAppInbox />} /> */}
            </Route>
          </Route>

          {/* 4. 404 - NOT FOUND */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
