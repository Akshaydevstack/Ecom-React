import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetProduct } from "../API/GetProducts";
import { addToCart } from "../API/AddToCart";

export default function ProductDetailsPage() {
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
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 p-8 rounded-3xl border border-gray-700 backdrop-blur-md bg-gray-900/60 shadow-2xl">
        {/* Images */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src={images[currentImage]}
            alt={product.name}
            className="rounded-2xl w-full max-w-sm object-cover border border-gray-700 hover:scale-105 transition"
          />

          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
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
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-4xl text-white font-bold">{product.name}</h2>
          <p className="text-2xl text-yellow-400 font-semibold">
            {product.price}
          </p>
          <p className="text-gray-300">
            {product.description ||
              "Premium product with sleek design and top-notch features."}
          </p>
          <div className="flex gap-4">
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
              className="bg-yellow-400 text-black px-6 py-3 rounded-full hover:bg-yellow-300 transition hover:scale-105"
            >
              Add to Cart
            </button>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-yellow-400 hover:underline"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}
