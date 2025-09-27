import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUserFriends, FaRupeeSign } from "react-icons/fa";

const BookingCardStatic = () => {
  return (
    <div className=" bg-amber-50 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-amber-300 relative">
      {/* Decorative corner elements */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 w-4 sm:w-6 h-4 sm:h-6 border-t-2 border-l-2 border-amber-500 rounded-tl-lg"></div>
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-4 sm:w-6 h-4 sm:h-6 border-t-2 border-r-2 border-amber-500 rounded-tr-lg"></div>
      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 w-4 sm:w-6 h-4 sm:h-6 border-b-2 border-l-2 border-amber-500 rounded-bl-lg"></div>
      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-4 sm:w-6 h-4 sm:h-6 border-b-2 border-r-2 border-amber-500 rounded-br-lg"></div>

      {/* Image with overlay */}
      <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent z-10" />
        <img
          src="/static_image .jpg"
          alt="पन्हाळा ते पावनखिंड"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute left-2 sm:left-4 bottom-2 sm:bottom-4 z-20 bg-amber-500/90 backdrop-blur-sm rounded sm:rounded-lg px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold text-white">
          पन्हाळा → पावनखिंड
        </div>

        {/* Decorative emblem */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-6 sm:w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-5 bg-gradient-to-b from-amber-50 to-amber-100">
        <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-1 sm:mb-2 text-center">
          राहण्याची आणि जेवणाची सोय
        </h3>

        <div className="h-0.5 sm:h-1 w-12 sm:w-16 bg-amber-500 mx-auto mb-2 sm:mb-3 rounded-full"></div>

        <p className="text-amber-800 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base text-center">
          पन्हाळा ते पावनखिंड ट्रेकचे ट्रेकर्ससाठी आरक्षित सुविधा — सुरक्षित आणि
          आरामदायी राहण्याची सोय, veg/ non-veg जेवण, आणि गरम चहा. ग्रुपसाठी
          आरामदायी व्यवस्था.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <Link
            to="/booking"
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 font-medium shadow-md w-full sm:flex-1 text-center flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            बुक करा
          </Link>

          <Link
            to="/book/details"
            className="px-3 py-2 border border-amber-400 text-amber-700 rounded-lg text-xs sm:text-sm hover:bg-amber-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-1 w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            अधिक माहिती
          </Link>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 sm:h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"></div>
    </div>
  );
};

export default BookingCardStatic;
