import { motion } from "framer-motion";
import axios from "axios";
import { addToCart } from "../../API/AddToCart";

export default function OurMobileCollection({
  products,
  navigate,
  setSelectedBrand,
  setPriceRange,
}) {
  const storedUser = JSON.parse(localStorage.getItem("user"));

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
      // get the user first
      const res = await axios.get(
        `http://localhost:3000/users/${storedUser.userid}`
      );
      const user = res.data;

      // check if already in wishlist
      const alreadyExists = user.wishlist?.some(
        (item) => item.id === product.id
      );
      if (alreadyExists) {
       alert("Item in cart")
        return;
      }

      const updatedWishlist = [...(user.wishlist || []), product];
      await axios.patch(`http://localhost:3000/users/${storedUser.userid}`, {
        wishlist: updatedWishlist,
      });

      alert('Item added to wishlist');
      // or toast.success("Added to wishlist!");
    } catch (err) {
      console.error("Error adding to wishlist:", err);
    }
  };

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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.h2
        className="text-4xl font-bold mb-14 text-center tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Mobile Collection
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => {
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
    </div>
  );
}
