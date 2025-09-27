import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetTestimonialState,
  fetchTestimonials,
  deleteTestimonial,
  updateReviewStatus,
} from "../../store/slices/TestimonialSlice";

// Review Card Component for Mobile View
import ReviewCard from "./ReviewCard";
const AllReview = () => {
  const {
    testimonials,
    loading,
    error,
    message,
    page,
    totalPages,
    totalReviews,
  } = useSelector((state) => state.testimonial);
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [actionLoading, setActionLoading] = useState({ type: "", id: "" });
  const [limit] = useState(5);

  useEffect(() => {
    dispatch(fetchTestimonials(currentPage, limit, status, keyword));

    return () => {
      dispatch(resetTestimonialState());
    };
  }, [dispatch, currentPage, status, keyword, limit]);

  const handleStatusUpdate = async (id, status) => {
    setActionLoading({ type: "status", id });
    await dispatch(updateReviewStatus({ reviewId: id, status }));
    setActionLoading({ type: "", id: "" });
    setStatus("all");
    dispatch(fetchTestimonials(currentPage, limit, status, keyword));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setActionLoading({ type: "delete", id });
      await dispatch(deleteTestimonial({ reviewId: id }));
      setActionLoading({ type: "", id: "" });
      dispatch(fetchTestimonials(currentPage, limit, status, keyword));
    }
  };

  const handleView = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setViewModal(true);
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return "";
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleRetry = () => {
    dispatch(fetchTestimonials(currentPage, limit));
    setStatus("all");
  };

  const filteredTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.comment.toLowerCase().includes(keyword.toLowerCase()) ||
      (testimonial.user &&
        testimonial.user.name &&
        testimonial.user.name.toLowerCase().includes(keyword.toLowerCase()))
  );

  // Calculate statistics
  const approvedCount = testimonials.filter(
    (t) => t.status === "approved"
  ).length;
  const pendingCount = testimonials.filter(
    (t) => t.status === "pending"
  ).length;
  const rejectedCount = testimonials.filter(
    (t) => t.status === "rejected"
  ).length;

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-6 mt-[60px] md:mt-0">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-amber-900">Customer Reviews</h1>
        <p className="text-amber-700">Manage and monitor customer feedback</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-600">
          <h3 className="text-lg font-semibold text-amber-900">Approved</h3>
          <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-amber-500">
          <h3 className="text-lg font-semibold text-amber-900">Pending</h3>
          <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-brown-800">
          <h3 className="text-lg font-semibold text-amber-900">Rejected</h3>
          <p className="text-2xl font-bold text-brown-700">{rejectedCount}</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or comment..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {keyword && (
                <button
                  onClick={() => setKeyword("")}
                  className="absolute right-3 top-2.5 text-amber-600 hover:text-amber-800"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-amber-100 text-amber-900 rounded-lg hover:bg-amber-200 flex items-center gap-2"
            >
              <span>Filters</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>

            <button
              onClick={() => {
                setStatus("all");
                setKeyword("");
              }}
              className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                Sort By
              </label>
              <select className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                Rating
              </label>
              <select className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                Items Per Page
              </label>
              <select
                value={limit}
                onChange={(e) => setCurrentPage(1)}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Mobile View - Cards */}
      <div className="block md:hidden">
        {loading && currentPage === 1 ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            <p className="mt-2 text-amber-700">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900"
            >
              Try Again
            </button>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-amber-700">No reviews found.</p>
            {keyword || status !== "all" ? (
              <button
                onClick={() => {
                  setKeyword("");
                  setStatus("all");
                }}
                className="mt-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div>
            {filteredTestimonials.map((testimonial) => (
              <ReviewCard
                key={testimonial._id}
                testimonial={testimonial}
                onView={handleView}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
                actionLoading={actionLoading}
              />
            ))}

            {/* Pagination for mobile */}
            <div className="bg-amber-50 px-4 py-3 flex items-center justify-between border-t border-amber-200 mt-4">
              <div className="flex-1 flex justify-between items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-2 border border-amber-300 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? "bg-amber-100 text-amber-400 cursor-not-allowed"
                      : "bg-white text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm text-amber-700">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-3 py-2 border border-amber-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? "bg-amber-100 text-amber-400 cursor-not-allowed"
                      : "bg-white text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        {loading && currentPage === 1 ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            <p className="mt-2 text-amber-700">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900"
            >
              Try Again
            </button>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-amber-700">No reviews found.</p>
            {keyword || status !== "all" ? (
              <button
                onClick={() => {
                  setKeyword("");
                  setStatus("all");
                }}
                className="mt-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                      Review
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200">
                  {filteredTestimonials.map((testimonial) => (
                    <tr key={testimonial._id} className="hover:bg-amber-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-amber-200 rounded-full flex items-center justify-center">
                            <span className="font-medium text-amber-800">
                              {testimonial.user && testimonial.user.name
                                ? testimonial.user.name.charAt(0).toUpperCase()
                                : "U"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-amber-900">
                              {testimonial.user && testimonial.user.name
                                ? testimonial.user.name
                                : "Unknown User"}
                            </div>
                            <div className="text-sm text-amber-600">
                              {testimonial.user && testimonial.user.email
                                ? testimonial.user.email
                                : "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-amber-900">
                          {truncateMessage(testimonial.comment)}
                          {testimonial.comment &&
                            testimonial.comment.length > 50 && (
                              <button
                                onClick={() => {
                                  setSelectedTestimonial(testimonial);
                                  setViewModal(true);
                                }}
                                className="ml-1 text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                View more
                              </button>
                            )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-5 w-5 ${
                                star <= testimonial.rating
                                  ? "text-amber-500"
                                  : "text-amber-200"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            testimonial.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : testimonial.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {testimonial.status.charAt(0).toUpperCase() +
                            testimonial.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-amber-600">
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedTestimonial(testimonial);
                              setViewModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="View details"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>

                          {testimonial.status !== "approved" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(testimonial._id, "approved")
                              }
                              disabled={
                                actionLoading.type === "status" &&
                                actionLoading.id === testimonial._id
                              }
                              className="text-green-600 hover:text-green-900"
                              title="Approve review"
                            >
                              {actionLoading.type === "status" &&
                              actionLoading.id === testimonial._id ? (
                                <svg
                                  className="animate-spin h-5 w-5 text-green-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                          )}

                          {testimonial.status !== "rejected" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(testimonial._id, "rejected")
                              }
                              disabled={
                                actionLoading.type === "status" &&
                                actionLoading.id === testimonial._id
                              }
                              className="text-red-600 hover:text-red-900"
                              title="Reject review"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(testimonial._id)}
                            disabled={
                              actionLoading.type === "delete" &&
                              actionLoading.id === testimonial._id
                            }
                            className="text-brown-600 hover:text-brown-900"
                            title="Delete review"
                          >
                            {actionLoading.type === "delete" &&
                            actionLoading.id === testimonial._id ? (
                              <svg
                                className="animate-spin h-5 w-5 text-brown-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-amber-50 px-4 py-3 flex items-center justify-between border-t border-amber-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-amber-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * limit, totalReviews)}
                    </span>{" "}
                    of <span className="font-medium">{totalReviews}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-amber-300 text-sm font-medium ${
                        currentPage === 1
                          ? "bg-amber-100 text-amber-400 cursor-not-allowed"
                          : "bg-white text-amber-500 hover:bg-amber-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? "z-10 bg-amber-500 border-amber-500 text-white"
                              : "bg-white border-amber-300 text-amber-500 hover:bg-amber-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-amber-300 text-sm font-medium ${
                        currentPage === totalPages
                          ? "bg-amber-100 text-amber-400 cursor-not-allowed"
                          : "bg-white text-amber-500 hover:bg-amber-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Modal */}
      {viewModal && selectedTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-amber-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-amber-900">
                Review Details
              </h3>
              <button
                onClick={() => setViewModal(false)}
                className="text-amber-500 hover:text-amber-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start mb-6">
                <div className="h-12 w-12 flex-shrink-0 bg-amber-200 rounded-full flex items-center justify-center mr-4">
                  <span className="font-medium text-amber-800 text-lg">
                    {selectedTestimonial.user && selectedTestimonial.user.name
                      ? selectedTestimonial.user.name.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-amber-900">
                    {selectedTestimonial.user && selectedTestimonial.user.name
                      ? selectedTestimonial.user.name
                      : "Unknown User"}
                  </h4>
                  <p className="text-amber-600">
                    {selectedTestimonial.user && selectedTestimonial.user.email
                      ? selectedTestimonial.user.email
                      : "No email provided"}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-6 w-6 ${
                        star <= selectedTestimonial.rating
                          ? "text-amber-500"
                          : "text-amber-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-amber-700 font-medium">
                    {selectedTestimonial.rating}/5
                  </span>
                </div>

                <div className="mt-4">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      selectedTestimonial.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : selectedTestimonial.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedTestimonial.status.charAt(0).toUpperCase() +
                      selectedTestimonial.status.slice(1)}
                  </span>
                  <span className="ml-3 text-sm text-amber-600">
                    Posted on{" "}
                    {new Date(
                      selectedTestimonial.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg mb-6">
                <h5 className="font-medium text-amber-900 mb-2">
                  Review Comment
                </h5>
                <p className="text-amber-800">
                  {selectedTestimonial.comment || "No comment provided."}
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setViewModal(false)}
                  className="px-4 py-2 border border-amber-300 rounded-lg text-amber-700 hover:bg-amber-50"
                >
                  Close
                </button>
                {selectedTestimonial.status !== "approved" && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedTestimonial._id, "approved");
                      setViewModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve Review
                  </button>
                )}
                {selectedTestimonial.status !== "rejected" && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedTestimonial._id, "rejected");
                      setViewModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReview;
