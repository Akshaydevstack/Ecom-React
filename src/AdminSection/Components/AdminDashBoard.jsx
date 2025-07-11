import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, carts: 0 });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    async function loadStats() {
      const usersRes = await axios.get("http://localhost:3000/users");
      const productsRes = await axios.get("http://localhost:3000/products");

      const ordersCount = usersRes.data.reduce((acc, u) => acc + (u.orders?.length || 0), 0);
      const cartsCount = usersRes.data.reduce((acc, u) => acc + (u.cart?.length || 0), 0);

      // Simulate brand distribution
      const brands = {};
      productsRes.data.forEach(product => {
        brands[product.brand] = (brands[product.brand] || 0) + 1;
      });

      setStats({
        users: usersRes.data.length,
        products: productsRes.data.length,
        orders: ordersCount,
        carts: cartsCount,
      });

      // Trend data for area chart
      setChartData([
        { month: 'Jan', orders: 10, revenue: 120000 },
        { month: 'Feb', orders: 14, revenue: 168000 },
        { month: 'Mar', orders: 18, revenue: 216000 },
        { month: 'Apr', orders: 22, revenue: 264000 },
        { month: 'May', orders: 30, revenue: 360000 },
        { month: 'Jun', orders: 42, revenue: 504000 },
        { month: 'Jul', orders: ordersCount, revenue: ordersCount * 12000 },
      ]);

      setPieData([
        { name: "Completed", value: ordersCount },
        { name: "Pending", value: 10 },
        { name: "Carts", value: cartsCount },
      ]);

      setCategoryData(
        Object.entries(brands).map(([name, value]) => ({ name, value }))
      );

      setPerformanceData([
        { subject: 'Samsung', A: 120, fullMark: 150 },
        { subject: 'Apple', A: 98, fullMark: 150 },
        { subject: 'OnePlus', A: 86, fullMark: 150 },
        { subject: 'Xiaomi', A: 99, fullMark: 150 },
        { subject: 'Realme', A: 85, fullMark: 150 },
        { subject: 'Vivo', A: 85, fullMark: 150 },
      ]);
    }
    loadStats();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 text-center px-2"
      >
        Admin Dashboard
      </motion.h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
        <StatCard
          icon={<UsersIcon />}
          iconBg="bg-blue-500/20"
          label="Total Users"
          count={stats.users}
          trend="+12% this month"
          extra="5 pending approvals"
          btnColor="bg-blue-600 hover:bg-blue-500"
        />
        <StatCard
          icon={<ProductsIcon />}
          iconBg="bg-purple-500/20"
          label="Total Products"
          count={stats.products}
          trend="+8 new listings"
          extra="2 low-stock items"
          btnColor="bg-purple-600 hover:bg-purple-500"
        />
        <StatCard
          icon={<OrdersIcon />}
          iconBg="bg-green-500/20"
          label="Total Orders"
          count={stats.orders}
          trend="3 pending shipments"
          extra="7 under review"
          btnColor="bg-green-600 hover:bg-green-500"
        />
        <StatCard
          icon={<CartIcon />}
          iconBg="bg-yellow-500/20"
          label="Items in Carts"
          count={stats.carts}
          trend="+5 items added today"
          extra="1 abandoned cart"
          btnColor="bg-yellow-600 hover:bg-yellow-500"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 bg-gray-800/70 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-yellow-400">Sales Performance</h3>
            <select className="bg-gray-700 border border-gray-600 text-white text-xs sm:text-sm rounded-lg px-2 sm:px-3 py-1">
              <option>Last 7 Days</option>
              <option>Last Month</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    fontSize: 12
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  name="Orders" 
                  stroke="#facc15" 
                  fillOpacity={1} 
                  fill="url(#colorOrders)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue (₹)" 
                  stroke="#34d399" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Order Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/70 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-3 sm:mb-4">Order Status</h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} items`, '']}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    fontSize: 12
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-7xl mx-auto">
       
        {/* Brand Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/70 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-3 sm:mb-4">Brand Distribution</h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    fontSize: 15
                  }}
                />
                <Bar dataKey="value" name="Products" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Performance Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800/70 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-3 sm:mb-4">Brand Performance</h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 150]} 
                  stroke="#9CA3AF"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    fontSize: 12
                  }}
                />
                <Radar
                  name="Sales"
                  dataKey="A"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Custom Icons (optimized for all screen sizes)
function UsersIcon() {
  return (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

// StatCard Component (optimized for responsiveness)
function StatCard({ icon, iconBg, label, count, trend, extra, btnColor }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`${iconBg} backdrop-blur-sm border border-gray-700 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg flex flex-col transition duration-300 hover:shadow-lg`}
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className={`p-2 sm:p-3 rounded-lg ${iconBg.replace('/20', '/30')} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-400 text-xs sm:text-sm font-medium truncate">{label}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 truncate">{count}</h2>
          <p className="text-green-400 text-xs mt-1 truncate">{trend}</p>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700/50">
        <p className="text-gray-400 text-xs truncate">{extra}</p>
        <button className={`mt-2 sm:mt-3 w-full py-1 sm:py-2 ${btnColor} text-white text-xs sm:text-sm font-medium rounded-lg transition shadow-md`}>
          View Details
        </button>
      </div>
    </motion.div>
  );
}