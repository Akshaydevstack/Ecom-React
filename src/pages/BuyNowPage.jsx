import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function BuyNowPage() {
  const navigate = useNavigate();
  const [activePaymentTab, setActivePaymentTab] = useState("credit-card");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    upiId: "",
    saveCard: false,
  });
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
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  // Calculate total
  const total = cartItems.reduce((acc, item) => {
    const price = Number(String(item.price).replace(/[₹,]/g, "")) || 0;
    return acc + price;
  }, 0);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Place order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/users/${storedUser.userid}`);
      const existingOrders = res.data.orders || [];

      const newOrder = {
        id: Date.now(),
        items: cartItems,
        total,
        shippingInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        paymentMethod: activePaymentTab,
        date: new Date().toISOString(),
      };

      await axios.patch(`http://localhost:3000/users/${storedUser.userid}`, {
        cart: [],
        orders: [...existingOrders, newOrder],
      });

      alert("Payment successful! Your order has been placed.");
    navigate("/cart/buynow/order-confirmation", { state: { order: newOrder } });
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center text-white p-10">Loading your cart...</div>;
  }

  return (
    <div
      className="min-h-screen bg-black text-white py-12 px-4 flex items-center justify-center"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(15,24,44,0.95), rgba(55,63,73,0.95))",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl space-y-8"
      >
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-4 text-center text-yellow-400"
        >
          Complete Your Purchase
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-6 text-yellow-400">
              Order Summary
            </h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-400">Your cart is empty.</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center mb-6 p-4 bg-gray-800 rounded-xl"
                  >
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                    <div className="ml-4">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-gray-400 text-sm">
                        {item.color} • {item.storage}
                      </p>
                      <p className="text-yellow-400 font-bold">{item.price}</p>
                    </div>
                  </div>
                ))}
                <div className="space-y-4 border-t border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal:</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Shipping:</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-yellow-400">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Payment & Shipping */}
          <div className="flex flex-col gap-6">
            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">
                Payment Method
              </h3>
              <div className="flex border-b border-gray-700 mb-6">
                {["credit-card", "upi", "net-banking", "cod"].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 font-medium ${
                      activePaymentTab === type
                        ? "text-yellow-400 border-b-2 border-yellow-400"
                        : "text-gray-400"
                    }`}
                    onClick={() => setActivePaymentTab(type)}
                  >
                    {type === "credit-card"
                      ? "Credit Card"
                      : type === "upi"
                      ? "UPI"
                      : type === "net-banking"
                      ? "Net Banking"
                      : "Cash on Delivery"}
                  </button>
                ))}
              </div>
              {activePaymentTab === "credit-card" && (
                <div className="space-y-4">
                  <input className="payment-input" placeholder="Card Number" name="cardNumber" value={formData.cardNumber} onChange={handleChange} />
                  <input className="payment-input" placeholder="Name on Card" name="cardName" value={formData.cardName} onChange={handleChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <input className="payment-input" placeholder="MM/YY" name="expiry" value={formData.expiry} onChange={handleChange} />
                    <input className="payment-input" placeholder="CVV" name="cvv" value={formData.cvv} onChange={handleChange} />
                  </div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="saveCard" checked={formData.saveCard} onChange={handleChange} className="text-yellow-400" />
                    <span className="text-gray-300 text-sm">Save card for future payments</span>
                  </label>
                </div>
              )}
              {activePaymentTab === "upi" && (
                <div className="space-y-4">
                  <input className="payment-input" placeholder="yourname@upi" name="upiId" value={formData.upiId} onChange={handleChange} />
                  <button className="bg-blue-500 hover:bg-blue-600 w-full py-2 rounded-lg font-bold">Pay via UPI</button>
                </div>
              )}
              {activePaymentTab === "net-banking" && (
                <div>
                  <select className="payment-input">
                    <option>Select your bank</option>
                    <option>SBI</option>
                    <option>HDFC</option>
                    <option>ICICI</option>
                    <option>Axis</option>
                  </select>
                  <button className="bg-purple-500 hover:bg-purple-600 w-full mt-4 py-2 rounded-lg font-bold">Proceed to Bank</button>
                </div>
              )}
              {activePaymentTab === "cod" && (
                <div className="text-center py-4">
                  <p className="text-gray-300 mb-2">Pay cash when your order is delivered.</p>
                  <p className="text-green-400 text-sm">No additional charges apply.</p>
                </div>
              )}
            </motion.div>

            {/* Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Shipping Information</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="payment-input" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} />
                  <input className="payment-input" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <input className="payment-input" placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                <input className="payment-input" placeholder="Address" name="address" value={formData.address} onChange={handleChange} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input className="payment-input" placeholder="City" name="city" value={formData.city} onChange={handleChange} />
                  <input className="payment-input" placeholder="State" name="state" value={formData.state} onChange={handleChange} />
                  <input className="payment-input" placeholder="ZIP Code" name="zip" value={formData.zip} onChange={handleChange} />
                </div>
              </form>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full py-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold transition shadow-lg mt-2"
            >
              Place Order
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}