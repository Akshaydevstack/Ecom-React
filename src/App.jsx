import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./Component/Navbar";
import RegisterPage from "./pages/RegisterPage";
import Footer from "./Component/Footer";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BuyNowPage from "./pages/BuyNowPage";
import OrderConfirmation from "./pages/OrderConfirmationpage";
import AuthProvider from "./Context/AuthProvider";
import WishlistPage from "./pages/WishlistPage";
import ViewOrders from "./pages/ViewOrdersPage";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./Routes/ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="dark"
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/cart/" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/buynow" element={<BuyNowPage />} />
              <Route
                path="/cart/buynow/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/orders" element={<ViewOrders />} />
            </Route>
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
