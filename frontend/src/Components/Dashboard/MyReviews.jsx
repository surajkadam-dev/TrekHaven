import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetTestimonialState,
  fetchMyTestimonials,
  deleteTestimonial,
} from "../../store/slices/TestimonialSlice";

const MyReviews = () => {
  const {
    myTestimonials,
    error,
    message,
    loading,
    totalReviews,
    totalPages,
    page,
    limit,
  } = useSelector((state) => state.testimonial);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Set different limits for desktop and mobile
  const desktopLimit = 10;
  const mobileLimit = 1;
  const currentLimit = window.innerWidth >= 768 ? desktopLimit : mobileLimit;

  useEffect(() => {
    dispatch(fetchMyTestimonials(currentPage, currentLimit));

    const handleResize = () => {
      const newLimit = window.innerWidth >= 768 ? desktopLimit : mobileLimit;
      dispatch(fetchMyTestimonials(currentPage, newLimit));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      dispatch(resetTestimonialState());
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch, currentPage, currentLimit]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setDeleteLoading(true);
      await dispatch(deleteTestimonial({ reviewId: id }));
      setDeleteLoading(false);
      dispatch(fetchMyTestimonials(currentPage, currentLimit));
    }
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

  // Calculate statistics
  const approvedCount = myTestimonials.filter(
    (t) => t.status === "approved"
  ).length;
  const pendingCount = myTestimonials.filter(
    (t) => t.status === "pending"
  ).length;
  const rejectedCount = myTestimonials.filter(
    (t) => t.status === "rejected"
  ).length;

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="flex space-x-2 justify-center">
            <div className="w-4 h-4 bg-amber-600 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-amber-600 rounded-full animate-bounce delay-150"></div>
            <div className="w-4 h-4 bg-amber-600 rounded-full animate-bounce delay-300"></div>
          </div>
          <p className="mt-4 text-amber-800 font-semibold">
            Loading Your Reviews...
          </p>
        </div>
      </div>
    );
  }

  if (!loading && myTestimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-amber-50 rounded-lg shadow-lg mt-40 md:mt-0">
        <div className="bg-amber-100 p-4 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-amber-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <p className="text-amber-800 text-lg font-medium mb-4">
          You haven't submitted any reviews yet
        </p>
        <button
          onClick={() => dispatch(fetchMyTestimonials(1, currentLimit))}
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-md"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-800 border-b-4 border-amber-600 pb-2">
        My Reviews
      </h1>

      {/* Stats Overview - Responsive Adjustments */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 border-l-4 border-amber-500">
          <div className="flex items-center">
            <div className="rounded-full bg-amber-100 p-2 md:p-3 mr-3 md:mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total Reviews</p>
              <p className="text-xl md:text-2xl font-bold text-amber-700">
                {totalReviews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-2 md:p-3 mr-3 md:mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Approved</p>
              <p className="text-xl md:text-2xl font-bold text-green-700">
                {approvedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-2 md:p-3 mr-3 md:mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6:w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18  9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Pending</p>
              <p className="text-xl md:text-2xl font-bold text-blue-700">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-2 md:p-3 mr-3 md:mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Rejected</p>
              <p className="text-xl md:text-2xl font-bold text-red-700">
                {rejectedCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg mb-6 border border-amber-200">
        <table className="min-w-full bg-white">
          <thead className="bg-amber-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Booking ID</th>
              <th className="py-3 px-4 text-left">Rating</th>
              <th className="py-3 px-4 text-left">Message</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myTestimonials.map((testimonial) => (
              <tr
                key={testimonial._id}
                className="border-b border-amber-100 hover:bg-amber-50 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-amber-800">
                  {testimonial.booking?._id?.slice(-8) || "N/A"}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <span className="font-normal ml-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 inline ${
                            i < testimonial.rating
                              ? "text-amber-500"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {truncateMessage(testimonial.comment)}
                  {testimonial.comment.length > 50 && (
                    <button
                      onClick={() => {
                        setSelectedTestimonial(testimonial);
                        setViewModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 ml-1 text-sm"
                    >
                      View more
                    </button>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      testimonial.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : testimonial.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {testimonial.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTestimonial(testimonial);
                        setViewModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-all duration-200 hover:scale-110"
                      title="View"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                      title="Delete"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0va1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {myTestimonials.map((testimonial) => (
          <div
            key={testimonial._id}
            className="bg-white rounded-lg shadow-lg p-4 border border-amber-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-amber-800">
                  Booking ID: {testimonial.booking?._id?.slice(-8) || "N/A"}
                </h3>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 inline ${
                        i < testimonial.rating
                          ? "text-amber-500"
                          : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  testimonial.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : testimonial.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {testimonial.status}
              </span>
            </div>
            <p className="mt-3 text-gray-700">
              {truncateMessage(testimonial.comment, 100)}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => {
                  setSelectedTestimonial(testimonial);
                  setViewModal(true);
                }}
                className="text-blue-600 text-sm font-medium flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                View Full
              </button>
              <button
                onClick={() => handleDelete(testimonial._id)}
                className="text-red-600 text-sm font-medium flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg p-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-amber-300 text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 53a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-full ${
                    currentPage === pageNum
                      ? "bg-amber-600 text-white"
                      : "text-amber-700 hover:bg-amber-50"
                  } border border-amber-300`}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-amber-300极text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && selectedTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setViewModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
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
            <h2 className="text-2xl font-bold text-amber-800 mb-2">
              Review Details
            </h2>
            <div className="mb-4">
              <p className="font-semibold">
                Booking ID:{" "}
                <span className="font-normal">
                  {selectedTestimonial.booking?._id?.slice(-8) || "N/A"}
                </span>
              </p>
              <p className="font-semibold mt-2">
                Rating:
                <span className="font-normal ml-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 inline ${
                        i < selectedTestimonial.rating
                          ? "text-amber-500"
                          : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </span>
              </p>
              <p className="font-semibold mt-2">
                Status:
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedTestimonial.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : selectedTestimonial.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedTestimonial.status}
                </span>
              </p>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-amber-700">Message:</h3>
              <p className="mt-2 text-gray-700 bg-amber-50 p-3 rounded">
                {selectedTestimonial.comment}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewModal(false)}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
