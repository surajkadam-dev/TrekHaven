import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getAccommodation } from "../store/slices/adminSlice.js";
import { clearAllErrors } from "../store/slices/userSlice.js";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaHiking,
  FaUtensils,
  FaArrowLeft,
  FaHome,
  FaUserFriends,
  FaBed,
  FaGlobe,
  FaSpinner,
} from "react-icons/fa";

const StaticTrekDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toastShown = useRef(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState("english"); // 'marathi' or 'english'

  const { accommodation } = useSelector((store) => store.admin);
  const { isAuthenticated, message, error, user } = useSelector(
    (store) => store.user
  );
  const total = accommodation?.vegRate + accommodation?.pricePerNight;

  useEffect(() => {
    dispatch(getAccommodation());
  }, [navigate, dispatch, error]);

  useEffect(() => {
    // Simulate loading delay for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "marathi" ? "english" : "marathi");
  };

  // Content based on selected language
  const content = {
    marathi: {
      title: "पन्हाळा ते पावनखिंड - साधी राहणी व जेवण",
      back: "मागे जा",
      services: "आमच्या साध्या सेवा",
      description:
        "आम्ही आमच्या गावातील साध्या सोयी पुरवतो. ५-स्टार सुविधा नसल्या तरी स्वच्छता आणि साधेपणा यावर आम्ही भर देतो. ट्रेकर्सना मुळातील ग्रामीण अनुभव देणे हा आमचा हेतू.",
      accommodation: "राहण्याची सोय",
      accommodationItems: [
        "साधे स्वच्छ खोली (शेअर्ड)",
        "एसी / वाय-फाय / लग्जरी सुविधा उपलब्ध नाहीत",
        "झोपण्याचे साहित्य आपण आणाल",
        "मोफत पिण्याचे पाणी",
      ],
      meals: "जेवण व्यवस्था",
      mealsItems: [
        "घरगुती शाकाहारी जेवण",
        "मांसाहारी जेवण (अगोदर मागणी करावी)",
        "स्थानिक पद्धतीचा नाश्ता",
      ],
      note: "लक्षात ठेवा:",
      noteText:
        "आमच्या गावातील सुविधा शहरापेक्षा वेगळ्या आहेत. एसी, वायफाय किंवा लग्जरी सुविधा उपलब्ध नाहीत. निसर्गाच्या जवळ साधेपणाने राहण्याचा अनुभव घेण्यासाठी आपले स्वागत आहे.",
      bookingInfo: "बुकिंग माहिती",
      people: "किती लोक राहतील?",
      peopleDesc:
        "एका खोलीत जास्तीत जास्त ४ व्यक्ती राहू शकतात. मोठ्या ग्रुपसाठी कृपया आधी संपर्क करा.",
      mealType: "जेवण प्रकार निवडा",
      mealTypeDesc:
        "बुकिंग करताना शाकाहारी (veg) किंवा मांसाहारी (nonveg) जेवण निवडावे लागेल. एकदा निवड केल्यानंतर बदल शक्य नाही.",
      nights: "किती रात्री राहाल?",
      nightsDesc:
        "सामान्यपणे ट्रेकर्स १ ते २ रात्री राहतात. अधिक रात्री राहण्यासाठी आधी कळवावे.",
      perPerson: "/व्यक्ती/रात्र",
      bookNow: "बुकिंग करा",
      minNights: "किमान रात्री",
      payment: "पैसे भरणे",
      paymentMethod: "रोख / ऑनलाइन",
      cancellation: "रद्द करणे",
      cancellationPolicy: "24 तास आधी",
      location: "करपेवाडी , शाहूवाडी ",
    },
    english: {
      title: "Panhala to Pawan Khind - Simple Accommodation & Meals",
      back: "Go Back",
      services: "Our Simple Services",
      description:
        "We provide basic facilities from our village. While we don't have 5-star amenities, we emphasize cleanliness and simplicity. Our goal is to give trekkers an authentic rural experience.",
      accommodation: "Accommodation",
      accommodationItems: [
        "Simple clean room (shared)",
        "AC / WiFi / Luxury amenities not available",
        "You need to bring your own bedding",
        "Free drinking water",
      ],
      meals: "Meal Arrangements",
      mealsItems: [
        "Homemade vegetarian meals",
        "Non-vegetarian meals (request in advance)",
        "Local style breakfast",
      ],
      note: "Please Note:",
      noteText:
        "Our village facilities are different from city amenities. AC, WiFi or luxury facilities are not available. You're welcome to experience simple living close to nature.",
      bookingInfo: "Booking Information",
      people: "How many people will stay?",
      peopleDesc:
        "Maximum 4 people can stay in one room. For larger groups, please contact in advance.",
      mealType: "Choose Meal Type",
      mealTypeDesc:
        "When booking, you'll need to choose vegetarian (veg) or non-vegetarian (nonveg) meals. Once selected, changes are not possible.",
      nights: "How many nights will you stay?",
      nightsDesc:
        "Typically trekkers stay 1 to 2 nights. For longer stays, please inform in advance.",
      perPerson: "/person/night",
      bookNow: "Book Now",
      minNights: "Minimum nights",
      payment: "Payment",
      paymentMethod: "Cash / Online",
      cancellation: "Cancellation",
      cancellationPolicy: "24 hours prior",
      location: "Karapewadi, Shahuwadi",
    },
  };

  const currentContent = content[language];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-green-600 text-4xl mb-4"
          >
            <FaSpinner />
          </motion.div>
          <p className="text-green-800 font-medium">
            {language === "marathi" ? "लोड होत आहे..." : "Loading..."}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Decorative top border */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.5 }}
        className="h-2 bg-gradient-to-r from-green-400 via-green-600 to-green-400"
      />

      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent z-10" />
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7 }}
          src="/pawankhind.jpeg"
          alt="पन्हाळा ते पावनखिंड"
          className="w-full h-full object-cover"
        />

        {/* Back Button and Language Toggle */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 text-green-800 rounded-lg hover:bg-white transition-all duration-300 backdrop-blur-sm shadow-md border border-green-200"
          >
            <FaArrowLeft />
            {currentContent.back}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 text-green-800 rounded-lg hover:bg-white transition-all duration-300 backdrop-blur-sm shadow-md border border-green-200"
          >
            <FaGlobe />
            {language === "marathi" ? "English" : "मराठी"}
          </motion.button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-6 text-white z-10">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-center md:text-left"
            >
              {currentContent.title}
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
              transition={{ delay: 0.4 }}
              className="h-1 bg-green-300 rounded-full mx-auto md:mx-0"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-10 md:-mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Details & Meals */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-green-200 relative overflow-hidden"
            >
              {/* Decorative element */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-100 rounded-full opacity-50" />

              <h2 className="text-2xl font-bold text-green-900 mb-4 text-center relative z-10">
                {currentContent.services}
              </h2>

              <div className="text-green-800 relative z-10">
                <p className="mb-4 text-center">{currentContent.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="text-xl font-semibold mb-3 text-green-900 flex items-center gap-2">
                      <FaBed className="text-green-700" />
                      {currentContent.accommodation}
                    </h3>
                    <ul className="space-y-2">
                      {currentContent.accommodationItems.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-start"
                        >
                          <span className="text-green-700 mr-2">•</span>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="text-xl font-semibold mb-3 text-green-900 flex items-center gap-2">
                      <FaUtensils className="text-green-700" />
                      {currentContent.meals}
                    </h3>
                    <ul className="space-y-2">
                      {currentContent.mealsItems.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="flex items-start"
                        >
                          <span className="text-green-700 mr-2">•</span>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mt-6 p-4 bg-green-100 rounded-lg border border-green-200"
                >
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-green-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {currentContent.note}
                  </h4>
                  <p className="text-green-800">{currentContent.noteText}</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Additional Details */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-green-200"
            >
              <h3 className="text-xl font-bold text-green-900 mb-4 text-center">
                {currentContent.bookingInfo}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-medium mb-2 text-green-900 flex items-center">
                    <FaUtensils className="mr-2 text-green-700" />
                    {currentContent.mealType}
                  </h4>
                  <p className="text-green-800 text-sm">
                    {currentContent.mealTypeDesc}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-medium mb-2 text-green-900 flex items-center">
                    <FaCalendarAlt className="mr-2 text-green-700" />
                    {currentContent.nights}
                  </h4>
                  <p className="text-green-800 text-sm">
                    {currentContent.nightsDesc}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Booking Sidebar */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 h-fit top-4 border border-green-200 sticky"
          >
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-green-800">
                ₹{total}
              </span>
              <span className="ml-1 text-green-700">
                {currentContent.perPerson}
              </span>
            </div>

            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/booking")}
              className="w-full py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition mb-5 flex items-center justify-center gap-2 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {currentContent.bookNow}
            </motion.button>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-green-50 rounded-md border border-green-100">
                <span className="text-green-800">
                  {currentContent.minNights}
                </span>
                <span className="font-medium text-green-900">1</span>
              </div>

              <div className="flex justify-between p-3 bg-green-50 rounded-md border border-green-100">
                <span className="text-green-800">{currentContent.payment}</span>
                <span className="font-medium text-green-900">
                  {currentContent.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between p-3 bg-green-50 rounded-md border border-green-100">
                <span className="text-green-800">
                  {currentContent.cancellation}
                </span>
                <span className="font-medium text-green-900">
                  {currentContent.cancellationPolicy}
                </span>
              </div>
            </div>

            {/* Decorative element at bottom */}
            <div className="mt-6 pt-4 border-t border-green-200 text-center">
              <p className="text-green-700 text-sm flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {currentContent.location}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="h-2 bg-gradient-to-r from-green-400 via-green-600 to-green-400 mt-8"
      />
    </div>
  );
};

export default StaticTrekDetails;
