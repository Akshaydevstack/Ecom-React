import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  LogIn,
  Search,
  X,
  User,
  Heart,
  PackageCheck,
} from "lucide-react";
import { AuthContext } from "../Context/AuthProvider";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const location = useLocation();
  const currentPath = location.pathname;

  const { user, logout, cartlength } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${searchTerm}`);
    setMobileSearchOpen(false);
  };

  const handillogout = () => {
    const result = confirm("Do you want to logout");
    result ? logout() : navigate("/");
  };
  return (
    <nav className="bg-black shadow-md p-3 overflow-hiden">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-yellow-400">
          MobileMart
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/"
            className={`${
              currentPath === "/"
                ? "text-yellow-400 font-semibold"
                : "text-white"
            } hover:text-yellow-400 transition`}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className={`${
              currentPath === "/shop"
                ? "text-yellow-400 font-semibold"
                : "text-white"
            } hover:text-yellow-400 transition`}
          >
            Shop
          </Link>
          <Link
            to="/cart"
            className={`relative flex items-center ${
              currentPath === "/cart"
                ? "text-yellow-400 font-semibold"
                : "text-white"
            } hover:text-yellow-400 transition`}
          >
            <ShoppingCart className="w-5 h-5 mr-1" /> Cart
            {cartlength > 0 && (
              <span className="absolute -top-2 -right-4  text-white text-[13px] px-1 py-[1px] rounded-full">
                {cartlength}
              </span>
            )}
          </Link>

          {user && (
            <Link
              to="/wishlist"
              className={`flex items-center ${
                currentPath === "/wishlist"
                  ? "text-yellow-400 font-semibold"
                  : "text-white"
              } hover:text-yellow-400 transition`}
            >
              <Heart className="w-5 h-5 mr-1" /> Wishlist
            </Link>
          )}

          {user && (
            <Link
              to="/orders"
              className={`flex items-center ${
                currentPath === "/orders"
                  ? "text-yellow-400 font-semibold"
                  : "text-white"
              } hover:text-yellow-400 transition`}
            >
              <PackageCheck className="w-5 h-5 mr-1" /> Orders
            </Link>
          )}

          {user ? (
            <>
              <span
                onClick={() => navigate("/user")}
                className="text-yellow-400 flex items-center hover:text-yellow-300 hover:underline cursor-pointer"
              >
                <User className="w-5 h-5 mr-1" /> {user.name}
              </span>
              <button
                onClick={handillogout}
                className="flex items-center px-4 py-2 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`flex items-center px-4 py-2 rounded-full transition ${
                currentPath === "/login"
                  ? "bg-yellow-400 text-black"
                  : "bg-yellow-400 text-black hover:bg-yellow-300"
              }`}
            >
              <LogIn className="w-5 h-5 mr-2" /> Login
            </Link>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="md:hidden flex items-center space-x-3">
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-2 rounded-full hover:bg-gray-800"
          >
            <Search className="w-6 h-6 text-yellow-400" />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-800"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-yellow-400" />
            ) : (
              <svg
                className="w-6 h-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 shadow-md">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`${
                currentPath === "/"
                  ? "text-yellow-400 font-semibold"
                  : "text-white"
              } hover:text-yellow-400 transition`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className={`${
                currentPath === "/shop"
                  ? "text-yellow-400 font-semibold"
                  : "text-white"
              } hover:text-yellow-400 transition`}
            >
              Shop
            </Link>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={`relative flex items-center ${
                currentPath === "/cart"
                  ? "text-yellow-400 font-semibold"
                  : "text-white"
              } hover:text-yellow-400 transition`}
            >
              <ShoppingCart className="w-5 h-5 mr-1" /> Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user && (
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center ${
                  currentPath === "/wishlist"
                    ? "text-yellow-400 font-semibold"
                    : "text-white"
                } hover:text-yellow-400 transition`}
              >
                <Heart className="w-5 h-5 mr-1" /> Wishlist
              </Link>
            )}
            {user && (
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center ${
                  currentPath === "/orders"
                    ? "text-yellow-400 font-semibold"
                    : "text-white"
                } hover:text-yellow-400 transition`}
              >
                <PackageCheck className="w-5 h-5 mr-1" /> Orders
              </Link>
            )}

            {user ? (
              <>
                <span onClick={() => navigate("/user")} className="text-yellow-400 flex items-center hover:text-red-300 hover:underline cursor-pointer">
                  <User className="w-5 h-5 mr-1" /> {user.name}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-2 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-2 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition"
              >
                <LogIn className="w-5 h-5 mr-2" /> Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-black p-4 border-t border-gray-800 shadow-md">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              placeholder="Search smartphones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-l-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black px-4 rounded-r-full hover:bg-yellow-300 transition"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}
