import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function OrderStatus({ pieData }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-800/70 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg space-y-3"
    >
      <h3 className="text-lg sm:text-xl font-bold text-yellow-400">
        Order Status Distribution
      </h3>
      <p className="text-sm text-gray-400 mb-2 max-w-md">
        This pie chart breaks down your orders by their current status
        — such as Pending, Processing, Delivered, or Cancelled — giving you
        a quick overview of your order pipeline health.
      </p>

      <div className="h-[250px] sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="52%"
              cy="50%"
              labelLine={false}
              outerRadius={125}
              fill="#8884d8"
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} items ${name}`]}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e5e7eb",
                color: "#111827",
                fontSize: 15,
              }}
              itemStyle={{ color: "#111827" }}
              labelStyle={{ color: "#111827" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}