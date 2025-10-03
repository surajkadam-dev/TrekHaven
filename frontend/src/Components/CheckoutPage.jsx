"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
const BackendURL = "http://localhost:8000";
import {
  createBooking,
  resetSlice,
  clearAllBookingErrors,
} from "../store/slices/bookSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaRupeeSign,
  FaCreditCard,
  FaLock,
  FaCheckCircle,
  FaGooglePay,
  FaTimes,
  FaSpinner,
  FaClock,
  FaInfoCircle,
  FaShieldAlt,
  FaArrowLeft,
  FaGlobe,
} from "react-icons/fa";

const STORAGE_KEY = "razorpay_checkout_payload";
const WEBHOOK_POLLING_INTERVAL = 3000;
const WEBHOOK_POLLING_TIMEOUT = 60000;

const CheckoutPage = () => {
  const { accommodationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookingDataFromState = location.state || {};

  console.log("Booking Data from state:", bookingDataFromState);
  const { error, loading, message } = useSelector((store) => store.booking);
  const { user } = useSelector((store) => store.user);

  // Professional business color palette
  const colors = {
    darkGreen: "#2E4E3F",
    mediumGreen: "#5A7D5A",
    lightBeige: "#F5F1E6",
    brown: "#8B4513",
    lightBrown: "#A67B5B",
    textDark: "#2D2D2D",
  };

  // Language state
  const [language, setLanguage] = useState("en");
  const translations = {
    en: {
      title: "Complete Your Booking",
      summaryTitle: "Your Trip Summary",
      name: "Full Name",
      email: "Email ID",
      phone: "Contact Number",
      date: "Travel Date",
      package: "Trek Package",
      groupSize: "Group Size",
      mealPreference: "Meal Preference",
      stayIncluded: "Stay Included?",
      paymentMethod: "Payment Method",
      onlinePayment: "Online Payment",
      onlinePaymentDesc: "Pay securely via Card, UPI or Net Banking",
      cashPayment: "Pay at Check-in",
      cashPaymentDesc: "Pay 50% now, remaining at check-in",
      terms: "I accept the terms and conditions",
      payNow: "Pay Now",
      paymentDetails: "Payment Details",
      accommodation: "Accommodation + Meals",
      deposit: "Deposit (50%)",
      balance: "Balance Amount (Pay at location)",
      currentAmount: "Amount to Pay Now",
      totalAmount: "Total Amount",
      bookingProtection: "Booking Protection",
      bookingProtectionDesc:
        "Your booking is protected by our cancellation policy",
      needHelp: "Need Help?",
      call: "Call:",
      emailSupport: "Email:",
      secured: "Your payment is secured with Razorpay",
      bookingSuccess: "Booking Successful!",
      bookingSuccessDesc:
        "Your booking has been completed successfully. You will receive a confirmation email shortly.",
      viewBookings: "View Bookings",
      waitingConfirmation: "Waiting for Confirmation",
      waitingDesc:
        "Your payment was successful! Waiting for your booking confirmation.",
      dontClose: "Please don't close this window...",
      back: "Back",
    },
    mr: {
      title: "तुमचे आरक्षण पूर्ण करा",
      summaryTitle: "तुमच्या प्रवासाचा संक्षिप्त आढावा",
      name: "संपूर्ण नाव",
      email: "ई-मेल आयडी",
      phone: "संपर्क क्रमांक",
      date: "प्रवासाची तारीख",
      package: "ट्रेक पॅकेज",
      groupSize: "गटातील लोकसंख्या",
      mealPreference: "जेवणाची पसंती",
      stayIncluded: "राहणी समाविष्ट आहे का?",
      paymentMethod: "पेमेंटची पद्धत",
      onlinePayment: "ऑनलाइन पेमेंट",
      onlinePaymentDesc: "कार्ड, UPI किंवा नेट बँकिंगद्वारे सुरक्षितपणे भरा",
      cashPayment: "चेक-इनवर पेमेंट",
      cashPaymentDesc: "आधी 50% भरा, उर्वरित रक्कम चेक-इनवर",
      terms: "मी अटी व शर्ती मान्य करतो/करते",
      payNow: "आता भरा",
      paymentDetails: "भरणा तपशील",
      accommodation: "रहाणे + जेवण",
      deposit: "डेपॉझिट (50%)",
      balance: "बाकी रक्कम (स्थळावर भरणे)",
      currentAmount: "सद्याची रक्कम भरा",
      totalAmount: "एकूण रक्कम",
      bookingProtection: "आरक्षण संरक्षण",
      bookingProtectionDesc: "आपले आरक्षण आमच्या रद्द धोरणाद्वारे संरक्षित आहे",
      needHelp: "सहाय्य हवे आहे?",
      call: "कॉल करा:",
      emailSupport: "ई-मेल:",
      secured: "तुमचे पेमेंट Razorpay द्वारे सुरक्षित आहे",
      bookingSuccess: "बुकिंग यशस्वी!",
      bookingSuccessDesc:
        "तुमची बुकिंग यशस्वीरीत्या पूर्ण झाली आहे. लवकरच तुम्हाला पुष्टी ईमेल मिळेल.",
      viewBookings: "बुकिंग पहा",
      waitingConfirmation: "पुष्टीची वाट पाहत आहोत",
      waitingDesc:
        "तुमची पेमेंट यशस्वी झाली आहे! तुमच्या बुकिंगसाठी पुष्टीची वाट पाहत आहोत.",
      dontClose: "कृपया हे विंडो बंद करू नका...",
      back: "मागे",
    },
  };
  const t = translations[language];

  // UI & payment state
  const [bookingData] = useState(bookingDataFromState);
  const [paymentMode, setPaymentMode] = useState("online");
  const [onlineMethod, setOnlineMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [waitingForWebhook, setWaitingForWebhook] = useState(false);
  const [currentRazorpayOrderId, setCurrentRazorpayOrderId] = useState(null);
  const [webhookPollingCount, setWebhookPollingCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Calculate amounts based on payment mode
  const fullAmount = bookingData.amount || 0;
  const depositAmount = paymentMode === "cash" ? fullAmount / 2 : fullAmount;
  const remainingAmount = paymentMode === "cash" ? fullAmount / 2 : 0;

  // Booking result
  const [bookingResult, setBookingResult] = useState(null);

  // Razorpay payload & instance
  const [razorpayPayload, setRazorpayPayload] = useState(null);
  const rzpRef = useRef(null);
  const pollingRef = useRef(null);

  // Handle resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clear polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Redirect to dashboard after successful booking
  useEffect(() => {
    if (isSuccess && bookingResult) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, bookingResult, navigate]);

  // Helper: remove payload safely
  const cleanupRazorpayPayload = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to remove razorpay payload from sessionStorage", e);
    }
    setRazorpayPayload(null);
  };

  // Verify SDK loaded on mount
  useEffect(() => {
    if (!window.Razorpay) {
      console.error("Razorpay SDK failed to load");
      toast.error("Payment gateway initialization failed");
    }
  }, []);

  // Show backend messages
  useEffect(() => {
    if (message && isSuccess) {
      dispatch(clearAllBookingErrors());
      dispatch(resetSlice());
    }
  }, [message, isSuccess, dispatch]);

  // Show backend errors
  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(error);
      console.error("Booking error:", error);
      setIsProcessing(false);
      setWaitingForWebhook(false);
      dispatch(clearAllBookingErrors());
    }
  }, [error, dispatch]);

  // Read saved payload from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.razorpayOrder) {
          setRazorpayPayload(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse session data", e);
    }
  }, []);

  // Poll for webhook confirmation
  const pollForWebhookConfirmation = async (orderId) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    let attempts = 0;
    const maxAttempts = WEBHOOK_POLLING_TIMEOUT / WEBHOOK_POLLING_INTERVAL;

    pollingRef.current = setInterval(async () => {
      attempts++;
      setWebhookPollingCount(attempts);

      if (attempts > maxAttempts) {
        clearInterval(pollingRef.current);
        setWaitingForWebhook(false);
        toast.error("Payment confirmation timeout. Please contact support.");
        return;
      }

      try {
        const response = await axios.get(
          `${BackendURL}/api/v1/booking/check-confirmation/${orderId}`,
          { withCredentials: true }
        );

        if (response.data.success && response.data.booking) {
          clearInterval(pollingRef.current);
          setWaitingForWebhook(false);
          setBookingResult(response.data.booking);
          setIsSuccess(true);

          toast.success(
            paymentMode === "cash"
              ? `Deposit paid successfully`
              : "Payment successful"
          );
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, WEBHOOK_POLLING_INTERVAL);
  };

  // Open Razorpay modal when payload is set
  useEffect(() => {
    if (!razorpayPayload) return;
    let mounted = true;

    const openRzp = async () => {
      setPaymentError(null);
      setIsProcessing(true);

      const {
        razorpayOrder,
        razorpayKey,
        bookingToken,
        paymentMode: payloadPaymentMode,
        depositAmount: payloadDepositAmount,
        fullAmount: payloadFullAmount,
      } = razorpayPayload;

      // Sanity checks
      if (!razorpayOrder || !razorpayOrder.id) {
        const msg = "Invalid order data received from server.";
        setPaymentError(msg);
        toast.error(msg);
        setIsProcessing(false);
        cleanupRazorpayPayload();
        return;
      }
      if (!razorpayKey) {
        const msg = "Missing Razorpay key from server.";
        setPaymentError(msg);
        toast.error(msg);
        setIsProcessing(false);
        cleanupRazorpayPayload();
        return;
      }

      setCurrentRazorpayOrderId(razorpayOrder.id);

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "Maratha Kingdom Tours",
        description:
          payloadPaymentMode === "cash"
            ? `Booking Deposit (${payloadDepositAmount})`
            : "Booking Payment",
        order_id: razorpayOrder.id,
        image: "/logo.png",
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.mobile || "",
        },
        theme: { color: colors.darkGreen },

        handler: async (paymentResponse) => {
          try {
            setIsProcessing(true);
            setWaitingForWebhook(true);

            const verifyRes = await axios.post(
              `${BackendURL}/api/v1/booking/${accommodationId}/verify-payment`,
              {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );

            if (verifyRes?.data?.success) {
              toast.info("Payment verified. Waiting for confirmation...");
              pollForWebhookConfirmation(paymentResponse.razorpay_order_id);

              cleanupRazorpayPayload();
              return;
            }

            const fallbackMsg =
              verifyRes?.data?.error || "Payment verification failed.";
            setPaymentError(fallbackMsg);
            toast.error(fallbackMsg);
            setIsProcessing(false);
            setWaitingForWebhook(false);
            cleanupRazorpayPayload();
          } catch (err) {
            console.error("verify-payment error:", err);
            const msg =
              err.response?.data?.message ||
              err.response?.data?.error ||
              err.message ||
              "Payment verification failed";
            setPaymentError("Payment verification failed: " + msg);
            toast.error("Payment verification failed: " + msg);
            setIsProcessing(false);
            setWaitingForWebhook(false);
            cleanupRazorpayPayload();
          }
        },

        modal: {
          ondismiss: () => {
            const msg = "Payment cancelled by user";
            setPaymentError(msg);
            toast.info(msg);
            cleanupRazorpayPayload();
            setIsProcessing(false);
            setWaitingForWebhook(false);

            setTimeout(() => navigate("/"), 1500);
          },
        },
      };

      try {
        rzpRef.current = new window.Razorpay(options);

        rzpRef.current.on("payment.failed", (resp) => {
          const desc =
            resp?.error?.description || resp?.error?.reason || "Payment failed";
          console.error("Payment failed:", resp);
          setPaymentError(desc);
          toast.error(desc);
          setIsProcessing(false);
          setWaitingForWebhook(false);
          cleanupRazorpayPayload();
        });

        rzpRef.current.open();
      } catch (err) {
        console.error("Failed to initialize Razorpay:", err);
        const msg = "Failed to initialize payment: " + err.message;
        setPaymentError(msg);
        toast.error(msg);
        setIsProcessing(false);
        setWaitingForWebhook(false);
        cleanupRazorpayPayload();
      }
    };

    openRzp();

    return () => {
      mounted = false;
      try {
        if (rzpRef.current?.close) rzpRef.current.close();
      } catch (e) {}
    };
  }, [
    razorpayPayload,
    accommodationId,
    user,
    navigate,
    paymentMode,
    remainingAmount,
    colors.darkGreen,
  ]);

  // Main entry when user clicks the Pay / Continue button
  const processBooking = async () => {
    if (!termsAccepted) {
      const msg = "Please accept terms and conditions";
      setPaymentError(msg);
      toast.warn(msg);
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);
    dispatch(clearAllBookingErrors());

    try {
      const bookingPayload = {
        ...bookingData,
        paymentMode,
      };

      const result = await dispatch(
        createBooking({ bookingData: bookingPayload, accommodationId })
      );

      const payload = result.payload || result;

      // Check if backend returned a failed response
      if (
        payload &&
        typeof payload.success !== "undefined" &&
        payload.success === false
      ) {
        const errMsg =
          payload.error || payload.message || "Booking initialization failed";

        if (errMsg.includes("Booking already exists")) {
          toast.error(
            "You already have a booking for this accommodation on the selected date."
          );
        } else {
          toast.error(errMsg);
        }

        setPaymentError(errMsg);
        setIsProcessing(false);
        cleanupRazorpayPayload();
        return;
      }

      // If Razorpay order is returned (online or cash deposit), open Razorpay modal
      if (payload?.razorpayOrder) {
        const saved = {
          ...payload,
          bookingData: bookingPayload,
          paymentMode,
          depositAmount,
          fullAmount,
        };

        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        } catch (e) {
          console.warn("Failed to save payload to sessionStorage", e);
        }

        setRazorpayPayload(saved);
        setIsProcessing(false);
        return;
      }

      // If backend returned booking object directly (fully offline booking)
      if (payload?.booking || payload) {
        const booking = payload.booking || payload;

        console.log(payload);

        // Check if booking is already existing
        if (payload.error) {
          setIsProcessing(false);
          setIsSuccess(false);
          cleanupRazorpayPayload();
          return;
        }

        // Otherwise, show booking confirmation
        setBookingResult(booking);
        setIsSuccess(true);
        setIsProcessing(false);
        return;
      }

      // If nothing returned, silently cleanup
      setIsProcessing(false);
      cleanupRazorpayPayload();
    } catch (err) {
      console.error("processBooking error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Payment processing failed. Please try again.";

      if (msg.includes("Booking already exists")) {
        toast.error(
          "You already have a booking for this accommodation on the selected date."
        );
      } else {
        toast.error(msg);
      }

      setPaymentError(msg);
      setIsProcessing(false);
      cleanupRazorpayPayload();
    }
  };

  const handleGPaySubmit = () => {
    if (!termsAccepted) {
      const msg = "Please accept terms and conditions";
      setPaymentError(msg);
      toast.warn(msg);
      return;
    }
    setOnlineMethod("gpay");
    processBooking();
  };

  const handleOtherPaymentSubmit = () => {
    if (!termsAccepted) {
      const msg = "Please accept terms and conditions";
      setPaymentError(msg);
      toast.warn(msg);
      return;
    }
    processBooking();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.lightBeige }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.darkGreen }}
          ></div>
          <p style={{ color: colors.darkGreen }}>Processing your booking...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess && bookingResult) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: colors.lightBeige }}
      >
        <div
          className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center border-2"
          style={{ borderColor: colors.darkGreen }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${colors.mediumGreen}20` }}
          >
            <FaCheckCircle
              className="text-2xl"
              style={{ color: colors.mediumGreen }}
            />
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: colors.darkGreen }}
          >
            {t.bookingSuccess}
          </h2>
          <p className="mb-6" style={{ color: colors.brown }}>
            {t.bookingSuccessDesc}
          </p>
          <div
            className="rounded-lg p-4 mb-6 text-left border"
            style={{
              backgroundColor: `${colors.lightBeige}`,
              borderColor: colors.lightBrown,
            }}
          >
            <h3
              className="font-semibold mb-2"
              style={{ color: colors.darkGreen }}
            >
              Booking Details:
            </h3>
            <p className="text-sm" style={{ color: colors.brown }}>
              Name: {bookingData.name}
            </p>
            <p className="text-sm" style={{ color: colors.brown }}>
              Date: {formatDate(bookingData.stayDate)}
            </p>
            <p className="text-sm" style={{ color: colors.brown }}>
              Group Size: {bookingData.groupSize} people
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-white py-3 rounded-lg font-medium transition duration-200"
            style={{ backgroundColor: colors.darkGreen }}
          >
            {t.viewBookings}
          </button>
        </div>
      </div>
    );
  }

  // Webhook waiting state
  if (waitingForWebhook) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: colors.lightBeige }}
      >
        <div
          className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center border-2"
          style={{ borderColor: colors.darkGreen }}
        >
          <div className="flex justify-center mb-4">
            <FaClock
              className="text-4xl animate-pulse"
              style={{ color: colors.mediumGreen }}
            />
          </div>
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: colors.darkGreen }}
          >
            {t.waitingConfirmation}
          </h2>
          <p className="mb-4" style={{ color: colors.brown }}>
            {t.waitingDesc}
          </p>
          <div
            className="w-full rounded-full h-2 mb-4"
            style={{ backgroundColor: `${colors.lightBrown}30` }}
          >
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(webhookPollingCount * 5, 100)}%`,
                backgroundColor: colors.mediumGreen,
              }}
            ></div>
          </div>
          <p className="text-sm" style={{ color: colors.lightBrown }}>
            {t.dontClose}
          </p>
        </div>
      </div>
    );
  }

  // Main checkout UI
  return (
    <div
      className="min-h-screen py-6 px-4"
      style={{ backgroundColor: "white" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center p-2 rounded-lg transition-colors"
            style={{
              color: colors.darkGreen,
              backgroundColor: `${colors.darkGreen}10`,
            }}
          >
            <FaArrowLeft className="mr-2" /> {t.back}
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={() => setLanguage(language === "en" ? "mr" : "en")}
            className="flex items-center px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: colors.mediumGreen,
              color: colors.lightBeige,
            }}
          >
            <FaGlobe className="mr-2" />
            {language === "en" ? "मराठी" : "English"}
          </button>
        </div>

        <h1
          className="text-2xl font-bold mb-6 flex items-center"
          style={{ color: colors.darkGreen }}
        >
          {t.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Booking Summary */}
          <div className="lg:col-span-2">
            <div
              className="bg-white rounded-lg shadow-sm p-5 mb-6 border-2"
              style={{ borderColor: colors.darkGreen }}
            >
              <h2
                className="text-lg font-semibold mb-4 flex items-center"
                style={{ color: colors.darkGreen }}
              >
                <FaInfoCircle
                  className="mr-2"
                  style={{ color: colors.mediumGreen }}
                />
                {t.summaryTitle}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center">
                  <FaUser
                    className="mr-2"
                    style={{ color: colors.mediumGreen }}
                  />
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: colors.mediumGreen }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.darkGreen }}
                    >
                      {user?.name || bookingData.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaEnvelope
                    className="mr-2"
                    style={{ color: colors.mediumGreen }}
                  />
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: colors.mediumGreen }}
                    >
                      {t.email}
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.darkGreen }}
                    >
                      {user?.email || bookingData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaPhone
                    className="mr-2"
                    style={{ color: colors.mediumGreen }}
                  />
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: colors.mediumGreen }}
                    >
                      {t.phone}
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.darkGreen }}
                    >
                      {user?.mobile || bookingData.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaCalendarAlt
                    className="mr-2"
                    style={{ color: colors.mediumGreen }}
                  />
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: colors.mediumGreen }}
                    >
                      {t.date}
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.darkGreen }}
                    >
                      {formatDate(bookingData.stayDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="border-t pt-4"
                style={{ borderColor: `${colors.lightBrown}30` }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="text-sm"
                    style={{ color: colors.mediumGreen }}
                  >
                    {t.package}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.darkGreen }}
                  >
                    {bookingData.trekName}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span
                    className="text-sm"
                    style={{ color: colors.mediumGreen }}
                  >
                    {t.groupSize}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.darkGreen }}
                  >
                    {bookingData.groupSize} people
                  </span>
                </div>

                {bookingData.mealType && (
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-sm"
                      style={{ color: colors.mediumGreen }}
                    >
                      {t.mealPreference}
                    </span>
                    <span
                      className="text-sm font-medium capitalize"
                      style={{ color: colors.darkGreen }}
                    >
                      {bookingData.mealType}
                    </span>
                  </div>
                )}

                {bookingData.needStay && (
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-sm"
                      style={{ color: colors.mediumGreen }}
                    >
                      {t.stayIncluded}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.darkGreen }}
                    >
                      Yes ({bookingData.stayNight} nights)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div
              className="bg-white rounded-lg shadow-sm p-5 border-2"
              style={{ borderColor: colors.darkGreen }}
            >
              <h2
                className="text-lg font-semibold mb-4 flex items-center"
                style={{ color: colors.darkGreen }}
              >
                <FaCreditCard
                  className="mr-2"
                  style={{ color: colors.mediumGreen }}
                />
                {t.paymentMethod}
              </h2>

              {paymentError && (
                <div
                  className="border p-3 rounded-lg mb-4 flex items-start"
                  style={{
                    backgroundColor: `${colors.lightBrown}10`,
                    borderColor: colors.lightBrown,
                  }}
                >
                  <FaTimes
                    className="mr-2 mt-0.5"
                    style={{ color: colors.lightBrown }}
                  />
                  <p className="text-sm" style={{ color: colors.brown }}>
                    {paymentError}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    paymentMode === "online"
                      ? "bg-opacity-20"
                      : "hover:border-opacity-60"
                  }`}
                  style={{
                    borderColor:
                      paymentMode === "online"
                        ? colors.darkGreen
                        : `${colors.darkGreen}40`,
                    backgroundColor:
                      paymentMode === "online"
                        ? `${colors.darkGreen}10`
                        : "transparent",
                  }}
                  onClick={() => setPaymentMode("online")}
                >
                  <div className="flex items-center mb-1">
                    <div
                      className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                        paymentMode === "online"
                          ? "bg-white border-2"
                          : "border"
                      }`}
                      style={{
                        borderColor: colors.darkGreen,
                        backgroundColor:
                          paymentMode === "online"
                            ? colors.darkGreen
                            : "transparent",
                      }}
                    >
                      {paymentMode === "online" && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                    <h3
                      className="font-medium text-sm"
                      style={{ color: colors.darkGreen }}
                    >
                      {t.onlinePayment}
                    </h3>
                  </div>
                  <p
                    className="text-xs ml-6"
                    style={{ color: colors.mediumGreen }}
                  >
                    {t.onlinePaymentDesc}
                  </p>
                </div>

                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    paymentMode === "cash"
                      ? "bg-opacity-20"
                      : "hover:border-opacity-60"
                  }`}
                  style={{
                    borderColor:
                      paymentMode === "cash"
                        ? colors.darkGreen
                        : `${colors.darkGreen}40`,
                    backgroundColor:
                      paymentMode === "cash"
                        ? `${colors.darkGreen}10`
                        : "transparent",
                  }}
                  onClick={() => setPaymentMode("cash")}
                >
                  <div className="flex items-center mb-1">
                    <div
                      className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                        paymentMode === "cash" ? "bg-white border-2" : "border"
                      }`}
                      style={{
                        borderColor: colors.darkGreen,
                        backgroundColor:
                          paymentMode === "cash"
                            ? colors.darkGreen
                            : "transparent",
                      }}
                    >
                      {paymentMode === "cash" && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                    <h3
                      className="font-medium text-sm"
                      style={{ color: colors.darkGreen }}
                    >
                      {t.cashPayment}
                    </h3>
                  </div>
                  <p
                    className="text-xs ml-6"
                    style={{ color: colors.mediumGreen }}
                  >
                    {t.cashPaymentDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-start mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 mr-2 h-4 w-4 focus:ring-2 border rounded"
                  style={{
                    borderColor: colors.darkGreen,
                    color: colors.darkGreen,
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-xs"
                  style={{ color: colors.brown }}
                >
                  {t.terms}
                </label>
              </div>

              <button
                onClick={
                  onlineMethod === "gpay"
                    ? handleGPaySubmit
                    : handleOtherPaymentSubmit
                }
                disabled={isProcessing || !termsAccepted}
                className="w-full text-white py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center text-sm disabled:opacity-70"
                style={{ backgroundColor: colors.darkGreen }}
              >
                {isProcessing ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : paymentMode === "cash" ? (
                  `Pay ₹${depositAmount} Now`
                ) : (
                  `Pay ₹${fullAmount} Now`
                )}
              </button>

              <div
                className="flex items-center justify-center mt-3 text-xs"
                style={{ color: colors.mediumGreen }}
              >
                <FaLock className="mr-1 text-xs" />
                <span>{t.secured}</span>
              </div>
            </div>
          </div>

          {/* Right column - Payment Summary */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-lg shadow-sm p-5 sticky top-4 border-2"
              style={{ borderColor: colors.darkGreen }}
            >
              <h2
                className="text-lg font-semibold mb-4 flex items-center"
                style={{ color: colors.darkGreen }}
              >
                <FaRupeeSign
                  className="mr-2"
                  style={{ color: colors.mediumGreen }}
                />
                {t.paymentDetails}
              </h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span
                    className="text-sm"
                    style={{ color: colors.mediumGreen }}
                  >
                    {t.accommodation}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.darkGreen }}
                  >
                    ₹{fullAmount}
                  </span>
                </div>

                {paymentMode === "cash" && (
                  <>
                    <div
                      className="flex justify-between"
                      style={{ color: colors.brown }}
                    >
                      <span className="text-sm">{t.deposit}</span>
                      <span className="text-sm font-medium">
                        ₹{depositAmount}
                      </span>
                    </div>
                    <div
                      className="flex justify-between"
                      style={{ color: colors.mediumGreen }}
                    >
                      <span className="text-sm">{t.balance}</span>
                      <span className="text-sm">₹{remainingAmount}</span>
                    </div>
                  </>
                )}

                <div
                  className="border-t pt-2"
                  style={{ borderColor: `${colors.lightBrown}30` }}
                >
                  <div className="flex justify-between font-semibold">
                    <span style={{ color: colors.darkGreen }}>
                      {paymentMode === "cash" ? t.currentAmount : t.totalAmount}
                    </span>
                    <span style={{ color: colors.darkGreen }}>
                      ₹{paymentMode === "cash" ? depositAmount : fullAmount}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-lg p-3 mb-4 border"
                style={{
                  backgroundColor: `${colors.lightBeige}`,
                  borderColor: colors.lightBrown,
                }}
              >
                <h3
                  className="font-medium mb-1 flex items-center text-sm"
                  style={{ color: colors.darkGreen }}
                >
                  <FaShieldAlt
                    className="mr-1 text-xs"
                    style={{ color: colors.mediumGreen }}
                  />
                  {t.bookingProtection}
                </h3>
                <p className="text-xs" style={{ color: colors.brown }}>
                  {t.bookingProtectionDesc}
                </p>
              </div>

              <div
                className="rounded-lg p-3 border"
                style={{
                  backgroundColor: `${colors.lightBeige}`,
                  borderColor: colors.lightBrown,
                }}
              >
                <h3
                  className="font-medium mb-1 text-sm"
                  style={{ color: colors.darkGreen }}
                >
                  {t.needHelp}
                </h3>
                <p className="text-xs mb-1" style={{ color: colors.brown }}>
                  {t.call}{" "}
                  <a
                    href="tel:+919321803014"
                    className="underline"
                    style={{ color: colors.mediumGreen }}
                  >
                    +91 9321803014
                  </a>
                </p>
                <p className="text-xs" style={{ color: colors.brown }}>
                  {t.emailSupport}{" "}
                  <a
                    href="mailto:surajkadam1706004@gmail.com"
                    className="underline"
                    style={{ color: colors.mediumGreen }}
                  >
                    surajkadam1706004@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default CheckoutPage;
