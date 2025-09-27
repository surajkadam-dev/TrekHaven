"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  updateProfile,
  resetLoading,
  resetMessage,
  clearAllErrors,
} from "../../store/slices/userSlice";
import UpdateMobile from "../UpdateMobile";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCalendar,
  FiEdit2,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiGlobe,
} from "react-icons/fi";
import { GiRoyalLove } from "react-icons/gi";

const UpdateProfile = ({ isMobile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isUpdated, message, error, loading } = useSelector(
    (state) => state.user
  );

  // Professional business color palette
  const colors = {
    darkBrown: "#4A3C2B",
    mediumBrown: "#7D6E5D",
    lightBeige: "#F5F1E6",
    sageGreen: "#8A9A8A",
    accentGreen: "#6B8E6B",
    textDark: "#2D2D2D",
  };

  // Language state
  const [language, setLanguage] = useState("en");
  const translations = {
    en: {
      title: "Update Profile",
      subtitle: "Manage your account information",
      name: "Full Name",
      email: "Email",
      mobile: "Mobile Number",
      verified: "Verified",
      verificationRequired: "Verification required",
      enterCode: "Enter Verification Code",
      otpPlaceholder: "Enter 6-digit OTP",
      verifyOtp: "Verify OTP",
      sendCode: "Send Verification Code",
      updateProfile: "Update Profile",
      noChanges: "No Changes to Update",
      verifyEmail: "Verify Email to Update",
      footer: "Professional Business Services",
    },
    mr: {
      title: "प्रोफाइल अपडेट करा",
      subtitle: "तुमची खाते माहिती सांभाळा",
      name: "पूर्ण नाव",
      email: "ईमेल",
      mobile: "मोबाईल नंबर",
      verified: "सत्यापित",
      verificationRequired: "सत्यापन आवश्यक",
      enterCode: "सत्यापन कोड प्रविष्ट करा",
      otpPlaceholder: "6-अंकी OTP प्रविष्ट करा",
      verifyOtp: "OTP सत्यापित करा",
      sendCode: "सत्यापन कोड पाठवा",
      updateProfile: "प्रोफाइल अपडेट करा",
      noChanges: "अपडेट करण्यासाठी बदल नाहीत",
      verifyEmail: "अपडेट करण्यासाठी ईमेल सत्यापित करा",
      footer: "व्यावसायिक सेवा",
    },
  };
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalProfile, setOriginalProfile] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [showOtp, setShowOtp] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
      setOriginalEmail(user.email || "");
      setOriginalProfile({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  useEffect(() => {
    // Check if email has been changed
    setIsEmailChanged(formData.email !== originalEmail);

    // If email changed back to original, mark as verified
    if (formData.email === originalEmail) {
      setIsVerified(true);
      setShowOTPForm(false);
    } else {
      setIsVerified(false);
    }
  }, [formData.email, originalEmail]);
  const isProfileChanged = () => {
    return (
      formData.name !== originalProfile.name ||
      formData.email !== originalProfile.email ||
      formData.mobile !== originalProfile.mobile
    );
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetMessage());
      setTimeout(() => {
        dispatch(resetMessage());
      }, 500);
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
      setTimeout(() => {
        dispatch(clearAllErrors());
      }, 500);
    }
  }, [error, dispatch]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If email was changed but not verified, don't submit
    if (isEmailChanged && !isVerified) {
      toast.error("Please verify your email before updating", {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: colors.saffron,
          color: colors.parchment,
          border: `1px solid ${colors.deepMaroon}`,
          fontFamily: "'Noto Sans Devanagari', 'Poppins', sans-serif",
        },
      });
      return;
    }

    dispatch(updateProfile(formData));
  };

  const handleSendOTP = async () => {
    if (!isEmailChanged) return;

    setIsSendingOTP(true);
    try {
      const { data } = await axios.post(
        "https://trekrest.onrender.com/api/v1/otp/send-otp",
        {
          email: formData.email,
        }
      );
      toast.success(data.message || "OTP sent to your email");
      setShowOTPForm(true);
      setOtpCountdown(60); // 60 seconds countdown
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const { data } = await axios.post(
        "https://trekrest.onrender.com/api/v1/otp/verify-otp",
        {
          email: formData.email,
          otp,
        }
      );
      toast.success(data.message || "Email verified successfully");
      setIsVerified(true);
      setIsEmailChanged(false);
      setShowOTPForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      setIsVerified(false);
    }
  };

  const handleCancelVerification = () => {
    setFormData({ ...formData, email: originalEmail });
    setShowOTPForm(false);
    setOtp("");
    setIsVerified(true);
    setOtpCountdown(0);
    setIsSendingOTP(false);
  };

  // Loading animation component
  const LoadingSpinner = () => (
    <div className="flex justify-center">
      <div
        className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2"
        style={{ borderColor: colors.royalGold }}
      ></div>
    </div>
  );

  return (
    <div
      className={`${
        isMobile ? "w-full p-2" : "p-4"
      } flex justify-center items-center`}
      style={{ backgroundColor: colors.lightBeige, minHeight: "100%" }}
    >
      <div className={`w-full ${isMobile ? "mt-20" : "max-w-[60%]"}`}>
        {/* Profile Update Card */}
        <div
          className="rounded-xl shadow-2xl overflow-hidden border-2"
          style={{
            borderColor: colors.darkBrown,
            backgroundColor: "white",
          }}
        >
          <div className="h-3" style={{ backgroundColor: "#6B8E23" }}></div>
          <div className="flex justify-end mb-4 mt-2 mr-1">
            <button
              onClick={() => setLanguage(language === "en" ? "mr" : "en")}
              className="flex items-center px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: "#6B8E23",
                color: colors.lightBeige,
              }}
            >
              <FiGlobe className="mr-2" />
              {language === "en" ? "मराठी" : "English"}
            </button>
          </div>

          <div className="px-4 md:px-6 py-6 md:py-8">
            <div className="text-center mb-6">
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: colors.darkBrown }}
              >
                {t.title}
              </h1>
              <p className="text-sm" style={{ color: colors.mediumBrown }}>
                {t.subtitle}
              </p>
              <div className="flex justify-center mt-2">
                <div
                  className="h-1 w-12 rounded-full"
                  style={{ backgroundColor: colors.accentGreen }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="relative">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.darkBrown }}
                >
                  {t.name}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser
                      className="h-5 w-5"
                      style={{ color: colors.mediumBrown }}
                    />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none"
                    style={{
                      borderColor: colors.mediumBrown,
                      backgroundColor: colors.lightBeige,
                      color: colors.textDark,
                    }}
                    placeholder={t.name}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.darkBrown }}
                >
                  {t.email}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail
                      className="h-5 w-5"
                      style={{ color: colors.mediumBrown }}
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={user.provider === "google"}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none"
                    style={{
                      borderColor: colors.mediumBrown,
                      backgroundColor:
                        user.provider === "google"
                          ? "#E5E5E5"
                          : colors.lightBeige,
                      color: colors.textDark,
                    }}
                    placeholder={t.email}
                    required
                  />
                </div>

                {/* Email verification status */}
                {isEmailChanged && (
                  <div className="mt-1 flex items-center">
                    {isVerified ? (
                      <span
                        className="text-sm flex items-center"
                        style={{ color: colors.darkBrown }}
                      >
                        <FiCheck className="mr-1" /> {t.verified}
                      </span>
                    ) : (
                      <span
                        className="text-sm flex items-center"
                        style={{ color: colors.accentGreen }}
                      >
                        <FiShield className="mr-1" /> {t.verificationRequired}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* OTP Verification Section */}
              {isEmailChanged && showOTPForm && (
                <div
                  className="p-4 rounded-lg border-2 transition-all duration-300"
                  style={{
                    borderColor: colors.accentGreen,
                    backgroundColor: `${colors.lightBeige}DD`,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="font-medium"
                      style={{ color: colors.darkBrown }}
                    >
                      {t.enterCode}
                    </h3>
                    <button
                      type="button"
                      onClick={handleCancelVerification}
                      className="p-1 rounded-full hover:bg-opacity-20"
                      style={{
                        color: colors.darkBrown,
                        backgroundColor: `${colors.darkBrown}10`,
                      }}
                    >
                      <FiArrowLeft />
                    </button>
                  </div>

                  <div className="relative">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: colors.darkBrown }}
                    >
                      OTP Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiShield style={{ color: colors.mediumBrown }} />
                      </div>
                      <input
                        type={showOtp ? "text" : "password"}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:outline-none"
                        style={{
                          borderColor: colors.mediumBrown,
                          backgroundColor: colors.lightBeige,
                          color: colors.textDark,
                        }}
                        placeholder={t.otpPlaceholder}
                        maxLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOtp(!showOtp)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        style={{ color: colors.mediumBrown }}
                      >
                        {showOtp ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6}
                      className="flex-1 py-2 px-4 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50"
                      style={{
                        backgroundColor: colors.darkBrown,
                        color: colors.lightBeige,
                      }}
                    >
                      {t.verifyOtp}
                    </button>
                  </div>
                </div>
              )}

              {/* Send OTP Button */}
              {isEmailChanged && !showOTPForm && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isSendingOTP || otpCountdown > 0}
                  className="w-full py-3 px-4 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50"
                  style={{
                    backgroundColor: "#6B8E23",
                    color: colors.lightBeige,
                  }}
                >
                  {isSendingOTP ? (
                    <LoadingSpinner />
                  ) : otpCountdown > 0 ? (
                    `Resend OTP in ${otpCountdown}s`
                  ) : (
                    <>
                      <FiShield className="mr-2" />
                      {t.sendCode}
                    </>
                  )}
                </button>
              )}

              {/* Mobile Field */}
              <div className="relative">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.darkBrown }}
                >
                  {t.mobile}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone
                      className="h-5 w-5"
                      style={{ color: colors.mediumBrown }}
                    />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none"
                    style={{
                      borderColor: colors.mediumBrown,
                      backgroundColor: colors.lightBeige,
                      color: colors.textDark,
                    }}
                    disabled
                    placeholder={t.mobile}
                    required
                  />
                </div>

                {/* Show Update Mobile button if mobile not set */}
                {!formData.mobile && (
                  <button
                    type="button"
                    onClick={() => navigate("/update-mobile")} // Navigate to UpdateMobile page
                    className="mt-2 w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Update Mobile
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  loading ||
                  !isProfileChanged() ||
                  (isEmailChanged && !isVerified)
                }
                className="w-full py-3 px-4 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50"
                style={{
                  backgroundColor:
                    !isProfileChanged() || (isEmailChanged && !isVerified)
                      ? colors.mediumBrown
                      : "#6B8E23",
                  color: colors.lightBeige,
                }}
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <FiEdit2 className="mr-2" />
                    {!isProfileChanged()
                      ? t.noChanges
                      : isEmailChanged && !isVerified
                      ? t.verifyEmail
                      : t.updateProfile}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div
            className="py-3 text-center text-xs"
            style={{
              backgroundColor: "#6B8E23",
              color: colors.lightBeige,
            }}
          >
            {t.footer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
