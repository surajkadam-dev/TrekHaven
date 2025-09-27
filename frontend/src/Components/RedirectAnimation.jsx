import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaHome, FaTimes } from "react-icons/fa";

const RedirectAnimation = ({
  redirectUrl = "/dashboard",
  duration = 5000,
  bookingResult = null,
  onClose = null,
  show = true,
}) => {
  const [remainingTime, setRemainingTime] = useState(duration);
  const navigate = useNavigate();
  const circumference = 2 * Math.PI * 45;

  useEffect(() => {
    // Reset timer when component is shown
    setRemainingTime(duration);
  }, [show, duration]);

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = Math.max(0, prev - 10);
        if (newTime <= 0) {
          clearInterval(interval);
          window.location.href = redirectUrl;
          return 0;
        }
        return newTime;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [show, navigate, redirectUrl]);

  if (!show) return null;

  const progress = circumference - (remainingTime / duration) * circumference;
  console.log("bookingResult:", bookingResult);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-lg w-full relative">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        )}

        <div className="text-center">
          {/* Check icon with circular progress */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
              {/* Circular progress around the check icon */}
              <svg
                className="absolute top-0 left-0 w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  className="text-green-100"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-green-500 transition-all duration-100"
                  strokeWidth="6"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                  strokeDasharray={circumference}
                  strokeDashoffset={progress}
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-green-700 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            Your booking has been successfully processed. Thank you for choosing
            us!
          </p>

          {/* Booking details */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 max-w-md mx-auto">
            <p className="font-semibold">
              Reference ID:{" "}
              {bookingResult?._id || bookingResult?.id
                ? bookingResult._id || bookingResult.id
                : `MS-${Date.now().toString().slice(-6)}`}
            </p>
            {bookingResult?.createdAt && (
              <p className="mt-2">
                Booked on: {new Date(bookingResult.createdAt).toLocaleString()}
              </p>
            )}
            {bookingResult?.amount && (
              <p className="mt-2">Amount: ₹{bookingResult.amount}</p>
            )}
            <p className="mt-2">Your receipt has been sent to your email</p>
          </div>

          {/* Countdown text */}
          <p className="text-gray-600 my-6">
            Redirecting to dashboard in {(remainingTime / 1000).toFixed(1)}{" "}
            seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default RedirectAnimation;
