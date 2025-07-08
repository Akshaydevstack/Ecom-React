import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      if (!storedUser) return;
      try {
        const res = await axios.get(`http://localhost:3000/users/${storedUser.userid}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-bold";
    switch (status?.toLowerCase()) {
      case "shipped":
        return `${baseClasses} bg-blue-600 text-white`;
      case "delivered":
        return `${baseClasses} bg-green-600 text-white`;
      case "cancelled":
        return `${baseClasses} bg-red-600 text-white`;
      default:
        return `${baseClasses} bg-yellow-500 text-black`;
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-white py-12 px-4"
      style={{
        backgroundImage: "linear-gradient(135deg, rgba(26,30,43,0.95), rgba(46,68,99,0.95))"
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-bold text-center text-yellow-400 mb-10">
          Your Orders
        </h1>

        {loading ? (
          <p className="text-center text-gray-300">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400 mb-4">You have no orders yet.</p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg transition shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-4 md:space-y-0">
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <span className="text-gray-400 text-sm">Order ID:</span>
                      <span className="text-yellow-400 font-bold">{order.id}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-gray-400 text-sm">Date:</span>
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-gray-400 text-sm">Payment:</span>
                      <span>{order.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className={getStatusBadge(order.status || "Processing")}>
                      {order.status || "Processing"}
                    </span>
                  </div>

                  <div className="font-bold text-lg">
                    Total: <span className="text-yellow-400">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item) => (
                             
                    <div key={item.id} onClick={() => navigate(`/product/${item.id}`)} className="flex items-center space-x-4 bg-gray-800 p-3 rounded-xl">
                      <img
                        src={Array.isArray(item.image) ? item.image[0] : item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-gray-400 text-xs">
                          {item.color} {item.storage}
                        </p>
                        <p className="text-yellow-400 font-bold">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}