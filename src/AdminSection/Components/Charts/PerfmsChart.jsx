import React from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function PerformanceRadarChart({ performanceData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-gray-800/70 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg space-y-3"
    >
      <h3 className="text-lg sm:text-xl font-bold text-yellow-400">
        Brand Sales Performance
      </h3>
      <p className="text-sm text-gray-400 mb-2 max-w-md">
        This radar chart compares the total quantity of products sold across
        different brands, highlighting your top-performing brands and
        identifying opportunities to improve sales distribution.
      </p>

      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={performanceData}
          >
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis
              dataKey="subject"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <PolarRadiusAxis angle={30} stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                borderColor: "#374151",
                fontSize: 18,
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
  );
}