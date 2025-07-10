import "./App.css";
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import AuthProvider from "./Context/AuthProvider";
import ProtectedRoute from "./Routes/UserRoutes";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { LoaderPage } from "./Component/LoaderPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserRoutes from "./Routes/UserRoutes";

const HomePage = lazy(() => import("./pages/HomePage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const BuyNowPage = lazy(() => import("./pages/BuyNowPage"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmationpage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const ViewOrders = lazy(() => import("./pages/ViewOrdersPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfile"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 1000,
              style: {
                marginTop: "100px",
              },
            }}
          />
          <Suspense fallback={<LoaderPage />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/cart/" element={<CartPage />} />
              <Route element={<UserRoutes />}>
                <Route path="/user" element={<UserProfilePage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/buynow" element={<BuyNowPage />} />
                <Route path="/orderconfirmation" element={<OrderConfirmation/>}/>
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/orders" element={<ViewOrders />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
