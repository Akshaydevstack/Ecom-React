import { motion } from "framer-motion";
import axios from "axios";
import useCart from "../../Hooks/useCart";
import { toast } from "react-toastify";
import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function OurMobileCollection({
  products,
  navigate,
  setSelectedBrand,
  setPriceRange,
}) { 
  const { addToCart } = useCart();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [searchQuery, setSearchQuery] = useState("");

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const addToWishlist = async (e, product) => {
    e.stopPropagation();
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3000/users/${storedUser.userid}`
      );
      const user = res.data;

      const alreadyExists = user.wishlist?.some(
        (item) => item.id === product.id
      );
      if (alreadyExists) {
        toast.warn("Item already exists");
        return;
      }

      const updatedWishlist = [...(user.wishlist || []), product];
      await axios.patch(`http://localhost:3000/users/${storedUser.userid}`, {
        wishlist: updatedWishlist,
      });
      toast.success(`${product.name} added to wishlist`);
    } catch (err) {
      console.error("Error adding to wishlist:", err);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      (product.brand && product.brand.toLowerCase().includes(query)) ||
      product.description.toLowerCase().includes(query)
    );
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl text-gray-400">
          No products match your filters
        </h3>
        <button
          onClick={() => {
            setSelectedBrand("All");
            setPriceRange([10000, 200000]);
          }}
          className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-300 transition font-semibold"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 md:gap-0">
  <motion.h2
    className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    Explore Our Mobile Collection
  </motion.h2>

  <div className="relative w-full max-w-md md:max-w-xs">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <FiSearch className="text-gray-400 w-5 h-5" />
    </div>
    <input
      type="text"
      placeholder="Search mobiles..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-800 text-white border border-gray-700 
      focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition 
      shadow-sm hover:shadow-md"
    />
    {searchQuery && (
      <button
        onClick={() => setSearchQuery("")}
        className="absolute inset-y-0 right-0 pr-4 flex items-center"
      >
        <FiX className="text-gray-400 hover:text-white w-5 h-5" />
      </button>
    )}
  </div>
</div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-400 mb-4">
            No products match your search "{searchQuery}"
          </h3>
          <button
            onClick={() => setSearchQuery("")}
            className="bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-300 transition font-semibold"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const numericPrice = parseInt(product.price.replace(/[^0-9]/g, ""));
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <span className="text-yellow-400 font-bold">
                      {formatPrice(numericPrice)}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col space-y-3 items-center text-center flex-grow">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-400 text-sm flex-grow">
                    {product.description.slice(0, 60)}...
                  </p>

                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={(e) => {
                        if (!storedUser) {
                          e.stopPropagation();
                          navigate("/login");
                        } else {
                          e.stopPropagation();
                          addToCart(product);
                        }
                      }}
                      className="bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-300 transition font-semibold shadow hover:shadow-md"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={(e) => addToWishlist(e, product)}
                      className="bg-gray-800 text-yellow-400 px-2 py-2 rounded-full hover:bg-gray-700 transition font-semibold shadow hover:shadow-md"
                    >
                      ❤️ Wishlist
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}