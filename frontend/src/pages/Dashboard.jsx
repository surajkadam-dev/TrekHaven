import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Sidebar from "../Components/Dashboard/Sidebar.jsx";
import UpdateProfile from "../Components/Dashboard/UpdateProfile.jsx";
import UpdatePassword from "../Components/Dashboard/UpdatePassword.jsx";
import MyBookings from "../Components/Dashboard/MyBookings.jsx";
import AllBookings from "../Components/Dashboard/AllBookings.jsx";
import MyProfile from "../Components/Dashboard/MyProfile.jsx";
import AllUsers from "../Components/Dashboard/AllUsers.jsx";
import TestimonialForm from "../Components/Dashboard/TestimonialForm.jsx";
import Accommodation from "../Components/Dashboard/Accommodation.jsx";
import AdminDashboard from "../Components/Dashboard/AdminDashboard.jsx";
import AllReview from "../Components/Dashboard/AllReview.jsx";
import MyRefunds from "../Components/Dashboard/MyRefunds.jsx";
import { Link, useNavigate } from "react-router-dom";
import MyReviews from "../Components/Dashboard/myReviews.jsx";
import AllRefundRequests from "../Components/Dashboard/AllRefundRequestes.jsx";
import TransactionsPage from "../Components/Dashboard/TransactionsPage.jsx";

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const { user, isAuthenticated } = useSelector((state) => state.user || {});
  const role = String(user?.role || "").toLowerCase();
  const [componentName, setComponentName] = useState(
    role === "trekker" ? "My Profile" : "Dashboard"
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getActiveComponent = () => {
    switch (componentName) {
      case "Home":
        return (window.location.href = "/");
      case "Update Profile":
        return <UpdateProfile isMobile={isMobile} />;
      case "Update Password":
        return <UpdatePassword isMobile={isMobile} />;
      case "My Bookings":
        return <MyBookings isMobile={isMobile} />;
      case "My Refunds":
        return <MyRefunds />;
      case "Dashboard":
        return <AdminDashboard />;
      case "Bookings":
        return <AllBookings />;
      case "Accommodations":
        return <Accommodation />;
      case "Users":
        return <AllUsers />;
      case "New Review":
        return <TestimonialForm />;
      case "My Reviews":
        return <MyReviews />;
      case "Reviews":
        return <AllReview />;
      case "Refunds":
        return <AllRefundRequests />;
      case "my Transactions":
        return <TransactionsPage />;

      default:
        return <MyProfile />;
    }
  };

  // theme
  const sidebarWidth = 280;
  const themeStyles = {
    background: "linear-gradient(135deg,#FFF8ED 0%, #FDF7EE 60%)",
    headerBg: "#8B0000", // maroon
    textColor: "#2d3748",
    accentColor: "#F97316", // saffron
    fontFamily: "'Poppins', 'Noto Sans Devanagari', sans-serif",
  };

  return (
    <div
      style={{ fontFamily: themeStyles.fontFamily }}
      className="min-h-screen flex flex-col md:flex-row"
    >
      <Sidebar
        setComponentName={setComponentName}
        activeComponent={componentName}
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* MAIN: apply margin-left on desktop equal to sidebar width */}
      <main
        style={{
          marginLeft: isMobile ? 0 : isSidebarOpen ? `${sidebarWidth}px` : 0,
          transition: "margin-left 0.25s ease",
          background: themeStyles.background,
          minHeight: "100vh",
          width: isMobile
            ? "100%"
            : `calc(100% - ${isSidebarOpen ? sidebarWidth : 0}px)`,
        }}
        className="flex-1"
      >
        {/* Desktop Header */}

        <div className={isMobile ? "p-0" : "p-6"}>
          <motion.div
            key={componentName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white"
            style={{
              minHeight: isMobile
                ? "calc(100vh - 80px)"
                : "calc(100vh - 160px)",
              width: "100%",
              borderRadius: isMobile ? "0" : "0.75rem",
              boxShadow: isMobile
                ? "none"
                : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {getActiveComponent()}
          </motion.div>

          {!isMobile && (
            <footer
              className="mt-6 text-center text-sm"
              style={{ color: themeStyles.textColor }}
            >
              <p>
                © {new Date().getFullYear()} करपेवाडी होमस्टे. सर्व हक्क राखीव.
              </p>
              <p className="mt-1">🚩 महाराष्ट्राचा गौरव, मराठीचा अभिमान 🚩</p>
            </footer>
          )}
        </div>

        {/* Mobile Footer */}
        {isMobile && (
          <footer
            className="text-center text-sm p-4 bg-white border-t"
            style={{ color: themeStyles.textColor }}
          >
            <p>
              © {new Date().getFullYear()} करपेवाडी होमस्टे. सर्व हक्क राखीव.
            </p>
            <p className="mt-1">🚩 महाराष्ट्राचा गौरव, मराठीचा अभिमान 🚩</p>
          </footer>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
