import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaArrowLeft,
  FaLock,
  FaExclamationTriangle,
  FaEnvelope,
  FaUserShield,
  FaMountain,
} from "react-icons/fa";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Access Denied | Trek Adventures";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {/* Animated Lock Icon */}
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full blur-lg opacity-70 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-700 p-6 rounded-2xl shadow-lg border-4 border-white">
                <FaLock className="text-5xl text-white" />
              </div>
            </div>
          </motion.div>

          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-6xl font-bold text-emerald-900 mb-2"
          >
            403
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4"
          >
            Access Forbidden
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-lg text-emerald-700 mb-8 max-w-2xl mx-auto"
          >
            You don't have permission to access this resource. This area is
            restricted to authorized users only.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-emerald-200 mb-8"
        >
          <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center justify-center">
            <FaExclamationTriangle className="mr-2 text-amber-500" />
            Possible Reasons:
          </h2>
          <ul className="text-emerald-700 space-y-3 max-w-xl mx-auto">
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex items-start p-3 bg-emerald-50 rounded-lg"
            >
              <span className="text-emerald-500 mr-2 mt-1">
                <FaUserShield />
              </span>
              <div>
                <span className="font-medium">Insufficient Permissions</span>
                <p className="text-sm mt-1">
                  Your account doesn't have the required privileges to view this
                  content.
                </p>
              </div>
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="flex items-start p-3 bg-amber-50 rounded-lg"
            >
              <span className="text-amber-500 mr-2 mt-1">
                <FaLock />
              </span>
              <div>
                <span className="font-medium">Authentication Required</span>
                <p className="text-sm mt-1">
                  You may need to log in with different credentials to access
                  this page.
                </p>
              </div>
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="flex items-start p-3 bg-blue-50 rounded-lg"
            >
              <span className="text-blue-500 mr-2 mt-1">
                <FaMountain />
              </span>
              <div>
                <span className="font-medium">Restricted Content</span>
                <p className="text-sm mt-1">
                  This might be admin-only content or require special
                  authorization.
                </p>
              </div>
            </motion.li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-800 rounded-lg font-medium hover:bg-emerald-200 transition-colors"
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
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <FaHome />
            Go to Homepage
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/contact-us")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
          >
            <FaEnvelope />
            Request Access
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          className="text-center text-emerald-700 bg-white p-4 rounded-xl border border-emerald-200"
        >
          <p className="flex items-center justify-center">
            <FaEnvelope className="mr-2" />
            Need help? Contact administrators at{" "}
            <span className="font-semibold ml-1">
              surajkadam1706004@gmail.com
            </span>
          </p>
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -20, rotate: -10 }}
            animate={{ opacity: 0.1, y: 0, rotate: 0 }}
            transition={{ delay: i * 0.3, duration: 0.8 }}
            className="absolute text-emerald-300 text-6xl md:text-8xl"
            style={{
              top: `${15 + i * 15}%`,
              left: `${5 + i * 15}%`,
            }}
          >
            <FaLock />
          </motion.div>
        ))}

        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i + 5}
            initial={{ opacity: 0, y: 20, rotate: 10 }}
            animate={{ opacity: 0.1, y: 0, rotate: 0 }}
            transition={{ delay: i * 0.3 + 0.5, duration: 0.8 }}
            className="absolute text-emerald-300 text-6xl md:text-8xl"
            style={{
              bottom: `${10 + i * 15}%`,
              right: `${5 + i * 15}%`,
            }}
          >
            <FaLock />
          </motion.div>
        ))}
      </div>

      {/* Animated security shield floating */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-200 text-20xl pointer-events-none z-[-1]"
      >
        <FaUserShield />
      </motion.div>
    </div>
  );
};

export default ForbiddenPage;
