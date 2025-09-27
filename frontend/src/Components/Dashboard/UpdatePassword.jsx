"use client";
import React, { useState, useEffect } from "react";
import {
  updatePassword,
  clearAllErrors,
  resetMessage,
} from "../../store/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import GoogleProviderMessage from "./GoogleProviderMessage";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaGoogle,
  FaLanguage,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UpdatePassword = ({ isMobile }) => {
  const { loading, error, isUpdated, message, user } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [language, setLanguage] = useState("en"); // Default to Marathi

  const translations = {
    en: {
      title: "Update Password",
      subtitle: "Secure your account with a new password",
      oldPassword: "Old Password",
      oldPlaceholder: "Enter current password",
      newPassword: "New Password",
      newPlaceholder: "Enter new password",
      confirmPassword: "Confirm Password",
      confirmPlaceholder: "Re-enter new password",
      button: "Update Password",
      buttonLoading: "Updating Password...",
    },
    mr: {
      title: "पासवर्ड बदला",
      subtitle: "नवीन पासवर्डने तुमचे खाते सुरक्षित करा",
      oldPassword: "जुना पासवर्ड",
      oldPlaceholder: "सध्याचा पासवर्ड टाका",
      newPassword: "नवीन पासवर्ड",
      newPlaceholder: "नवीन पासवर्ड टाका",
      confirmPassword: "पासवर्ड पुन्हा टाका",
      confirmPlaceholder: "नवीन पासवर्ड पुन्हा टाका",
      button: "पासवर्ड बदला",
      buttonLoading: "पासवर्ड बदलत आहे",
    },
  };

  const t = translations[language];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePassword(passwordData));
  };

  useEffect(() => {
    return () => {
      dispatch(clearAllErrors());
    };
  }, [dispatch, isUpdated]);

  useEffect(() => {
    if (message) {
      toast.success(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: "#D1FAE5", // light green
          color: "#047857", // dark green
          border: "1px solid #A7F3D0",
          fontFamily: "'Noto Sans Devanagari', 'Poppins', sans-serif",
        },
      });
      dispatch(resetMessage());
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [message, dispatch, isUpdated]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: "#F5E6D3", // light beige
          color: "#6B8E23", // olive green
          border: "1px solid #E6D8B7",
          fontFamily: "'Noto Sans Devanagari', 'Poppins', sans-serif",
        },
      });
      dispatch(clearAllErrors());
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [error, isUpdated, dispatch]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (user?.provider === "google") {
    return <GoogleProviderMessage />;
  }

  return (
    <div
      className={`flex items-center justify-center ${
        isMobile ? "w-full p-2" : "p-4"
      } min-h-screen`}
      style={{ backgroundColor: "#FAF9F6" }} // beige background
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full ${isMobile ? "mt-20" : "max-w-[60%]"}`}
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 relative"
          style={{ borderColor: "#6B8E23" }}
        >
          {/* Language toggle button at top-right */}
          <button
            onClick={() => setLanguage(language === "en" ? "mr" : "en")}
            className="absolute top-4 right-3 p-2 rounded-md border border-green-800 hover:bg-green-700 transition-colors"
            aria-label="Toggle language"
            style={{
              background: "green",
              color: "white",

              zIndex: 10,
            }}
          >
            {language === "mr" ? "EN" : "MR"}
          </button>

          <div style={{ height: 12, backgroundColor: "#6B8E23" }}></div>

          <div className="px-4 md:px-6 py-6 md:py-8">
            <motion.div
              variants={itemVariants}
              className="text-center mb-4 md:mb-6"
            >
              <h1
                className="text-xl md:text-2xl font-bold mb-2"
                style={{ color: "#4B7A0F" }}
              >
                {t.title}
              </h1>
              <p className="text-xs md:text-sm" style={{ color: "#6B8E23" }}>
                {t.subtitle}
              </p>
              <div className="flex justify-center mt-2">
                <div
                  className="h-1 w-10 md:w-12 rounded-full"
                  style={{ backgroundColor: "#4B7A0F" }}
                ></div>
              </div>
            </motion.div>

            {/* Shield icon below the toggle button and title */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-6"
            >
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#6B8E23", color: "white" }}
              >
                <FaShieldAlt className="w-6 h-6 md:w-8 md:h-8 text-beige-100" />
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {["old", "new", "confirm"].map((field) => {
                const labelMap = {
                  old: t.oldPassword,
                  new: t.newPassword,
                  confirm: t.confirmPassword,
                };
                const placeholderMap = {
                  old: t.oldPlaceholder,
                  new: t.newPlaceholder,
                  confirm: t.confirmPlaceholder,
                };
                return (
                  <motion.div
                    key={field}
                    variants={itemVariants}
                    className="relative"
                  >
                    <label
                      className="block text-xs md:text-sm font-medium mb-1"
                      style={{ color: "#4B7A0F" }}
                      htmlFor={field + "Password"}
                    >
                      {labelMap[field]}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock
                          className="h-4 w-4 md:h-5 md:w-5"
                          style={{ color: "#6B8E23" }}
                        />
                      </div>
                      <input
                        type={showPasswords[field] ? "text" : "password"}
                        name={field + "Password"}
                        id={field + "Password"}
                        value={passwordData[field + "Password"]}
                        onChange={handleChange}
                        className="w-full pl-9 md:pl-10 pr-10 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-amber-500 bg-amber-50 text-amber-900 text-sm md:text-base"
                        placeholder={placeholderMap[field]}
                        required
                        style={{
                          borderColor: "#A9B97D",
                          backgroundColor: "#F5F5DC",
                          color: "#4B7A0F",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords[field] ? (
                          <FaEyeSlash
                            className="h-4 w-4 md:h-5 md:w-5"
                            style={{ color: "#6B8E23" }}
                          />
                        ) : (
                          <FaEye
                            className="h-4 w-4 md:h-5 md:w-5"
                            style={{ color: "#6B8E23" }}
                          />
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                className="w-full py-2 md:py-3 px-4 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-sm md:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  backgroundColor: "#6B8E23",
                  color: "white",
                  borderColor: "#4B7A0F",
                }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-white"
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
                    {t.buttonLoading}
                  </>
                ) : (
                  t.button
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-4 md:mt-6"
        >
          <div
            className="w-10 h-10 md:w-12 md:h-12"
            style={{ color: "#4B7A0F" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 10V7c0-1.103-.897-2-2-2h-3c0-1.103-.897-2-2-2H6C4.897 3 4 3.897 4 5v3c-1.103 0-2 .897-2 2v3c0 1.103.897 2 2 2v3c0 1.103.897 2 2 2h8c1.103 0 2-.897 2-2v-3c1.103 0 2-.897 2-2v-3c0-1.103-.897-2-2-2zM6 5h6v3H6V5zm12 8v-3h-4v-2H4v3h4v2h2v4H6v-3H4v3H2v-4h2v-2h2v-2h12v3z" />
            </svg>
          </div>
        </motion.div>
      </motion.div>

      <ToastContainer />
    </div>
  );
};

export default UpdatePassword;
