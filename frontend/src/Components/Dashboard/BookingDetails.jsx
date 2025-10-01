import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiUsers,
  FiHome,
  FiCoffee,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiClock,
  FiShield,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingDetails = () => {
  const { id } = useParams();
  console.log("id: ", id);
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://trekrest.onrender.com/api/v1/booking/${id}/booking/details`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await response.json();
        console.log("data: ", data);

        if (data.success) {
          setBooking(data.data);
        } else {
          toast.error(data.message);
          navigate("/admin/bookings");
        }
      } catch (error) {
        toast.error("Failed to fetch booking details");
        navigate("/admin/bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  console.log("booking:", booking);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      // Implement your status update API call here
      toast.success(`Booking status updated to ${newStatus}`);
      setBooking((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      toast.error("Failed to update booking status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FiAlertCircle className="mx-auto text-4xl text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Booking not found
          </h2>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
              Booking Details
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                booking.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : booking.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {booking.status}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Customer Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUser className="text-green-600" />
              Customer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Full Name
                </span>
                <span className="text-gray-800">{booking.name}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Email Address
                </span>
                <span className="text-gray-800 flex items-center gap-2">
                  <FiMail className="text-green-600" />
                  {booking.email}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Phone Number
                </span>
                <span className="text-gray-800 flex items-center gap-2">
                  <FiPhone className="text-green-600" />
                  {booking.phone}
                </span>
              </div>

              {booking.groupName && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 mb-1">
                    Group/Organization
                  </span>
                  <span className="text-gray-800">{booking.groupName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCalendar className="text-green-600" />
              Booking Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Stay Date
                </span>
                <span className="text-gray-800 flex items-center gap-2">
                  <FiCalendar className="text-green-600" />
                  {formatDate(booking.stayDate)}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Group Size
                </span>
                <span className="text-gray-800 flex items-center gap-2">
                  <FiUsers className="text-green-600" />
                  {booking.groupSize}{" "}
                  {booking.groupSize === 1 ? "Person" : "People"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Accommodation Needed
                </span>
                <span className="text-gray-800 flex items-center gap-2">
                  <FiHome className="text-green-600" />
                  {booking.needStay ? "Yes" : "No"}
                </span>
              </div>

              {booking.needStay && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 mb-1">
                    Nights of Stay
                  </span>
                  <span className="text-gray-800">
                    {booking.stayNight} Night(s)
                  </span>
                </div>
              )}

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Meal Preference
                </span>
                <span className="text-gray-800 flex items-center gap-2">
                  <FiCoffee className="text-green-600" />
                  {booking.mealType === "veg" ? "Vegetarian" : "Non-Vegetarian"}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCreditCard className="text-green-600" />
              Payment Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Total Amount
                </span>
                <span className="text-xl font-semibold text-green-700">
                  {formatCurrency(booking.amount)}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Payment Mode
                </span>
                <span className="text-gray-800 capitalize">
                  {booking.paymentMode}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Payment Status
                </span>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.paymentStatus === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Deposit Amount
                </span>
                <span className="text-gray-800 flex items-center gap-2">
                  {booking.paymentMode === "cash" ? (
                    <FiCheckCircle className="text-green-600" />
                  ) : (
                    <FiXCircle className="text-red-600" />
                  )}
                  {booking.paymentMode === "cash" &&
                    formatCurrency(booking.depositAmount)}{" "}
                  {booking.paymentMode === "online" ? "Not Required" : "(Paid)"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Remaining Amount
                </span>
                <span className="text-gray-800">
                  {formatCurrency(booking.remainingAmount)}
                </span>
              </div>

              {booking.transactionId && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 mb-1">
                    Transaction ID
                  </span>
                  <span className="text-gray-800 font-mono text-sm">
                    {booking.transactionId}
                  </span>
                </div>
              )}

              {booking.razorpayOrderId && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 mb-1">
                    Razorpay Order ID
                  </span>
                  <span className="text-gray-800 font-mono text-sm">
                    {booking.razorpayOrderId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Refund Information */}
          {booking.refundRequested && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiDollarSign className="text-green-600" />
                Refund Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 mb-1">
                    Refund Status
                  </span>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.refundStatus === "processed"
                        ? "bg-green-100 text-green-800"
                        : booking.refundStatus === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.refundStatus}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 mb-1">
                    Refund Amount
                  </span>
                  <span className="text-green-700 font-semibold">
                    {formatCurrency(booking.refundAmount)}
                  </span>
                </div>

                {booking.refundStatus === "processing" && (
                  <div className="md:col-span-2 bg-yellow-50 p-4 rounded-lg flex items-start gap-3">
                    <FiClock className="text-yellow-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-800">
                        Refund in Progress
                      </h3>
                      <p className="text-yellow-700 text-sm mt-1">
                        This refund is currently being processed. It may take
                        5-7 business days to reflect in the customer's account.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4 justify-end">
          {booking.status === "confirmed" && (
            <button
              onClick={() => handleStatusUpdate("cancelled")}
              disabled={updating}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {updating ? <FiLoader className="animate-spin" /> : <FiXCircle />}
              Cancel Booking
            </button>
          )}

          {booking.status === "cancelled" &&
            booking.paymentStatus !== "refunded" && (
              <button
                onClick={() => handleStatusUpdate("confirmed")}
                disabled={updating}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {updating ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <FiCheckCircle />
                )}
                Reinstate Booking
              </button>
            )}

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FiShield />
            Generate Invoice
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default BookingDetails;
