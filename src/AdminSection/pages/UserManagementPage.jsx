import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUser, FiShield, FiLock } from "react-icons/fi";
import { toast } from "react-hot-toast";

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
      toast.success("User updated successfully!");
    } catch (err) {
      console.error("Error updating user", err);
      toast.error("Failed to update user.");
    }
  };

  const deleteUser = async (user) => {
    if (user.role === "Admin") {
      toast.error("Cannot delete an admin user.");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${user.name}?`);
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/users/${user.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user", err);
      toast.error("Failed to delete user.");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      String(u.id).includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900 p-6 rounded-2xl shadow-lg"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">User Management</h1>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID"
            className="w-full md:w-1/3 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div whileHover={{ y: -3 }} className="bg-gray-900 p-4 rounded-xl shadow-lg">
            <div className="text-sm text-gray-400">Total Users</div>
            <div className="text-2xl font-bold text-yellow-400">{users.length}</div>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="bg-gray-900 p-4 rounded-xl shadow-lg">
            <div className="text-sm text-gray-400">Admins</div>
            <div className="text-2xl font-bold text-purple-400">
              {users.filter(user => user.role === "Admin").length}
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="bg-gray-900 p-4 rounded-xl shadow-lg">
            <div className="text-sm text-gray-400">Blocked Users</div>
            <div className="text-2xl font-bold text-red-400">
              {users.filter(user => user.isBlock).length}
            </div>
          </motion.div>
        </div>

        {/* User Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/70 border border-gray-700 rounded-xl p-5 shadow-lg transition-all duration-300 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-700 p-2 rounded-lg text-yellow-400">
                  <FiUser className="text-lg" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-yellow-400 truncate">
                    {user.name}
                    <span className="text-sm text-gray-400"> (ID: {user.id})</span>
                  </div>
                  <div className="text-gray-300 text-sm break-words">{user.email}</div>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <div className="flex items-center gap-1 text-sm text-purple-400">
                  <FiShield /> {user.role}
                </div>
                <div className={`flex items-center gap-1 text-sm ${user.isBlock ? "text-red-400" : "text-green-400"}`}>
                  <FiLock /> {user.isBlock ? "Blocked" : "Active"}
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => updateUser(user.id, { isBlock: !user.isBlock })}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors duration-200 ${
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
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                    user.role === "Admin"
                      ? "bg-purple-400 hover:bg-purple-500 text-gray-900"
                      : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                  }`}
                >
                  {user.role === "Admin" ? "Make User" : "Make Admin"}
                </button>
                <button
                  onClick={() => deleteUser(user)}
                  className="flex-1 py-2 rounded-lg font-semibold transition-colors duration-200 bg-gray-700 hover:bg-gray-600 text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-center">
            No users found.
          </motion.div>
        )}
      </div>
    </div>
  );
}