import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGoogle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEnvelope,
  FaShieldAlt,
} from "react-icons/fa";
import { Lock, Mail, ArrowRight, Shield, CornerUpLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+[a-zA-Z0-9-]*(\.[a-zA-Z]{2,})+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus(null);
    setMessage("");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "https://trekrest.onrender.com/api/v1/user/forgot-password",
        { email },
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setStatus("success");
      setMessage(
        data.message || "Password reset link has been sent to your email."
      );
    } catch (err) {
      console.error("Forgot password error:", err);

      const errorStatus = err.response?.status;
      const errorData = err.response?.data;

      if (errorStatus === 400) {
        if (
          errorData?.error?.includes("Google") ||
          errorData?.message?.includes("Google")
        ) {
          setStatus("oauth_warning");
          setMessage(
            "This account is registered with Google. Please login using Google."
          );
        } else {
          setStatus("error");
          setMessage(
            errorData?.error ||
              "Invalid request. Please check your email address."
          );
        }
      } else if (errorStatus === 404) {
        setStatus("error");
        setMessage("No account found with this email address.");
      } else if (errorStatus === 429) {
        setStatus("error");
        setMessage("Too many attempts. Please try again in a few minutes.");
      } else if (err.code === "NETWORK_ERROR" || err.code === "ECONNREFUSED") {
        setStatus("error");
        setMessage(
          "Unable to connect to server. Please check your connection."
        );
      } else {
        setStatus("error");
        setMessage(
          errorData?.error || "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clean white, green/olive theme with border focus
  const theme = {
    white: "#ffffff",
    olive: {
      50: "#f8faf7",
      100: "#f1f5ef",
      200: "#e5ebe2", // Light border
      300: "#c8d5c0", // Medium border
      400: "#9bb294", // Focus border
      500: "#768f6d", // Active border
      600: "#5a7152", // Text
      700: "#475a40", // Dark text
      800: "#3a4934", // Headers
    },
    green: {
      50: "#f0f9f0",
      100: "#dcf0dc",
      200: "#bce1bc", // Light border
      300: "#8dcc8d", // Button hover
      400: "#57b057", // Button border
      500: "#389138", // Primary button
      600: "#2a732a", // Button active
    },
    borders: {
      light: "1px solid #e5ebe2",
      medium: "1px solid #c8d5c0",
      strong: "2px solid #9bb294",
      focus: "2px solid #57b057",
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, scale: 0.95, height: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      height: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const getStatusConfig = () => {
    const configs = {
      success: {
        icon: FaCheckCircle,
        title: "Email Sent",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        iconColor: theme.green[500],
        borderStyle: {
          border: theme.borders.medium,
          borderLeft: `4px solid ${theme.green[500]}`,
        },
      },
      error: {
        icon: FaExclamationTriangle,
        title: "Error",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        iconColor: "#dc2626",
        borderStyle: {
          border: theme.borders.medium,
          borderLeft: `4px solid #dc2626`,
        },
      },
      oauth_warning: {
        icon: FaGoogle,
        title: "Google Account",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-800",
        iconColor: "#d97706",
        borderStyle: {
          border: theme.borders.medium,
          borderLeft: `4px solid #d97706`,
        },
      },
    };
    return configs[status] || {};
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center px-4 py-8"
      style={{
        background:
          "linear-gradient(135deg, #f8faf7 0%, #ffffff 50%, #f1f5ef 100%)",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Security Header with Border */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 p-6 rounded-2xl"
          style={{
            backgroundColor: theme.white,
            border: theme.borders.medium,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex justify-center mb-4">
            <div
              className="p-4 rounded-full border-2"
              style={{
                backgroundColor: theme.olive[50],
                borderColor: theme.olive[300],
              }}
            >
              <Lock size={32} style={{ color: theme.olive[600] }} />
            </div>
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: theme.olive[800] }}
          >
            Reset Your Password
          </h1>
          <p className="text-sm" style={{ color: theme.olive[600] }}>
            Enter your email to receive a secure reset link
          </p>
        </motion.div>

        {/* Main Card with Consistent Border */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: theme.white,
            border: theme.borders.medium,
            boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Status Messages with Border */}
          <AnimatePresence>
            {message && (
              <motion.div
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-6 p-4 rounded-lg"
                style={
                  statusConfig.borderStyle || { border: theme.borders.light }
                }
              >
                <div className="flex items-start space-x-3">
                  {StatusIcon && (
                    <StatusIcon
                      size={20}
                      style={{ color: statusConfig.iconColor }}
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">
                      {statusConfig.title}
                    </h4>
                    <p className="text-sm leading-relaxed">{message}</p>

                    {/* Success Specific Content with Border */}
                    {status === "success" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mt-3 p-3 rounded-lg flex items-center space-x-3 text-sm"
                        style={{
                          backgroundColor: theme.green[50],
                          border: `1px solid ${theme.green[200]}`,
                        }}
                      >
                        <FaEnvelope
                          size={14}
                          style={{ color: theme.green[500] }}
                        />
                        <div>
                          <p
                            className="font-medium text-xs"
                            style={{ color: theme.green[700] }}
                          >
                            Check your inbox
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: theme.green[600] }}
                          >
                            The reset link will expire in 2 minutes
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input with Border */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium"
                style={{ color: theme.olive[700] }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: theme.olive[500] }}
                />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 transition-all duration-200"
                  style={{
                    border: theme.borders.medium,
                    backgroundColor: theme.white,
                  }}
                  onFocus={(e) => {
                    e.target.style.border = theme.borders.focus;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.green[100]}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.border = theme.borders.medium;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Submit Button with Border */}
            <motion.button
              type="submit"
              disabled={isLoading || !email}
              whileHover={
                !isLoading && email
                  ? {
                      scale: 1.02,
                      boxShadow: "0 4px 12px rgba(56, 145, 56, 0.3)",
                    }
                  : {}
              }
              whileTap={!isLoading && email ? { scale: 0.98 } : {}}
              className="w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                backgroundColor:
                  isLoading || !email ? theme.green[400] : theme.green[500],
                border: `1px solid ${
                  isLoading || !email ? theme.green[400] : theme.green[600]
                }`,
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer with Top Border */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm" style={{ color: theme.olive[600] }}>
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: theme.green[600] }}
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>

        {/* Security Footer with Border */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: theme.white,
            border: theme.borders.light,
          }}
        >
          <div
            className="flex items-center justify-center space-x-2 text-xs"
            style={{ color: theme.olive[600] }}
          >
            <FaShieldAlt size={12} style={{ color: theme.green[500] }} />
            <span>Secure & encrypted password reset process</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
