import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAccommodation,
  resetSlice,
  resetMessage,
  resetError,
  updateAccommodation,
} from "../../store/slices/adminSlice";
import {
  FaUsers,
  FaRupeeSign,
  FaBed,
  FaShieldAlt,
  FaExclamationTriangle,
  FaLanguage,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Accommodation = () => {
  const dispatch = useDispatch();
  const { accommodation, loading, error, message } = useSelector(
    (state) => state.admin
  );
  const id = accommodation?._id;

  const [language, setLanguage] = useState("en"); // default English

  const translations = {
    en: {
      title: "Update Accommodation",
      subtitle:
        "Manage your accommodation details with royal Maratha standards",
      maxMembers: "Maximum Members",
      vegRate: "Veg Rate (₹)",
      nonVegRate: "Non-Veg Rate (₹)",
      pricePerNight: "Price Per Night (₹)",
      noChanges: "No changes made yet. Modify fields below to enable update.",
      noChangesBtn: "No Changes Made",
      updateBtn: "Update Accommodation",
      loading: "Updating...",
    },
    mr: {
      title: "निवासस्थान अद्यतनित करा",
      subtitle: "राजसी मराठा मानकांसह आपले निवासस्थान व्यवस्थापित करा",
      maxMembers: "कमाल सदस्य",
      vegRate: "शाकाहारी दर (₹)",
      nonVegRate: "मांसाहारी दर (₹)",
      pricePerNight: "प्रति रात्र किंमत (₹)",
      noChanges:
        "अद्याप कोणतेही बदल केलेले नाहीत. अद्यतन सक्षम करण्यासाठी खालील फील्ड्स बदला.",
      noChangesBtn: "कोणतेही बदल नाहीत",
      updateBtn: "निवासस्थान अद्यतनित करा",
      loading: "अद्यतनित करत आहे...",
    },
  };

  const t = translations[language];

  const [formData, setFormData] = useState({
    maxMembers: 0,
    vegRate: 200,
    nonVegRate: 350,
    pricePerNight: 200,
  });

  const [initialData, setInitialData] = useState({ ...formData });
  const [hasChanges, setHasChanges] = useState(false);

  // Beige, green, brown theme colors
  const colors = {
    beige: "#FAF9F6",
    greenDark: "#4B7A0F",
    greenMedium: "#6B8E23",
    brownDark: "#5D4037",
    brownMedium: "#8B5E3C",
    accent: "#A67B5B",
    border: "#D7C4A3",
    errorBg: "#FEE2E2",
    errorText: "#B91C1C",
    successBg: "#D1FAE5",
    successText: "#047857",
    warningBg: "#FEF3C7",
    warningText: "#92400E",
  };

  useEffect(() => {
    dispatch(getAccommodation());

    return () => {
      dispatch(resetSlice());
      dispatch(resetMessage());
      dispatch(resetError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (accommodation) {
      const newFormData = {
        maxMembers: accommodation.maxMembers || 0,
        vegRate: accommodation.vegRate || 200,
        nonVegRate: accommodation.nonVegRate || 350,
        pricePerNight: accommodation.pricePerNight || 200,
      };

      setFormData(newFormData);
      setInitialData(newFormData);
    }
  }, [accommodation]);

  useEffect(() => {
    const changesDetected = Object.keys(formData).some(
      (key) => formData[key] !== initialData[key]
    );
    setHasChanges(changesDetected);
  }, [formData, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);
    setFormData({
      ...formData,
      [name]: numericValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasChanges) {
      toast.warn(t.noChanges, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: colors.warningBg,
          color: colors.warningText,
          border: `1px solid ${colors.warningText}`,
          fontFamily: "'Poppins', sans-serif",
        },
      });
      return;
    }

    dispatch(updateAccommodation({ id, updateData: formData }));
  };

  useEffect(() => {
    if (message) {
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: colors.successBg,
          color: colors.successText,
          border: `1px solid ${colors.successText}`,
          fontFamily: "'Poppins', sans-serif",
        },
      });
      dispatch(resetMessage());
      setInitialData({ ...formData });
      setHasChanges(false);
    }

    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: colors.errorBg,
          color: colors.errorText,
          border: `1px solid ${colors.errorText}`,
          fontFamily: "'Poppins', sans-serif",
        },
      });
      dispatch(resetError());
    }
  }, [message, error, dispatch, formData]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "mr" : "en"));
  };

  return (
    <div
      className="min-h-screen p-6 "
      style={{
        backgroundColor: colors.beige,
        fontFamily: "'Poppins', sans-serif",
        color: colors.brownDark,
      }}
    >
      <ToastContainer />

      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: colors.greenMedium }}
            >
              <FaBed className="w-8 h-8" style={{ color: colors.beige }} />
            </div>
          </div>
          <h1
            className="text-3xl font-bold mb-2 tracking-wide"
            style={{ color: colors.brownDark }}
          >
            {t.title}
          </h1>
          <p className="text-base" style={{ color: colors.brownMedium }}>
            {t.subtitle}
          </p>
          <div
            className="w-24 h-1 mx-auto mt-3 rounded-full shadow-md"
            style={{ backgroundColor: colors.greenMedium }}
          ></div>
        </div>

        {/* No Changes Warning */}
        {!hasChanges && (
          <div
            className="mb-6 p-4 rounded-lg flex items-center text-sm"
            style={{
              backgroundColor: colors.warningBg,
              color: colors.warningText,
              border: `1px solid ${colors.warningText}`,
            }}
          >
            <FaExclamationTriangle className="mr-3" />
            <span>{t.noChanges}</span>
          </div>
        )}

        {/* Accommodation Form */}
        <div
          className="rounded-xl shadow-xl border-2 overflow-hidden relative"
          style={{ borderColor: colors.border, backgroundColor: "white" }}
        >
          <div
            className="h-2"
            style={{ backgroundColor: colors.greenMedium }}
          ></div>
          <div className="absolute top-2 right-1">
            <button
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="px-6 py-2 mt-1 rounded-lg md:px-3 text-sm"
              style={{
                backgroundColor: colors.greenMedium,
                color: "white",
                borderColor: colors.brownMedium,
                boxShadow: `0 0 5px ${colors.greenMedium}`,
              }}
              title={language === "en" ? "मराठी" : "English"}
            >
              <span>{language === "en" ? "मराठी" : "English"}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Max Members */}
            <div>
              <label
                htmlFor="maxMembers"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.brownDark }}
              >
                {t.maxMembers}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUsers style={{ color: colors.greenMedium }} />
                </div>
                <input
                  id="maxMembers"
                  type="number"
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-green-600 focus:outline-none"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: "white",
                    color: colors.brownDark,
                  }}
                  required
                />
              </div>
            </div>

            {/* Veg Rate */}
            <div>
              <label
                htmlFor="vegRate"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.brownDark }}
              >
                {t.vegRate}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRupeeSign style={{ color: colors.greenMedium }} />
                </div>
                <input
                  id="vegRate"
                  type="number"
                  name="vegRate"
                  value={formData.vegRate}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-green-600 focus:outline-none"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: "white",
                    color: colors.brownDark,
                  }}
                  required
                />
              </div>
            </div>

            {/* Non-Veg Rate */}
            <div>
              <label
                htmlFor="nonVegRate"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.brownDark }}
              >
                {t.nonVegRate}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRupeeSign style={{ color: colors.greenMedium }} />
                </div>
                <input
                  id="nonVegRate"
                  type="number"
                  name="nonVegRate"
                  value={formData.nonVegRate}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-green-600 focus:outline-none"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: "white",
                    color: colors.brownDark,
                  }}
                  required
                />
              </div>
            </div>

            {/* Price Per Night */}
            <div>
              <label
                htmlFor="pricePerNight"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.brownDark }}
              >
                {t.pricePerNight}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRupeeSign style={{ color: colors.greenMedium }} />
                </div>
                <input
                  id="pricePerNight"
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-green-600 focus:outline-none"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: "white",
                    color: colors.brownDark,
                  }}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !hasChanges}
              className="w-full py-3 mt-4 font-semibold rounded-lg text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: loading
                  ? colors.accentLight
                  : !hasChanges
                  ? colors.secondary
                  : colors.greenDark,
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{t.loading}</span>
                </span>
              ) : (
                <span>
                  <FaShieldAlt className="inline mr-2" />
                  {hasChanges ? t.updateBtn : t.noChangesBtn}
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
        </div>
      </div>
    </div>
  );
};

export default Accommodation;
