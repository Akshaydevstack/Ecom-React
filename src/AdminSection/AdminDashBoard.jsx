import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import PerformanceRadarChart from "./Components/Charts/PerfmsChart";
import BrandDistribution from "./Components/Charts/BrandDistribution";
import OrderStatus from "./Components/Charts/OrderStatus";
import SalesTable from "./Components/Table/SalesTable";
import DailySalesChart from "./Components/Charts/DailySalesChart";
import DailyStats from "./Components/Charts/DailyStats";
import Actioncard from "./Cards/Actioncard";
import CartDropdown from "./Components/Charts/CartDropdown";
import AdminNavbar from "./Components/AdminNavBar";
import WelcomeAdmin from "./Cards/GreetingCard";
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    carts: 0,
  });
  const [dailySalesData, setDailySalesData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [timeRange, setTimeRange] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        const [usersRes, productsRes] = await Promise.all([
          axios.get("http://localhost:3000/users"),
          axios.get("http://localhost:3000/products"),
        ]);

        // Process orders from users API
        const allOrders = usersRes.data.flatMap((user) => user.orders || []);
        const today = new Date();
        const todayOrders = allOrders.filter((order) => {
          const orderDate = new Date(order.date);
          return orderDate.toDateString() === today.toDateString();
        });

        // Group orders by hour
        const hourlyData = Array.from({ length: 24 }, (_, hour) => {
          const hourOrders = todayOrders.filter((order) => {
            const orderDate = new Date(order.date);
            return orderDate.getHours() === hour;
          });

          const totalRevenue = hourOrders.reduce(
            (sum, order) => sum + (order.total || 0),
            0
          );

          return {
            hour: `${hour}:00`,
            orders: hourOrders.length,
            revenue: totalRevenue,
          };
        });

        // Filter out hours with no activity
        const filteredHourlyData = hourlyData.filter((hour) => hour.orders > 0);

        // Calculate daily totals
        const dailyTotals = {
          orders: todayOrders.length,
          revenue: todayOrders.reduce(
            (sum, order) => sum + (order.total || 0),
            0
          ),
          avgOrderValue:
            todayOrders.length > 0
              ? todayOrders.reduce(
                  (sum, order) => sum + (order.total || 0),
                  0
                ) / todayOrders.length
              : 0,
        };

        // Process other data
        const ordersCount = allOrders.length;
        const cartsCount = usersRes.data.reduce(
          (acc, u) => acc + (u.cart?.length || 0),
          0
        );

        // Simulate brand distribution
        const brands = {};
        productsRes.data.forEach((product) => {
          brands[product.brand] = (brands[product.brand] || 0) + 1;
        });

        setStats({
          users: usersRes.data.length,
          products: productsRes.data.length,
          orders: ordersCount,
          carts: cartsCount,
          dailyTotals,
        });

        setDailySalesData(filteredHourlyData);

        setPieData([
          { name: "Completed", value: ordersCount - 2 },
          { name: "Pending", value: 10 },
          { name: "Carts", value: cartsCount },
        ]);

        setCategoryData(
          Object.entries(brands).map(([name, value]) => ({ name, value }))
        );

        setPerformanceData([
          { subject: "Samsung", A: 120, fullMark: 150 },
          { subject: "Apple", A: 98, fullMark: 150 },
          { subject: "OnePlus", A: 86, fullMark: 150 },
          { subject: "Xiaomi", A: 99, fullMark: 150 },
          { subject: "Realme", A: 85, fullMark: 150 },
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, [timeRange]);

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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-700 ${
          isSidebarExpanded ? "w-56" : "w-16"
        } transition-all duration-300 ease-in-out z-50`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
       <AdminNavbar/>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 ${
          isSidebarExpanded ? "ml-56" : "ml-16"
        } transition-all duration-300 ease-in-out p-4 sm:p-6 space-y-6 sm:space-y-8`}
      >
        <WelcomeAdmin />
        <Actioncard stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-gray-800/70 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
          >
            <CartDropdown timeRange={timeRange} setTimeRange={setTimeRange} />
            <DailyStats stats={stats} />
            <DailySalesChart dailySalesData={dailySalesData} />
            <SalesTable dailySalesData={dailySalesData} stats={stats} />
          </motion.div>
          <OrderStatus pieData={pieData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-7xl mx-auto">
          <BrandDistribution categoryData={categoryData} />
          <PerformanceRadarChart performanceData={performanceData} />
        </div>
      </div>
    </div>
  );
}
