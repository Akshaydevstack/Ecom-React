import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
export default function DailySalesChart({dailySalesData}) {
  return (
   <>
   <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailySalesData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorDailyOrders"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="colorDailyRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="hour"
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickMargin={10}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    fontSize: 12,
                  }}
                  formatter={(value, name) => {
                    if (name === "Revenue")
                      return [`₹${value.toLocaleString()}`, name];
                    return [value, name];
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(value) => {
                    if (value === "revenue") return "Revenue (₹)";
                    return value.charAt(0).toUpperCase() + value.slice(1);
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#facc15"
                  fillOpacity={1}
                  fill="url(#colorDailyOrders)"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#34d399"
                  fillOpacity={1}
                  fill="url(#colorDailyRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
   </>
  )
}
