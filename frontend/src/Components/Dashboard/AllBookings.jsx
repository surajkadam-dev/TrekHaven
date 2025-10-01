"use client";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "/logo_green.png";
import {
  getAllBookings,
  updatePaymentStatus,
  resetError,
  resetMessage,
  resetSlice,
} from "../../store/slices/adminSlice";

import { deleteUserBooking } from "../../store/slices/bookSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Loader2,
  Search,
  Eye,
  IndianRupee,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sword,
  CreditCard,
  User,
  X,
  Check,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";

// Maratha Kingdom color palette
const colors = {
  saffron: "#6B8E23",
  green: "#138808",
  maroon: "#8B0000",
  gold: "#D4AF37",
  cream: "#F8F4E6",
  darkBrown: "#5D4037",
};

// ✅ Custom Button with Maratha theme
const Button = ({
  children,
  onClick,
  disabled,
  className,
  variant = "primary",
}) => {
  const baseClasses =
    "px-4 py-2 rounded-xl font-semibold transition-all shadow-md flex items-center gap-2";

  const variants = {
    primary: `bg-${colors.saffron.replace(
      "#",
      ""
    )} text-white hover:bg-${colors.maroon.replace("#", "")}`,
    secondary: `bg-${colors.green.replace(
      "#",
      ""
    )} text-white hover:bg-${colors.darkBrown.replace("#", "")}`,
    danger: `bg-${colors.maroon.replace("#", "")} text-white hover:bg-red-800`,
    success: `bg-${colors.green.replace(
      "#",
      ""
    )} text-white hover:bg-green-800`,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      style={{
        backgroundColor:
          variant === "primary"
            ? colors.saffron
            : variant === "secondary"
            ? colors.green
            : variant === "danger"
            ? colors.maroon
            : variant === "success"
            ? colors.green
            : colors.saffron,
        color: "white",
      }}
    >
      {children}
    </button>
  );
};

// ✅ Custom Card with Maratha theme
const Card = ({ children, className }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`shadow-xl border-2 rounded-2xl p-4 relative overflow-hidden ${className}`}
      style={{
        borderColor: colors.saffron,
        backgroundColor: colors.cream,
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: colors.saffron }}
      ></div>
      {children}
    </motion.div>
  );
};

// ✅ Action Button
const ActionButton = ({ icon, onClick, className, tooltip }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    title={tooltip}
    className={`p-2 rounded-lg border ${className}`}
    style={{ borderColor: colors.saffron }}
  >
    {icon}
  </motion.button>
);

