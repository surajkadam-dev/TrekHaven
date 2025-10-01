import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, Check, Clock, Loader } from "lucide-react";
import ResetPassword from "../Components/ResetPassword";
import TokenExpired from "../Components/TokenExpired";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [tokenValid, setTokenValid] = useState(null); // null = loading
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, valid, invalid

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
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setVerificationStatus("verifying");

        // Simulate API call with delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 1500));

        await axios.get(
          `https://trekrest.onrender.com/api/v1/user/verify-reset-token/${token}`
        );

        setVerificationStatus("valid");
        setTimeout(() => setTokenValid(true), 1000); // Show success state before transitioning
      } catch (err) {
        setVerificationStatus("invalid");
        setTimeout(() => setTokenValid(false), 1000); // Show error state before transitioning
      }
    };

    verifyToken();
  }, [token]);

  // Loading Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  // Loading Component
  const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md text-center space-y-8"
      >
        {/* Animated Icon */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div
            className="p-6 rounded-full relative"
            style={{ backgroundColor: theme.olive[50] }}
          >
            <motion.div variants={spinnerVariants} animate="animate">
              <Lock size={64} style={{ color: theme.olive[500] }} />
            </motion.div>
          </div>
        </motion.div>

        {/* Status Message */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h1
            className="text-2xl font-bold"
            style={{ color: theme.olive[800] }}
          >
            {verificationStatus === "verifying" && "Verifying Your Link"}
            {verificationStatus === "valid" && "Link Verified!"}
            {verificationStatus === "invalid" && "Link Expired"}
          </h1>

          <p
            className="text-lg leading-relaxed max-w-md mx-auto"
            style={{ color: theme.olive[600] }}
          >
            {verificationStatus === "verifying" &&
              "Checking your password reset link for security..."}
            {verificationStatus === "valid" &&
              "Your link is valid! Redirecting you to reset your password..."}
            {verificationStatus === "invalid" &&
              "This link is no longer valid. Redirecting..."}
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Status Icon */}
          <div className="flex justify-center">
            {verificationStatus === "verifying" && (
              <motion.div
                variants={spinnerVariants}
                animate="animate"
                className="w-12 h-12 border-4 rounded-full"
                style={{
                  borderColor: `${theme.olive[200]} ${theme.olive[200]} ${theme.olive[200]} ${theme.olive[500]}`,
                }}
              />
            )}

            {verificationStatus === "valid" && (
              <motion.div
                variants={checkmarkVariants}
                initial="hidden"
                animate="visible"
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.green[100] }}
              >
                <Check size={32} style={{ color: theme.green[500] }} />
              </motion.div>
            )}

            {verificationStatus === "invalid" && (
              <motion.div
                variants={checkmarkVariants}
                initial="hidden"
                animate="visible"
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.olive[100] }}
              >
                <Clock size={32} style={{ color: theme.olive[500] }} />
              </motion.div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: theme.olive[100] }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width:
                    verificationStatus === "verifying"
                      ? "60%"
                      : verificationStatus === "valid"
                      ? "100%"
                      : verificationStatus === "invalid"
                      ? "100%"
                      : "0%",
                }}
                transition={{
                  duration: verificationStatus === "verifying" ? 2 : 0.5,
                  ease: "easeInOut",
                }}
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    verificationStatus === "valid"
                      ? theme.green[500]
                      : verificationStatus === "invalid"
                      ? theme.olive[500]
                      : theme.olive[400],
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Security Message */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center space-x-2 pt-8"
          style={{ color: theme.olive[500] }}
        >
          <Shield size={16} />
          <span className="text-sm">Secure verification in progress</span>
        </motion.div>
      </motion.div>
    </div>
  );

  // Main render with smooth transitions
  return (
    <AnimatePresence mode="wait">
      {tokenValid === null ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingState />
        </motion.div>
      ) : tokenValid ? (
        <motion.div
          key="reset-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <ResetPassword token={token} />
        </motion.div>
      ) : (
        <motion.div
          key="expired"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <TokenExpired />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResetPasswordPage;
