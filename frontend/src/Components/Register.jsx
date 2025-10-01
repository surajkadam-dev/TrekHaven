"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  clearErrors,
  registerUser,
  resetLoading,
  loginWithGoogle,
} from "../store/slices/userSlice.js";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaUserAlt,
  FaKey,
  FaTree,
  FaShieldAlt,
  FaPhone,
  FaCheckCircle,
  FaRedo,
  FaEnvelope,
  FaHome,
} from "react-icons/fa";
import { GiMeal } from "react-icons/gi";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firbase/config.js";

// Language content
const languageContent = {
  en: {
    title: "Karapewadi Homestay",
    subtitle: " A peaceful retreat in the heart of nature",
    register: "Register",
    trekker: "Trekker",
    admin: "Admin",
    fullName: "Full Name",
    mobile: "Mobile Number",
    email: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    adminKey: "Admin Key",
    verifyMobile: "Verify Mobile",
    sendingOtp: "Sending OTP...",
    sendOtp: "Send OTP",
    enterOtp: "Enter OTP",
    verifyOtp: "Verify OTP",
    resendOtp: "Resend OTP",
    verifyEmail: "Verify Email",
    sendingVerification: "Sending verification...",
    emailVerified: "Email Verified",
    or: "or",
    alreadyAccount: "Already have an account?",
    loginHere: "Login here",
    passwordStrength: "Password Strength",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    secureAccess: "Secure & Private Stay",
    heritageTrekking: "Fresh Home-Cooked Meals",
    exclusiveExperiences: "Tranquil Natural Surroundings",
    quote: '"Experience peace, comfort, and hospitality like home."',
  },
  mr: {
    title: "करपेवाडी होमस्टे",
    subtitle: "निसर्गाच्या सानिध्यात एक शांत निवासस्थान",
    register: "नोंदणी करा",
    trekker: "ट्रेकर",
    admin: "प्रशासक",
    fullName: "पूर्ण नाव",
    mobile: "मोबाइल नंबर",
    email: "ईमेल पत्ता",
    password: "पासवर्ड",
    confirmPassword: "पासवर्डची पुष्टी करा",
    adminKey: "प्रशासक की",
    verifyMobile: "मोबाइल सत्यापित करा",
    sendingOtp: "OTP पाठवत आहे...",
    sendOtp: "OTP पाठवा",
    enterOtp: "OTP प्रविष्ट करा",
    verifyOtp: "OTP सत्यापित करा",
    resendOtp: "OTP पुन्हा पाठवा",
    verifyEmail: "ईमेल सत्यापित करा",
    sendingVerification: "सत्यापन पाठवत आहे...",
    emailVerified: "ईमेल सत्यापित झाले",
    or: "किंवा",
    alreadyAccount: "आधीपासून खाते आहे?",
    loginHere: "येथे लॉग इन करा",
    passwordStrength: "पासवर्ड सामर्थ्य",
    weak: "कमकुवत",
    medium: "मध्यम",
    strong: "मजबूत",
    secureAccess: "सुरक्षित आणि खाजगी मुक्काम",
    heritageTrekking: "घरी शिजवलेले ताजे जेवण",
    exclusiveExperiences: "शांत नैसर्गिक परिसर",
    quote: '"अनुभव शांती, आराम, आणि घरासारखी पाहुणचार."',
  },
};

const pwdStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const strengthLabel = (score) => {
  switch (score) {
    case 0:
    case 1:
      return { text: "कमकुवत", color: "bg-red-400", width: "w-1/4" };
    case 2:
    case 3:
      return { text: "मध्यम", color: "bg-yellow-400", width: "w-2/4" };
    case 4:
      return { text: "मजबूत", color: "bg-green-400", width: "w-full" };
    default:
      return { text: "कमकुवत", color: "bg-red-400", width: "w-1/4" };
  }
};

