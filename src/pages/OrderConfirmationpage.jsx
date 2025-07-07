import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-300 text-lg">No order found. Please place an order first.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black text-white py-10 px-4 flex flex-col items-center justify-center"
      style={{
        backgroundImage: "linear-gradient(135deg, rgba(26,30,43,0.95), rgba(46,68,99,0.95))"
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
            className="mx-auto mb-4 w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          <h1 className="text-3xl font-bold mb-2 text-yellow-400">Payment Successful!</h1>
          <p className="text-lg text-gray-300">Thank you for your order.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 bg-opacity-90 p-6 rounded-2xl border border-gray-700 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Order ID:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Date:</span>
                <span>{new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Payment:</span>
                <span>{order.paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-4 pt-4 space-y-4 max-h-40 overflow-auto">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-14 h-14 object-contain rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-gray-400 text-xs">Qty: 1</p>
                  </div>
                  <p className="text-yellow-400 font-bold">₹{Number(item.price).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4 flex justify-between font-bold text-lg">
              <span>Total Paid:</span>
              <span className="text-yellow-400">₹{order.total.toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Shipping */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900 bg-opacity-90 p-6 rounded-2xl border border-gray-700 shadow-lg flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">Shipping Information</h2>
              <p className="text-gray-300">
                {order.shippingInfo.name}<br />
                {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.zip}<br />
                Phone: {order.shippingInfo.phone}<br />
                Email: {order.shippingInfo.email}
              </p>
              <p className="text-green-400 mt-3">Expected delivery: 3-5 business days</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-start">
              <Link
                to="/shop"
                className="w-full sm:w-auto text-center px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg transition shadow-lg"
              >
                Continue Shopping
              </Link>
              <Link
                to="/orders"
                className="w-full sm:w-auto text-center px-6 py-3 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold rounded-lg transition"
              >
                View Orders
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}