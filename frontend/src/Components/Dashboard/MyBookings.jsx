import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "/logo_green.png";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getMyBookings,
  clearAllBookingErrors,
  resetSlice,
  cancelBooking,
  deleteUserBooking,
} from "../../store/slices/bookSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaExclamationTriangle, FaTrash, FaTimes, FaEye } from "react-icons/fa";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  CreditCard,
  User,
  X,
  Calendar,
  Download,
} from "lucide-react";
import { GiRoyalLove } from "react-icons/gi";

// Updated color palette with #6B8E23 as primary
const colors = {
  oliveGreen: "#6B8E23",
  lightOlive: "#9AB973",
  darkOlive: "#556B2F",
  saffron: "#FF9933",
  maroon: "#8B0000",
  gold: "#D4AF37",
  cream: "#F8F4E6",
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  darkGray: "#333333",
};

// Language content
const languageContent = {
  en: {
    title: "My Bookings",
    subtitle: "List of all your bookings at Karapewadi Homestay",
    noBookings: "No bookings found",
    noBookingsDesc: "You haven't made any  bookings yet. ",
    newBooking: "Book New Trek",
    cancel: "Cancel",
    cancelBooking: "Cancel Booking",
    cancelReason: "Cancellation Reason",
    cancelReasonPlaceholder: "Please provide your reason for cancellation...",
    processing: "Processing...",
    delete: "Delete",
    deleteBooking: "Delete Booking",
    deleteConfirm:
      "Are you sure you want to permanently delete this booking? This action cannot be undone.",
    viewDetails: "View Details",
    guestInfo: "Guest Information",
    bookingDetails: "Booking Details",
    paymentInfo: "Payment Information",
    additionalInfo: "Additional Information",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    groupName: "Group Name",
    stayDate: "Stay Date",
    bookingDate: "Booking Date",
    groupSize: "Group Size",
    stayNights: "Stay Nights",
    bookingStatus: "Booking Status",
    totalAmount: "Total Amount",
    paymentMode: "Payment Mode",
    paymentStatus: "Payment Status",
    depositPaid: "Deposit Paid",
    remainingAmount: "Remaining Amount",
    refundRequested: "Refund Requested",
    refundStatus: "Refund Status",
    refundAmount: "Refund Amount",
    refundId: "Refund ID",
    downloadInvoice: "Download Invoice",
    close: "Close",
    showing: "Showing",
    of: "of",
    bookings: "bookings",
    prev: "Prev",
    next: "Next",
    trekker: "Trekker",
    date: "Date",
    people: "People",
    meal: "Meal",
    payment: "Payment",
    actions: "Actions",
    loading: "Loading your booking information...",
    error: "Error",
    retry: "Retry",
  },
  mr: {
    title: "माझ्या बुकिंग",
    subtitle: "करपेवाडी होमस्टेमधील तुमच्या सर्व बुकिंगची यादी",
    noBookings: "कोणतीही बुकिंग सापडली नाही",
    noBookingsDesc: "तुम्ही अद्याप कोणत्याही ट्रेकसाठी बुकिंग केलेली नाही.",
    newBooking: "नवीन बुकींग करा",
    cancel: "रद्द करा",
    cancelBooking: "बुकिंग रद्द करा",
    cancelReason: "रद्द करण्याचे कारण",
    cancelReasonPlaceholder: "तुमचे बुकिंग रद्द करण्याचे कारण सांगा...",
    processing: "प्रक्रिया करत आहे...",
    delete: "हटवा",
    deleteBooking: "बुकिंग हटवा",
    deleteConfirm:
      "ही बुकिंग कायमची हटवू इच्छिता? ही क्रिया परत करता येणार नाही.",
    viewDetails: "तपशील पहा",
    guestInfo: "अतिथी माहिती",
    bookingDetails: "बुकिंग तपशील",
    paymentInfo: "पेमेंट माहिती",
    additionalInfo: "अधिक माहिती",
    fullName: "पूर्ण नाव",
    email: "ईमेल",
    phone: "फोन",
    groupName: "गटाचे नाव",
    stayDate: "राहण्याची तारीख",
    bookingDate: "बुकिंग तारीख",
    groupSize: "गटाचा आकार",
    stayNights: "राहण्याच्या रात्री",
    bookingStatus: "बुकिंग स्थिती",
    totalAmount: "एकूण रक्कम",
    paymentMode: "पेमेंट प्रकार",
    paymentStatus: "पेमेंट स्थिती",
    depositPaid: "डेपॉझिट भरले",
    remainingAmount: "बाकी रक्कम",
    refundRequested: "रिफंड विनंती",
    refundStatus: "रिफंड स्थिती",
    refundAmount: "रिफंड रक्कम",
    refundId: "रिफंड आयडी",
    downloadInvoice: "इनव्हॉइस डाउनलोड करा",
    close: "बंद करा",
    showing: "दाखवत आहे",
    of: "पैकी",
    bookings: "बुकिंग",
    prev: "मागे",
    next: "पुढे",
    trekker: "ट्रेकर",
    date: "तारीख",
    people: "लोक",
    meal: "जेवण",
    payment: "पेमेंट",
    actions: "क्रिया",
    loading: "तुमची बुकिंग माहिती लोड करत आहे...",
    error: "त्रुटी",
    retry: "पुन्हा प्रयत्न करा",
  },
};

