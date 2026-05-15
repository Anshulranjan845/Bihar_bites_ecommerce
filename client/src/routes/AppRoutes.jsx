import { Route, Routes } from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";

import RegisterPage from "../features/auth/pages/RegisterPage";

import HomePage from "../pages/HomePage";

import AdminDashboard from "../pages/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";

import AdminRoute from "./AdminRoute";

const ProductsPage = lazy(
  () => import("../features/products/pages/ProductsPage"),
);

import ProductDetailPage from "../features/products/pages/ProductDetailPage";
import CartPage from "../features/cart/pages/CartPage";

import CheckoutPage from "../features/checkout/pages/CheckoutPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";

import PaymentFailedPage from "../pages/PaymentFailedPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

import AdminLayout from "../layouts/AdminLayout";

import AdminHomePage from "../features/admin/pages/AdminHomePage";

import AdminProductsPage from "../features/admin/pages/AdminProductsPage";

import CreateProductPage from "../features/admin/pages/CreateProductPage";
import MainLayout from "../layouts/MainLayout";
import Container from "../components/Container";
import { lazy, Suspense } from "react";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />

        <Route path="products" element={<ProductsPage />} />

        <Route path="products/:slug" element={<ProductDetailPage />} />

        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route path="login" element={<LoginPage />} />

        <Route path="register" element={<RegisterPage />} />

        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Route>


      <Route
        path="/products"
        element={
          <Suspense fallback={<p>Loading...</p>}>
            <ProductsPage />
          </Suspense>
        }
      />

      <Route path="/products/:slug" element={<ProductDetailPage />} />

      <Route path="/payment-success" element={<PaymentSuccessPage />} />

      <Route path="/payment-failed" element={<PaymentFailedPage />} />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHomePage />} />

        <Route path="products" element={<AdminProductsPage />} />

        <Route path="products/create" element={<CreateProductPage />} />
      </Route>
    </Routes>
  );
}
