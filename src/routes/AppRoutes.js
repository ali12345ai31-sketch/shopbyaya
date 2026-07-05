import { Routes, Route } from "react-router-dom";

// =========================
// 🌐 PUBLIC PAGES
// =========================
import Home from "../pages/Home";
import Login from "../pages/Login";
import SearchResults from "../pages/SearchResults";
import ProductDetails from "../pages/ProductDetails";

// =========================
// 👤 USER PAGES
// =========================
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import Favorites from "../pages/Favorites";
import OrderTracking from "../pages/OrderTracking";
import UserComments from "../pages/UserComments";

// =========================
// 👑 ADMIN PAGES
// =========================
import AdminLayout from "../pages/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminOrders from "../pages/AdminOrders";
import AdminAnalytics from "../pages/AdminAnalytics";
import AdminProducts from "../pages/AdminProducts";
import AdminAddProduct from "../pages/AdminAddProduct";
import AdminEditProduct from "../pages/AdminEditProduct";
import AdminReviews from "../pages/AdminReviews";
import AdminComments from "../pages/AdminComments";

// =========================
// 🔐 PROTECTION
// =========================
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🌐 PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/product/:id" element={<ProductDetails />} />

      {/* 👤 USER ROUTES */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/order/:id" element={<OrderTracking />} />
      <Route path="/comments" element={<UserComments />} />

      {/* 👑 ADMIN ROUTES (PROTECTED) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<AdminAddProduct />} />
        <Route path="products/:id" element={<AdminEditProduct />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="comments" element={<AdminComments />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
    </Routes>
  );
}
