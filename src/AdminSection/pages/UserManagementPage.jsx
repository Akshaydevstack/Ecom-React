import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users", err);
    }
  };

  const updateUser = async (id, updatedFields) => {
    try {
      await axios.patch(`http://localhost:3000/users/${id}`, updatedFields);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, ...updatedFields } : user
        )
      );
    } catch (err) {
      console.error("Error updating user", err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      String(u.id).includes(search)
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-300">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-yellow-400 mb-6"
      >
        User Management
      </motion.h1>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or ID"
          className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/80 border border-gray-700 rounded-xl p-5 shadow-lg flex flex-col space-y-3 transition-all duration-300"
          >
            <div className="text-lg font-semibold text-yellow-400">
              {user.name} (ID: {user.id})
            </div>
            <div className="text-gray-300 text-sm">Email: {user.email}</div>
            <div className="text-gray-400 text-sm">
              Role: <span className="font-semibold">{user.role}</span>
            </div>
            <div className="text-gray-400 text-sm">
              Status:{" "}
              <span
                className={`font-semibold ${
                  user.isBlock ? "text-red-500" : "text-green-400"
                }`}
              >
                {user.isBlock ? "Blocked" : "Active"}
              </span>
            </div>

            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => updateUser(user.id, { isBlock: !user.isBlock })}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  user.isBlock
                    ? "bg-green-500 hover:bg-green-600 text-gray-900"
                    : "bg-red-500 hover:bg-red-600 text-gray-100"
                }`}
              >
                {user.isBlock ? "Unblock" : "Block"}
              </button>

              <button
                onClick={() =>
                  updateUser(user.id, {
                    role: user.role === "Admin" ? "User" : "Admin",
                  })
                }
                className={`flex-1 py-2 rounded-lg transition font-semibold ${
                  user.role === "Admin"
                    ? "bg-purple-400 hover:bg-purple-500 text-gray-900"
                    : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                }`}
              >
                {user.role === "Admin" ? "Make User" : "Make Admin"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-gray-400 mt-6">No users found.</div>
      )}
    </div>
  );
}