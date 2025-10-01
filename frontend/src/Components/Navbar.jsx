import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "../store/store";
import {
  clearAllErrors,
  logoutUser,
  resetMessage,
} from "../store/slices/userSlice";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, message, error } = useSelector(
    (state) => state.user || {}
  );

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const popoverRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsPopoverOpen(false);
      }

      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllErrors());
      setIsPopoverOpen(false);
      setMobileOpen(false);
    }
  }, [error, dispatch]);

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());

      persistor.purge();

      toast.success(message);
      setIsPopoverOpen(false);
      setMobileOpen(false);
      dispatch(resetMessage());
      dispatch(clearAllErrors());
      window.location.href = "/";
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("my error", error);
    }
  };

  const navLinks = (
    <>
      <Link
        to="/"
        onClick={() => setMobileOpen(false)}
        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-beige-300 transition-colors"
      >
        Home
      </Link>
      <Link
        to="/tours"
        onClick={() => setMobileOpen(false)}
        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-beige-300 transition-colors"
      >
        Tours
      </Link>
      <Link
        to="/about"
        onClick={() => setMobileOpen(false)}
        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-beige-300 transition-colors"
      >
        About Us
      </Link>
      <Link
        to="/contact-us"
        onClick={() => setMobileOpen(false)}
        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-beige-300 transition-colors"
      >
        Contact
      </Link>
    </>
  );

  return (
    <nav className="bg-gradient-to-r from-brown-700 to-green-800 text-beige-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Karpewadi HomeStay Logo"
                className={`h-16 w-auto object-contain md:h-20 text-red-500`}
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navLinks}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center" ref={popoverRef}>
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsPopoverOpen((s) => !s)}
                    className="flex items-center focus:outline-none"
                    aria-expanded={isPopoverOpen}
                    aria-haspopup="true"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full border-2 border-green-600"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-beige-100 font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="ml-2 text-sm font-medium text-beige-100">
                      {user?.name || "User "}
                    </span>
                    <svg
                      className={`ml-1 h-5 w-5 transition-transform ${
                        isPopoverOpen ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isPopoverOpen && (
                    <div className="origin-top-right absolute right-[-32px] mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-brown-900  focus:outline-none z-50 text-left">
                      <div className="py-1 text-sm text-brown-800">
                        <div className="px-4 py-2 border-b border-brown-300">
                          <p className="text-sm font-medium truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-brown-600 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsPopoverOpen(false)}
                          className="block px-4 py-2 hover:bg-beige-300 transition-colors"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/bookings"
                          onClick={() => setIsPopoverOpen(false)}
                          className="block px-4 py-2 hover:bg-beige-300 transition-colors"
                        >
                          My Bookings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-beige-300 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium rounded-md bg-beige-100 text-green-700 hover:bg-beige-200 transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <div ref={hamburgerRef}>
              <button
                onClick={() => setMobileOpen((s) => !s)}
                aria-label="Toggle menu"
                className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none md:hidden text-beige-100 hover:bg-green-700 transition-colors"
              >
                <svg
                  className={`h-6 w-6 transform transition-transform ${
                    mobileOpen ? "rotate-90" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {mobileOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        ref={mobileMenuRef}
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:hidden bg-gradient-to-r from-brown-700 to-green-800`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">{navLinks}</div>

        <div className="border-t border-brown-900/20 px-4 py-3">
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="text-beige-100">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-beige-300 truncate">{user?.email}</p>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-beige-300 transition-colors"
              >
                Dashboard
              </Link>

              <Link
                to="/bookings"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-beige-300 transition-colors"
              >
                My Bookings
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-beige-100 text-green-700 hover:bg-beige-200 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-green-600 hover:bg-green-700 transition-colors"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-beige-100 text-green-700 hover:bg-beige-200 transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </nav>
  );
};

export default Navbar;
