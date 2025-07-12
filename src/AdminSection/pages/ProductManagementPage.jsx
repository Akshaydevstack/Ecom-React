import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiCheck, FiImage } from "react-icons/fi";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(getEmptyProduct());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockFilter, setStockFilter] = useState("all"); // 'all', 'inStock', 'outOfStock', 'lowStock'

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products", err);
    } finally {
      setLoading(false);
    }
  };

  function getEmptyProduct() {
    return {
      id: "",
      brand: "",
      name: "",
      price: "",
      image: [],
      count: 0,
      isActive: true,
      description: "",
      created_at: new Date().toISOString(),
    };
  }

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({ ...product });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData(getEmptyProduct());
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingProduct) {
        await axios.patch(
          `http://localhost:3000/products/${editingProduct}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/products", formData);
      }
      await loadProducts();
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error saving product", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:3000/products/${id}`);
        await loadProducts();
      } catch (err) {
        console.error("Error deleting product", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageUrlChange = (e) => {
    const urls = e.target.value.split("\n").filter(url => url.trim() !== "");
    setFormData({ ...formData, image: urls });
  };

  const filteredProducts = products.filter((p) => {
    // Apply search filter
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.id.includes(search);
    
    // Apply stock filter
    let matchesStock = true;
    switch (stockFilter) {
      case 'inStock':
        matchesStock = p.count > 0;
        break;
      case 'outOfStock':
        matchesStock = p.count <= 0;
        break;
      case 'lowStock':
        matchesStock = p.count > 0 && p.count < 10;
        break;
      default:
        matchesStock = true;
    }
    
    return matchesSearch && matchesStock;
  });

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900 p-6 rounded-3xl shadow-lg"
        >
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">
              Product Management
            </h1>
            <p className="text-sm text-gray-400">
              Manage your product inventory
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
              <option value="lowStock">Low Stock (&lt;10)</option>
            </select>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl shadow transition"
            >
              <FiPlus /> Add Product
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-gray-900 p-6 rounded-3xl shadow-lg"
          >
            <div className="text-gray-400 text-sm">Total Products</div>
            <div className="text-3xl font-bold text-yellow-400">
              {products.length}
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-gray-900 p-6 rounded-3xl shadow-lg"
          >
            <div className="text-gray-400 text-sm">Active Products</div>
            <div className="text-3xl font-bold text-green-400">
              {products.filter((p) => p.isActive).length}
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-gray-900 p-6 rounded-3xl shadow-lg"
          >
            <div className="text-gray-400 text-sm">Out of Stock</div>
            <div className="text-3xl font-bold text-red-400">
              {products.filter((p) => p.count <= 0).length}
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-gray-900 p-6 rounded-3xl shadow-lg"
          >
            <div className="text-gray-400 text-sm">Low Stock (&lt;10)</div>
            <div className="text-3xl font-bold text-orange-400">
              {products.filter((p) => p.count > 0 && p.count < 10).length}
            </div>
          </motion.div>
        </div>

        {/* Product Table */}
        {loading && !isFormOpen ? (
          <div className="flex justify-center items-center h-64 bg-gray-900 rounded-3xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-400"></div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-3xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(253, 224, 71, 0.1)" }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.image[0] ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover mr-3"
                              src={product.image[0]}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-800 rounded-md flex items-center justify-center mr-3">
                              <FiImage className="text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-100">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-100">
                        {product.brand}
                      </td>
                      <td className="px-6 py-4 text-yellow-400">
                        ₹{product.price}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm ${
                            product.count > 0 
                              ? product.count < 10 
                                ? "text-orange-400" 
                                : "text-green-400" 
                              : "text-red-400"
                          }`}
                        >
                          {product.count} in stock
                          {product.count > 0 && product.count < 10 && " (Low)"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.isActive
                              ? "bg-green-400/20 text-green-300"
                              : "bg-red-400/20 text-red-300"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-yellow-400 hover:text-yellow-500"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit/Add Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <h2 className="text-2xl font-bold text-yellow-400">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Column - Form Fields */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-400">Product ID</label>
                        <input
                          type="text"
                          value={formData.id}
                          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-400">Brand</label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) =>
                            setFormData({ ...formData, brand: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-400">Product Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-400">Price (₹)</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-400">Stock Count</label>
                        <input
                          type="number"
                          value={formData.count}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              count: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-400">Status</label>
                        <div className="flex items-center mt-1">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.isActive}
                              onChange={(e) =>
                                setFormData({ ...formData, isActive: e.target.checked })
                              }
                              className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-700 rounded focus:ring-yellow-400"
                            />
                            <span className="ml-2 text-sm text-gray-300">
                              Active Product
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-400">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image URL Input */}
                  <div className="w-full md:w-1/3 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">Product Image URLs</label>
                      <div className="h-48 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                        {formData.image[0] ? (
                          <img
                            src={formData.image[0]}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-500">
                            <FiImage size={48} className="opacity-50" />
                          </div>
                        )}
                      </div>
                      <textarea
                        placeholder="Enter image URLs (one per line)"
                        value={formData.image.join("\n")}
                        onChange={handleImageUrlChange}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    ) : (
                      <FiCheck />
                    )}
                    Save Product
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}