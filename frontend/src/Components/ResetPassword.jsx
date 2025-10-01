import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Check,
  X,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  LogIn,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = ({ token }) => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Password requirements state
  const [requirements, setRequirements] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    numbers: false,
    specialChars: false,
    noRepeating: false,
  });

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
  };

  // Pure function to compute requirements without state updates
  const computePasswordRequirements = (pwd) => {
    return {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /[0-9]/.test(pwd),
      specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      noRepeating: !/(.)\1\1/.test(pwd), // No more than 2 identical characters in a row
    };
  };

  // Check password requirements and update state
  const checkPasswordRequirements = (pwd) => {
    const checks = computePasswordRequirements(pwd);
    setRequirements(checks);
    return checks;
  };

  // Calculate password strength score without state updates
  const getPasswordStrength = (pwd) => {
    const checks = computePasswordRequirements(pwd);
    const passedChecks = Object.values(checks).filter(Boolean).length;

    if (pwd.length === 0) return 0;
    if (passedChecks <= 2) return 1; // Weak
    if (passedChecks <= 4) return 2; // Medium
    return 3; // Strong
  };

  // Get strength color and text
  const getStrengthInfo = (strength) => {
    switch (strength) {
      case 1:
        return { color: theme.red[500], text: "Weak", bg: theme.red[50] };
      case 2:
        return { color: "#f59e0b", text: "Medium", bg: "#fef3c7" };
      case 3:
        return { color: theme.green[500], text: "Strong", bg: theme.green[50] };
      default:
        return { color: theme.olive[400], text: "None", bg: theme.olive[50] };
    }
  };

  // Check if at least 3 character type requirements are met
  const getCharacterTypesCount = () => {
    const types = [
      requirements.lowercase,
      requirements.uppercase,
      requirements.numbers,
      requirements.specialChars,
    ];
    return types.filter(Boolean).length;
  };

  const characterTypesMet = getCharacterTypesCount() >= 3;

  // Validate password for submission
  const validatePassword = (pwd) => {
    const checks = computePasswordRequirements(pwd);
    const characterTypesCount = [
      checks.lowercase,
      checks.uppercase,
      checks.numbers,
      checks.specialChars,
    ].filter(Boolean).length;
    const allMet =
      Object.values(checks).every(Boolean) && characterTypesCount >= 3;
    return allMet;
  };

  // Update requirements only when password changes
  useEffect(() => {
    if (password) {
      checkPasswordRequirements(password);
    }
  }, [password]);

  // Calculate strength only when needed (not during render)
  const strength = password ? getPasswordStrength(password) : 0;
  const strengthInfo = getStrengthInfo(strength);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setStatus("error");
      setMessage("Please ensure your password meets all requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setStatus(null);
    setMessage("");

    try {
      const { data } = await axios.put(
        `https://trekrest.onrender.com/api/v1/user/reset-password/${token}`,
        { password, confirmPassword },
        { timeout: 10000, headers: { "Content-Type": "application/json" } }
      );

      setStatus("success");
      setResetSuccess(true);
      setMessage(
        data.message ||
          "Password has been reset successfully! You can now login with your new password."
      );
    } catch (err) {
      console.error("Reset password error:", err);
      const errorData = err.response?.data;
      setStatus("error");
      setMessage(
        errorData?.error || "Invalid or expired token. Please try again."
      );
      setResetSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const messageVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
  };

  const requirementVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className="p-3 rounded-full border"
              style={{
                backgroundColor: resetSuccess
                  ? theme.green[50]
                  : theme.olive[50],
                borderColor: resetSuccess ? theme.green[200] : theme.olive[300],
              }}
            >
              <Lock
                size={32}
                style={{
                  color: resetSuccess ? theme.green[500] : theme.olive[600],
                }}
              />
            </div>
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: theme.olive[800] }}
          >
            {resetSuccess
              ? "Password Reset Successfully!"
              : "Reset Your Password"}
          </h1>
          <p className="text-sm" style={{ color: theme.olive[600] }}>
            {resetSuccess
              ? "Your password has been updated successfully"
              : "Create a strong new password"}
          </p>
        </div>

        {/* Status Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`mb-6 p-4 rounded-lg border ${
                status === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-start space-x-3">
                {status === "success" && (
                  <Check size={20} style={{ color: theme.green[500] }} />
                )}
                {status === "error" && (
                  <X size={20} style={{ color: theme.red[500] }} />
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{message}</p>

                  {/* Success-specific content with login button */}
                  {resetSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 p-3 rounded-lg border bg-white space-y-3"
                      style={{ borderColor: theme.green[200] }}
                    >
                      <div className="flex items-center space-x-2">
                        <Check size={16} style={{ color: theme.green[500] }} />
                        <span className="text-sm font-medium text-green-800">
                          Ready to Login
                        </span>
                      </div>
                      <p className="text-xs text-green-700">
                        Your password has been updated. You can now sign in with
                        your new credentials.
                      </p>
                      <motion.button
                        onClick={handleLoginRedirect}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 text-white font-medium text-sm"
                        style={{ backgroundColor: theme.green[500] }}
                      >
                        <LogIn size={16} />
                        <span>Go to Login</span>
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form - Only show if reset hasn't succeeded */}
        {!resetSuccess && (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div
              className="rounded-xl shadow-sm border p-6 mb-4"
              style={{
                borderColor: theme.olive[200],
                backgroundColor: theme.white,
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.olive[700] }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition pr-12"
                      style={{ borderColor: theme.olive[300] }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: theme.olive[500] }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 space-y-3"
                    >
                      {/* Strength Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span
                            className="text-sm font-medium"
                            style={{ color: theme.olive[700] }}
                          >
                            Password Strength:
                          </span>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: strengthInfo.color }}
                          >
                            {strengthInfo.text}
                          </span>
                        </div>
                        <div
                          className="h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: theme.olive[100] }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(strength / 3) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: strengthInfo.color }}
                          />
                        </div>
                      </div>

                      {/* Requirements List */}
                      <div
                        className="p-4 rounded-lg border space-y-3"
                        style={{
                          backgroundColor: theme.olive[50],
                          borderColor: theme.olive[200],
                        }}
                      >
                        <p
                          className="text-sm font-medium mb-2"
                          style={{ color: theme.olive[700] }}
                        >
                          Your password must contain:
                        </p>

                        {/* Minimum length */}
                        <motion.div
                          variants={requirementVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center space-x-2"
                        >
                          {requirements.length ? (
                            <Check
                              size={16}
                              style={{ color: theme.green[500] }}
                            />
                          ) : (
                            <X size={16} style={{ color: theme.red[500] }} />
                          )}
                          <span
                            className={`text-sm ${
                              requirements.length
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            At least 8 characters
                          </span>
                        </motion.div>

                        {/* Character types requirement */}
                        <motion.div
                          variants={requirementVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center space-x-2"
                        >
                          {characterTypesMet ? (
                            <Check
                              size={16}
                              style={{ color: theme.green[500] }}
                            />
                          ) : (
                            <X size={16} style={{ color: theme.red[500] }} />
                          )}
                          <span
                            className={`text-sm ${
                              characterTypesMet
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            At least 3 of the following:
                          </span>
                        </motion.div>

                        {/* Character types sub-list */}
                        <div className="ml-6 space-y-2">
                          <div className="flex items-center space-x-2">
                            {requirements.lowercase ? (
                              <Check
                                size={14}
                                style={{ color: theme.green[500] }}
                              />
                            ) : (
                              <X size={14} style={{ color: theme.red[500] }} />
                            )}
                            <span
                              className={`text-xs ${
                                requirements.lowercase
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              Lower case letters (a-z)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {requirements.uppercase ? (
                              <Check
                                size={14}
                                style={{ color: theme.green[500] }}
                              />
                            ) : (
                              <X size={14} style={{ color: theme.red[500] }} />
                            )}
                            <span
                              className={`text-xs ${
                                requirements.uppercase
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              Upper case letters (A-Z)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {requirements.numbers ? (
                              <Check
                                size={14}
                                style={{ color: theme.green[500] }}
                              />
                            ) : (
                              <X size={14} style={{ color: theme.red[500] }} />
                            )}
                            <span
                              className={`text-xs ${
                                requirements.numbers
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              Numbers (0-9)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {requirements.specialChars ? (
                              <Check
                                size={14}
                                style={{ color: theme.green[500] }}
                              />
                            ) : (
                              <X size={14} style={{ color: theme.red[500] }} />
                            )}
                            <span
                              className={`text-xs ${
                                requirements.specialChars
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              Special characters (e.g. !@#$%^&*)
                            </span>
                          </div>
                        </div>

                        {/* No repeating characters */}
                        <motion.div
                          variants={requirementVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center space-x-2"
                        >
                          {requirements.noRepeating ? (
                            <Check
                              size={16}
                              style={{ color: theme.green[500] }}
                            />
                          ) : (
                            <X size={16} style={{ color: theme.red[500] }} />
                          )}
                          <span
                            className={`text-sm ${
                              requirements.noRepeating
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            No more than 2 identical characters in a row
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.olive[700] }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition pr-12"
                      style={{ borderColor: theme.olive[300] }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: theme.olive[500] }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex items-center space-x-2"
                    >
                      {password === confirmPassword ? (
                        <>
                          <Check
                            size={16}
                            style={{ color: theme.green[500] }}
                          />
                          <span className="text-sm text-green-700">
                            Passwords match
                          </span>
                        </>
                      ) : (
                        <>
                          <X size={16} style={{ color: theme.red[500] }} />
                          <span className="text-sm text-red-700">
                            Passwords do not match
                          </span>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={
                    isLoading ||
                    !validatePassword(password) ||
                    password !== confirmPassword
                  }
                  whileHover={
                    !isLoading &&
                    validatePassword(password) &&
                    password === confirmPassword
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    !isLoading &&
                    validatePassword(password) &&
                    password === confirmPassword
                      ? { scale: 0.98 }
                      : {}
                  }
                  className="w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor:
                      isLoading ||
                      !validatePassword(password) ||
                      password !== confirmPassword
                        ? theme.olive[300]
                        : theme.green[500],
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* Back to Login Link */}
            <div className="text-center mt-4">
              <motion.button
                onClick={handleLoginRedirect}
                className="text-sm font-medium hover:underline transition-all"
                style={{ color: theme.green[600] }}
                whileHover={{ scale: 1.05 }}
              >
                ← Back to Login
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs flex items-center justify-center space-x-2 mt-6"
          style={{ color: theme.olive[500] }}
        >
          <Shield size={12} />
          <span>Secure & encrypted password reset process</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
