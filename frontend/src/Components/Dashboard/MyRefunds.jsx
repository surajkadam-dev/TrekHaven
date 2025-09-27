import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  resetRefundSlice,
  fetchRefundRequests,
  deleteRefundRequest,
} from "../../store/slices/refundSlice";
import RefundTimeline from "./RefundTimeline";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaClock,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { RiRefundLine } from "react-icons/ri";

const MyRefunds = () => {
  const { refundRequests, loading, error, message } = useSelector(
    (state) => state.refund
  );
  const dispatch = useDispatch();
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    dispatch(fetchRefundRequests());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
    } else if (error) {
      toast.error(error);
    }
  }, [message, error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetRefundSlice());
    };
  }, [dispatch]);

  const handleViewTimeline = (refund) => {
    setSelectedRefund(refund);
    setShowTimeline(true);
  };

  const handleDeleteRefund = (id) => {
    if (
      window.confirm("Are you sure you want to delete this refund request?")
    ) {
      dispatch(deleteRefundRequest(id));
      setTimeout(() => {
        dispatch(fetchRefundRequests());
      }, 500);
    }
  };

  const handleBackToRefunds = () => {
    setShowTimeline(false);
    setSelectedRefund(null);
  };

  const resetFilters = () => {
    setFilterStatus("all");
    setFilterDate("");
  };

  const filteredAndSortedRefunds = refundRequests
    .filter((request) => {
      const statusMatch =
        filterStatus === "all" || request.status === filterStatus;
      const dateMatch =
        !filterDate ||
        new Date(request.initiatedAt).toDateString() ===
          new Date(filterDate).toDateString();
      return statusMatch && dateMatch;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.initiatedAt) - new Date(a.initiatedAt);
      } else {
        return new Date(a.initiatedAt) - new Date(b.initiatedAt);
      }
    });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#6B8E23] mb-4"></div>
        <p className="text-gray-600">Loading your refund requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md"
          role="alert"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Error loading refund requests: {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showTimeline && selectedRefund) {
    return (
      <RefundTimeline
        timeline={selectedRefund.timeline}
        onBack={handleBackToRefunds}
        refundData={selectedRefund}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto mt-[60px] md:mt-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <RiRefundLine className="text-4xl text-[#6B8E23] mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Refund Requests
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

            <button
              onClick={() =>
                setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
              }
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50"
            >
              {sortOrder === "newest" ? "Newest First" : "Oldest First"}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                >
                  <option value="all">All Statuses</option>
                  <option value="requested">Requested</option>
                  <option value="processing">Processing</option>
                  <option value="approved">Approved</option>
                  <option value="refunded">Refunded</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg mb-6">
          <table className="min-w-full bg-white">
            <thead className="bg-[#6B8E23] text-white">
              <tr>
                <th className="py-4 px-4 text-left">Name</th>
                <th className="py-4 px-4 text-left">Amount</th>
                <th className="py-4 px-4 text-left">Status</th>
                <th className="py-4 px-4 text-left">Request Date</th>
                <th className="py-4 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedRefunds.map((request, index) => (
                <tr
                  key={request._id}
                  className={`border-b transition-colors duration-200 hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-4 px-4">
                    {request.booking?.name || "N/A"}
                  </td>
                  <td className="py-4 px-4 font-medium">
                    ₹{request.amount || "0"}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === "refunded"
                          ? "bg-green-100 text-green-800"
                          : request.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : request.status === "approved"
                          ? "bg-purple-100 text-purple-800"
                          : request.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {new Date(request.initiatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewTimeline(request)}
                        className="bg-[#6B8E23] hover:bg-[#5A7A1F] text-white px-3 py-2 rounded-md flex items-center transition duration-300"
                      >
                        <FaClock className="mr-1" />
                        Timeline
                      </button>
                      <button
                        onClick={() => handleDeleteRefund(request._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center transition duration-300"
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredAndSortedRefunds.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-md p-5 border-l-4 border-[#6B8E23] transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {request.booking?.name || "N/A"}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    request.status === "refunded"
                      ? "bg-green-100 text-green-800"
                      : request.status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : request.status === "approved"
                      ? "bg-purple-100 text-purple-800"
                      : request.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {request.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium">₹{request.amount || "0"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Requested</p>
                  <p className="font-medium">
                    {new Date(request.initiatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewTimeline(request)}
                  className="flex-1 bg-[#6B8E23] hover:bg-[#5A7A1F] text-white py-2 rounded-md flex items-center justify-center transition duration-300"
                >
                  <FaClock className="mr-1" />
                  Timeline
                </button>
                <button
                  onClick={() => handleDeleteRefund(request._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md flex items-center justify-center transition duration-300"
                >
                  <FaTrash className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {refundRequests.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <RiRefundLine className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">
              No refund requests found.
            </p>
            <p className="text-gray-500">
              When you request refunds, they will appear here.
            </p>
          </div>
        )}

        {refundRequests.length > 0 && filteredAndSortedRefunds.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FaFilter className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">
              No refund requests match your filters.
            </p>
            <button
              onClick={resetFilters}
              className="text-[#6B8E23] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyRefunds;
