import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./Context/AuthProvider";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { LoaderPage } from "./Component/LoaderPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserRoutes from "./Routes/UserRoutes";
import AdminDashboard from "./AdminSection/AdminDashBoard";
import AdminRoutes from "./Routes/AdminRoute";
import UserLayout from "./Layouts/UserLayout";
import UserManagement from "./AdminSection/pages/UserManagementPage";
import AdminLayout from "./Layouts/AdminLayout";


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
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 1000,
            style: { marginTop: "100px" },
          }}
        />
        <Suspense fallback={<LoaderPage />}>
          <Routes>
            {/* <Route element={<AdminLayout/>}> */}
            <Route element={<AdminRoutes />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="UserMagagement" element={<UserManagement/>}/>
            </Route>
            {/* </Route> */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route element={<UserRoutes />}>
                <Route path="/user" element={<UserProfilePage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/buynow" element={<BuyNowPage />} />
                <Route
                  path="/orderconfirmation"
                  element={<OrderConfirmation />}
                />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/orders" element={<ViewOrders />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
