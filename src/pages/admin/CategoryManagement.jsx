import React, { useState, useEffect } from "react";
import api from "../../axios/axiosInstance";
import { FaTags, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaFilter } from "react-icons/fa";

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [filterType, setFilterType] = useState("ALL");
    const [formData, setFormData] = useState({
        name: "",
        type: "NFR",
        description: ""
    });
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (filterType === "ALL") {
            setFilteredCategories(categories);
        } else {
            setFilteredCategories(categories.filter(cat => cat.type === filterType));
        }
    }, [filterType, categories]);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get("/admin/product-categories");
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            showMessage("Error fetching categories", "error");
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/admin/product-category/${editingCategory._id}`, formData);
                showMessage("Category updated successfully", "success");
            } else {
                await api.post("/admin/product-category", formData);
                showMessage("Category created successfully", "success");
            }
            setIsModalOpen(false);
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            showMessage(error.response?.data?.message || "Error saving category", "error");
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                type: category.type,
                description: category.description || ""
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: "",
                type: "NFR",
                description: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to deactivate this category?")) {
            try {
                await api.delete(`/admin/product-category/${id}`);
                showMessage("Category deactivated successfully", "success");
                fetchCategories();
            } catch (error) {
                console.error("Error deleting category:", error);
                showMessage("Error deleting category", "error");
            }
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "CYLINDER":
                return "bg-orange-100 text-orange-700";
            case "NFR":
                return "bg-purple-100 text-purple-700";
            case "FTL":
                return "bg-blue-100 text-blue-700";
            case "PR":
                return "bg-indigo-100 text-indigo-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const categoryStats = {
        total: categories.length,
        cylinder: categories.filter(c => c.type === "CYLINDER").length,
        nfr: categories.filter(c => c.type === "NFR").length,
        ftl: categories.filter(c => c.type === "FTL").length,
        pr: categories.filter(c => c.type === "PR").length
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen animate-fadeIn">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FaTags className="text-blue-600" />
                            Product Category Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Manage product categories across all types</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-md"
                    >
                        <FaPlus /> Add Category
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div
                        onClick={() => setFilterType("ALL")}
                        className={`p-4 rounded-lg shadow-sm border-2 cursor-pointer transition ${filterType === "ALL" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"
                            }`}
                    >
                        <div className="text-sm text-gray-600 font-medium">Total Categories</div>
                        <div className="text-2xl font-bold text-gray-800 mt-1">{categoryStats.total}</div>
                    </div>
                    <div
                        onClick={() => setFilterType("CYLINDER")}
                        className={`p-4 rounded-lg shadow-sm border-2 cursor-pointer transition ${filterType === "CYLINDER" ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-300"
                            }`}
                    >
                        <div className="text-sm text-gray-600 font-medium">Cylinder</div>
                        <div className="text-2xl font-bold text-orange-600 mt-1">{categoryStats.cylinder}</div>
                    </div>
                    <div
                        onClick={() => setFilterType("NFR")}
                        className={`p-4 rounded-lg shadow-sm border-2 cursor-pointer transition ${filterType === "NFR" ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-white hover:border-purple-300"
                            }`}
                    >
                        <div className="text-sm text-gray-600 font-medium">NFR Products</div>
                        <div className="text-2xl font-bold text-purple-600 mt-1">{categoryStats.nfr}</div>
                    </div>
                    <div
                        onClick={() => setFilterType("FTL")}
                        className={`p-4 rounded-lg shadow-sm border-2 cursor-pointer transition ${filterType === "FTL" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"
                            }`}
                    >
                        <div className="text-sm text-gray-600 font-medium">FTL</div>
                        <div className="text-2xl font-bold text-blue-600 mt-1">{categoryStats.ftl}</div>
                    </div>
                    <div
                        onClick={() => setFilterType("PR")}
                        className={`p-4 rounded-lg shadow-sm border-2 cursor-pointer transition ${filterType === "PR" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white hover:border-indigo-300"
                            }`}
                    >
                        <div className="text-sm text-gray-600 font-medium">Pressure Reg.</div>
                        <div className="text-2xl font-bold text-indigo-600 mt-1">{categoryStats.pr}</div>
                    </div>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-4 p-3 rounded-lg ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
                        {message.text}
                    </div>
                )}

                {/* Categories Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-4 border-b">Category Name</th>
                                <th className="p-4 border-b">Type</th>
                                <th className="p-4 border-b">Description</th>
                                <th className="p-4 border-b text-center">Status</th>
                                <th className="p-4 border-b text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400">
                                        {filterType === "ALL"
                                            ? "No categories found. Add one to get started."
                                            : `No ${filterType} categories found.`}
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category._id} className="hover:bg-blue-50 transition duration-150">
                                        <td className="p-4 font-medium text-gray-800">{category.name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${getTypeColor(category.type)}`}>
                                                {category.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 text-sm">{category.description || "-"}</td>
                                        <td className="p-4 text-center">
                                            {category.isActive ? (
                                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs flex items-center justify-center w-fit mx-auto gap-1">
                                                    <FaCheck size={10} /> Active
                                                </span>
                                            ) : (
                                                <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs flex items-center justify-center w-fit mx-auto gap-1">
                                                    <FaTimes size={10} /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => openModal(category)}
                                                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-800">
                                {editingCategory ? "Edit Category" : "New Category"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                    placeholder="e.g., Suraksha Hose"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                >
                                    <option value="CYLINDER">Cylinder</option>
                                    <option value="NFR">NFR Product</option>
                                    <option value="FTL">FTL</option>
                                    <option value="PR">Pressure Regulator (PR)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                                    rows="3"
                                    placeholder="Optional description for this category"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
                                >
                                    {editingCategory ? "Update Category" : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
