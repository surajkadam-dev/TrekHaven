import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaArrowLeft,
  FaExclamationTriangle,
  FaMountain,
} from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-9xl font-bold text-green-800 mb-4 flex justify-center items-center"
          >
            <motion.span
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block"
            >
              4
            </motion.span>
            <motion.span
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.7, type: "spring" }}
              className="inline-block mx-2 text-green-600"
            >
              <FaExclamationTriangle className="inline mb-5" />
            </motion.span>
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="inline-block"
            >
              4
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-green-900 mb-4"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-lg text-green-700 mb-8 max-w-2xl mx-auto"
          >
            Oops! The page you're looking for seems to have wandered off the
            trail. Don't worry, even the best explorers sometimes take wrong
            turns.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-green-200 mb-8"
        >
          <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center justify-center">
            <FaMountain className="mr-2 text-green-600" />
            Here's what you can do:
          </h2>
          <ul className="text-green-700 space-y-2 max-w-xl mx-auto">
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex items-start"
            >
              <span className="text-green-500 mr-2">•</span>
              Double-check the URL for any mistakes
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="flex items-start"
            >
              <span className="text-green-500 mr-2">•</span>
              Return to our homepage and navigate from there
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="flex items-start"
            >
              <span className="text-green-500 mr-2">•</span>
              Use the search function to find what you need
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="flex items-start"
            >
              <span className="text-green-500 mr-2">•</span>
              Contact our support team if you need further assistance
            </motion.li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium hover:bg-green-200 transition-colors"
          >
            <FaArrowLeft />
            Go Back
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <FaHome />
            Go to Homepage
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          className="mt-12 text-center text-green-600"
        >
          <p>
            Still lost? Email us at{" "}
            <span className="font-semibold">surajkadam1706004@gmail.com</span>
          </p>
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.3, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
            className="absolute text-green-300 text-6xl md:text-8xl"
            style={{
              top: `${20 + i * 15}%`,
              left: `${5 + i * 20}%`,
              rotate: `${i * 15}deg`,
            }}
          >
            <FaMountain />
          </motion.div>
        ))}

        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i + 5}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.2, y: 0 }}
            transition={{ delay: i * 0.2 + 0.5, duration: 0.8 }}
            className="absolute text-green-300 text-6xl md:text-8xl"
            style={{
              bottom: `${10 + i * 15}%`,
              right: `${5 + i * 20}%`,
              rotate: `${i * -20}deg`,
            }}
          >
            <FaMountain />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotFound;
