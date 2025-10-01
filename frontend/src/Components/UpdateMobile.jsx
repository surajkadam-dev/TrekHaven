import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firbase/config"; // Fixed typo in "firebase"
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaPhone,
  FaCheckCircle,
  FaArrowLeft,
  FaRedo,
  FaHome,
  FaMountain,
} from "react-icons/fa";
import { updateProfile, clearAllErrors } from "../store/slices/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateMobile = ({ onSuccess }) => {
  const { user } = useSelector((store) => store.user);
  const { message } = useSelector((store) => store.booking);

  const dispatch = useDispatch();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [step, setStep] = useState("mobile"); // "mobile" | "otp" | "done"
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaVerifierRef = useRef(null);
  const recaptchaWidgetIdRef = useRef(null);
  const [verifiedMobile, setVerifiedMobile] = useState("");
  const [captchaSolved, setCaptchaSolved] = useState(false);

  const otpInputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      dispatch(clearAllErrors());
    }
  }, [message, dispatch]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Clean up recaptcha on component unmount
  useEffect(() => {
    return () => {
      if (recaptchaWidgetIdRef.current !== null) {
        window.grecaptcha?.reset(recaptchaWidgetIdRef.current);
      }
    };
  }, []);

  // Setup reCAPTCHA
  const setupRecaptcha = useCallback(async () => {
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "normal",
            callback: (response) => {
              console.log("Captcha solved:", response);
              setCaptchaSolved(true);
              toast.success("Captcha verified, now you can send OTP");
            },
            "expired-callback": () => {
              toast.error("Captcha expired. Please try again.");
              resetRecaptcha();
              setCaptchaSolved(false);
            },
          }
        );

        try {
          const widgetId = await recaptchaVerifierRef.current.render();
          recaptchaWidgetIdRef.current = widgetId;
        } catch (error) {
          console.error("Recaptcha render error:", error);
          toast.error("Failed to load captcha. Please refresh the page.");
          resetRecaptcha();
        }
      }
    } catch (error) {
      console.error("Recaptcha setup error:", error);
      toast.error("Failed to setup captcha. Please refresh the page.");
    }
  }, []);

  const resetRecaptcha = useCallback(() => {
    if (recaptchaWidgetIdRef.current !== null) {
      window.grecaptcha?.reset(recaptchaWidgetIdRef.current);
      recaptchaWidgetIdRef.current = null;
    }
    recaptchaVerifierRef.current = null;
    setCaptchaSolved(false);
  }, []);

  // Check mobile availability
  const checkMobileAvailability = async () => {
    try {
      const { data } = await axios.get(
        `https://trekrest.onrender.com/api/v1/user/check-mobile?number=${mobile}`
      );

      if (!data.available) {
        toast.error("मोबाइल नंबर आधीपासून नोंदणीकृत आहे");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Mobile check error:", err);
      toast.error("Error checking mobile availability");
      return false;
    }
  };

  // Handle OTP sending
  const sendOtp = async (e) => {
    if (e) e.preventDefault();

    if (!/^[0-9]{10}$/.test(mobile)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const available = await checkMobileAvailability();
      if (!available) {
        setLoading(false);
        return;
      }

      // Setup recaptcha if not already done
      if (!recaptchaVerifierRef.current) {
        await setupRecaptcha();
        setLoading(false);
        return; // Stop here, wait for user to solve captcha
      }

      if (!captchaSolved) {
        toast.error("Please complete the captcha first");
        setLoading(false);
        return;
      }

      const fullNumber = `+91${mobile}`;
      console.log(
        "auth :",
        auth,
        " fullNum:",
        fullNumber,
        " recapcha: ",
        recaptchaVerifierRef.current
      );
      const confirmation = await signInWithPhoneNumber(
        auth,
        fullNumber,
        recaptchaVerifierRef.current
      );

      setConfirmationResult(confirmation);
      setStep("otp");
      setCountdown(30);
      toast.success("OTP sent successfully!");
    } catch (err) {
      console.error("OTP error:", err);
      toast.error(err.message || "Failed to send OTP");
      resetRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  // Handle OTP input key events
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (countdown > 0) return;

    setLoading(true);
    try {
      resetRecaptcha();
      await sendOtp();
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(err.message || "Failed to resend OTP");
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const otpToVerify = otp.join("");

    if (otpToVerify.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await confirmationResult.confirm(otpToVerify);

      const profileData = {
        name: user?.name || "",
        email: user?.email || "",
        mobile,
      };

      // Dispatch Redux updateProfile
      await dispatch(updateProfile(profileData));

      toast.success("Mobile verified and updated!");
      setVerifiedMobile(mobile);
      // Reset states
      setStep("done");
      setOtp(Array(6).fill(""));
      setTimeout(() => {
        resetRecaptcha();
      }, 500);
    } catch (err) {
      console.error("OTP verify error:", err);
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // Go back to mobile entry
  const goBackToMobile = () => {
    setStep("mobile");
    resetRecaptcha();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-600"
      >
        {/* Karapewadi HomeStay Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-4 px-4 text-center relative">
          <div className="absolute top-2 left-4">
            <FaHome className="text-2xl text-green-300" />
          </div>
          <h1 className="text-xl font-bold">Karapewadi HomeStay</h1>
          <p className="text-xs text-green-200">Verify your mobile number</p>
          <div className="absolute top-2 right-4">
            <FaMountain className="text-xl text-green-300" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "mobile" && (
            <motion.form
              key="mobile-form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={sendOtp}
              className="p-6 sm:p-8"
            >
              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-6"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-green-500 to-green-700 flex items-center justify-center shadow-md">
                  <FaPhone className="text-white text-2xl sm:text-3xl" />
                </div>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2"
              >
                Update Mobile Number
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-gray-600 text-center mb-6 text-sm sm:text-base"
              >
                Enter your 10-digit mobile number to receive a verification code
              </motion.p>

              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex">
                  <div className="px-3 sm:px-4 py-3 bg-green-100 border border-r-0 border-green-300 rounded-l-lg flex items-center text-green-800 font-medium">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    maxLength={10}
                    className="flex-1 px-3 sm:px-4 py-3 border border-green-300 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your mobile number"
                    disabled={loading}
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mb-6 flex justify-center"
                id="recaptcha-container"
              ></motion.div>

              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading || mobile.length !== 10}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg disabled:opacity-50 flex items-center justify-center font-medium hover:from-green-700 hover:to-green-900 transition-all duration-300 shadow-md"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </motion.button>
            </motion.form>
          )}

          {step === "otp" && (
            <motion.div
              key="otp-form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6 sm:p-8 relative"
            >
              <button
                type="button"
                onClick={goBackToMobile}
                className="absolute top-4 sm:top-6 left-4 sm:left-6 p-2 rounded-full hover:bg-green-100 text-green-700"
                aria-label="Go back"
                disabled={loading}
              >
                <FaArrowLeft />
              </button>

              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-6"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-green-500 to-green-700 flex items-center justify-center shadow-md">
                  <FaCheckCircle className="text-white text-2xl sm:text-3xl" />
                </div>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2"
              >
                Verify OTP
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-gray-600 text-center mb-6 text-sm sm:text-base"
              >
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold">+91 {mobile}</span>
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex justify-between mb-6 sm:mb-8 space-x-2"
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    disabled={loading}
                    className="w-10 h-12 sm:w-12 sm:h-14 border border-green-300 rounded-lg text-center text-lg sm:text-xl font-semibold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <button
                  onClick={verifyOtp}
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg disabled:opacity-50 flex items-center justify-center font-medium hover:from-green-700 hover:to-green-900 transition-all duration-300 shadow-md"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-green-700 text-sm">
                      Resend OTP in{" "}
                      <span className="font-semibold">{countdown}</span> seconds
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={loading}
                      className="text-green-700 hover:text-green-900 disabled:opacity-50 flex items-center justify-center text-sm font-medium mx-auto"
                    >
                      <FaRedo className="mr-1" /> Didn't receive code? Resend
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="success-message"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6 sm:p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
              >
                <FaCheckCircle className="text-white text-3xl sm:text-4xl" />
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-xl sm:text-2xl font-bold text-gray-800 mb-2"
              >
                Mobile Verified Successfully!
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-gray-600 mb-6 text-sm sm:text-base"
              >
                Your mobile number{" "}
                <span className="font-semibold">+91 {verifiedMobile}</span> has
                been verified and updated.
              </motion.p>

              <motion.button
                variants={itemVariants}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-900 transition-all duration-300 shadow-md"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default UpdateMobile;
