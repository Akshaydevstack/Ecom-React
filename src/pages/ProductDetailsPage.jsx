import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetProduct } from "../API/GetProducts";
import useCart from "../Hooks/useCart";
import { FiShoppingCart } from "react-icons/fi";
import { toast } from "react-hot-toast";
import LoaderPage from "../Component/LoaderPage";
export default function ProductDetailsPage() {
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    window.scrollTo(0, 0);
    GetProduct()
      .then((res) => {
        setProducts(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const product = products.find((p) => parseInt(p.id) === parseInt(id));
  const images = product
    ? Array.isArray(product.image)
      ? product.image
      : [product.image]
    : [];

  const isInCart = product
    ? cart.some((item) => item.id === product.id)
    : false;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!storedUser) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
    <LoaderPage/>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h2 className="text-2xl mb-4">Product not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-300 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return <div className="min-h-[80vh] md:min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 py-6 sm:py-10">
  <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-700 backdrop-blur-md bg-gray-900/60 shadow-lg md:shadow-2xl">
    {/* Images Section */}
    <div className="flex flex-col items-center space-y-3 sm:space-y-4 w-full relative">
      {/* Stock Status Badges */}
      {product.count === 0 && (
        <div className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-red-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold z-10">
          Out of Stock
        </div>
      )}
      {product.count > 0 && product.count < 10 && (
        <div className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-yellow-500 text-black px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold z-10">
          Limited Stock
        </div>
      )}

      {/* Main Image */}
      <div className="w-full max-w-xs sm:max-w-md aspect-square overflow-hidden rounded-xl sm:rounded-2xl border border-gray-700">
        <img
          src={images[currentImage]}
          alt={product.name}
          className="w-full h-full object-cover transition hover:scale-105 duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition ${
                currentImage === index
                  ? "border-yellow-400"
                  : "border-gray-700"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Product Info Section */}
    <div className="flex flex-col justify-center space-y-4 sm:space-y-6 w-full text-center lg:text-left">
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold">
        {product.name}
      </h2>
      <p className="text-lg sm:text-xl md:text-2xl text-yellow-400 font-semibold">
        ₹{product.price}
      </p>
      <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto lg:mx-0">
        {product.description ||
          "Premium product with sleek design and top-notch features."}
      </p>

      {/* Stock Status Message */}
      {product.count === 0 ? (
        <div className="text-red-400 font-semibold py-2 sm:py-3 text-sm sm:text-base">
          This product is currently out of stock
        </div>
      ) : product.count < 10 ? (
        <div className="text-yellow-400 font-semibold py-2 sm:py-3 text-sm sm:text-base">
          Only {product.count} left in stock!
        </div>
      ) : null}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
        {product.count > 0 ? (
          <>
            {isInCart ? (
              <button
                onClick={() => navigate("/cart")}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full transition hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FiShoppingCart className="text-base sm:text-lg" />
                Go to Cart
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 sm:px-8 sm:py-3 rounded-full transition hover:scale-105 text-sm sm:text-base"
              >
                Add to Cart
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="text-xs sm:text-sm text-yellow-400 hover:underline mt-1 sm:mt-0"
            >
              ← Back to Products
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-gray-300 px-6 py-2 sm:px-8 sm:py-3 rounded-full cursor-not-allowed text-sm sm:text-base"
            disabled
          >
            Out of Stock
          </button>
        )}
      </div>

      {/* Additional Product Details */}
      <div className="pt-3 sm:pt-4 border-t border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
          Product Details
        </h3>
        <ul className="text-gray-300 text-xs sm:text-sm space-y-1">
          <li>
            <span className="font-medium">Brand:</span>{" "}
            {product.brand || "N/A"}
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
}