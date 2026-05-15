import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import CartPage from "../features/cart/pages/CartPage";
import CheckoutPage from "../features/checkout/pages/CheckoutPage";
import AdminHomePage from "../features/admin/pages/AdminHomePage";
import AdminProductsPage from "../features/admin/pages/AdminProductsPage";
import CreateProductPage from "../features/admin/pages/CreateProductPage";
import ProductDetailPage from "../features/products/pages/ProductDetailPage";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/HomePage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentFailedPage from "../pages/PaymentFailedPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import AdminRoute from "./AdminRoute";

const ProductsPage = lazy(() => import("../features/products/pages/ProductsPage"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />

        <Route
          path="products"
          element={
            <Suspense fallback={<p>Loading...</p>}>
              <ProductsPage />
            </Suspense>
          }
        />

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

        <Route
          path="login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="payment-success" element={<PaymentSuccessPage />} />
        <Route path="payment-failed" element={<PaymentFailedPage />} />
      </Route>

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
