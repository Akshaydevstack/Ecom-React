import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthProvider";
import { toast } from "react-hot-toast";


export default function CartPage() {
  const { setcartlength } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCart = async () => {
      if (!storedUser) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:3000/users/${storedUser.userid}`
        );
        setCartItems(res.data.cart || []);
      } catch (err) {
        console.log("Error fetching cart:", err);
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  // Group same items
  const groupedItems = cartItems.reduce((acc, item) => {
    const existing = acc.find((i) => i.id === item.id);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ ...item, count: 1 });
    }
    return acc;
  }, []);

  // Calculate total
  const total = groupedItems.reduce((acc, item) => {
    const priceNumber = Number(String(item.price).replace(/₹|,/g, "").trim()) || 0;
    return acc + priceNumber * item.count;
  }, 0);
  const itemCount = cartItems.length;

  const updateCartOnServer = async (updatedCart) => {
    try {
      setcartlength(updatedCart.length);
      await axios.patch(`http://localhost:3000/users/${storedUser.userid}`, {
        cart: updatedCart,
      });
    } catch (err) {
      console.log("Error updating cart:", err);
      toast.error("Failed to update cart");
    }
  };

  const increaseQuantity = async (item) => {
    const updatedCart = [...cartItems, item];
    setCartItems(updatedCart);
    await updateCartOnServer(updatedCart);
    toast.success("Quantity increased");
  };

  const decreaseQuantity = async (id) => {
    const index = cartItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      const updatedCart = [...cartItems];
      updatedCart.splice(index, 1);
      setCartItems(updatedCart);
      await updateCartOnServer(updatedCart);
      toast.success("Quantity decreased");
    }
  };

  const removeAllOfItem = async (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    await updateCartOnServer(updatedCart);
    toast.success("Item removed from cart");
  };

  if (loading) {
    return (
      <div className="text-center text-white p-8">Loading your cart...</div>
    );
  }

  return (
    <div
      className="min-h-screen text-white py-12 px-4 relative"
      style={{
        background: "linear-gradient(135deg, rgba(26,30,43,0.95), rgba(46,68,99,0.95))",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-10 text-center text-yellow-400"
        >
          Your Cart {itemCount > 0 && `(${itemCount})`}
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {itemCount === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-8 bg-gray-900 bg-opacity-70 rounded-2xl border border-gray-700"
              >
                <p className="text-gray-400 text-xl mb-4">
                  Your cart is empty 🛒
                </p>
                <Link
                  to="/shop"
                  className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-full transition"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            ) : (
              groupedItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col md:flex-row items-center bg-gray-900 bg-opacity-70 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <img
                    onClick={() => navigate(`/product/${item.id}`)}
                    src={item.image[0]}
                    alt={item.name}
                    className="w-32 h-32 object-contain rounded-xl mb-4 md:mb-0 md:mr-6 cursor-pointer hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h3 className="text-2xl font-semibold">
                      {item.name}{" "}
                      {item.count > 1 && (
                        <span className="text-gray-400 text-lg">
                          (×{item.count})
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-400">{item.brand}</p>
                    <p className="text-yellow-400 font-bold text-xl">
                      ₹{item.price.toLocaleString()}
                    </p>

                    {/* Quantity buttons */}
                    <div className="flex justify-center md:justify-start mt-2 space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded-full"
                      >
                        -
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => increaseQuantity(item)}
                        className="px-4 py-1 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full"
                      >
                        +
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removeAllOfItem(item.id)}
                    className="mt-4 md:mt-0 bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-full transition shadow-md"
                  >
                    Remove All
                  </motion.button>
                </motion.div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {itemCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-1/3 bg-gray-900 bg-opacity-70 p-6 rounded-2xl border border-gray-700 shadow-lg h-max"
            >
              <h4 className="text-2xl font-bold mb-6 text-yellow-400">
                Order Summary
              </h4>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Items:</span>
                  <span>{itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Shipping:</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="border-t border-gray-700 pt-4 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-yellow-400">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold transition shadow-lg"
                onClick={() => navigate("/buynow")}
              >
                Proceed to Checkout
              </motion.button>

              <p className="text-gray-400 text-sm mt-4 text-center">
                or{" "}
                <Link to="/shop" className="text-yellow-400 hover:underline">
                  Continue Shopping
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}