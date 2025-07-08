import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthProvider";

export default function BuyNowPage() {
  const { setcartlength } = useContext(AuthContext);
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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Validate on change if the field has been touched
    if (touched[name]) {
      validateField(name, type === "checkbox" ? checked : value);
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, type === "checkbox" ? checked : value);
  };

  const validateField = (name, value) => {
    let error = "";

    if (!value) {
      error = "This field is required";
    } else {
      switch (name) {
        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "Please enter a valid email address";
          }
          break;
        case "phone":
          if (!/^\d{10}$/.test(value)) {
            error = "Please enter a valid 10-digit phone number";
          }
          break;
        case "zip":
          if (!/^\d{6}$/.test(value)) {
            error = "Please enter a valid 6-digit ZIP code";
          }
          break;
        case "cardNumber":
          if (!/^\d{16}$/.test(value.replace(/\s/g, ""))) {
            error = "Please enter a valid 16-digit card number";
          }
          break;
        case "expiry":
          if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(value)) {
            error = "Please enter a valid expiry date (MM/YY)";
          }
          break;
        case "cvv":
          if (!/^\d{3,4}$/.test(value)) {
            error = "Please enter a valid CVV (3 or 4 digits)";
          }
          break;
        case "upiId":
          if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(value)) {
            error = "Please enter a valid UPI ID (e.g., name@upi)";
          }
          break;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate shipping info
    const shippingFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zip",
    ];
    shippingFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
        isValid = false;
      }
    });

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate phone format
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    // Validate payment method specific fields
    if (activePaymentTab === "credit-card") {
      const cardFields = ["cardNumber", "cardName", "expiry", "cvv"];
      cardFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = "This field is required";
          isValid = false;
        }
      });

      if (
        formData.cardNumber &&
        !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))
      ) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
        isValid = false;
      }

      if (
        formData.expiry &&
        !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.expiry)
      ) {
        newErrors.expiry = "Please enter a valid expiry date (MM/YY)";
        isValid = false;
      }

      if (formData.cvv && !/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "Please enter a valid CVV (3 or 4 digits)";
        isValid = false;
      }
    }

    if (activePaymentTab === "upi" && !formData.upiId) {
      newErrors.upiId = "Please enter your UPI ID";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Place order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched to show errors
    const allFieldsTouched = {};
    Object.keys(formData).forEach((key) => {
      allFieldsTouched[key] = true;
    });
    setTouched(allFieldsTouched);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    setcartlength(0);
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3000/users/${storedUser.userid}`
      );
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
      navigate("/cart/buynow/order-confirmation", {
        state: { order: newOrder },
      });
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white p-10">Loading your cart...</div>
    );
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
                      <p className="text-yellow-400 font-bold">₹{item.price}</p>
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
                    type="button"
                    className={`px-4 py-2 font-medium ${
                      activePaymentTab === type
                        ? "text-yellow-400 border-b-2 border-yellow-400"
                        : "text-gray-400 hover:text-yellow-300"
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
                  <div>
                    <input
                      className={`payment-input ${
                        errors.cardNumber && touched.cardNumber
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Card Number"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength="19"
                    />
                    {errors.cardNumber && touched.cardNumber && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      className={`payment-input ${
                        errors.cardName && touched.cardName
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Name on Card"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.cardName && touched.cardName && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.cardName}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        className={`payment-input ${
                          errors.expiry && touched.expiry
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="MM/YY"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength="5"
                      />
                      {errors.expiry && touched.expiry && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.expiry}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        className={`payment-input ${
                          errors.cvv && touched.cvv ? "border-red-500" : ""
                        }`}
                        placeholder="CVV"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength="4"
                        type="password"
                      />
                      {errors.cvv && touched.cvv && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="saveCard"
                      checked={formData.saveCard}
                      onChange={handleChange}
                      className="text-yellow-400"
                    />
                    <span className="text-gray-300 text-sm">
                      Save card for future payments
                    </span>
                  </label>
                </div>
              )}

              {activePaymentTab === "upi" && (
                <div className="space-y-4">
                  <div>
                    <input
                      className={`payment-input ${
                        errors.upiId && touched.upiId ? "border-red-500" : ""
                      }`}
                      placeholder="yourname@upi"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.upiId && touched.upiId && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.upiId}
                      </p>
                    )}
                  </div>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 w-full py-2 rounded-lg font-bold"
                    type="button"
                  >
                    Pay via UPI
                  </button>
                </div>
              )}

              {activePaymentTab === "net-banking" && (
                <div>
                  <select className="payment-input w-full">
                    <option value="">Select your bank</option>
                    <option value="SBI">SBI</option>
                    <option value="HDFC">HDFC</option>
                    <option value="ICICI">ICICI</option>
                    <option value="Axis">Axis</option>
                  </select>
                  <button
                    className="bg-purple-500 hover:bg-purple-600 w-full mt-4 py-2 rounded-lg font-bold"
                    type="button"
                  >
                    Proceed to Bank
                  </button>
                </div>
              )}

              {activePaymentTab === "cod" && (
                <div className="text-center py-4">
                  <p className="text-gray-300 mb-2">
                    Pay cash when your order is delivered.
                  </p>
                  <p className="text-green-400 text-sm">
                    No additional charges apply.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">
                Shipping Information
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      className={`payment-input ${
                        errors.name && touched.name ? "border-red-500" : ""
                      }`}
                      placeholder="Full Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <input
                      className={`payment-input ${
                        errors.email && touched.email ? "border-red-500" : ""
                      }`}
                      placeholder="Email *"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="email"
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <input
                    className={`payment-input ${
                      errors.phone && touched.phone ? "border-red-500" : ""
                    }`}
                    placeholder="Phone Number *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength="10"
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <input
                    className={`payment-input ${
                      errors.address && touched.address ? "border-red-500" : ""
                    }`}
                    placeholder="Address *"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.address && touched.address && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      className={`payment-input ${
                        errors.city && touched.city ? "border-red-500" : ""
                      }`}
                      placeholder="City *"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.city && touched.city && (
                      <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <input
                      className={`payment-input ${
                        errors.state && touched.state ? "border-red-500" : ""
                      }`}
                      placeholder="State *"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.state && touched.state && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      className={`payment-input ${
                        errors.zip && touched.zip ? "border-red-500" : ""
                      }`}
                      placeholder="ZIP Code *"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength="6"
                    />
                    {errors.zip && touched.zip && (
                      <p className="text-red-400 text-xs mt-1">{errors.zip}</p>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-bold transition shadow-lg mt-2 ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-300 text-black"
              }`}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
