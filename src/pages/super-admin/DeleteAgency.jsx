import React, { useState } from "react";
import axiosInstance from "../../axios/axiosInstance";

// Helper function to format address object
const formatAddress = (address) => {
    if (!address || typeof address === 'string') return address || "N/A";
    if (typeof address === 'object') {
        const parts = [];
        if (address.buildingNo) parts.push(address.buildingNo);
        if (address.street) parts.push(address.street);
        if (address.landmark) parts.push(address.landmark);
        if (address.place) parts.push(address.place);
        if (address.city) parts.push(address.city);
        if (address.district) parts.push(address.district);
        if (address.state) parts.push(address.state);
        if (address.pincode) parts.push(address.pincode);
        return parts.filter(Boolean).join(", ") || "N/A";
    }
    return "N/A";
};

export default function DeleteAgency() {
    // Step 1: Agency Search
    const [agencyIdInput, setAgencyIdInput] = useState("");
    const [agencyDetails, setAgencyDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 2: Confirmation Code
    const [randomCode, setRandomCode] = useState("");
    const [userCode, setUserCode] = useState("");
    const [codeMatched, setCodeMatched] = useState(false);

    // Step 3-5: Delete Process
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteResult, setDeleteResult] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Step 1: Fetch Agency Details
    const handleFindAgency = async () => {
        if (!agencyIdInput.trim()) {
            setError("Please enter an Agency ID");
            return;
        }

        setLoading(true);
        setError("");
        setAgencyDetails(null);
        setRandomCode("");
        setUserCode("");
        setCodeMatched(false);
        setDeleteResult(null);

        try {
            console.log("🔍 Searching for agency:", agencyIdInput.trim());
            const response = await axiosInstance.get(`/super-admin/agency/${agencyIdInput.trim()}`);
            console.log("✅ Agency found:", response.data);

            // Map the response data to match frontend expectations
            const agencyData = {
                ...response.data.data,
                godownCount: response.data.data.godowns?.count || 0,
                userCount: response.data.data.relatedCount?.users || 0,
                vehicleCount: response.data.data.relatedCount?.vehicles || 0,
                supplierCount: response.data.data.relatedCount?.suppliers || 0,
            };
            setAgencyDetails(agencyData);

            // Step 2: Generate random confirmation code
            const code = Math.random().toString(36).substring(2, 10).toUpperCase();
            setRandomCode(code);

            setError("");
        } catch (err) {
            console.error("❌ Error fetching agency:", err);
            const errorMsg = err.response?.data?.message || err.message || "Agency not found";
            setError(errorMsg);
            setAgencyDetails(null);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Validate confirmation code
    const handleCodeChange = (e) => {
        const value = e.target.value.toUpperCase();
        setUserCode(value);
        setCodeMatched(value === randomCode);
    };

    // Step 3: Handle delete with confirmation
    const handleDeleteClick = () => {
        setShowConfirmDialog(true);
    };

    // Step 4: Confirm and execute deletion
    const confirmDelete = async () => {
        setShowConfirmDialog(false);
        setIsDeleting(true);
        setError("");

        try {
            console.log("🗑️ Deleting agency:", agencyDetails._id);
            const response = await axiosInstance.delete(`/super-admin/agency/${agencyDetails._id}`);
            console.log("✅ Agency deleted successfully:", response.data);
            setDeleteResult({
                success: true,
                message: response.data.message,
                agencyName: agencyDetails.name,
            });
            setAgencyIdInput("");
            setAgencyDetails(null);
            setRandomCode("");
            setUserCode("");
            setCodeMatched(false);
        } catch (err) {
            console.error("❌ Error deleting agency:", err);
            const errorMsg = err.response?.data?.message || err.message || "Failed to delete agency";
            console.error("Full error response:", err.response?.data);
            setDeleteResult({
                success: false,
                message: errorMsg,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    // Reset function
    const handleReset = () => {
        setAgencyIdInput("");
        setAgencyDetails(null);
        setRandomCode("");
        setUserCode("");
        setCodeMatched(false);
        setDeleteResult(null);
        setError("");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Permanent Agency Deletion</h1>
                    <p className="text-gray-600 mb-6">
                        This action permanently deletes an agency and all associated data. It cannot be undone.
                    </p>

                    {/* Step 1: Agency Search */}
                    <div className="mb-8 pb-8 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Find Agency</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter Agency ID"
                                value={agencyIdInput}
                                onChange={(e) => setAgencyIdInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleFindAgency()}
                                disabled={agencyDetails !== null}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                            />
                            <button
                                onClick={handleFindAgency}
                                disabled={loading || agencyDetails !== null}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
                            >
                                {loading ? "Searching..." : "Find Agency"}
                            </button>
                        </div>
                        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}

                        {/* Agency Details Card */}
                        {agencyDetails && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="font-semibold text-gray-900 mb-3">Agency Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Name:</span>
                                        <p className="text-gray-900">{agencyDetails.name}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">GST:</span>
                                        <p className="text-gray-900">{agencyDetails.gst || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Address:</span>
                                        <p className="text-gray-900">{formatAddress(agencyDetails.address)}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Godowns:</span>
                                        <p className="text-gray-900">{agencyDetails.godownCount || 0}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Users:</span>
                                        <p className="text-gray-900">{agencyDetails.userCount || 0}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Vehicles:</span>
                                        <p className="text-gray-900">{agencyDetails.vehicleCount || 0}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Confirmation Code */}
                    {agencyDetails && !deleteResult && (
                        <div className="mb-8 pb-8 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Verify with Confirmation Code</h2>
                            <p className="text-gray-600 text-sm mb-4">
                                Enter the confirmation code below to proceed. This ensures accidental deletions are prevented.
                            </p>
                            <div className="p-4 bg-gray-100 rounded-md mb-4">
                                <p className="text-sm text-gray-700">Your confirmation code:</p>
                                <p className="text-2xl font-mono font-bold text-gray-900 mt-1">{randomCode}</p>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter confirmation code"
                                value={userCode}
                                onChange={handleCodeChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                            />
                            {userCode && (
                                <p
                                    className={`mt-2 text-sm font-medium ${codeMatched ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {codeMatched ? "✓ Code matched!" : "✗ Code does not match"}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 3: Warning Banner & Delete Button */}
                    {agencyDetails && codeMatched && !deleteResult && (
                        <div className="mb-8 pb-8 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 3: Ready to Delete</h2>
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md mb-6">
                                <p className="text-red-800 font-semibold">⚠️ WARNING</p>
                                <p className="text-red-700 text-sm mt-2">
                                    You are about to permanently delete: <span className="font-bold">{agencyDetails.name}</span>
                                </p>
                                <ul className="text-red-700 text-sm mt-2 list-disc list-inside space-y-1">
                                    <li>All agency users and staff records will be deleted</li>
                                    <li>All vehicles and stock locations will be removed</li>
                                    <li>All inventory and transaction records will be erased</li>
                                    <li>This action cannot be undone</li>
                                </ul>
                            </div>
                            <button
                                onClick={handleDeleteClick}
                                disabled={isDeleting}
                                className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:bg-gray-400 transition"
                            >
                                {isDeleting ? "Deleting..." : "Permanent Delete"}
                            </button>
                        </div>
                    )}

                    {/* Step 5: Result Message */}
                    {deleteResult && (
                        <div className="mb-8 pb-8 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 5: Result</h2>
                            <div
                                className={`p-4 rounded-lg ${deleteResult.success
                                    ? "bg-green-50 border border-green-200"
                                    : "bg-red-50 border border-red-200"
                                    }`}
                            >
                                <p className={`font-semibold ${deleteResult.success ? "text-green-800" : "text-red-800"}`}>
                                    {deleteResult.success ? "✓ Agency Deleted Successfully" : "✗ Deletion Failed"}
                                </p>
                                <p className={`text-sm mt-2 ${deleteResult.success ? "text-green-700" : "text-red-700"}`}>
                                    {deleteResult.message}
                                </p>
                                {deleteResult.success && deleteResult.agencyName && (
                                    <p className="text-sm mt-2 text-green-700">
                                        Agency deleted: <span className="font-semibold">{deleteResult.agencyName}</span>
                                    </p>
                                )}
                                {!deleteResult.success && (
                                    <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-800 font-mono overflow-auto max-h-32">
                                        <p className="font-semibold mb-1">Error Details:</p>
                                        {deleteResult.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {!agencyDetails && (
                            <button
                                onClick={() => setError("")}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                            >
                                Clear
                            </button>
                        )}
                        {agencyDetails && (
                            <button
                                onClick={handleReset}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                            >
                                Start Over
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Final Confirmation</h3>
                        <p className="text-gray-600 mb-6">
                            Are you absolutely sure you want to permanently delete <span className="font-semibold">{agencyDetails?.name}</span>?
                            This action cannot be reversed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition font-medium"
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
