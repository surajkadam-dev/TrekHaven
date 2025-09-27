import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

// Decorative Corner Element Component
const CornerElement = ({ position = "top-left" }) => {
  const positionClasses = {
    "top-left": "top-4 left-4 border-t-2 border-l-2",
    "top-right": "top-4 right-4 border-t-2 border-r-2",
    "bottom-left": "bottom-4 left-4 border-b-2 border-l-2",
    "bottom-right": "bottom-4 right-4 border-b-2 border-r-2",
  };

  return (
    <div
      className={`absolute w-12 h-12 border-amber-400 opacity-70 ${positionClasses[position]}`}
      aria-hidden="true"
    />
  );
};

// Scroll Indicator Component
const ScrollIndicator = () => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
    <div className="animate-bounce flex flex-col items-center">
      <span className="text-amber-200 text-sm mb-1">स्क्रोल करा</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-amber-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  </div>
);

const HeroBanner = ({ onBookClick, textVariants: customTextVariants }) => {
  const [currentText, setCurrentText] = useState(0);
  const [isTextPaused, setIsTextPaused] = useState(false);

  const defaultTextVariants = [
    "करपेवडी — पन्हाळा ते पावनखिंड मार्गावरील ट्रेकर्ससाठी निवास व जेवण",
    "आम्ही फक्त करपेवडी येथे सेवा पुरवतो — मार्गदर्शन किंवा ट्रेक देत नाही",
    "स्वच्छता, साधेपणा आणि स्थानिक घरगुती जेवण यावर आमचा विश्वास",
  ];

  const textVariants = customTextVariants || defaultTextVariants;

  useEffect(() => {
    if (isTextPaused) return;

    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % textVariants.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isTextPaused, textVariants.length]);

  const handleMoreInfo = () => {
    // Scroll to about section or open modal
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[400px] md:min-h-[600px] overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-full pattern-dots pattern-amber-500 pattern-opacity-30 pattern-size-4"></div>
        <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-amber-600 rounded-full mix-blend-overlay opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 -ml-48 -mb-48 bg-amber-500 rounded-full mix-blend-overlay opacity-20"></div>
      </div>

      {/* Maratha-inspired border pattern */}
      <div
        className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"
        aria-hidden="true"
      ></div>
      <div
        className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"
        aria-hidden="true"
      ></div>

      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 md:mb-6"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
              पन्हाळा ते पावनखिंड ट्रेकर्ससाठी आदर्श निवासस्थान
            </h1>

            <div
              className="relative h-16 sm:h-20 md:h-24 lg:h-28 flex items-center justify-center"
              onMouseEnter={() => setIsTextPaused(true)}
              onMouseLeave={() => setIsTextPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentText}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                  className="absolute text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-200 px-2"
                  aria-live="polite"
                >
                  {textVariants[currentText]}
                </motion.h2>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-6 md:mb-8 lg:mb-10 px-2"
          >
            कृपया लक्षात घ्या: आम्ही केवळ करपेवडी या ठिकाणी ट्रेकर्ससाठी
            राहण्याची व जेवणाची सोय उपलब्ध करतो. ट्रेक, मार्गदर्शन किंवा
            ट्रॅव्हल सेवा आम्ही नाही देत. आमची प्राथमिकता स्वच्छता, साधेपणा आणि
            स्थानिक घरगुती जेवण आहे.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={onBookClick}
              className="px-6 py-2 md:px-8 md:py-3 text-sm md:text-base bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              ट्रेक बुक करा
            </button>

            <button
              onClick={handleMoreInfo}
              className="px-6 py-2 md:px-8 md:py-3 text-sm md:text-base bg-transparent border-2 border-amber-400 text-amber-300 font-bold rounded-full hover:bg-amber-400 hover:text-amber-900 transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 focus:outline-none"
            >
              अधिक माहिती
            </button>
          </motion.div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <CornerElement position="top-left" />
      <CornerElement position="top-right" />
      <CornerElement position="bottom-left" />
      <CornerElement position="bottom-right" />

      <ScrollIndicator />
    </div>
  );
};

HeroBanner.propTypes = {
  onBookClick: PropTypes.func.isRequired,
  textVariants: PropTypes.arrayOf(PropTypes.string),
};

export default HeroBanner;
