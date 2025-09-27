// src/App.jsx
import React from "react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import StaticTrekDetails from "./Components/StaticTrekDetails";
import BookingPage from "./pages/BookingPage";
import CheckoutPage from "./Components/CheckoutPage";
import ScrollToTop from "./Components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./pages/Dashboard";
import ContactUs from "./pages/ContactUs"; // Importing ContactUs component
import TermsAndConditions from "./pages/TermsAndConditions";
import CancellationRefund from "./pages/CancellationRefund";
// Importing CancellationRefund component
import ShippingPolicy from "./pages/shippingPolicy";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import PanhalaHomestay from "./pages/PanhalaHomestay";
import UserDetails from "./Components/Dashboard/UserDetails";
import Footer from "./pages/Footer";
import BookingDetails from "./Components/Dashboard/BookingDetails";
import UpdateMobile from "./Components/UpdateMobile";

/**
 * Wrapper so we can use useLocation() (hooks must be inside component)
 */
const AppRoutes = ({ onMount }) => {
  const location = useLocation();

  // hide navbar on dashboard and its subroutes
  const hideNavbar = location.pathname.startsWith("/dashboard");
  const hideFooter = location.pathname.startsWith("/dashboard");
  const hideContainer = location.pathname.startsWith("/login");
  useEffect(() => {
    // Call the onMount callback once when component mounts
    onMount && onMount();
  }, [onMount]);

  return (
    <>
      {/* Conditionally render Navbar */}
      {!hideNavbar && <Navbar />}

      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PanhalaHomestay />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book/details" element={<StaticTrekDetails />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/checkout/:accommodationId" element={<CheckoutPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/cancellation-refund" element={<CancellationRefund />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin/users/:id" element={<UserDetails />} />
        <Route path="/admin/users/booking/:id" element={<BookingDetails />} />
        <Route path="/update-mobile" element={<UpdateMobile />} />
        <Route path="*" element={<NotFound />} />

        {/* Contact Us route */}
        {/* Dashboard route (no navbar) */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      {!hideContainer && <ToastContainer position="top-right" theme="dark" />}
      {!hideFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
