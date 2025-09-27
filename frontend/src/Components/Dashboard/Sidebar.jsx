import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, clearAllErrors } from "../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaCogs,
  FaClipboardList,
  FaBars,
  FaUsers,
  FaBed,
  FaShieldAlt,
  FaFortAwesome,
  FaHorse,
} from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { GoReport } from "react-icons/go";

const translations = {
  en: {
    dashboard: "Dashboard",
    home: "Home",
    myProfile: "My Profile",
    updateProfile: "Update Profile",
    updatePassword: "Update Password",
    myBookings: "My Bookings",
    myRefunds: "My Refunds",
    myReviews: "My Reviews",
    newReview: "New Review",
    accommodations: "Accommodations",
    bookings: "Bookings",
    users: "Users",
    reviews: "Reviews",
    reports: "Reports",
    logout: "Logout",
    marathaDashboard: "Karpewadi Homestay Dashboard",
    roleAdmin: "Admin",
    roleTrekker: "Trekker",
    roleUser: "User ",
    languageToggle: "मराठी",
    myTransactions: "my Transacations",
    refunds: "Refunds",
  },
  mr: {
    dashboard: "डॅशबोर्ड",
    home: "मुख्यपृष्ठ",
    myProfile: "माझे प्रोफाइल",
    updateProfile: "प्रोफाइल अपडेट करा",
    updatePassword: "पासवर्ड अपडेट करा",
    myBookings: "माझ्या बुकिंग्स",
    myRefunds: "माझे रिफंड",
    myReviews: "माझे पुनरावलोकन",
    newReview: "नवीन पुनरावलोकन",
    accommodations: "निवासस्थान",
    bookings: "बुकिंग्स",
    users: "वापरकर्ते",
    reviews: "पुनरावलोकने",
    reports: "अहवाल",
    logout: "बाहेर पडा",
    marathaDashboard: "करपेवाडी  होमस्टे डॅशबोर्ड",
    roleAdmin: "प्रशासक",
    roleTrekker: "ट्रेककर",
    roleUser: "वापरकर्ता",
    languageToggle: "English",
    myTransactions: "माझे व्यवहार",
    refunds: "परतावा",
  },
};

