import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RefundTimeline from "./RefundTimeline";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiCalendar,
  FiCreditCard,
  FiStar,
  FiBook,
  FiDollarSign,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPhone,
  FiShield,
} from "react-icons/fi";
import { toast } from "react-toastify";

// UserHeader Component
const UserHeader = ({
  user,
  onBlock,
  onUnblock,
  isBlocking,
  isUnblocking,
  navigate,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FiArrowLeft className="text-lg" />
          Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          User Details
        </h1>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onBlock}
          disabled={user?.isBlocked || isBlocking}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            user?.isBlocked || isBlocking
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {isBlocking ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiXCircle className="text-lg" />
          )}
          {isBlocking ? "Blocking..." : "Block User"}
        </button>

        <button
          onClick={onUnblock}
          disabled={!user?.isBlocked || isUnblocking}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            !user?.isBlocked || isUnblocking
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isUnblocking ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiCheckCircle className="text-lg" />
          )}
          {isUnblocking ? "Unblocking..." : "Unblock User"}
        </button>
      </div>
    </div>
  );
};

// UserInfoCard Component
const UserInfoCard = ({ user, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-pulse">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <FiUser className="w-12 h-12 text-green-600" />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
          <p className="text-gray-600 mb-4">
            User ID: {user._id.substring(0, 8)}...
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FiMail className="text-green-600" />
              <span className="text-gray-700">{user.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <FiCalendar className="text-green-600" />
              <span className="text-gray-700">
                Joined: {formatDate(user.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FiShield className="text-green-600" />
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize">
                {user.role}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  user.isBlocked ? "bg-red-500" : "bg-green-500"
                }`}
              ></div>
              <span className="text-gray-700">
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tabs Component
const Tabs = ({ activeTab, setActiveTab, counts }) => {
  const tabs = [
    { id: "bookings", label: "Bookings", icon: FiBook, count: counts.bookings },
    {
      id: "payments",
      label: "Payments",
      icon: FiCreditCard,
      count: counts.payments,
    },
    { id: "reviews", label: "Reviews", icon: FiStar, count: counts.reviews },
    {
      id: "refunds",
      label: "Refunds",
      icon: FiDollarSign,
      count: counts.refunds,
    },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex flex-wrap gap-2 md:gap-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-green-600 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="text-lg" />
              <span>{tab.label}</span>
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// HistoryList Component
const HistoryList = ({ activeTab, data, loading }) => {
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const navigate = useNavigate();

  const handleViewTimeline = (refund) => {
    setSelectedRefund(refund);
    setShowTimeline(true);
  };

  const handleBackToRefunds = () => {
    setShowTimeline(false);
    setSelectedRefund(null);
  };

  if (showTimeline && selectedRefund) {
    return (
      <RefundTimeline
        timeline={selectedRefund.timeline}
        onBack={handleBackToRefunds}
        refundData={selectedRefund}
      />
    );
  }
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <FiAlertCircle className="mx-auto text-gray-400 text-4xl mb-4" />
        <p className="text-gray-500">No {activeTab} found</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderBookingItem = (booking) => (
    <div
      key={booking._id}
      className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 
               transition-transform hover:scale-[1.01] hover:shadow-lg"
    >
      {/* Top section */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 text-base">
          Booking #{booking._id?.substring(0, 8)}
        </h3>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
          ${
            booking.status === "confirmed"
              ? "bg-green-100 text-green-800"
              : booking.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : booking.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {booking.status}
        </span>
      </div>

      {/* Details section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
        <div className="flex flex-col">
          <span className="font-medium text-gray-500">Meal</span>
          <span>{booking.mealType || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-500">Date</span>
          <span>{formatDate(booking.stayDate)}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-500">Participants</span>
          <span>{booking.groupSize || 0}</span>
        </div>
      </div>
    </div>
  );

  const renderPaymentItem = (payment) => (
    <div
      key={payment._id}
      className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800">
          Payment #{payment._id.substring(0, 8)}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            payment.status === "paid"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {payment.status}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
        <div>Amount: ₹{payment.amount}</div>
        <div>Date: {formatDate(payment.createdAt)}</div>
      </div>
    </div>
  );

  const renderReviewItem = (review) => (
    <div
      key={review._id}
      className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <FiStar
              key={i}
              className={
                i < review.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(review.createdAt)}
        </span>
      </div>
      <p className="text-gray-700">{review.comment || "No comment provided"}</p>
    </div>
  );

  const renderRefundItem = (refund) => (
    <div
      key={refund._id}
      className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800">
          Refund #{refund._id.substring(0, 8)}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            refund.status === "refunded"
              ? "bg-green-100 text-green-800"
              : refund.status === "processing"
              ? "bg-blue-100 text-blue-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {refund.status}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
        <div>Amount: ₹{refund.amount}</div>
        <div>Reason: {refund.reason}</div>
        <div>Date: {formatDate(refund.createdAt)}</div>
      </div>
      <div className="w-full flex justify-end items-center">
        <button
          onClick={() => handleViewTimeline(refund)}
          className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded-md flex items-center transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Timeline
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((item) => {
          switch (activeTab) {
            case "bookings":
              return renderBookingItem(item);
            case "payments":
              return renderPaymentItem(item);
            case "reviews":
              return renderReviewItem(item);
            case "refunds":
              return renderRefundItem(item);
            default:
              return null;
          }
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
        {activeTab === "bookings" && data.length > 0 && (
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Meal Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((booking) => (
                <tr
                  key={booking._id}
                  className="hover:bg-green-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{booking._id?.substring(0, 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {booking.mealType || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {formatDate(booking.stayDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {booking.groupSize || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-green-600 hover:text-green-900 mr-3"
                      onClick={() => {
                        navigate(`/admin/users/booking/${booking._id}`);
                      }}
                    >
                      view
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "payments" && data.length > 0 && (
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Amount
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-green-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{payment._id?.substring(0, 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      ₹{payment.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {formatDate(payment.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "reviews" && data.length > 0 && (
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((review) => (
                <tr
                  key={review._id}
                  className="hover:bg-green-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar
                          key={i}
                          className={
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-md truncate">
                      {review.comment || "No comment provided"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {formatDate(review.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "refunds" && data.length > 0 && (
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Refund ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((refund) => (
                <tr
                  key={refund._id}
                  className="hover:bg-green-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{refund._id?.substring(0, 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      ₹{refund.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-md truncate">
                      {refund.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          refund.status === "refunded"
                            ? "bg-green-100 text-green-800"
                            : refund.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {refund.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {formatDate(refund.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewTimeline(refund)}
                      className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded-md flex items-center transition duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Timeline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

// Main UserDetails Component
const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blockLoading, setBlockLoading] = useState(false);
  const [unblockLoading, setUnblockLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://trekrest.onrender.com/api/v1/admin/${id}/user/detail`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.success) {
          setUserDetails(data.data);
        } else {
          toast.error(data.message);
          navigate("/dashboard");
        }
      } catch (error) {
        toast.error("Failed to fetch user details");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, navigate]);

  const handleBlockUser = async () => {
    try {
      setBlockLoading(true);
      const response = await fetch(
        `https://trekrest.onrender.com/api/v1/admin/${id}/block/user`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("User blocked successfully");
        setUserDetails((prev) => ({
          ...prev,
          user: { ...prev.user, isBlocked: true },
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to block user");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblockUser = async () => {
    try {
      setUnblockLoading(true);
      const response = await fetch(
        `https://trekrest.onrender.com/api/v1/admin/${id}/unblock/user`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("User unblocked successfully");
        setUserDetails((prev) => ({
          ...prev,
          user: { ...prev.user, isBlocked: false },
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to unblock user");
    } finally {
      setUnblockLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-pulse">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-full mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FiAlertCircle className="mx-auto text-4xl text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            User not found
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <UserHeader
          user={userDetails.user}
          onBlock={handleBlockUser}
          onUnblock={handleUnblockUser}
          isBlocking={blockLoading}
          isUnblocking={unblockLoading}
          navigate={navigate}
        />

        <UserInfoCard user={userDetails.user} loading={loading} />

        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={{
            bookings: userDetails.histories.bookings.length,
            payments: userDetails.histories.payments.length,
            reviews: userDetails.histories.reviews.length,
            refunds: userDetails.histories.refunds.length,
          }}
        />

        <HistoryList
          activeTab={activeTab}
          data={userDetails.histories[activeTab]}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default UserDetails;
