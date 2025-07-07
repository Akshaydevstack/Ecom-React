import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!storedUser) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:3000/users/${storedUser.userid}`
        );
        setWishlist(res.data.wishlist || []);
      } catch (err) {
        console.log("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [navigate]);

  const removeItem = async (id) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);
    setWishlist(updatedWishlist);

    try {
      await axios.patch(`http://localhost:3000/users/${storedUser.userid}`, {
        wishlist: updatedWishlist,
      });
    } catch (err) {
      console.log("Error updating wishlist:", err);
    }
  };

  const addToCart = async (item) => {
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      // get current user data
      const res = await axios.get(
        `http://localhost:3000/users/${storedUser.userid}`
      );
      const user = res.data;

      // check if already in cart
      const alreadyInCart = user.cart?.some((p) => p.id === item.id);
      if (alreadyInCart) {
       alert("already exist")
        return;
      }

      const updatedCart = [...(user.cart || []), item];
      await axios.patch(`http://localhost:3000/users/${storedUser.userid}`, {
        cart: updatedCart,
      });

     alert("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white p-8">Loading your wishlist...</div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black text-white py-12 px-4 relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/32846085/pexels-photo-32846085.jpeg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-80" />

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
          Your Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
        </motion.h2>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 bg-gray-900 bg-opacity-90 rounded-2xl border border-gray-700"
          >
            <p className="text-gray-400 text-xl mb-4">
              Your wishlist is empty ❤️
            </p>
            <Link
              to="/shop"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-full transition"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 bg-opacity-90 p-6 rounded-2xl border border-gray-700 shadow-lg flex flex-col items-center text-center"
              >
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-48 h-48 object-cover rounded-xl mb-4"
                />
                <h3 className="text-2xl font-semibold mb-1">{item.name}</h3>
                <p className="text-gray-400 mb-2">{item.brand}</p>
                <p className="text-yellow-400 font-bold text-xl mb-4">
                  {item.price}
                </p>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(item)}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-full transition shadow-md"
                  >
                    Add to Cart
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removeItem(item.id)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full transition shadow-md"
                  >
                    Remove
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}