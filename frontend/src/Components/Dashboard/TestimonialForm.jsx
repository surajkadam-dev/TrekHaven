import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  submitTestimonial,
  resetTestimonialState,
} from "../../store/slices/TestimonialSlice";
import { getMyBookings } from "../../store/slices/bookSlice";

const TestimonialForm = () => {
  const { user } = useSelector((store) => store.user);
  const testimonialState = useSelector((store) => store.testimonial);
  const dispatch = useDispatch();
  const { myBooking } = useSelector((store) => store.booking);

  // Extract message and error from testimonial state
  const message = testimonialState?.message || "";
  const error = testimonialState?.error || "";
  const loading = testimonialState?.loading || false;

  const [formData, setFormData] = useState({
    stayDate: "",
    comment: "",
    rating: 1,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (message) {
      dispatch(getMyBookings());
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        dispatch(resetTestimonialState());
        setFormData({
          stayDate: "",
          comment: "",
          rating: 1,
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(getMyBookings());
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        dispatch(resetTestimonialState());
        setFormData({
          stayDate: "",
          comment: "",
          rating: 1,
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "rating"
          ? parseInt(value, 10)
          : name === "comment"
          ? value.trimStart() // prevents leading spaces
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const testimonialData = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      ...formData,
    };

    dispatch(submitTestimonial(testimonialData));
  };

  const handleReset = () => {
    dispatch(resetTestimonialState());
    setFormData({
      stayDate: "",
      comment: "",
      rating: 1,
    });
    setShowSuccess(false);
    setShowError(false);
  };

  return (
    <div className="min-h-screen bg-white py-4 md:py-8 px-2 md:px-4 mt-20 md:mt-0">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {/* Notification Area */}
        <div className="relative">
          {/* Success Message */}
          {showSuccess && (
            <div className="absolute top-0 left-0 right-0 z-10 animate-fade-in">
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mx-4 mt-4 shadow-lg">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
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
                  <p className="font-medium">{message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {showError && (
            <div className="absolute top-0 left-0 right-0 z-10 animate-fade-in">
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mx-4 mt-4 shadow-lg">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="bg-[#6B8E23] text-white py-6 px-4 md:px-6 relative">
          <div className="absolute top-4 left-4 w-3 h-3 border-2 border-white opacity-50 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 border-2 border-white opacity-50 rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-center uppercase tracking-wide">
            Share Your Experience
          </h1>
          <p className="text-center text-white opacity-90 mt-2 text-sm md:text-base">
            We value your feedback about your stay
          </p>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#6B8E23]">
            User Information
          </h2>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p className="truncate">
              <span className="font-medium text-gray-700">Name:</span>{" "}
              {user.name}
            </p>
            <p className="truncate">
              <span className="font-medium text-gray-700">Email:</span>{" "}
              {user.email}
            </p>
          </div>
        </div>

        {/* Testimonial Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          {/* Stay Date */}
          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="stayDate"
            >
              Stay Date
            </label>

            {myBooking.filter((b) => b.status === "completed").length === 0 ? (
              <p className="text-red-500 text-sm">
                No completed booking stay date
              </p>
            ) : (
              <select
                id="stayDate"
                name="stayDate"
                value={formData.stayDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                required
              >
                <option value="">-- Select Stay Date --</option>
                {myBooking
                  .filter((b) => b.status === "completed")
                  .map((b) => (
                    <option key={b._id} value={b.stayDate}>
                      {new Date(b.stayDate).toDateString()}
                    </option>
                  ))}
              </select>
            )}
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <React.Fragment key={star}>
                  <input
                    type="radio"
                    id={`star-${star}`}
                    name="rating"
                    value={star}
                    checked={formData.rating === star}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label
                    htmlFor={`star-${star}`}
                    className={`text-2xl cursor-pointer transition-transform hover:scale-110 ${
                      star <= formData.rating
                        ? "text-[#6B8E23]"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </label>
                </React.Fragment>
              ))}
              <span className="ml-2 text-[#6B8E23] font-medium">
                {formData.rating} / 5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="comment"
            >
              Your Experience
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
              placeholder="Share your experience at our property..."
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#6B8E23] text-white rounded-lg font-medium hover:bg-[#5A7A1F] transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  Submitting...
                </>
              ) : (
                <>
                  Submit Testimonial
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-100 text-gray-600 py-3 px-4 md:px-6 text-center text-xs md:text-sm border-t border-gray-200">
          <p>Your feedback helps us improve our services • Thank you!</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialForm;
