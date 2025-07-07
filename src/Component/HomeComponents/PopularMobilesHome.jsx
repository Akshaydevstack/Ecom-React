import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../API/AddToCart";

// Motion variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 10, stiffness: 100 },
  },
};

export default function PopularMobiles({ homeProducts }) {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        className="text-3xl font-bold mb-12 text-center tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Popular Mobiles
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {homeProducts.slice(0, 8).map((product) => (
          <motion.div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer"
            style={{ aspectRatio: "1/1" }}
            variants={item}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            {/* Image */}
            <div className="w-48 h-48 mb-4 overflow-hidden rounded-xl">
              <motion.img
                src={product.image[0] || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
              />
            </div>

            {/* Details */}
            <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
            <p className="text-gray-400 mb-4">{product.price}</p>

            {/* Add to Cart */}
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!storedUser) {
                  navigate("/login");
                } else {
                  addToCart(product);
                }
              }}
              className="bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-300 transition font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* View All */}
      <div className="flex justify-center mt-12">
        <motion.button
          type="button"
          onClick={() => navigate("/shop")}
          className="bg-yellow-400 text-black px-8 py-3 rounded-full hover:bg-yellow-300 transition font-semibold shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Mobiles
        </motion.button>
      </div>
    </div>
  );
}