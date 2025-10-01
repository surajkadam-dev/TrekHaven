import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, AlertTriangle, ArrowRight, Mail, Shield } from "lucide-react";

const TokenExpired = () => {
  const navigate = useNavigate();

  const theme = {
    white: "#ffffff",
    olive: {
      50: "#f8faf7",
      100: "#f1f5ef",
      200: "#e5ebe2",
      300: "#c8d5c0",
      400: "#9bb294",
      500: "#768f6d",
      600: "#5a7152",
      700: "#475a40",
      800: "#3a4934",
    },
    green: {
      50: "#f0f9f0",
      100: "#dcf0dc",
      200: "#bce1bc",
      300: "#8dcc8d",
      400: "#57b057",
      500: "#389138",
      600: "#2a732a",
      700: "#235b23",
    },
    red: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
    },
    amber: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const handleResendLink = () => {
    navigate("/password-reset");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: theme.white }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Main Card */}
        <div
          className="rounded-2xl shadow-lg border p-8 mb-6 text-center"
          style={{
            backgroundColor: theme.white,
            borderColor: theme.olive[200],
          }}
        >
          {/* Animated Icon */}
          <motion.div
            variants={iconVariants}
            className="flex justify-center mb-6"
          >
            <div
              className="relative p-4 rounded-full"
              style={{ backgroundColor: theme.amber[50] }}
            >
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-75"
                style={{ backgroundColor: theme.amber[200] }}
              />
              <div className="relative">
                <Clock size={48} style={{ color: theme.amber[600] }} />
                <AlertTriangle
                  size={20}
                  className="absolute -top-1 -right-1"
                  style={{ color: theme.red[500] }}
                />
              </div>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="mb-4">
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: theme.olive[800] }}
            >
              Link Expired
            </h1>
            <p
              className="text-sm opacity-75"
              style={{ color: theme.olive[600] }}
            >
              Your password reset link is no longer valid
            </p>
          </motion.div>

          {/* Alert Box */}
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-lg border mb-6 text-left"
            style={{
              backgroundColor: theme.amber[50],
              borderColor: theme.amber[200],
            }}
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle
                size={20}
                style={{ color: theme.amber[600] }}
                className="flex-shrink-0 mt-0.5"
              />
              <div>
                <h3
                  className="font-semibold text-sm mb-1"
                  style={{ color: theme.amber[800] }}
                >
                  Security Notice
                </h3>
                <p className="text-sm" style={{ color: theme.amber[700] }}>
                  Password reset links expire after a short period for security
                  reasons. This helps protect your account from unauthorized
                  access.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Reasons List */}
          <motion.div variants={itemVariants} className="mb-6 text-left">
            <h4
              className="font-medium text-sm mb-3"
              style={{ color: theme.olive[700] }}
            >
              This could be because:
            </h4>
            <ul
              className="space-y-2 text-sm"
              style={{ color: theme.olive[600] }}
            >
              <li className="flex items-center space-x-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: theme.olive[400] }}
                />
                <span>The link was used already</span>
              </li>
              <li className="flex items-center space-x-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: theme.olive[400] }}
                />
                <span>More than 2 Mintute has passed</span>
              </li>
              <li className="flex items-center space-x-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: theme.olive[400] }}
                />
                <span>The link was invalid or tampered with</span>
              </li>
            </ul>
          </motion.div>

          {/* Primary Action Button */}
          <motion.button
            variants={itemVariants}
            onClick={handleResendLink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center space-x-2 mb-4"
            style={{ backgroundColor: theme.green[500] }}
          >
            <Mail size={18} />
            <span>Request New Reset Link</span>
            <ArrowRight size={16} />
          </motion.button>

          {/* Secondary Actions */}
          <motion.div variants={itemVariants} className="flex space-x-3">
            <button
              onClick={handleGoLogin}
              className="flex-1 py-2 px-4 rounded-lg border font-medium text-sm transition-colors hover:bg-gray-50"
              style={{
                borderColor: theme.olive[300],
                color: theme.olive[700],
              }}
            >
              Back to Login
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 py-2 px-4 rounded-lg border font-medium text-sm transition-colors hover:bg-gray-50"
              style={{
                borderColor: theme.olive[300],
                color: theme.olive[700],
              }}
            >
              Go Home
            </button>
          </motion.div>
        </div>

        {/* Security Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div
            className="inline-flex items-center space-x-2 px-4 py-3 rounded-lg border text-xs"
            style={{
              backgroundColor: theme.white,
              borderColor: theme.olive[200],
              color: theme.olive[600],
            }}
          >
            <Shield size={14} style={{ color: theme.green[500] }} />
            <span>Your security is important to us</span>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <p className="text-xs" style={{ color: theme.olive[500] }}>
            Need help?{" "}
            <button
              className="underline hover:no-underline font-medium"
              style={{ color: theme.green[600] }}
            >
              Contact Support
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TokenExpired;