const Sidebar = ({
  setComponentName,
  activeComponent,
  isMobile,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { user } = useSelector((state) => state.user || {});
  const role = String(user?.role || "").toLowerCase();
  const userName = user?.name || "User ";
  const firstLetter = userName.charAt(0).toUpperCase();

  const [hoveredItem, setHoveredItem] = useState(null);
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sidebarWidth = isMobile ? 260 : 280;
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: -sidebarWidth },
  };
  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -10 },
  };

  // Icons mapping (unchanged)
  const getIcon = (component) => {
    switch (component) {
      case "Home":
        return <FaFortAwesome />;
      case "My Profile":
        return <FaShieldAlt />;
      case "Update Profile":
        return <FaCogs />;
      case "Update Password":
        return <FaShieldAlt />;
      case "My Bookings":
        return <FaClipboardList />;
      case "New Review":
        return <FaClipboardList />;
      case "Dashboard":
        return <FaFortAwesome />;
      case "Accommodations":
        return <FaBed />;
      case "Bookings":
        return <FaClipboardList />;
      case "Users":
        return <FaUsers />;
      case "Reviews":
        return <FaClipboardList />;
      case "Reports":
        return <GoReport />;
      default:
        return <FaShieldAlt />;
    }
  };

  // Menu items with keys for translation
  const menuItems = {
    common: [
      { key: "home", component: "Home" },
      { key: "myProfile", component: "My Profile" },
      { key: "updateProfile", component: "Update Profile" },
      { key: "updatePassword", component: "Update Password" },
    ],
    trekker: [
      { key: "myBookings", component: "My Bookings" },
      { key: "myRefunds", component: "My Refunds" },
      { key: "myReviews", component: "My Reviews" },
      { key: "newReview", component: "New Review" },
      {
        key: "myTransactions",
        component: "my Transactions",
      },
    ],
    admin: [
      { key: "dashboard", component: "Dashboard" },
      { key: "accommodations", component: "Accommodations" },
      { key: "bookings", component: "Bookings" },
      { key: "users", component: "Users" },
      { key: "reviews", component: "Reviews" },
      { key: "refunds", component: "Refunds" },
    ],
  };

  const handleItemClick = (component) => {
    setComponentName(component);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearAllErrors());
    navigate("/");
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "mr" : "en"));
  };

  const renderMenuItems = (items) =>
    items.map(({ key, component }) => (
      <motion.button
        key={component}
        onClick={() => handleItemClick(component)}
        onMouseEnter={() => setHoveredItem(component)}
        onMouseLeave={() => setHoveredItem(null)}
        className={`w-full flex items-center gap-3 p-2 md:p-4 rounded-lg transition-all text-left
          ${
            activeComponent === component
              ? "bg-oliveGreen text-beigeLight shadow-md"
              : "text-darkBrown hover:bg-hoverGreen hover:text-beigeLight"
          }`}
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        aria-pressed={activeComponent === component}
        type="button"
      >
        <span className="text-lg md:text-xl">{getIcon(component)}</span>
        <span className="font-medium text-sm md:text-base">
          {translations[language][key]}
        </span>
        <FiChevronRight className="ml-auto text-base md:text-lg" />
      </motion.button>
    ));

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-beigeLight shadow-md px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-darkBrown hover:bg-hoverGreen focus:outline-none focus:ring-2 focus:ring-inset focus:ring-oliveGreen"
            aria-label={language === "en" ? "Open menu" : "मेनू उघडा"}
            type="button"
          >
            <FaBars className="h-6 w-6" />
          </button>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-oliveGreen text-beigeLight font-semibold">
            {firstLetter}
          </div>
        </header>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: `${sidebarWidth}px`,
          height: "100vh",
          zIndex: 40,
          padding: isMobile ? "16px" : "20px",
          boxSizing: "border-box",
        }}
        className="relative bg-white shadow-2xl overflow-y-auto flex flex-col mt-16 md:mt-0"
      >
        {/* Top Gradient Border */}
        <div
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-oliveGreen via-softOlive to-oliveGreen"
          aria-hidden="true"
        />

        {/* Bottom Gradient Border */}
        <div
          className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-oliveGreen via-softOlive to-oliveGreen"
          aria-hidden="true"
        />

        {/* Background pattern removed for soft natural theme */}

        {/* Top Section */}
        <div className="flex-1 flex flex-col z-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-darkBrown">
                {translations[language].dashboard}
              </h2>
            </div>
            <button
              onClick={toggleLanguage}
              aria-label={
                language === "en" ? "Switch to Marathi" : "इंग्रजीमध्ये बदला"
              }
              type="button"
              className="text-sm font-semibold px-3 py-1 rounded-md bg-beigeLight text-darkBrown hover:bg-hoverGreen hover:text-beigeLight transition"
            >
              {translations[language].languageToggle}
            </button>
          </div>

          <nav
            className="space-y-2 md:space-y-3"
            aria-label="Sidebar navigation"
          >
            {renderMenuItems(menuItems.common)}
            {role === "trekker" && renderMenuItems(menuItems.trekker)}
            {role === "admin" && renderMenuItems(menuItems.admin)}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="mt-auto pt-2 z-10">
          <button
            className="w-full flex items-center justify-center gap-3 p-3 md:p-4 rounded-lg font-medium transition-all bg-oliveGreen text-beigeLight hover:bg-hoverGreen"
            onClick={handleLogout}
            type="button"
          >
            {translations[language].logout}
          </button>
        </div>
      </motion.aside>

      <style jsx>{`
        :root {
          --beige-light: #f5f5dc;
          --warm-brown: #d2b48c;
          --muted-green: #a3b18a;
          --olive-green: #6b8e23;
          --hover-green: #556b2f;
          --dark-brown: #4b3b2d;
          --soft-olive: #7a9a3e;
        }
        .bg-beigeLight {
          background-color: var(--beige-light);
        }
        .bg-warmBrown {
          background-color: var(--warm-brown);
        }
        .bg-mutedGreen {
          background-color: var(--muted-green);
        }
        .bg-oliveGreen {
          background-color: var(--olive-green);
        }
        .bg-hoverGreen {
          background-color: var(--hover-green);
        }
        .text-darkBrown {
          color: var(--dark-brown);
        }
        .text-beigeLight {
          color: var(--beige-light);
        }
        .from-warmBrown {
          --tw-gradient-from: var(--warm-brown);
        }
        .to-mutedGreen {
          --tw-gradient-to: var(--muted-green);
        }
        .from-oliveGreen {
          --tw-gradient-from: var(--olive-green);
        }
        .via-softOlive {
          --tw-gradient-via: var(--soft-olive);
        }
        .hover\\:bg-hovergreen:hover {
          background-color: var(--hover-green);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
