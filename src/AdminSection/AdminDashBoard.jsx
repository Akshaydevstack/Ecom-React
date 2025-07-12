import React, { useEffect, useState } from "react";
import axios from "axios";

import "react-datepicker/dist/react-datepicker.css";
import PerformanceRadarChart from "./Components/Charts/PerfmsChart";
import BrandDistribution from "./Components/Charts/BrandDistribution";
import OrderStatus from "./Components/Charts/OrderStatus";
import DailySection from "./Components/Charts/DailySection";
import Actioncard from "./Cards/Actioncard";
import WelcomeAdmin from "./Cards/GreetingCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    carts: 0,
  });
  const [pieData, setPieData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);

        const [usersRes, productsRes] = await Promise.all([
          axios.get("http://localhost:3000/users"),
          axios.get("http://localhost:3000/products"),
        ]);

        const users = usersRes.data;
        const products = productsRes.data;
        const orders = users.flatMap((user) => user.orders || []);

        // Debug: Log sample cart data
        console.log(
          "Sample user carts:",
          users.slice(0, 3).map((u) => ({
            id: u.id,
            cart: u.cart,
            cartItemsCount: u.cart?.items?.length || 0,
          }))
        );

        // Pie chart data - Order status distribution
        const normalizeStatus = (status) => {
          if (!status) return "Pending";
          const s = status.toLowerCase();
          if (s.includes("pending")) return "Pending";
          if (s.includes("process")) return "Processing";
          if (s.includes("cancel")) return "Cancelled";
          if (s.includes("deliver")) return "Delivered";
          return "Pending";
        };

        const statusCounts = orders.reduce((acc, order) => {
          const norm = normalizeStatus(order.status);
          acc[norm] = (acc[norm] || 0) + 1;
          return acc;
        }, {});

        const pie = ["Pending", "Processing", "Cancelled", "Delivered"].map(
          (status) => ({
            name: status,
            value: statusCounts[status] || 0,
          })
        );

        // Brand distribution data
        const brandCounts = {};
        products.forEach((product) => {
          brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
        });
        const brandData = Object.entries(brandCounts).map(([name, value]) => ({
          name,
          value,
        }));

        // Performance radar data
        const brandOrders = {};
        orders.forEach((order) => {
          order.items?.forEach((item) => {
            if (item.brand) {
              brandOrders[item.brand] =
                (brandOrders[item.brand] || 0) + (item.quantity || 1);
            }
          });
        });

        const maxOrderCount = Math.max(10, ...Object.values(brandOrders));
        const radarData = Object.entries(brandOrders).map(([brand, count]) => ({
          subject: brand,
          A: count,
          fullMark: maxOrderCount,
        }));

        const radar = radarData.length
          ? radarData
          : [{ subject: "No Orders", A: 0, fullMark: 10 }];

        setStats({
          users: users.length,
          products: products.length,
          orders: orders.length,
          carts: users.reduce((total, user) => {
            if (!user.cart) return total;

            if (Array.isArray(user.cart)) {
              return total + user.cart.length;
            }

            if (user.cart.items && Array.isArray(user.cart.items)) {
              return total + user.cart.items.length;
            }

            if (typeof user.cart.count === "number") {
              return total + user.cart.count;
            }

            return total;
          }, 0),
        });

        setPieData(pie);
        setCategoryData(brandData);
        setPerformanceData(radar);
        setAllOrders(orders);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7.5xl mx-auto p-4 sm:p-6">
      <WelcomeAdmin />
      <Actioncard stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <DailySection allOrders={allOrders} />
        <OrderStatus pieData={pieData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <BrandDistribution categoryData={categoryData} />
        <PerformanceRadarChart performanceData={performanceData} />
      </div>
    </div>
  );
}
