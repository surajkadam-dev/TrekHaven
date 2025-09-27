import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  resetSlice,
  getAllRefundRequests,
  resetMessage,
  resetLoading,
  resetError,
} from "../../store/slices/adminSlice";
import {
  FaEye,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
} from "react-icons/fa";
import {
  FaChevronLeft,
  FaMoneyBillWave,
  FaUser,
  FaCalendarAlt,
  FaReceipt,
  FaInfoCircle,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSyncAlt,
} from "react-icons/fa";
import { RiRefundLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

// Mobile Card Component
const RefundMobileCard = ({ refund, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#6B8E23] mb-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800">
          {refund.booking?.groupName || "N/A"}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            refund.status === "refunded"
              ? "bg-green-100 text-green-800"
              : refund.status === "processing"
              ? "bg-blue-100 text-blue-800"
              : refund.status === "approved"
              ? "bg-purple-100 text-purple-800"
              : refund.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {refund.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-sm text-gray-600">Amount</p>
          <p className="font-medium">₹{refund.payment?.amount || "0"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Requested</p>
          <p className="font-medium">
            {new Date(refund.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">User</p>
          <p className="font-medium">{refund.user?.name || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Method</p>
          <p className="font-medium">{refund.method || "N/A"}</p>
        </div>
      </div>

      <button
        onClick={() => onViewDetails(refund)}
        className="w-full bg-[#6B8E23] hover:bg-[#5A7A1F] text-white py-2 rounded-md flex items-center justify-center transition duration-300"
      >
        <FaEye className="mr-2" />
        View Details
      </button>
    </div>
  );
};

// Main Component
const AllRefundRequests = () => {
  const {
    error,
    loading,
    message,
    AllRefundRequests: refundRequests,
    totalRefundRequests,
    totalPages,
    page,
  } = useSelector((store) => store.admin);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    status: "",
    method: "",
    email: "",
    name: "",
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500); // 500ms delay

    return () => clearTimeout(handler); // cleanup on change
  }, [filters]);
  useEffect(() => {
    dispatch(getAllRefundRequests(filters));
  }, [dispatch, debouncedFilters]);

  useEffect(() => {
    if (message) {
      alert(message);
      dispatch(resetMessage());
    }
  }, [message, dispatch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      method: "",
      email: "",
      name: "",
      page: 1,
      limit: 10,
    });
  };

  const handleViewDetails = (refund) => {
    setSelectedRefund(refund);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedRefund(null);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#6B8E23] mb-4"></div>
        <p className="text-gray-600">Loading refund requests...</p>
      </div>
    );
  }

  if (showDetails && selectedRefund) {
    return <RefundDetails refund={selectedRefund} onBack={handleBackToList} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[60px] md:mt-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <RiRefundLine className="text-4xl text-[#6B8E23] mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">
              All Refund Requests
            </h1>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50"
            >
              <FaFilter className="mr-2" />
              Filters
              {showFilters ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Filter Refunds
              </h2>
              <button
                onClick={resetFilters}
                className="text-sm text-[#6B8E23] hover:underline"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                >
                  <option value="">All Statuses</option>
                  <option value="requested">Requested</option>
                  <option value="processing">Processing</option>
                  <option value="approved">Approved</option>
                  <option value="refunded">Refunded</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Method
                </label>
                <select
                  value={filters.method}
                  onChange={(e) => handleFilterChange("method", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                >
                  <option value="">All Methods</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="razorpay">Online</option>
                  <option value="cash">Cash</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email & Name
                </label>
                <input
                  type="text"
                  value={filters.email || filters.name}
                  onChange={(e) =>
                    handleFilterChange(`${"email" || "name"}`, e.target.value)
                  }
                  placeholder="Enter Email or Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <p className="text-gray-700">
            Showing {refundRequests?.length || 0} of {totalRefundRequests}{" "}
            refund requests
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg mb-6">
          <table className="min-w-full bg-white">
            <thead className="bg-[#6B8E23] text-white">
              <tr>
                <th className="py-4 px-4 text-left">Grup Name</th>
                <th className="py-4 px-4 text-left">User</th>
                <th className="py-4 px-4 text-left">Amount</th>
                <th className="py-4 px-4 text-left">Method</th>
                <th className="py-4 px-4 text-left">Status</th>
                <th className="py-4 px-4 text-left">Request Date</th>
                <th className="py-4 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {refundRequests?.map((refund, index) => (
                <tr
                  key={refund._id}
                  className={`border-b transition-colors duration-200 hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-4 px-4">
                    {refund.booking?.groupName || "N/A"}
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">
                        {refund.user?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {refund.user?.email || ""}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium">
                    ₹{refund.payment?.amount || "0"}
                  </td>
                  <td className="py-4 px-4 capitalize">
                    {refund.method === "razorpay" ? "Online" : "Cash" || "N/A"}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        refund.status === "refunded"
                          ? "bg-green-100 text-green-800"
                          : refund.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : refund.status === "approved"
                          ? "bg-purple-100 text-purple-800"
                          : refund.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {refund.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {new Date(refund.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleViewDetails(refund)}
                      className="bg-[#6B8E23] hover:bg-[#5A7A1F] text-white px-3 py-2 rounded-md flex items-center transition duration-300"
                    >
                      <FaEye className="mr-1" />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {refundRequests?.map((refund) => (
            <RefundMobileCard
              key={refund._id}
              refund={refund}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-md ${
                      filters.page === pageNum
                        ? "bg-[#6B8E23] text-white"
                        : "bg-white border border-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {refundRequests.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <RiRefundLine className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">
              No refund requests found.
            </p>
            <p className="text-gray-500">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Refund Details Component
const RefundDetails = ({ refund, onBack }) => {
  const [activeTab, setActiveTab] = useState("details");

  // Status configuration
  const statusConfig = {
    refunded: { color: "bg-green-100 text-green-800", icon: FaCheckCircle },
    processing: { color: "bg-blue-100 text-blue-800", icon: FaSyncAlt },
    approved: { color: "bg-purple-100 text-purple-800", icon: FaCheckCircle },
    rejected: { color: "bg-red-100 text-red-800", icon: FaTimesCircle },
    pending: { color: "bg-amber-100 text-amber-800", icon: FaClock },
  };

  const StatusIcon = statusConfig[refund.status]?.icon || FaInfoCircle;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-100 py-8 px-4 mt-[60px] md:mt-0">
      <div className="max-w-5xl mx-auto">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center mb-6"
        >
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center text-green-700 font-medium px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FaChevronLeft className="mr-2" />
            Back to refund requests
          </motion.button>
        </motion.div>

        {/* Main content card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
        >
          {/* Header with status */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Refund Details</h1>
                <p className="opacity-90">
                  Refund ID: {refund?.refundPaymentId}
                </p>
              </div>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center mt-4 md:mt-0"
              >
                <StatusIcon className="text-xl mr-2" />
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    statusConfig[refund.status]?.color
                  }`}
                >
                  {refund.status.charAt(0).toUpperCase() +
                    refund.status.slice(1)}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {["details", "user", "booking", "notes"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                    activeTab === tab
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "details" && "Refund Information"}
                  {tab === "user" && "User Details"}
                  {tab === "booking" && "Booking Info"}
                  {tab === "notes" && "Notes"}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-3 rounded-lg mr-4">
                        <FaMoneyBillWave className="text-green-600 text-xl" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Payment Details
                      </h2>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium text-lg text-green-700">
                          ₹{refund.payment?.amount || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="font-medium capitalize">
                          {refund.method || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Request Date:</span>
                        <span className="font-medium">
                          {new Date(refund.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      {refund.updatedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="font-medium">
                            {new Date(refund.updatedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <FaReceipt className="text-blue-600 text-xl" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Refund Process
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div
                          className={`h-3 w-3 rounded-full mr-3 ${
                            refund.status === "initiated"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className="text-sm">Refund requested</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`h-3 w-3 rounded-full mr-3 ${
                            refund.status === "processing"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className="text-sm">Under review</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`h-3 w-3 rounded-full mr-3 ${
                            refund.status === "refunded"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className="text-sm">Refund creadited</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "user" && (
                <motion.div
                  key="user"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-indigo-50 p-5 rounded-xl border border-indigo-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FaUser className="text-indigo-600 text-xl" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      User Information
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Full Name</p>
                      <p className="font-medium">
                        {refund.user?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Email Address
                      </p>
                      <p className="font-medium">
                        {refund.user?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">User ID</p>
                      <p className="font-medium">{refund.user?._id || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Contact Number
                      </p>
                      <p className="font-medium">
                        {refund.user?.mobile || "N/A"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "booking" && (
                <motion.div
                  key="booking"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-amber-50 p-5 rounded-xl border border-amber-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-100 p-3 rounded-lg mr-4">
                      <FaCalendarAlt className="text-amber-600 text-xl" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Booking Information
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Booking Name</p>
                      <p className="font-medium">
                        {refund.booking?.groupName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Stay Date</p>
                      <p className="font-medium">
                        {refund.booking?.stayDate
                          ? new Date(
                              refund.booking.stayDate
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                      <p className="font-medium">
                        {refund.booking?._id || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Number of Guests
                      </p>
                      <p className="font-medium">
                        {refund.booking?.groupSize || "N/A"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "notes" && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {refund.reason && (
                    <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                      <div className="flex items-center mb-4">
                        <div className="bg-red-100 p-3 rounded-lg mr-4">
                          <FaFileAlt className="text-red-600 text-xl" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          Refund Reason
                        </h2>
                      </div>
                      <p className="text-gray-700">{refund.reason}</p>
                    </div>
                  )}

                  {refund.adminNotes && (
                    <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                      <div className="flex items-center mb-4">
                        <div className="bg-purple-100 p-3 rounded-lg mr-4">
                          <FaInfoCircle className="text-purple-600 text-xl" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          Admin Notes
                        </h2>
                      </div>
                      <p className="text-gray-700">{refund.adminNotes}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AllRefundRequests;
