import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  loginWithGoogle,
  clearAllErrors,
  clearErrors,
  resetMessage,
} from "../store/slices/userSlice";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaUserShield,
  FaTimes,
  FaHome,
  FaExclamationTriangle,
} from "react-icons/fa";
import { GiTempleGate } from "react-icons/gi";
import { Loader2 } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

// Custom Error Component
const ErrorDisplay = ({ error, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [error, duration, onClose]);

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-lg flex items-start">
        <FaExclamationTriangle className="text-red-500 text-xl mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-700 ml-4"
          aria-label="Close error"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

const LANGUAGES = {
  EN: {
    trekker: "Trekker",
    admin: "Admin",
    email: "Email",
    password: "Password",
    login: "Login",
    or: "OR",
    googleSignIn: "Sign in with Google",
    register: "Register",
    forgotPassword: "Forgot Password?",
    selectRole: "Select Role",
    language: "Language",
  },
  MR: {
    trekker: "ट्रेकर",
    admin: "प्रशासक",
    email: "ईमेल",
    password: "पासवर्ड",
    login: "लॉगिन",
    or: "किंवा",
    googleSignIn: "गूगलने साइन इन करा",
    register: "नोंदणी करा",
    forgotPassword: "पासवर्ड विसरलात?",
    selectRole: "भूमिका निवडा",
    language: "भाषा",
  },
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, message } = useSelector(
    (state) => state.user
  );

  const [role, setRole] = useState("trekker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("EN");
  const [displayedError, setDisplayedError] = useState("");
  const errorTimeoutRef = useRef(null);

  const t = LANGUAGES[language];

  useEffect(() => {
    if (error && error !== displayedError) {
      setDisplayedError(error);

      // Clear previous timeout if exists
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      // Set timeout to clear error after 5 seconds
      errorTimeoutRef.current = setTimeout(() => {
        setDisplayedError("");
        dispatch(clearErrors());
      }, 5000);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error, displayedError, dispatch]);
  useEffect(() => {
    dispatch(clearErrors());
    toast.dismiss(); // removes any lingering toast
  }, [dispatch, error]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(resetMessage());
      dispatch(clearErrors());
      navigate("/");
    }
  }, [isAuthenticated, message, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear any existing error when submitting again
    setDisplayedError("");
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    if (!loading) {
      dispatch(loginUser({ email, password, role }));
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "MR" : "EN"));
  };

  const handleGoogleResponse = useCallback(
    async (response) => {
      try {
        const idToken = response?.credential;
        if (!idToken) {
          setDisplayedError("Google साइन-इन अयशस्वी. टोकन मिळाला नाही.");
          return;
        }
        dispatch(loginWithGoogle(idToken, role));
      } catch (err) {
        console.error("Google response error:", err);
        setDisplayedError("Google साइन-इन त्रुटी");
      }
    },
    [dispatch, role]
  );

  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
          }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [handleGoogleResponse]);

  const roleBtnBase =
    "flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer select-none transition-colors duration-300 shadow-sm";
  const roleBtnSelected =
    "bg-green-200 text-green-900 shadow-md hover:bg-green-300";
  const roleBtnUnselected = "bg-beige-100 text-brown-700 hover:bg-beige-200";

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-brown-900">
      {/* Custom Error Display */}
      {displayedError && (
        <ErrorDisplay
          error={displayedError}
          onClose={() => {
            setDisplayedError("");
            dispatch(clearErrors());
          }}
        />
      )}

      <aside className="hidden md:flex flex-col justify-center items-center flex-1 bg-green-100 p-12 shadow-inner">
        <FaHome className="text-green-700 text-8xl mb-8 drop-shadow-lg" />
        <h1 className="text-3xl font-extrabold mb-4 select-none">
          {language === "EN"
            ? "Welcome to Karpewadi Homestay Portal"
            : "करपेवाडी  होमस्टे पोर्टलमध्ये आपले स्वागत आहे"}
        </h1>
        <p className="max-w-md text-brown-800 text-lg leading-relaxed select-none">
          {language === "EN"
            ? "Access your account to manage your bookings, view your stay details, and enjoy a seamless homestay experience."
            : "आपले बुकिंग व्यवस्थापित करण्यासाठी, आपल्या मुक्कामाचे तपशील पहाण्यासाठी आणि एक आरामदायक होमस्टे अनुभव घेण्यासाठी आपले खाते प्रवेश करा."}
        </p>
      </aside>

      <main className="flex-1 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md rounded-xl shadow-lg p-8 border border-green-600">
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="text-sm font-semibold text-green-700 bg-green-200 px-3 py-1 rounded-full shadow-sm hover:bg-green-300 transition-colors"
              type="button"
            >
              {language}
            </button>
          </div>

          <fieldset className="mb-6">
            <legend className="mb-2 font-semibold text-brown-800 select-none">
              {t.selectRole}
            </legend>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole("trekker")}
                className={`${roleBtnBase} ${
                  role === "trekker" ? roleBtnSelected : roleBtnUnselected
                }`}
                aria-pressed={role === "trekker"}
                aria-label={t.trekker}
              >
                <FaUser className="text-xl" />
                <span>{t.trekker}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`${roleBtnBase} ${
                  role === "admin" ? roleBtnSelected : roleBtnUnselected
                }`}
                aria-pressed={role === "admin"}
                aria-label={t.admin}
              >
                <FaUserShield className="text-xl" />
                <span>{t.admin}</span>
              </button>
            </div>
          </fieldset>

          <form onSubmit={handleSubmit} noValidate>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-brown-800 select-none"
            >
              {t.email}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full mb-4 px-4 py-2 rounded-md border border-brown-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-colors bg-beige-50 text-brown-900 shadow-sm"
              autoComplete="email"
              aria-required="true"
            />

            <label
              htmlFor="password"
              className="block mb-1 font-medium text-brown-800 select-none"
            >
              {t.password}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mb-6 px-4 py-2 rounded-md border border-brown-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-colors bg-beige-50 text-brown-900 shadow-sm"
              autoComplete="current-password"
              aria-required="true"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-beige-50 font-semibold py-3 rounded-md shadow-md transition-colors focus:outline-none focus:ring-4 focus:ring-green-400"
              aria-busy={loading}
            >
              {loading && <Loader2 className="animate-spin h-5 w-5" />}
              {t.login}
            </button>
          </form>

          <div className="flex justify-between mt-4 text-sm text-green-700 font-semibold select-none">
            <Link
              to="/register"
              className="hover:underline focus:underline focus:outline-none"
            >
              {t.register}
            </Link>
            <Link
              to="/password-reset"
              className="hover:underline focus:underline focus:outline-none"
            >
              {t.forgotPassword}
            </Link>
          </div>

          <div
            className="flex items-center my-8 text-brown-500 select-none"
            aria-hidden="true"
          >
            <hr className="flex-grow border-b border-brown-300" />
            <span className="mx-3 text-sm font-semibold">{t.or}</span>
            <hr className="flex-grow border-b border-brown-300" />
          </div>

          <div id="googleSignInDiv" className="w-full"></div>
        </div>
      </main>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