// Custom Card with updated theme
const Card = ({ children, className }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`shadow-xl border rounded-2xl p-4 relative overflow-hidden ${className}`}
      style={{
        borderColor: colors.oliveGreen,
        backgroundColor: colors.white,
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: colors.oliveGreen }}
      ></div>
      {children}
    </motion.div>
  );
};

// Action Button
const ActionButton = ({ icon, onClick, className, tooltip }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    title={tooltip}
    className={`p-2 rounded-lg border ${className}`}
    style={{ borderColor: colors.oliveGreen }}
  >
    {icon}
  </motion.button>
);

function MyBookings({ isMobile }) {
  const {
    loading,
    error,
    myBooking: MyBookings,
    message,
  } = useSelector((store) => store.booking);
  const dispatch = useDispatch();

  // Language state
  const [language, setLanguage] = useState("en");
  const lang = languageContent[language];

  // Track per-booking action state
  const [actionLoading, setActionLoading] = useState({});
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const progressInterval = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMyBookings());

    return () => {
      dispatch(clearAllBookingErrors());
      dispatch(resetSlice());
    };
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetSlice());
    }
  }, [message]);

  useEffect(() => {
    let isMounted = true;

    if (error && isMounted) {
      toast.error(error);
    }

    return () => {
      isMounted = false;
    };
  }, [error]);

  // Toggle language
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "mr" : "en"));
  };

  // Normalize booking fields
  const normalizeBooking = (b) => ({
    id: b._id || b.id || b.bookingId,
    name: b.name,
    email: b.email,
    phone: b.phone,
    date: b.stayDate,
    paymentMode: b.paymentMode,
    paymentStatus: b.paymentStatus,
    totalPrice: b.amount,
    status: b.status,
    groupName: b.groupName,
    groupSize: b.groupSize,
    needStay: b.needStay,
    stayNight: b.stayNight,
    mealType: b.mealType,
    transactionId: b.transactionId,
    createdAt: b.createdAt,
    depositAmount: b.depositAmount,
    remainingAmount: b.remainingAmount,
    depositPaid: b.depositPaid,
    refundRequested: b.refundRequested,
    refundStatus: b.refundStatus,
    refundAmount: b.refundAmount,
    refundId: b.refundId,
  });

  // Use normalized list in rendering
  const bookingsToRender = (MyBookings || [])
    .filter((booking) => !booking.deletedBy?.user)
    .map(normalizeBooking);

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
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const totalAmount = booking.totalPrice || 0;
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
      `Invoice #: Karapewadi-user-${booking.id.slice(-8).toUpperCase()}`,
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
        ["Stay Date", new Date(booking.date).toLocaleDateString()],
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
      ["Total Amount", `Rs. ${booking.totalAmount}`],
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
    doc.save(`karapewadi-invoice-${timestamp}.pdf`);
  };

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString(language === "en" ? "en-US" : "mr-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handler for opening cancel form
  const openCancelForm = (bookingId) => {
    setCancellingBooking(bookingId);
    setShowCancelForm(true);
  };

  // Handler for closing cancel form
  const closeCancelForm = () => {
    setShowCancelForm(false);
    setCancellingBooking(null);
    setCancelReason("");
  };

  // Handler for cancel with reason
  const handleCancelWithReason = async () => {
    if (!cancelReason.trim()) {
      toast.error(
        language === "en"
          ? "Please provide a cancellation reason"
          : "कृपया रद्द करण्याचे कारण प्रदान करा"
      );
      return;
    }

    try {
      setActionLoading((p) => ({ ...p, [cancellingBooking]: "cancel" }));
      await dispatch(
        cancelBooking({
          id: cancellingBooking,
          reason: cancelReason,
        })
      );
      await dispatch(getMyBookings());
      closeCancelForm();
    } catch (err) {
      toast.error(
        err?.message ||
          (language === "en"
            ? "Error cancelling booking"
            : "रद्द करताना त्रुटी आली")
      );
    } finally {
      setActionLoading((p) => {
        const copy = { ...p };
        delete copy[cancellingBooking];
        return copy;
      });
    }
  };

  // Handler for delete
  const handleDelete = async (bookingId) => {
    const confirmed = window.confirm(lang.deleteConfirm);
    if (!confirmed) return;

    try {
      setActionLoading((p) => ({ ...p, [bookingId]: "delete" }));
      await dispatch(deleteUserBooking(bookingId));
      await dispatch(getMyBookings());
      toast.success(
        language === "en"
          ? "Booking deleted successfully"
          : "बुकिंग यशस्वीरित्या हटवली गेली"
      );
    } catch (err) {
      toast.error(
        err?.message ||
          (language === "en" ? "Error deleting booking" : "हटवताना त्रुटी आली")
      );
    } finally {
      setActionLoading((p) => {
        const copy = { ...p };
        delete copy[bookingId];
        return copy;
      });
    }
  };

  const openBookingView = (booking) => {
    setViewBooking(booking);
  };

  const closeModal = () => {
    setViewBooking(null);
  };

  // Pagination handlers
  const totalPages = Math.ceil(bookingsToRender.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedBookings = bookingsToRender.slice(
    startIndex,
    startIndex + limit
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const StatusBadge = ({ status }) => {
    // Define colors for each status
    const statusColors = {
      cancelled: "bg-red-500 text-white",
      confirmed: "bg-blue-500 text-white",
      completed: "bg-green-500 text-white",
      pending: "bg-yellow-500 text-white",
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

  const downloadInvoice = (booking) => {
    const totalAmount = booking.totalPrice || 0;
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
      finalAmount = totalAmount - refundAmount;
      finalAmountDescription = `Cancellation Fee: Rs. ${finalAmount} (Refund Issued: Rs. ${refundAmount})`;
    } else if (isCashPayment && hasDepositPaid && refundRequested) {
      finalAmount = Math.min(booking?.depositAmount || 0, refundAmount);
      finalAmountDescription = `Cancellation Fee: Rs. ${
        booking.depositAmount - finalAmount
      } (Refund Issued: Rs. ${finalAmount})`;
    }

    const doc = new jsPDF();
    const oliveGreen = [107, 142, 35];
    const darkGray = [51, 51, 51];

    // Header
    doc.setFillColor(...oliveGreen);
    doc.rect(0, 0, 210, 18, "F");

    // Title text
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.text("Karpewadi HomeStay", 105, 12, { align: "center" });

    // Booking Invoice
    doc.setFontSize(11);
    doc.setTextColor(...darkGray);
    doc.text("BOOKING INVOICE", 105, 26, { align: "center" });

    // Invoice details
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice : trekker_${booking.id.slice(-8).toUpperCase()}`, 15, 30);
    doc.text(
      `Invoice Date: ${new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      15,
      36
    );

    // Line separator
    doc.setDrawColor(...oliveGreen);
    doc.line(15, 46, 195, 46);

    // Common compact table style
    const compactTable = {
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 0.5,
        lineHeight: 0.9,
        minCellHeight: 8,
      },
      headStyles: {
        fillColor: oliveGreen,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
        cellPadding: 0.5,
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 0.5,
        lineHeight: 0.9,
        minCellHeight: 8,
        textColor: [0, 0, 0],
      },
      margin: { left: 15, right: 15 },
    };

    // Guest Information
    autoTable(doc, {
      startY: 40,
      head: [[{ content: "Guest Information", colSpan: 2 }]],
      body: [
        ["Name", booking.name],
        ["Email", booking.email],
        ["Phone", booking.phone],
      ],
      ...compactTable,
    });

    // Booking Details
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [[{ content: "Booking Details", colSpan: 2 }]],
      body: [
        ["Group Name", booking.groupName || "-"],
        [
          "Stay Date",
          new Date(booking.stayDate).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        ],
        [
          "Booking Date",
          new Date(booking.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        ],
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
      ...compactTable,
    });

    // Payment Details
    const paymentBody = [
      ["Total Amount", booking.totalPrice],
      ["Payment Mode", booking.paymentMode],
      ["Payment Status", booking.paymentStatus],
    ];

    if (booking.paymentMode === "cash") {
      paymentBody.push(["Deposit Paid", booking.depositPaid ? "Yes" : "No"]);
      paymentBody.push(["Deposit Amount", booking.depositAmount]);
      paymentBody.push(["Remaining Amount", booking.remainingAmount]);
    }

    if (booking.refundRequested) {
      paymentBody.push(["Refund Requested", "Yes"]);
      paymentBody.push(["Refund Status", booking.refundStatus]);
      paymentBody.push(["Refund ID", booking.refundId || "-"]);
      paymentBody.push(["Refund Amount", booking.refundAmount]);
    }

    paymentBody.push([
      { content: "Final Amount", styles: { fontStyle: "bold" } },
      {
        content: `${
          finalAmountDescription ? `\n${finalAmountDescription}` : ""
        }`,
        styles: { fontStyle: "bold" },
      },
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [[{ content: "Payment Details", colSpan: 2 }]],
      body: paymentBody,
      ...compactTable,
    });

    // Terms & Conditions
    const pageHeight = doc.internal.pageSize.height;
    let termsY = doc.lastAutoTable.finalY + 10;

    if (termsY > pageHeight - 40) {
      doc.addPage();
      termsY = 20;
    }

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, "bold");
    doc.text("Terms & Conditions:", 15, termsY);

    doc.setFont(undefined, "normal");
    doc.text(
      "- Cancellation before 24 hours: 25% charges applied",
      15,
      termsY + 5
    );
    doc.text(
      "- Refund will be processed within 3-5 business days",
      15,
      termsY + 10
    );
    doc.text("- This is a computer-generated invoice", 15, termsY + 15);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(...oliveGreen);
    doc.text(
      "Thank you for choosing Karpewadi HomeStay!",
      105,
      pageHeight - 10,
      {
        align: "center",
      }
    );

    doc.save(`karpewadi-HomeStay-${booking.id.slice(-8)}.pdf`);
  };

  // Booking Card for Mobile View
  const BookingCard = ({ booking }) => (
    <Card className="mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{booking.name}</h3>
          <p className="text-sm text-gray-600">{formatDate(booking.date)}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-xs text-gray-500">{lang.groupName}</p>
          <p className="font-semibold text-sm">{booking.groupName || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{lang.people}</p>
          <p className="font-semibold text-sm">{booking.groupSize}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{lang.meal}</p>
          <p className="font-semibold text-sm">{booking.mealType || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{lang.payment}</p>
          <p className="font-semibold text-sm capitalize">
            {booking.paymentMode}
          </p>
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
            icon={<FaEye size={16} className="text-oliveGreen" />}
            onClick={() => openBookingView(booking)}
            tooltip={lang.viewDetails}
          />

          {booking.status !== "cancelled" && booking.status !== "completed" && (
            <ActionButton
              icon={
                actionLoading[booking.id] === "cancel" ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <FaExclamationTriangle className="text-maroon" />
                )
              }
              tooltip={lang.cancelBooking}
              onClick={() => openCancelForm(booking.id)}
            />
          )}

          {(booking.status === "cancelled" ||
            booking.status === "completed") && (
            <ActionButton
              icon={
                actionLoading[booking.id] === "delete" ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <FaTrash className="text-maroon" />
                )
              }
              tooltip={lang.deleteBooking}
              onClick={() => handleDelete(booking.id)}
            />
          )}
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oliveGreen mb-4"></div>
          <p className="text-lg text-gray-700">{lang.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4 text-maroon">⚠️</div>
          <h2 className="text-xl font-bold mb-2 text-maroon">{lang.error}</h2>
          <p className="mb-4 text-gray-700">{error}</p>
          <button
            onClick={() => dispatch(getMyBookings())}
            className="px-4 py-2 rounded-lg font-medium bg-oliveGreen text-white"
          >
            {lang.retry}
          </button>
        </div>
      </div>
    );
  }

  if (bookingsToRender.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4 text-oliveGreen">🏕️</div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">
            {lang.noBookings}
          </h2>
          <p className="mb-4 text-gray-600">{lang.noBookingsDesc}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg font-medium mt-4 bg-oliveGreen text-white"
          >
            {lang.newBooking}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header with language toggle */}
      <div className="bg-oliveGreen text-white py-6 md:py-8 relative">
        <button
          onClick={toggleLanguage}
          className="absolute top-4 right-4 bg-white  text-black px-3 py-1 rounded-lg font-medium"
        >
          {language === "en" ? "मराठी" : "English"}
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center ">
            <GiRoyalLove className="w-7 h-7 md:w-8 md:h-8 text-oliveGreen" />
          </div>
        </div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-center">
          {lang.title}
        </h1>
        <p className="opacity-90 text-sm md:text-base text-center">
          {lang.subtitle}
        </p>
      </div>

      <div className="px-2 md:px-4 py-4 md:py-8">
        {/* Cancel Reason Form Modal */}
        {showCancelForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-4 md:p-6 border border-oliveGreen">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {lang.cancelBooking}
                </h3>
                <button
                  onClick={closeCancelForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  {lang.cancelReason}
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oliveGreen"
                  placeholder={lang.cancelReasonPlaceholder}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeCancelForm}
                  className="px-4 py-2 rounded-lg font-medium border border-oliveGreen text-oliveGreen"
                >
                  {lang.cancel}
                </button>
                <button
                  onClick={handleCancelWithReason}
                  disabled={actionLoading[cancellingBooking]}
                  className="px-4 py-2 rounded-lg font-medium text-white bg-oliveGreen flex items-center disabled:opacity-70"
                >
                  {actionLoading[cancellingBooking] ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      {lang.processing}
                    </>
                  ) : (
                    lang.cancelBooking
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

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
              <motion.div
                className="bg-white rounded-xl md:rounded-2xl border-2 border-oliveGreen max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
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
                {/* Modal Header */}
                <div className="bg-oliveGreen text-white p-3 md:p-4 rounded-t-xl md:rounded-t-2xl flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield size={20} />
                    <h2 className="text-lg md:text-xl font-bold">
                      {lang.bookingDetails}
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
                      <h3 className="text-base md:text-lg font-bold border-b-2 pb-1 md:pb-2 flex items-center gap-2 text-oliveGreen border-oliveGreen/30">
                        <User size={18} /> {lang.guestInfo}
                      </h3>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {lang.fullName}
                        </p>
                        <p className="font-semibold text-sm md:text-base">
                          {viewBooking.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {lang.email}
                        </p>
                        <p className="font-semibold text-sm md:text-base">
                          {viewBooking.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {lang.phone}
                        </p>
                        <p className="font-semibold text-sm md:text-base">
                          {viewBooking.phone}
                        </p>
                      </div>
                    </div>

                    {/* Booking Information */}
                    <div className="space-y-3 md:space-y-4">
                      <h3 className="text-base md:text-lg font-bold border-b-2 pb-1 md:pb-2 flex items-center gap-2 text-oliveGreen border-oliveGreen/30">
                        <Calendar size={18} /> {lang.bookingDetails}
                      </h3>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {lang.groupName}
                        </p>
                        <p className="font-semibold text-sm md:text-base">
                          {viewBooking.groupName || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {lang.stayDate}
                        </p>
                        <p className="font-semibold text-sm md:text-base">
                          {new Date(viewBooking.stayDate).toLocaleDateString(
                            language === "en" ? "en-US" : "mr-IN",
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
                        <p className="text-xs md:text-sm text-gray-600">
                          {lang.bookingDate}
                        </p>
                        <p className="font-semibold text-sm md:text-base">
                          {new Date(viewBooking.createdAt).toLocaleDateString(
                            language === "en" ? "en-US" : "mr-IN",
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
                      <h3 className="text-base md:text-lg font-bold border-b-2 pb-1 md:pb-2 flex items-center gap-2 text-oliveGreen border-oliveGreen/30">
                        <CreditCard size={18} /> {lang.paymentInfo}
                      </h3>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {lang.totalAmount}
                        </p>
                        <p className="font-semibold text-sm md:text-base">
                          ₹{viewBooking?.totalPrice}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {lang.paymentMode}
                        </p>
                        <p className="font-semibold text-sm md:text-base capitalize">
                          {viewBooking.paymentMode}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {lang.paymentStatus}
                        </p>
                        <div className="mt-1 text-sm md:text-base">
                          {viewBooking.paymentStatus}
                        </div>
                      </div>

                      {viewBooking.paymentMode === "cash" && (
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">
                            {lang.depositPaid}
                          </p>
                          <div className="mt-1 text-sm md:text-base">
                            {viewBooking.depositPaid ? "Yes" : "No"}
                          </div>
                        </div>
                      )}

                      {viewBooking.refundRequested && (
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">
                            {lang.refundStatus}
                          </p>
                          <div className="mt-1 text-sm md:text-base">
                            {viewBooking.refundStatus}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-3 md:space-y-4">
                      <h3 className="text-base md:text-lg font-bold border-b-2 pb-1 md:pb-2 text-oliveGreen border-oliveGreen/30">
                        {lang.additionalInfo}
                      </h3>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {lang.groupSize}
                        </p>
                        <p className="font-semibold text-sm md:text-base">
                          {viewBooking.groupSize > 1
                            ? `${viewBooking.groupSize} ${
                                language === "en" ? "Trekkers" : "ट्रेकर्स"
                              }`
                            : `${viewBooking.groupSize} ${
                                language === "en" ? "Trekker" : "ट्रेकर"
                              }`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {lang.stayNights}
                        </p>
                        <p className="font-semibold text-sm md:text-base">
                          {viewBooking.stayNight}
                        </p>
                      </div>
                      {viewBooking.paymentMode === "cash" && (
                        <>
                          <div>
                            <p className="text-xs md:text-sm text-gray-600">
                              {lang.remainingAmount}
                            </p>
                            <p className="font-semibold text-sm md:text-base">
                              {viewBooking.remainingAmount ||
                                (language === "en"
                                  ? "No remaining amount"
                                  : "बाकी रक्कम नाही")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs md:text-sm text-gray-600">
                              {lang.depositAmount}
                            </p>
                            <p className="font-semibold text-sm md:text-base">
                              {viewBooking.depositAmount ||
                                (language === "en"
                                  ? "No deposit amount"
                                  : "डेपॉझिट रक्कम नाही")}
                            </p>
                          </div>
                        </>
                      )}

                      {viewBooking.refundRequested && (
                        <>
                          <div>
                            <p className="text-xs md:text-sm text-gray-600">
                              {lang.refundRequested}
                            </p>
                            <p className="font-semibold text-sm md:text-base">
                              {viewBooking.refundRequested
                                ? language === "en"
                                  ? "Yes"
                                  : "होय"
                                : language === "en"
                                ? "No"
                                : "नाही"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs md:text-sm text-gray-600">
                              {lang.refundAmount}
                            </p>
                            <p className="font-semibold text-sm md:text-base">
                              {viewBooking.refundAmount || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs md:text-sm text-gray-600">
                              {lang.refundId}
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
                  <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-xl border border-oliveGreen bg-oliveGreen/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {lang.bookingStatus}
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
                          {isDownloading
                            ? "Downloading..."
                            : "Download Invoice"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-3 md:p-4 rounded-b-xl md:rounded-b-2xl flex flex-col md:flex-row justify-end gap-2 md:gap-3 bg-oliveGreen/10">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg text-sm md:text-base border border-oliveGreen text-oliveGreen"
                  >
                    {lang.close}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Table View */}
        {!isMobile && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="text-white">
                  <tr className="bg-oliveGreen">
                    <th className="p-3 text-center">{lang.trekker}</th>
                    <th className="p-3 text-center">{lang.groupName}</th>
                    <th className="p-3 text-center">{lang.date}</th>
                    <th className="p-3 text-center">{lang.people}</th>
                    <th className="p-3 text-center">{lang.meal}</th>
                    <th className="p-3 text-center">{lang.payment}</th>
                    <th className="p-3 text-center">{lang.bookingStatus}</th>
                    <th className="p-3 text-center">{lang.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((booking) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-semibold text-center text-gray-800">
                        <div className="font-bold">{booking.name || "-"}</div>
                        <div className="text-sm text-center text-gray-600">
                          {booking.email || "—"}
                        </div>
                      </td>
                      <td className="p-3 text-center text-gray-800">
                        {booking.groupName || "—"}
                      </td>
                      <td className="p-3 text-center text-gray-800">
                        {formatDate(booking.date)}
                      </td>
                      <td className="p-3 text-center text-gray-800">
                        {booking.groupSize}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-sm text-center ${
                            booking.mealType === "veg"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.mealType || "—"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="font-semibold text-gray-800 capitalize">
                          {booking.paymentMode}
                        </div>
                        <div
                          className={`text-sm text-center ${
                            booking.paymentStatus === "paid"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {booking.paymentStatus}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <ActionButton
                            icon={
                              <FaEye size={18} className="text-oliveGreen" />
                            }
                            onClick={() => openBookingView(booking)}
                            tooltip={lang.viewDetails}
                          />

                          {booking.status !== "cancelled" &&
                            booking.status !== "completed" && (
                              <ActionButton
                                icon={
                                  actionLoading[booking.id] === "cancel" ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                  ) : (
                                    <FaExclamationTriangle className="text-maroon" />
                                  )
                                }
                                tooltip={lang.cancelBooking}
                                onClick={() => openCancelForm(booking.id)}
                              />
                            )}

                          {(booking.status === "cancelled" ||
                            booking.status === "completed") && (
                            <ActionButton
                              icon={
                                actionLoading[booking.id] === "delete" ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                  <FaTrash className="text-maroon" />
                                )
                              }
                              tooltip={lang.deleteBooking}
                              onClick={() => handleDelete(booking.id)}
                            />
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination for Desktop */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 md:mt-6 gap-3 md:gap-4 pt-4 border-t border-gray-200">
                <div className="font-bold text-sm md:text-base text-gray-700">
                  {lang.showing} {paginatedBookings.length} {lang.of}{" "}
                  {bookingsToRender.length} {lang.bookings}
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg disabled:opacity-50 flex items-center bg-oliveGreen text-white"
                  >
                    <ChevronLeft size={18} /> {lang.prev}
                  </button>

                  <div className="flex gap-1 md:gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 text-xs md:text-base ${
                            currentPage === p
                              ? "bg-oliveGreen text-white"
                              : "border-oliveGreen text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg disabled:opacity-50 flex items-center bg-oliveGreen text-white"
                  >
                    {lang.next} <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Mobile Card View */}
        {isMobile && (
          <div>
            {paginatedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}

            {/* Pagination for Mobile */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
                <div className="font-bold text-sm text-gray-700">
                  {lang.showing} {paginatedBookings.length} {lang.of}{" "}
                  {bookingsToRender.length}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg disabled:opacity-50 flex items-center bg-oliveGreen text-white"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-full border-2 text-xs ${
                            currentPage === pageNum
                              ? "bg-oliveGreen text-white"
                              : "border-oliveGreen text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 3 && (
                      <span className="px-2 text-gray-700">...</span>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg disabled:opacity-50 flex items-center bg-oliveGreen text-white"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}

export default MyBookings;
