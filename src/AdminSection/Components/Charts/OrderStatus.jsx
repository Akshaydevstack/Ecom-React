import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function OrderStatus({ pieData }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const [outerRadius, setOuterRadius] = useState(125);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 400) {
        setOuterRadius(70);
      } else if (window.innerWidth < 640) {
        setOuterRadius(90);
      } else {
        setOuterRadius(125);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-800/70 border border-gray-700 rounded-xl p-4 sm:p-6 shadow-lg"
    >
      <h3 className="text-lg sm:text-xl font-bold text-yellow-400 text-center sm:text-left mb-2">
        Order Status Distribution
      </h3>
      <p className="text-sm text-gray-400 text-center sm:text-left mb-4 max-w-2xl mx-auto sm:mx-0">
        This pie chart breaks down your orders by their current status —
        such as Pending, Processing, Delivered, or Cancelled.
      </p>

      <div className="flex flex-col items-center">
        <div className="h-[220px] xs:h-[250px] sm:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={outerRadius}
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
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-300 text-sm">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}