const Register = () => {
  const [role, setRole] = useState("trekker");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    role: "",
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirm: "",
    adminKey: "",
  });
  const [errors, setErrors] = useState({});
  const [waitingForGoogle, setWaitingForGoogle] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [sendEmailOtp, setSendEmailOtp] = useState(false);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [recaptchaLoading, setRecaptchaLoading] = useState(false);
  const [checkingMobile, setCheckingMobile] = useState(false);
  const [language, setLanguage] = useState("en");
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);

  const recaptchaVerifierRef = useRef(null);
  const recaptchaWidgetIdRef = useRef(null);
  const countdownRef = useRef(null);
  const confirmationResultRef = useRef(null);

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const lang = languageContent[language];

  // Toggle language
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "mr" : "en"));
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(
        () => setCountdown(countdown - 1),
        1000
      );
    } else if (countdown === 0 && otpSent) {
      setCanResend(true);
    }
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [countdown, otpSent]);

  // Initialize reCAPTCHA when needed
  useEffect(() => {
    if (auth && showRecaptcha && !recaptchaInitialized) {
      try {
        setRecaptchaLoading(true);

        // Clear any existing reCAPTCHA
        if (recaptchaWidgetIdRef.current) {
          window.grecaptcha.reset(recaptchaWidgetIdRef.current);
        }

        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: window.innerWidth < 768 ? "compact" : "normal",
            callback: () => {
              console.log("reCAPTCHA solved");
              setRecaptchaVerified(true);
            },
            "expired-callback": () => {
              console.log("reCAPTCHA expired");
              setRecaptchaVerified(false);
            },
          }
        );

        recaptchaVerifierRef.current.render().then((widgetId) => {
          recaptchaWidgetIdRef.current = widgetId;
          setRecaptchaLoading(false);
          setRecaptchaInitialized(true);
        });
      } catch (error) {
        console.error("Error initializing reCAPTCHA:", error);
        toast.error("reCAPTCHA लोड करताना त्रुटी");
        setRecaptchaLoading(false);
      }
    }
  }, [showRecaptcha, recaptchaInitialized]);

  // Clean up reCAPTCHA when mobile is verified
  useEffect(() => {
    if (mobileVerified && recaptchaInitialized) {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaWidgetIdRef.current = null;
        setRecaptchaInitialized(false);
        setShowRecaptcha(false);
      }
    }
  }, [mobileVerified, recaptchaInitialized]);

  const initRecaptcha = async () => {
    if (!/^[0-9]{10}$/.test(form.mobile)) {
      toast.error(
        language === "en"
          ? "Please enter a valid 10-digit mobile number"
          : "वैध 10-अंकी मोबाइल नंबर प्रविष्ट करा"
      );
      return;
    }
    setCheckingMobile(true);
    try {
      const { data } = await axios.get(
        `https://trekrest.onrender.com/api/v1/user/check-mobile?number=${form.mobile}`
      );

      if (!data.available) {
        toast.error(
          language === "en"
            ? "Mobile number is already registered"
            : "मोबाइल नंबर आधीपासून नोंदणीकृत आहे"
        );
        return;
      }
      setShowRecaptcha(true);
    } catch (error) {
      console.error(error);
      toast.error(language === "en" ? "Server error" : "सर्व्हर त्रुटी");
    } finally {
      setCheckingMobile(false);
    }
  };

  const sendOtp = async () => {
    if (!recaptchaVerified) {
      toast.error(
        language === "en"
          ? "Please complete the reCAPTCHA"
          : "कृपया reCAPTCHA पूर्ण करा"
      );
      return;
    }

    setSendingOtp(true);
    try {
      const appVerifier = recaptchaVerifierRef.current;
      const phoneNumber = `+91${form.mobile}`;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

      confirmationResultRef.current = confirmationResult;

      setOtpSent(true);
      setCountdown(30);
      setCanResend(false);
      setRecaptchaVerified(false);

      // Hide the reCAPTCHA container but keep reCAPTCHA initialized
      setShowRecaptcha(false);

      toast.success(
        language === "en" ? "OTP sent successfully" : "OTP पाठवला आहे"
      );
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(
        language === "en"
          ? "Error sending OTP: " + error.message
          : "OTP पाठवताना त्रुटी: " + error.message
      );

      // Reset reCAPTCHA on error
      if (recaptchaWidgetIdRef.current) {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
        setRecaptchaVerified(false);
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const resendOtp = async () => {
    // Reset and show reCAPTCHA for resend
    if (recaptchaWidgetIdRef.current) {
      window.grecaptcha.reset(recaptchaWidgetIdRef.current);
    }
    setRecaptchaVerified(false);
    setShowRecaptcha(true);
    setOtpSent(false);
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error(
        language === "en"
          ? "Please enter a 6-digit OTP"
          : "कृपया 6-अंकी OTP प्रविष्ट करा"
      );
      return;
    }

    if (!confirmationResultRef.current) {
      toast.error(
        language === "en"
          ? "OTP session lost, please resend OTP"
          : "OTP session हरवला आहे, कृपया पुन्हा OTP पाठवा"
      );
      return;
    }

    setVerifying(true);
    try {
      const result = await confirmationResultRef.current.confirm(otp);

      await auth.signOut();

      setMobileVerified(true);
      setOtpSent(false);
      setOtp("");
      toast.success(
        language === "en"
          ? "Mobile number verified successfully"
          : "मोबाइल क्रमांक सत्यापित झाला"
      );
    } catch (error) {
      console.error("Error verifying OTP:", error);

      switch (error.code) {
        case "auth/invalid-verification-code":
          toast.error(language === "en" ? "Invalid OTP" : "अवैध OTP");
          break;
        case "auth/code-expired":
          toast.error(
            language === "en"
              ? "OTP expired, please try again"
              : "OTP कालबाह्य झाला आहे, पुन्हा प्रयत्न करा"
          );
          break;
        case "auth/missing-verification-id":
          toast.error(
            language === "en"
              ? "OTP session lost, please resend OTP"
              : "OTP session हरवला आहे, कृपया पुन्हा OTP पाठवा"
          );
          setOtpSent(false);
          confirmationResultRef.current = null;
          setShowRecaptcha(true);
          break;
        default:
          toast.error(
            language === "en"
              ? "Verification failed: " + error.message
              : "सत्यापन अयशस्वी: " + error.message
          );
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    if (e.target.name === "mobile") {
      setMobileVerified(false);
      setOtpSent(false);
      setShowRecaptcha(false);
      setRecaptchaVerified(false);
      setRecaptchaInitialized(false);
      setCountdown(0);
      setCanResend(false);
      confirmationResultRef.current = null;
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleGoogleResponse = async (response) => {
    try {
      setWaitingForGoogle(true);
      const idToken = response?.credential;
      if (!idToken) {
        toast.error(
          language === "en"
            ? "Google sign-in failed. No token received."
            : "Google साइन-इन अयशस्वी. टोकन मिळाला नाही."
        );
        setWaitingForGoogle(false);
        return;
      }
      dispatch(loginWithGoogle(idToken));
    } catch (err) {
      console.error("Google response error:", err);
      toast.error(
        language === "en" ? "Google sign-in error" : "Google साइन-इन त्रुटी"
      );
      setWaitingForGoogle(false);
    }
  };

  useEffect(() => {
    const initializeGoogle = () => {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          {
            theme: "outline",
            size: "large",
            width: window.innerWidth < 768 ? "280" : "300",
            text: "continue_with",
          }
        );
      }
    };

    if (!document.getElementById("google-client-script")) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = "google-client-script";
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    } else {
      initializeGoogle();
    }
  }, [role, language]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim())
      errs.name =
        language === "en" ? "Full name is required" : "पूर्ण नाव आवश्यक आहे";
    if (!/^[0-9]{10}$/.test(form.mobile))
      errs.mobile =
        language === "en"
          ? "Please enter a valid 10-digit mobile number"
          : "वैध 10-अंकी मोबाइल नंबर प्रविष्ट करा";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = language === "en" ? "Invalid email" : "अवैध ईमेल";
    if (form.password.length < 8)
      errs.password =
        language === "en"
          ? "Minimum 8 characters required"
          : "किमान 8 वर्ण आवश्यक";
    if (form.password !== form.confirm)
      errs.confirm =
        language === "en" ? "Passwords don't match" : "पासवर्ड जुळत नाही";
    if (role != "") {
      form.role = role;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!mobileVerified) {
      toast.error(
        language === "en"
          ? "Please verify your mobile number"
          : "कृपया आपला मोबाइल क्रमांक सत्यापित करा"
      );
      return;
    }
    if (!emailVerified) {
      toast.error(
        language === "en"
          ? "Please verify your email"
          : "कृपया आपला ईमेल सत्यापित करा"
      );
      return;
    }
    dispatch(registerUser(form));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      setWaitingForGoogle(false);
      const timer = setTimeout(() => dispatch(clearErrors()), 5000);
      return () => clearTimeout(timer);
    }

    if (isAuthenticated) {
      setWaitingForGoogle(false);
      navigateTo("/");
      toast.success(
        language === "en"
          ? "User registered successfully"
          : "वापरकर्ता यशस्वीरित्या नोंदणीकृत"
      );
    }
  }, [error, isAuthenticated, navigateTo, language]);

  useEffect(() => {
    return () => {
      if (loading) {
        dispatch(resetLoading());
      }
      // Clean up reCAPTCHA on component unmount
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
    };
  }, []);

  const strength = strengthLabel(pwdStrength(form.password));

  // Email verification handler
  const handleSendOtp = async () => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setEmailVerifying(true);
    try {
      const res = await fetch(
        "https://trekrest.onrender.com/api/v1/otp/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        }
      );

      const data = await res.json();
      console.log(data);
      if (data.success) {
        toast.success("OTP sent to your email");
        setSendEmailOtp(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP");
    } finally {
      setEmailVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const res = await fetch(
        "https://trekrest.onrender.com/api/v1/otp/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, otp }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Email verified successfully");
        setEmailVerified(true);
        setSendEmailOtp(false);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Error verifying OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4 relative">
      {waitingForGoogle && (
        <div className="absolute inset-0 bg-green-50 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center border-2 border-green-700">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mb-4"></div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              {language === "en"
                ? "Authenticating with Google"
                : "Google सह प्रमाणीकरण करत आहे"}
            </h3>
            <p className="text-green-700 text-center">
              {language === "en"
                ? "Please wait while we verify your information..."
                : "कृपया थोडा वेळ वाट पहा, आम्ही आपली माहिती तपासत आहोत..."}
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row mt-[60px] border-2 border-green-700">
        {/* Left Side - Maratha Kingdom Theme */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-700 to-green-900 p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 flex flex-col justify-center space-y-8">
            {/* Branding */}
            <div className="text-center">
              <FaHome className="text-6xl mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">{lang.title}</h1>
              <p className="text-green-100">{lang.subtitle}</p>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaShieldAlt className="text-green-300" />
                <span>{lang.secureAccess}</span>
              </div>
              <div className="flex items-center space-x-3">
                <GiMeal className="text-green-300" />
                <span>{lang.heritageTrekking}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaTree className="text-green-300" />
                <span>{lang.exclusiveExperiences}</span>
              </div>
            </div>

            {/* Quote / Message */}
            <div className="bg-green-900/50 p-6 rounded-lg">
              <p className="text-green-100 italic">{lang.quote}</p>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full md:w-1/2 p-4 md:p-8 bg-green-50">
          {/* Language Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-green-700 text-white rounded-lg text-sm"
            >
              {language === "en" ? "मराठी" : "English"}
            </button>
          </div>

          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-2">
              {lang.register}
            </h2>
            <p className="text-green-700 text-sm md:text-base">
              {lang.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Role Toggle */}
            <div className="flex justify-center gap-2 md:gap-4">
              <button
                type="button"
                onClick={() => setRole("trekker")}
                className={`px-4 py-2 md:px-6 md:py-2 rounded-full border-2 transition text-sm md:text-base ${
                  role === "trekker"
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-green-700 border-green-700"
                }`}
              >
                <FaUserAlt className="inline mr-1 md:mr-2" />
                {lang.trekker}
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`px-4 py-2 md:px-6 md:py-2 rounded-full border-2 transition text-sm md:text-base ${
                  role === "admin"
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-green-700 border-green-700"
                }`}
              >
                <FaUserShield className="inline mr-1 md:mr-2" />
                {lang.admin}
              </button>
            </div>

            <div className="grid gap-4 md:gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-green-800 mb-1 md:mb-2">
                  {lang.fullName}
                </label>
                <div className="relative">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      const allowedchars = /^[A-Za-zs\u0900-\u097F]$/;

                      const key = e.key;
                      if (
                        key === "Backspace" ||
                        key === "Delete" ||
                        key === "ArrowLeft" ||
                        key === "ArrowRight" ||
                        key === "Tab" ||
                        e.key === " "
                      )
                        return;
                      if (!allowedchars.test(key)) {
                        e.preventDefault();
                      }
                    }}
                    className={`w-full px-4 py-2 md:py-3 border ${
                      errors.name ? "border-red-500" : "border-green-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-green-100 text-sm md:text-base`}
                    placeholder={lang.fullName}
                  />
                  <FaUserAlt className="absolute right-3 top-2.5 md:top-3.5 text-green-500 text-sm md:text-base" />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Mobile Number with OTP Verification */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-green-800 mb-1 md:mb-2">
                  {lang.mobile}
                  {mobileVerified && (
                    <span className="ml-2 text-green-600 flex items-center text-xs md:text-sm">
                      <FaCheckCircle className="inline mr-1" />
                      verified
                    </span>
                  )}
                </label>
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      disabled={mobileVerified}
                      onKeyDown={(e) => {
                        // Allow only numbers, backspace, delete, arrow keys
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            e.key === "Backspace" ||
                            e.key === "Delete" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab"
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={10}
                      className={`w-full px-4 py-2 md:py-3 border ${
                        errors.mobile ? "border-red-500" : "border-green-300"
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-green-100 text-sm md:text-base ${
                        mobileVerified ? "opacity-70" : ""
                      }`}
                      placeholder="10-अंकी मोबाइल"
                    />
                    <FaPhone className="absolute right-3 top-2.5 md:top-3.5 text-green-500 text-sm md:text-base" />
                    {errors.mobile && (
                      <p className="text-red-500 text-xs md:text-sm mt-1">
                        {errors.mobile}
                      </p>
                    )}
                  </div>

                  {!mobileVerified &&
                    !otpSent &&
                    !showRecaptcha &&
                    form.mobile.length === 10 && (
                      <button
                        type="button"
                        onClick={initRecaptcha}
                        disabled={
                          checkingMobile ||
                          !form.mobile ||
                          !/^[0-9]{10}$/.test(form.mobile)
                        }
                        className={`px-3 py-2 md:px-4 md:py-3 rounded-lg border md:text-sm ${
                          checkingMobile
                            ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                            : "bg-green-700 text-white border-green-700 hover:bg-green-800"
                        } transition flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap`}
                      >
                        {checkingMobile ? (
                          <Loader2 className="animate-spin h-4 w-4 md:h-5 md:w-5" />
                        ) : (
                          <FaPhone className=" md:text-sm" />
                        )}
                        {checkingMobile
                          ? language === "en"
                            ? " Checking..."
                            : " तपासत आहे..."
                          : lang.verifyMobile}
                      </button>
                    )}
                </div>

                {/* reCAPTCHA container - Only show when needed */}
                {showRecaptcha && !mobileVerified && (
                  <div className="mt-3 md:mt-4">
                    {recaptchaLoading ? (
                      <div className="flex justify-center items-center py-2 md:py-4">
                        <Loader2 className="animate-spin h-5 w-5 md:h-6 md:w-6 text-green-700" />
                        <span className="ml-2 text-green-700 text-sm md:text-base">
                          {language === "en"
                            ? "Loading reCAPTCHA..."
                            : "reCAPTCHA लोड होत आहे..."}
                        </span>
                      </div>
                    ) : (
                      <div
                        id="recaptcha-container"
                        className="flex justify-center"
                      ></div>
                    )}
                    {!recaptchaVerified && (
                      <p className="text-xs md:text-sm text-green-600 mt-2 text-center">
                        {language === "en"
                          ? "Please complete the reCAPTCHA"
                          : "कृपया reCAPTCHA पूर्ण करा"}
                      </p>
                    )}

                    {recaptchaVerified && (
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={sendingOtp}
                        className="w-full mt-3 md:mt-4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base"
                      >
                        {sendingOtp ? (
                          <Loader2 className="animate-spin h-4 w-4 md:h-5 md:w-5" />
                        ) : (
                          <>
                            <FaPhone /> {lang.sendOtp}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* OTP Input Field */}
                {otpSent && !mobileVerified && (
                  <div className="mt-3 md:mt-4 space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-green-800 mb-1 md:mb-2">
                        {lang.enterOtp}
                      </label>
                      <div className="flex flex-col md:flex-row gap-2">
                        <input
                          type="text"
                          value={otp}
                          onChange={handleOtpChange}
                          maxLength={6}
                          className="w-full px-4 py-2 md:py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-green-100 text-sm md:text-base"
                          placeholder="6-अंकी OTP"
                        />
                        <button
                          type="button"
                          onClick={verifyOtp}
                          disabled={verifying}
                          className={`px-3 py-2 md:px-4 md:py-3 rounded-lg border text-xs md:text-sm ${
                            verifying
                              ? "bg-green-300 text-green-800 border-green-300 cursor-not-allowed"
                              : "bg-green-700 text-white border-green-700 hover:bg-green-800"
                          } transition flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap`}
                        >
                          {verifying ? (
                            <Loader2 className="animate-spin h-4 w-4 md:h-5 md:w-5" />
                          ) : (
                            lang.verifyOtp
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-center">
                      {countdown > 0 ? (
                        <p className="text-xs md:text-sm text-green-700">
                          {language === "en"
                            ? `You can resend OTP in ${countdown} seconds`
                            : `${countdown} सेकंदांनंतर पुन्हा OTP मागवू शकता`}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={resendOtp}
                          className="text-green-700 hover:text-green-900 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                        >
                          <FaRedo /> {lang.resendOtp}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Email with Verification */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-green-800 mb-1 md:mb-2">
                  {lang.email}
                  {emailVerified && (
                    <span className="ml-2 text-green-600 flex items-center text-xs md:text-sm">
                      <FaCheckCircle className="inline mr-1" />
                      {lang.emailVerified}
                    </span>
                  )}
                </label>

                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={emailVerified}
                      className={`w-full px-4 py-2 md:py-3 border ${
                        errors.email ? "border-red-500" : "border-green-300"
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-green-100 text-sm md:text-base ${
                        emailVerified ? "opacity-70" : ""
                      }`}
                      placeholder={lang.email}
                    />
                    <FaEnvelope className="absolute right-3 top-2.5 md:top-3.5 text-green-500 text-sm md:text-base" />
                  </div>

                  {!emailVerified &&
                    form.email &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={emailVerifying}
                        className={`px-3 py-2 md:px-4 md:py-3 rounded-lg border md:text-sm ${
                          emailVerifying
                            ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                            : "bg-green-700 text-white border-green-700 hover:bg-green-800"
                        } transition flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap`}
                      >
                        {emailVerifying ? (
                          <Loader2 className="animate-spin h-4 w-4 md:h-5 md:w-5" />
                        ) : (
                          <FaEnvelope className="md:text-sm" />
                        )}
                        {emailVerifying
                          ? lang.sendingVerification
                          : lang.verifyEmail}
                      </button>
                    )}
                </div>

                {/* OTP Input (only shows after OTP sent and not yet verified) */}
                {sendEmailOtp && !emailVerified && (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex-1 px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm md:text-base"
                      placeholder="Enter OTP"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}

                {errors.email && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-green-800 mb-1 md:mb-2">
                  {lang.password}
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 md:py-3 border ${
                      errors.password ? "border-red-500" : "border-green-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-green-100 text-sm md:text-base`}
                    placeholder={
                      language === "en"
                        ? "Minimum 8 characters"
                        : "किमान 8 वर्ण"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-2.5 md:top-3.5 text-green-500 text-sm md:text-base"
                  >
                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">
                    {errors.password}
                  </p>
                )}

                {/* Password Strength Meter */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-green-800 mb-1">
                      <span>
                        {lang.passwordStrength}: {strength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${strength.color} ${strength.width} h-2 rounded-full transition-all`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-green-800 mb-1 md:mb-2">
                  {lang.confirmPassword}
                </label>
                <div className="relative">
                  <input
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 md:py-3 border ${
                      errors.confirm ? "border-red-500" : "border-green-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-green-100 text-sm md:text-base`}
                    placeholder={lang.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-2.5 md:top-3.5 text-green-500 text-sm md:text-base"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirm && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">
                    {errors.confirm}
                  </p>
                )}
              </div>

              {/* Admin Secret Key */}
              {role === "admin" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-green-800 mb-1 md:mb-2">
                    {lang.adminKey}
                  </label>
                  <div className="relative">
                    <input
                      name="adminKey"
                      type="password"
                      value={form.adminKey}
                      onChange={handleChange}
                      className="w-full px-4 py-2 md:py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-green-100 text-sm md:text-base"
                      placeholder={lang.adminKey}
                    />
                    <FaKey className="absolute right-3 top-2.5 md:top-3.5 text-green-500 text-sm md:text-base" />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white font-semibold py-2 md:py-3 rounded-lg hover:bg-green-800 transition flex justify-center items-center relative shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
              disabled={loading || !mobileVerified || !emailVerified}
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 md:h-5 md:w-5 absolute" />
              ) : null}

              <span
                className={`transition-opacity ${
                  loading ? "opacity-0" : "opacity-100"
                }`}
              >
                {mobileVerified && emailVerified
                  ? lang.register
                  : language === "en"
                  ? "Complete verification"
                  : "सत्यापन पूर्ण करा"}
              </span>
            </button>
          </form>

          {/* Google Sign-In */}
          <div className="mt-4 md:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green-300"></div>
              </div>
              <div className="relative flex justify-center text-xs md:text-sm">
                <span className="px-2 bg-green-50 text-green-700">
                  {lang.or}
                </span>
              </div>
            </div>

            <div className="mt-3 md:mt-4 flex justify-center">
              <div id="googleSignInDiv"></div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-4 md:mt-6 text-center">
            <p className="text-green-700 text-xs md:text-sm">
              {lang.alreadyAccount}{" "}
              <Link
                to="/login"
                className="text-green-700 font-semibold hover:text-green-900 underline"
              >
                {lang.loginHere}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default Register;