const AllBookings = () => {
  const dispatch = useDispatch();
  const {
    AllBookings,
    loading,
    error,
    totalBookings,
    totalPages,
    page,
    message,
  } = useSelector((store) => store.admin);

  const [keyword, setKeyword] = useState("");
  const [groupName, setGroupName] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [mealType, setMealType] = useState("");
  const [viewBooking, setViewBooking] = useState(null);
  const [limit] = useState(5);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [language, setLanguage] = useState("en");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const progressInterval = useRef(null);
  const translations = {
    en: {
      totalBooking: "Total Bookings",
      header: "All Bookings",
      serachbooking: "serach booking",
      mealType: "meal type",
      allbooking: "All Booking",
      completeBooking: "Completed",
      confirmBooking: "Confirmed",
      cancelBooki: "Cancelled",
      paymentMode: "All Payments",
      cashPayment: "cash",
      onlinePayment: "online",
      removeFilter: "Remove Filter",
      name: "name",
      stayDate: "stayDate",
      status: "status",
      PaymentMethod: "Payment",
      Action: "Action",
      veg: "veg",
      nonveg: "nonVeg",
      groupName: "grioup Name",
      fullName: "Full Name",
      guestInformation: "Guest Information",

      Email: "Email",
      Phone: "Phone",
      BookingDetails: "Booking Details",
      BookingDate: "Booking Date",
      PaymentInfo: "Payment Information",
      TotalAmount: "Total",
      PaymentStautus: "payment status",
      paymentPending: "pending",
      paymentFaild: "faild",
      PaymentPaid: "Paid",
      GroupSize: "Group size",
      StayNights: "stay Night",
      DepositePaid: "Deposite Paid",
      RefundStatus: "Refund Status",
      RefundProcessing: "Processing",
      RefundRequest: "Refund Request",
      Refundid: "Refund Id",
    },
    mr: {
      totalBooking: "एकूण बुकिंग्स",
      header: "सर्व बुकिंग्स",
      serachbooking: "बुकिंग शोधा",
      mealType: "जेवणाचा प्रकार",
      allbooking: "सर्व बुकिंग्स",
      completeBooking: "पूर्ण झाले",
      confirmBooking: "निश्चित झाले",
      cancelBooki: "रद्द झाले",
      paymentMode: "सर्व पेमेंट्स",
      cashPayment: "रोखी",
      onlinePayment: "ऑनलाइन",
      removeFilter: "फिल्टर काढा",
      name: "नाव",
      stayDate: "थांबण्याची तारीख",
      status: "स्थिती",
      PaymentMethod: "पेमेंट",
      Action: "क्रिया",
      veg: "शाकाहारी",
      nonveg: "मांसाहारी",
      groupName: "गटाचे नाव",
      fullName: "पूर्ण नाव",
      guestInformation: "पाहुण्याची माहिती",
      Email: "ईमेल",
      Phone: "फोन",
      BookingDetails: "बुकिंग माहिती",
      BookingDate: "बुकिंग तारीख",
      PaymentInfo: "पेमेंट माहिती",
      TotalAmount: "एकूण रक्कम",
      PaymentStautus: "पेमेंट स्थिती",
      paymentPending: "प्रलंबित",
      paymentFaild: "अयशस्वी",
      PaymentPaid: "भरलेले",
      GroupSize: "गटाचा आकार",
      StayNights: "राहण्याच्या रात्री",
      DepositePaid: "ठेव भरलेली",
      RefundStatus: "परताव्याची स्थिती",
      RefundProcessing: "प्रक्रियेत",
      RefundRequest: "परताव्याची विनंती",
      Refundid: "परतावा आयडी",
    },
  };
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "mr" : "en"));
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(
      getAllBookings(
        page,
        limit,
        keyword,
        groupName,
        status,
        paymentMode,
        mealType
      )
    );
  }, [
    dispatch,
    page,
    limit,
    keyword,
    groupName,
    status,
    paymentMode,
    mealType,
  ]);

  useEffect(() => {
    if (error) {
      dispatch(resetError());
    }
    if (message) {
      toast.error(message.error);
      dispatch(resetMessage());
      dispatch(resetSlice());
    }
  }, [error, message, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetSlice());
    };
  }, [dispatch]);

  const handlePrev = () => {
    if (page > 1)
      dispatch(
        getAllBookings(
          page - 1,
          limit,
          keyword,
          groupName,
          status,
          paymentMode,
          mealType
        )
      );
  };

  const handleNext = () => {
    if (page < totalPages)
      dispatch(
        getAllBookings(page + 1, limit, keyword, groupName, status, paymentMode)
      );
  };

  const openBookingView = (booking) => {
    setViewBooking(booking);
  };

  const closeModal = () => {
    setViewBooking(null);
  };

  const handlePaymentStatusChange = (id, currentStatus) => {
    setUpdatingId(id);
    const newStatus = currentStatus === "pending" ? "paid" : "pending";
    dispatch(updatePaymentStatus({ id, paymentStatus: newStatus })).then(() => {
      setUpdatingId(null);
      dispatch(
        getAllBookings(
          page,
          limit,
          keyword,
          groupName,
          status,
          paymentMode,
          mealType
        )
      );
    });
  };

  const handleDeleteBooking = (id) => {
    setDeletingId(id);
    dispatch(deleteUserBooking(id)).then(() => {
      setDeletingId(null);
      dispatch(
        getAllBookings(
          page,
          limit,
          keyword,
          groupName,
          status,
          paymentMode,
          mealType
        )
      );
    });
  };

  const StatusBadge = ({ status }) => {
    // Define colors for each status
    const statusColors = {
      cancelled: "bg-red-500 text-white",
      confirmed: "bg-blue-500 text-white",
      completed: "bg-green-500 text-white",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          statusColors[status] || "bg-gray-300 text-black"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const simulateDownload = (booking) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    // Simulate progress
    progressInterval.current = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval.current);
          generateAndDownloadPDF(booking);
          setTimeout(() => setIsDownloading(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  const generateAndDownloadPDF = (booking) => {
    const totalAmount = booking.amount || 0;
    const depositPaid = booking.depositPaid ? booking.depositAmount : 0;
    const hasDepositPaid = booking.depositPaid;
    const refundRequested = booking.refundRequested;
    const refundAmount = booking.refundAmount || 0;
    const paymentMode = booking.paymentMode;

    const isCashPayment = paymentMode === "cash";
    const isOnlinePayment = paymentMode === "online";

    let finalAmount = 0;
    let finalAmountDescription = "";

    if (isOnlinePayment && !refundRequested) {
      finalAmount = totalAmount;
      finalAmountDescription = "Full payment received. No balance due.";
    } else if (isCashPayment && hasDepositPaid && !refundRequested) {
      finalAmount = booking.depositAmount;
      finalAmountDescription = `Deposit received: Rs. ${booking.depositAmount}. Balance due: Rs. ${booking.remainingAmount}`;
    } else if (isOnlinePayment && refundRequested) {
      finalAmount = refundAmount; // ✅ What customer actually received
      finalAmountDescription = `Refund Issued: Rs. ${refundAmount}. Cancellation Fee: Rs. ${
        totalAmount - refundAmount
      }`;
    } else if (isCashPayment && hasDepositPaid && refundRequested) {
      // Amount customer actually gets back
      finalAmount = refundAmount || booking.depositAmount;

      // Explanation for customer
      finalAmountDescription = `Refund Issued: Rs. ${finalAmount}. Cancellation Fee: Rs. ${
        booking.depositAmount - finalAmount
      }`;
    }

    const doc = new jsPDF();

    // Colors - Green theme to match logo
    const primaryColor = [34, 139, 34]; // Forest Green
    const secondaryColor = [245, 245, 245]; // Light gray for backgrounds
    const accentColor = [50, 205, 50]; // Light Green
    const textColor = [51, 51, 51]; // Dark gray for text

    // Add header with background
    // Header background (White)
    // Header background (Gray)
    doc.setFillColor(255, 255, 255); // Dark Gray
    doc.rect(0, 0, 210, 25, "F");

    // Logo on left
    doc.addImage(logo, "PNG", 10, 3, 20, 20);

    // Company name in white
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("KARAPEWADI HOMESTAY", 105, 15, { align: "center" });

    // Divider line (Forest Green, under header)
    doc.setDrawColor(34, 139, 34); // Forest Green
    doc.setLineWidth(1);
    doc.line(0, 27, 210, 27); // X1, Y1, X2, Y2

    // Invoice title
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.text("BOOKING INVOICE", 105, 40, { align: "center" });
    const now = new Date();
    // Invoice details
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Invoice #: Karapewadi-admin-${booking._id.slice(-8).toUpperCase()}`,
      15,
      50
    );
    doc.text(
      `Date: ${now.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })}`,
      15,
      55
    );

    // Create tables with minimal padding
    const tableOptions = {
      startY: 65,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 1.5,
        lineHeight: 1.5,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: textColor,
      },
      alternateRowStyles: {
        fillColor: secondaryColor,
      },
      margin: { top: 10 },
    };

    // Guest Information Table
    autoTable(doc, {
      ...tableOptions,
      head: [["Guest Information", ""]],
      body: [
        ["Name", booking.name],
        ["Email", booking.email],
        ["Phone", booking.phone],
      ],
    });

    // Booking Details Table
    autoTable(doc, {
      ...tableOptions,
      startY: doc.lastAutoTable.finalY + 5,
      head: [["Booking Details", ""]],
      body: [
        ["Group Name", booking.groupName || "-"],
        ["Stay Date", new Date(booking.stayDate).toLocaleDateString()],
        ["Booking Date", new Date(booking.createdAt).toLocaleDateString()],
        [
          "Group Size",
          `${booking.groupSize} ${
            booking.groupSize > 1 ? "Trekkers" : "Trekker"
          }`,
        ],
        [
          "Stay Nights",
          `${booking.stayNight} ${booking.stayNight > 1 ? "nights" : "night"}`,
        ],
        ["Booking Status", booking.status],
      ],
    });

    // Payment Details Table
    const paymentBody = [
      ["Total Amount", `Rs. ${booking.amount}`],
      ["Payment Mode", booking.paymentMode],
      ["Payment Status", booking.paymentStatus],
    ];

    if (booking.paymentMode === "cash") {
      paymentBody.push(["Deposit Paid", booking.depositPaid ? "Yes" : "No"]);
      paymentBody.push(["Deposit Amount", `Rs. ${booking.depositAmount || 0}`]);
    }

    if (booking.refundRequested) {
      paymentBody.push(["Refund Requested", "Yes"]);
      paymentBody.push(["Refund Status", booking.refundStatus]);
      paymentBody.push(["Refund ID", booking.refundId || "-"]);
      paymentBody.push(["Refund Amount", `Rs. ${booking?.refundAmount || 0}`]);
    }
    paymentBody.push([
      {
        content: "Final Amount",
        styles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
      },
      {
        content: `Rs. ${finalAmount}`,
        styles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
      },
    ]);

    // ✅ Description row (normal, no background)
    paymentBody.push([
      { content: "Description", styles: { fontStyle: "italic" } },
      { content: finalAmountDescription, styles: { fontStyle: "italic" } },
    ]);

    autoTable(doc, {
      ...tableOptions,
      startY: doc.lastAutoTable.finalY + 5,
      head: [["Payment Details", ""]],
      body: paymentBody,
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Thank you for choosing Karpewadi HomeStay!",
      105,
      pageHeight - 20,
      { align: "center" }
    );
    doc.text(
      "For any queries, contact: +91 932180 3014",
      105,
      pageHeight - 15,
      { align: "center" }
    );
    doc.setFontSize(8);
    doc.text(
      "This is a computer-generated invoice. No signature is required.",
      105,
      pageHeight - 10,
      { align: "center" }
    );

    // Save the PDF
    doc.save(`karapewadi-invoice-${booking._id.slice(-8)}.pdf`);
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);
  // Maratha Kingdom-themed loading animation
  const LoadingAnimation = () => (
    <div className="flex justify-center py-12">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-16 h-16"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-1 h-10 rounded-full transform rotate-45"
            style={{ backgroundColor: colors.saffron }}
          ></div>
          <div
            className="w-1 h-10 rounded-full transform -rotate-45"
            style={{ backgroundColor: colors.saffron }}
          ></div>
        </div>
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4"
          style={{ borderColor: colors.saffron }}
          animate={{
            borderWidth: [4, 2, 4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>
    </div>
  );

  // Booking Card for Mobile View
  const BookingCard = ({ booking }) => (
    <Card className="mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg" style={{ color: colors.darkBrown }}>
            {booking.name}
          </h3>
          <p className="text-sm" style={{ color: colors.maroon }}>
            {booking.email}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            booking.status === "confirmed"
              ? "bg-green-100 text-green-800"
              : booking.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : booking.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-xs" style={{ color: colors.darkBrown }}>
            {t.groupName}
          </p>
          <p className="font-semibold text-sm">{booking.groupName || "—"}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: colors.darkBrown }}>
            {t.stayDate}
          </p>
          <p className="font-semibold text-sm">
            {new Date(booking.stayDate).toLocaleDateString(`${language}-IN`, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: colors.darkBrown }}>
            {t.mealType}
          </p>
          <p className="font-semibold text-sm">{booking.mealType || "—"}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: colors.darkBrown }}>
            {t.PaymentMethod}
          </p>
          <p className="font-semibold text-sm">{booking.paymentMode}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span
            className={
              booking.paymentStatus === "paid"
                ? "text-green-700"
                : "text-red-700"
            }
          >
            {booking.paymentStatus}
          </span>
        </div>
        <div className="flex gap-2">
          <ActionButton
            icon={<Eye size={16} style={{ color: colors.saffron }} />}
            onClick={() => openBookingView(booking)}
            tooltip="View Details"
          />

          {booking?.paymentMode === "cash" &&
            booking?.paymentStatus === "pending" &&
            booking?.status?.trim().toLowerCase() !== "cancelled" && (
              <ActionButton
                icon={
                  updatingId === booking._id ? (
                    <Loader2 className="animate-spin w-3 h-3 text-green-700" />
                  ) : (
                    <IndianRupee size={16} className="text-green-700" />
                  )
                }
                tooltip="Toggle Payment Status"
                onClick={() =>
                  handlePaymentStatusChange(booking._id, booking.paymentStatus)
                }
              />
            )}
          {(booking.status === "cancelled" ||
            booking.status === "completed") && (
            <ActionButton
              icon={<Trash2 size={18} className="text-red-700" />}
              tooltip="Delete Booking"
              onClick={() => handleDeleteBooking(booking._id)}
            />
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <motion.div
      className="min-h-screen p-4 md:p-6 mt-[58px] md:mt-0"
      style={{ backgroundColor: colors.cream }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <motion.h1
            className="text-2xl md:text-4xl font-bold mb-2"
            style={{ color: colors.maroon }}
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="inline-block transform rotate-12">⚔️</span>
            {t.allbooking}
            <span className="inline-block transform -rotate-12">🛡️</span>
          </motion.h1>
          <div
            className="w-24 md:w-32 h-1 mx-auto rounded-full"
            style={{
              background: `linear-gradient(to right, ${colors.saffron}, ${colors.maroon})`,
            }}
          ></div>
        </div>

        {/* 🔎 Advanced Filters */}
        <Card className="mb-6 md:mb-8">
          {/* Filter Toggle Button for Mobile */}
          {isMobile && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg mb-3 text-white"
              style={{ backgroundColor: colors.saffron }}
            >
              <span className="flex items-center gap-2">
                <Filter size={18} />
                Filters {showFilters ? "▲" : "▼"}
              </span>
              <span>{showFilters ? "Hide" : "Show"} Filters</span>
            </button>
          )}

          <div
            className={`${
              isMobile && !showFilters ? "hidden" : "grid"
            } grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4`}
          >
            {/* Search */}
            <div
              className="flex items-center border-2 rounded-xl bg-white px-3 shadow-inner"
              style={{ borderColor: colors.saffron }}
            >
              <Search style={{ color: colors.saffron }} size={18} />
              <input
                type="text"
                placeholder={`${
                  language === "mr" ? "बुकिंग शोधा... " : "Search"
                }`}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full p-2 outline-none bg-transparent text-sm md:text-base"
              />
            </div>

            {/* Group Filter */}
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="p-2 border-2 rounded-xl bg-white shadow-inner text-sm md:text-base"
              style={{ borderColor: colors.saffron }}
            >
              <option value="">{t.mealType}</option>
              <option value="veg">{t.veg}</option>
              <option value="nonveg">{t.nonveg}</option>
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border-2 rounded-xl bg-white shadow-inner text-sm md:text-base"
              style={{ borderColor: colors.saffron }}
            >
              <option value="">{t.allbooking}</option>
              <option value="confirmed">{t.confirmBooking}</option>
              <option value="cancelled">{t.cancelBooki}</option>
              <option value="completed">{t.completeBooking}</option>
            </select>

            {/* Payment Mode Filter */}
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="p-2 border-2 rounded-xl bg-white shadow-inner text-sm md:text-base"
              style={{ borderColor: colors.saffron }}
            >
              <option value="">{t.paymentMode}</option>
              <option value="cash">{t.cashPayment}</option>
              <option value="online">{t.onlinePayment}</option>
            </select>

            {/* Reset Filters */}
            <Button
              onClick={() => {
                setKeyword("");
                setGroupName("");
                setStatus("");
                setPaymentMode("");
              }}
              className="w-full text-sm md:text-base"
            >
              {t.removeFilter}
            </Button>
            <button
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="px-6 py-2 mt-1 rounded-lg md:px-3 text-sm"
              style={{
                backgroundColor: colors.green,
                color: "white",
                borderColor: colors.brownMedium,
                boxShadow: `0 0 5px ${colors.greenMedium}`,
              }}
              title={language === "en" ? "मराठी" : "English"}
            >
              <span>{language === "en" ? "मराठी" : "English"}</span>
            </button>
          </div>
        </Card>

        {/* Stats Card - Smaller on mobile */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="text-white rounded-xl md:rounded-2xl p-2 md:p-4 text-center shadow-lg"
            style={{ backgroundColor: colors.saffron }}
          >
            <div className="text-lg md:text-3xl font-bold">{totalBookings}</div>
            <div className="text-xs md:text-base text-white opacity-80">
              {t.totalBooking}
            </div>
          </div>
          <div
            className="text-white rounded-xl md:rounded-2xl p-2 md:p-4 text-center shadow-lg"
            style={{ backgroundColor: colors.green }}
          >
            <div className="text-lg md:text-3xl font-bold">
              {AllBookings?.filter((b) => b.status === "confirmed").length || 0}
            </div>
            <div className="text-xs md:text-base text-white opacity-80">
              {t.confirmBooking}
            </div>
          </div>
          <div
            className="text-white rounded-xl md:rounded-2xl p-2 md:p-4 text-center shadow-lg"
            style={{ backgroundColor: colors.gold }}
          >
            <div className="text-lg md:text-3xl font-bold">
              {AllBookings?.filter((b) => b.status === "completed").length || 0}
            </div>
            <div className="text-xs md:text-base text-white opacity-80">
              {t.completeBooking}
            </div>
          </div>
          <div
            className="text-white rounded-xl md:rounded-2xl p-2 md:p-4 text-center shadow-lg"
            style={{ backgroundColor: colors.maroon }}
          >
            <div className="text-lg md:text-3xl font-bold">
              {AllBookings?.filter((b) => b.status === "cancelled").length || 0}
            </div>
            <div className="text-xs md:text-base text-white opacity-80">
              {t.cancelBooki}
            </div>
          </div>
        </motion.div>

        {/* Loading Animation */}
        {loading && <LoadingAnimation />}

        {/* Error Message */}
        {error && (
          <motion.div
            className="border-2 text-red-700 p-3 md:p-4 rounded-xl text-center mb-4 md:mb-6 text-sm md:text-base"
            style={{ backgroundColor: "#FEE2E2", borderColor: "#EF4444" }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* 📋 Bookings Table (Desktop) / Cards (Mobile) */}
        <AnimatePresence>
          {!loading && AllBookings && AllBookings.length > 0 ? (
            <>
              {/* Desktop Table View */}
              {!isMobile && (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="text-white">
                        <tr style={{ backgroundColor: colors.saffron }}>
                          <th className="p-3">{t.name}</th>
                          {AllBookings.groupName === "" && (
                            <th className="p-3">{t.groupName} </th>
                          )}
                          <th className="p-3">{t.stayDate}</th>
                          <th className="p-3">{t.mealType}</th>
                          <th className="p-3">{t.status} </th>
                          <th className="p-3">{t.PaymentMethod}</th>
                          <th className="p-3 text-center">{t.Action} </th>
                        </tr>
                      </thead>
                      <tbody>
                        {AllBookings.map((b) => (
                          <motion.tr
                            key={b._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="border-b hover:bg-opacity-50 transition"
                            style={{
                              borderColor: colors.saffron,
                              backgroundColor: "white",
                            }}
                          >
                            <td
                              className="p-3 font-semibold"
                              style={{ color: colors.darkBrown }}
                            >
                              <div className="font-bold">{b.name}</div>
                              <div
                                className="text-sm"
                                style={{ color: colors.maroon }}
                              >
                                {b.email}
                              </div>
                            </td>
                            {AllBookings.groupName === "" && (
                              <td className="p-3">
                                <span
                                  className="px-2 py-1 rounded-full text-sm"
                                  style={{
                                    backgroundColor: `${colors.saffron}20`,
                                    color: colors.darkBrown,
                                  }}
                                >
                                  {b.groupName || "—"}
                                </span>
                              </td>
                            )}
                            <td className="p-3">
                              {new Date(b.stayDate).toLocaleDateString(
                                `${language}-IN`,
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                  b.mealType === "veg"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {b.mealType || "—"}
                              </span>
                            </td>

                            <td className="p-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  b.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : b.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : b.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="font-semibold">
                                {b.paymentMode}
                              </div>
                              <div
                                className={`text-sm ${
                                  b.paymentStatus === "paid"
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}
                              >
                                {b.paymentStatus}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex justify-center gap-2">
                                <ActionButton
                                  icon={
                                    <Eye
                                      size={18}
                                      style={{ color: colors.saffron }}
                                    />
                                  }
                                  onClick={() => openBookingView(b)}
                                  tooltip="View Details"
                                />

                                {b.paymentMode === "cash" &&
                                  b.paymentStatus === "pending" &&
                                  b.status !== "cancelled" && (
                                    <ActionButton
                                      icon={
                                        updatingId === b._id ? (
                                          <Loader2 className="animate-spin w-4 h-4 text-green-700" />
                                        ) : (
                                          <IndianRupee
                                            size={18}
                                            className="text-green-700"
                                          />
                                        )
                                      }
                                      tooltip="Toggle Payment Status"
                                      onClick={() =>
                                        handlePaymentStatusChange(
                                          b._id,
                                          b.paymentStatus
                                        )
                                      }
                                    />
                                  )}
                                {(b.status === "cancelled" ||
                                  b.status === "completed") && (
                                  <ActionButton
                                    icon={
                                      <Trash2
                                        size={18}
                                        className="text-red-700"
                                      />
                                    }
                                    tooltip="Delete Booking"
                                    onClick={() => handleDeleteBooking(b._id)}
                                  />
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* Mobile Card View */}
              {isMobile && (
                <div>
                  {AllBookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              )}
            </>
          ) : (
            !loading && (
              <motion.div
                className="text-center py-8 md:py-12 rounded-xl md:rounded-2xl border-2"
                style={{
                  backgroundColor: colors.cream,
                  borderColor: colors.saffron,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">🏰</div>
                <h3
                  className="text-xl md:text-2xl font-bold"
                  style={{ color: colors.darkBrown }}
                >
                  {language === "mr"
                    ? "कोणतेही बुकिंग सापडले नाही"
                    : "No Booking Found"}
                </h3>
                <p
                  className="mt-1 md:mt-2 text-sm md:text-base"
                  style={{ color: colors.maroon }}
                >
                  {language === "mr" ? "पुन्हा प्रयत्न करा" : "Try Again"}
                </p>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* ⬅➡ Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-center mt-4 md:mt-6 gap-3 md:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="font-bold text-sm md:text-base"
              style={{ color: colors.darkBrown }}
            >
              एकूण {totalBookings} बुकिंगपैकी {AllBookings?.length} दाखवत आहोत
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <Button
                onClick={handlePrev}
                disabled={page === 1}
                variant="secondary"
                className="text-sm md:text-base"
              >
                <ChevronLeft size={18} /> {language === "mr" ? "मागे" : "Back"}
              </Button>

              <div className="flex gap-1 md:gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() =>
                        dispatch(
                          getAllBookings(
                            p,
                            limit,
                            keyword,
                            groupName,
                            status,
                            paymentMode
                          )
                        )
                      }
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 text-xs md:text-base ${
                        page === p
                          ? "text-white"
                          : "text-orange-800 hover:bg-orange-100"
                      }`}
                      style={{
                        backgroundColor:
                          page === p ? colors.saffron : "transparent",
                        borderColor: colors.saffron,
                        color: page === p ? "white" : colors.darkBrown,
                      }}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <Button
                onClick={handleNext}
                disabled={page === totalPages}
                variant="secondary"
                className="text-sm md:text-base"
              >
                {language === "mr" ? "पुढे" : "Next"}
                <ChevronRight size={18} />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Booking View Modal */}
      <AnimatePresence>
        {viewBooking && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {isDownloading && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 flex flex-col items-center"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                >
                  <h3 className="text-lg font-bold mb-4">
                    Downloading Invoice
                  </h3>

                  {/* Circular Progress Bar */}
                  <div className="relative w-20 h-20 mb-4">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      {/* Background circle */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        className="fill-none stroke-gray-200"
                        strokeWidth="2"
                      />

                      {/* Progress circle */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        className="fill-none stroke-saffron"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={`${downloadProgress}, 100`}
                        transform="rotate(-90 18 18)"
                      />
                    </svg>

                    {/* Percentage text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {downloadProgress}%
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    Please wait while we prepare your invoice
                  </p>
                </motion.div>
              </motion.div>
            )}
            <motion.div
              className="bg-white rounded-xl md:rounded-2xl border-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{ borderColor: colors.saffron }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className="text-white p-3 md:p-4 rounded-t-xl md:rounded-t-2xl flex justify-between items-center"
                style={{ backgroundColor: colors.saffron }}
              >
                <div className="flex items-center gap-2">
                  <Shield size={20} />
                  <h2 className="text-lg md:text-xl font-bold">
                    {t.BookingDetails}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1 rounded-full hover:bg-opacity-20 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Guest Information */}
                  <div className="space-y-3 md:space-y-4">
                    <h3
                      className="text-base md:text-lg font-bold border-b-2 pb-1 md:pb-2 flex items-center gap-2"
                      style={{
                        color: colors.saffron,
                        borderColor: `${colors.saffron}30`,
                      }}
                    >
                      <User size={18} />
                      {t.guestInformation}
                    </h3>
                    <div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: colors.darkBrown }}
                      >
                        {t.fullName}
                      </p>
                      <p className="font-semibold text-sm md:text-base">
                        {viewBooking.name}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: colors.darkBrown }}
                      >
                        {t.Email}
                      </p>
                      <p className="font-semibold text-sm md:text-base">
                        {viewBooking.email}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: colors.darkBrown }}
                      >
                        {t.Phone}
                      </p>
                      <p className="font-semibold text-sm md:text-base">
                        {viewBooking.phone}
                      </p>
                    </div>
                  </div>

                  {/* Booking Information */}
                  <div className="space-y-3 md:space-y-4">
                    <h3
                      className="text-base md:text-lg font-bold border-b-2 pb-1 md:pb-2 flex items-center gap-2"
                      style={{
                        color: colors.saffron,
                        borderColor: `${colors.saffron}30`,
                      }}
                    >
                      <Calendar size={18} /> {t.BookingDetails}
                    </h3>
                    <div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: colors.darkBrown }}
                      >
                        {t.groupName}
                      </p>
                      <p className="font-semibold text-sm md:text-base">
                        {viewBooking.groupName || "-"}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: colors.darkBrown }}
                      >
                        {t.stayDate}
                      </p>
                      <p className="font-semibold text-sm md:text-base">
                        {new Date(viewBooking.stayDate).toLocaleDateString(
                          `${language}-IN`,
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: colors.darkBrown }}
                      >
                        {t.BookingDate}
                      </p>
                      <p className="font-semibold text-sm md:text-base">
                        {new Date(viewBooking.createdAt).toLocaleDateString(
                          `${language}-IN`,
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-3 md:space-y-4">
                    <h3
                      className="text-base md:text-lg font-bold border-b-2 pb-1 md:pb-2 flex items-center gap-2"
                      style={{
                        color: colors.saffron,
                        borderColor: `${colors.saffron}30`,
                      }}
                    >
                      <CreditCard size={18} /> {t.PaymentInfo}
                    </h3>
                    <div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: colors.darkBrown }}
                      >
                        {t.totalAmount}
                      </p>
                      <p className="font-semibold text-sm md:text-base">
                        ₹{viewBooking.amount}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: colors.darkBrown }}
                      >
                        {t.paymentMode}
                      </p>
                      <p className="font-semibold text-sm md:text-base capitalize">
                        {viewBooking.paymentMode}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: colors.darkBrown }}
                      >
                        {t.PaymentStautus}
                      </p>
                      <div className="mt-1 text-sm md:text-base">
                        {viewBooking.paymentStatus}
                      </div>
                    </div>

                    {viewBooking.paymentMode === "cash" && (
                      <div>
                        <p
                          className="text-xs md:text-sm"
                          style={{ color: colors.darkBrown }}
                        >
                          {t.DepositePaid}
                        </p>
                        <div className="mt-1 text-sm md:text-base">
                          {viewBooking.depositPaid ? "Yes" : "No"}
                        </div>
                      </div>
                    )}

                    {viewBooking.refundRequested && (
                      <div>
                        <p
                          className="text-xs md:text-sm"
                          style={{ color: colors.darkBrown }}
                        >
                          {t.RefundStatus}
                        </p>
                        <div className="mt-1 text-sm md:text-base">
                          {viewBooking.refundStatus}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-3 md:space-y-4">
                    <h3
                      className="text-base md:text-lg font-bold border-b-2 pb-1 md:pb-2 flex items-center gap-2"
                      style={{
                        color: colors.saffron,
                        borderColor: `${colors.saffron}30`,
                      }}
                    >
                      अधिक माहिती
                    </h3>
                    <div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: colors.darkBrown }}
                      >
                        {t.GroupSize}
                      </p>
                      <p className="font-semibold text-sm md:text-base">
                        {viewBooking.groupSize > 1
                          ? `${viewBooking.groupSize} ${
                              language === "mr" ? "ट्रेकर्स" : "Trekkers"
                            }`
                          : `${viewBooking.groupSize} ${
                              language === "mr" ? "ट्रेकर" : "Trekker"
                            }`}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: colors.darkBrown }}
                      >
                        {t.stayNight}
                      </p>
                      <p className="font-semibold text-sm md:text-base">
                        {viewBooking.stayNight}
                      </p>
                    </div>
                    {viewBooking.paymentMode === "cash" && (
                      <>
                        <div>
                          <p
                            className="text-xs md:text-sm"
                            style={{ color: colors.darkBrown }}
                          >
                            बाकी रक्कम
                          </p>
                          <p className="font-semibold text-sm md:text-base">
                            {viewBooking.remainingAmount ||
                              "No remaining amount"}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-xs md:text-sm"
                            style={{ color: colors.darkBrown }}
                          >
                            Deposite amount(अधि भरणा रक्कम)
                          </p>
                          <p className="font-semibold text-sm md:text-base">
                            {viewBooking.depositAmount || "No deposit amount"}
                          </p>
                        </div>
                      </>
                    )}

                    {viewBooking.refundRequested && (
                      <>
                        <div>
                          <p
                            className="text-xs md:text-sm"
                            style={{ color: colors.darkBrown }}
                          >
                            {t.RefundRequest}
                          </p>
                          <p className="font-semibold text-sm md:text-base">
                            {viewBooking.refundRequested
                              ? "yes"
                              : "No Refund Request"}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-xs md:text-sm"
                            style={{ color: colors.darkBrown }}
                          >
                            {t.Refundid}
                          </p>
                          <p className="font-semibold text-sm md:text-base">
                            {viewBooking.refundId || "-"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Booking Status */}
                <div
                  className="mt-4 md:mt-6 p-3 md:p-4 rounded-xl border"
                  style={{
                    backgroundColor: `${colors.saffron}10`,
                    borderColor: colors.saffron,
                  }}
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: colors.darkBrown }}
                      >
                        {t.status}
                      </p>
                      <div>
                        <StatusBadge status={viewBooking?.status} />
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => simulateDownload(viewBooking)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm md:text-base"
                        style={{ backgroundColor: colors.saffron }}
                        disabled={isDownloading}
                      >
                        <Download size={16} />
                        {isDownloading ? "Downloading..." : "Download Invoice"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className="p-3 md:p-4 rounded-b-xl md:rounded-b-2xl flex flex-col md:flex-row justify-end gap-2 md:gap-3"
                style={{ backgroundColor: `${colors.saffron}10` }}
              >
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="text-sm md:text-base"
                  style={{ borderColor: colors.saffron, color: colors.saffron }}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer position="top-right" theme="dark" />
    </motion.div>
  );
};

export default AllBookings;
