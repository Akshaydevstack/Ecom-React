import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetProduct } from "../API/GetProducts";
import useCart from "../Hooks/useCart";

export default function ProductDetailsPage() {
  const { addToCart } = useCart();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h2 className="text-2xl mb-4">Product not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-yellow-400 text-black px-6 py-2 rounded-full"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 md:p-8 rounded-3xl border border-gray-700 backdrop-blur-md bg-gray-900/60 shadow-2xl">

        {/* Images */}
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="w-full max-w-md aspect-square overflow-hidden rounded-2xl border border-gray-700">
            <img
              src={images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover transition hover:scale-105"
            />
          </div>

          {images.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition 
                    ${
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

        {/* Info */}
        <div className="flex flex-col justify-center space-y-6 w-full text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl text-white font-bold">{product.name}</h2>
          <p className="text-xl md:text-2xl text-yellow-400 font-semibold">
            ₹{product.price}
          </p>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto lg:mx-0">
            {product.description ||
              "Premium product with sleek design and top-notch features."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
              className="bg-yellow-400 text-black px-8 py-3 rounded-full hover:bg-yellow-300 transition hover:scale-105"
            >
              Add to Cart
            </button>
             
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-yellow-400 hover:underline mt-2 sm:mt-0"
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}