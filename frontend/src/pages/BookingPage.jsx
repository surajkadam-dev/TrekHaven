"use client";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAccommodation } from "../store/slices/adminSlice";
import { clearAllErrors } from "../store/slices/userSlice";

import ForbiddenPage from "./ForbiddenPage";
import UpdateMobile from "../Components/UpdateMobile";

import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const contentData = {
  en: {
    pageTitle: "Stay & Meals at Karpewadi",
    pageSubtitle: "Book for Panhalā to Pavankhind Trek",
    bookingForm: "Booking Form",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    stayDate: "Stay Date",
    groupSize: "Group Size",
    groupName: "Group Name",
    needStay: "I need accommodation",
    stayNights: "Number of Nights",
    mealType: "Meal Type",
    vegMeal: "Vegetarian Meal",
    nonVegMeal: "Non-Vegetarian Meal",
    submitBtn: "Proceed to Payment",
    pricingTitle: "Pricing Information",
    perPersonMeal: "Meal per person",
    totalPersons: "Total persons",
    mealAmount: "Meal Amount",
    stayAmount: "Stay Amount",
    totalAmount: "Total Amount",
    pleaseLogin: "Please login first",
    selectDate: "Select a date",
    enterPhone: "Enter phone number",
    validPhone: "Enter valid 10-digit phone",
    validDate: "Select a valid date",
    minPerson: "Minimum 1 person required",
    enterGroupName: "Enter group name",
  },
  mr: {
    pageTitle: "करपेवाडी येथे निवास आणि जेवण",
    pageSubtitle: "पन्हाळा ते पावनखिंड ट्रेकसाठी बुकिंग करा",
    bookingForm: "आरक्षण फॉर्म",
    fullName: "पूर्ण नाव",
    email: "ईमेल",
    phone: "फोन नंबर",
    stayDate: "मुक्कामाची तारीख",
    groupSize: "गटाचा आकार",
    groupName: "गटाचे नाव",
    needStay: "मला राहण्याची सोय हवी आहे",
    stayNights: "रात्रीची संख्या",
    mealType: "जेवणाचा प्रकार",
    vegMeal: "शाकाहारी जेवण",
    nonVegMeal: "मांसाहारी जेवण",
    submitBtn: "पेमेंट करा",
    pricingTitle: "किंमत माहिती",
    perPersonMeal: "प्रति व्यक्ती भोजन दर",
    totalPersons: "एकूण व्यक्ती",
    mealAmount: "भोजन रक्कम",
    stayAmount: "राहण्याचा दर",
    totalAmount: "एकूण रक्कम",
    pleaseLogin: "कृपया लॉगिन करा",
    selectDate: "कृपया तारीख निवडा",
    enterPhone: "कृपया फोन नंबर प्रविष्ट करा",
    validPhone: "कृपया वैध 10-अंकी फोन नंबर प्रविष्ट करा",
    validDate: "कृपया वैध तारीख निवडा",
    minPerson: "किमान 1 व्यक्ती आवश्यक आहे",
    enterGroupName: "कृपया गटाचे नाव प्रविष्ट करा",
  },
};

const BookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [language, setLanguage] = useState("en"); // language toggle
  const content = contentData[language];

  const [errors, setErrors] = useState({});
  const { isAuthenticated, user } = useSelector((store) => store.user);
  const { accommodation } = useSelector((store) => store.admin);
  const fetchedRef = useRef(false);
  const toastShown = useRef(false);

  const [accommodationId, setAccommodationId] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.mobile || "",
    groupName: "",
    stayDate: new Date().toISOString().split("T")[0],
    groupSize: 1,
    needStay: true,
    stayNight: 1,
    mealType: "veg",
    amount: 0,
  });

  useEffect(() => {
    if (!isAuthenticated && !toastShown.current) {
      navigate("/");
      toast.error(content.pleaseLogin);
      dispatch(clearAllErrors());
      toastShown.current = true;
    }
  }, [isAuthenticated, navigate, dispatch, language, content.pleaseLogin]);

  if (user?.role === "admin") return <ForbiddenPage />;

  useEffect(() => {
    if (isAuthenticated && !fetchedRef.current) {
      dispatch(getAccommodation());
      fetchedRef.current = true;
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (accommodation) setAccommodationId(accommodation._id);
  }, [accommodation]);

  // Calculate total
  useEffect(() => {
    if (accommodation) {
      const { vegRate, nonVegRate, pricePerNight } = accommodation;
      const mealRate = form.mealType === "non-veg" ? nonVegRate : vegRate;
      const mealAmount = form.needStay
        ? mealRate * form.stayNight * form.groupSize
        : mealRate * form.groupSize;
      const stayAmount = form.needStay
        ? pricePerNight * form.stayNight * form.groupSize
        : 0;
      setForm((prev) => ({ ...prev, amount: mealAmount + stayAmount }));
    }
  }, [
    form.groupSize,
    form.needStay,
    form.stayNight,
    form.mealType,
    accommodation,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.stayDate) newErrors.stayDate = content.selectDate;
    if (!form.phone) newErrors.phone = content.enterPhone;
    else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = content.validPhone;

    if (form.stayDate < new Date().toISOString().split("T")[0])
      newErrors.stayDate = content.validDate;

    if (form.groupSize < 1) newErrors.groupSize = content.minPerson;

    if (form.groupSize > 1 && !form.groupName.trim())
      newErrors.groupName = content.enterGroupName;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm())
      navigate(`/checkout/${accommodationId}`, { state: form });
  };

  const getPricing = () => {
    if (!accommodation)
      return {
        vegRate: 0,
        nonVegRate: 0,
        pricePerNight: 0,
        basePricePerPerson: 0,
      };
    const { vegRate, nonVegRate, pricePerNight } = accommodation;
    return {
      vegRate,
      nonVegRate,
      pricePerNight,
      basePricePerPerson: form.mealType === "non-veg" ? nonVegRate : vegRate,
    };
  };

  const { vegRate, nonVegRate, pricePerNight, basePricePerPerson } =
    getPricing();

  return (
    <div className="min-h-screen bg-beige-500 font-sans text-brown-900">
      {/* Language Toggle */}
      <div className="flex justify-end max-w-6xl mx-auto p-4 gap-2">
        <button
          onClick={() => setLanguage("en")}
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${
            language === "en"
              ? "bg-green-700 text-beige-50 shadow"
              : "bg-beige-200 text-brown-700 hover:bg-green-200"
          }`}
          type="button"
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("mr")}
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${
            language === "mr"
              ? "bg-green-700 text-beige-50 shadow"
              : "bg-beige-200 text-brown-700 hover:bg-green-200"
          }`}
          type="button"
          aria-label="Switch to Marathi"
        >
          MR
        </button>
      </div>

      {/* Page Header */}
      <header className="text-center mb-10 max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          {content.pageTitle}
        </h1>
        <p className="text-brown-700 mt-2 text-lg">{content.pageSubtitle}</p>
      </header>

      <main className="max-w-6xl mx-auto p-6 bg-beige-500 rounded-xl shadow-lg border-2 border-green-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form */}
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">{content.bookingForm}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block font-semibold mb-1">
                    {content.fullName}
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={user?.name || ""}
                    disabled
                    className="w-full px-4 py-2 border rounded bg-beige-200 text-brown-700 cursor-not-allowed"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-semibold mb-1">
                    {content.email}
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2 border rounded bg-beige-200 text-brown-700 cursor-not-allowed"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block font-semibold mb-1">
                    {content.phone}
                  </label>
                  {user.mobile && (
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      onChange={handleChange}
                      value={user?.mobile || form.phone}
                      disabled={!!user?.mobile}
                      className={`w-full px-4 py-2 border rounded text-brown-900 ${
                        user?.mobile ? "bg-beige-200 cursor-not-allowed" : ""
                      }`}
                      placeholder={content.phone}
                    />
                  )}
                  {!user.mobile && (
                    <p className="text-red-600 text-sm mt-1">
                      {"mobile number is required please update the profile "}
                    </p>
                  )}
                </div>

                {/* Stay Date */}
                <div>
                  <label
                    htmlFor="stayDate"
                    className="block font-semibold mb-1"
                  >
                    {content.stayDate}
                  </label>
                  <input
                    id="stayDate"
                    type="date"
                    name="stayDate"
                    value={form.stayDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded text-brown-900"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.stayDate && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.stayDate}
                    </p>
                  )}
                </div>

                {/* Group Size */}
                <div>
                  <label
                    htmlFor="groupSize"
                    className="block font-semibold mb-1"
                  >
                    {content.groupSize}
                  </label>
                  <input
                    id="groupSize"
                    type="number"
                    name="groupSize"
                    min="1"
                    value={form.groupSize}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded text-brown-900"
                    aria-describedby={
                      errors.groupSize ? "groupSize-error" : undefined
                    }
                  />
                  {errors.groupSize && (
                    <p
                      id="groupSize-error"
                      className="text-red-600 text-sm mt-1"
                    >
                      {errors.groupSize}
                    </p>
                  )}
                </div>

                {/* Group Name */}
                {form.groupSize > 1 && (
                  <div>
                    <label
                      htmlFor="groupName"
                      className="block font-semibold mb-1"
                    >
                      {content.groupName}
                    </label>
                    <input
                      id="groupName"
                      type="text"
                      name="groupName"
                      value={form.groupName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded text-brown-900"
                      aria-describedby={
                        errors.groupName ? "groupName-error" : undefined
                      }
                    />
                    {errors.groupName && (
                      <p
                        id="groupName-error"
                        className="text-red-600 text-sm mt-1"
                      >
                        {errors.groupName}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Need Stay */}
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  name="needStay"
                  checked
                  disabled
                  className="mr-2 cursor-not-allowed"
                  aria-disabled="true"
                  aria-checked="true"
                />
                <label className="font-semibold">{content.needStay}</label>
              </div>

              {/* Stay Nights */}
              {form.needStay && (
                <div className="mt-2 max-w-xs">
                  <label
                    htmlFor="stayNight"
                    className="block font-semibold mb-1"
                  >
                    {content.stayNights}
                  </label>
                  <input
                    id="stayNight"
                    type="number"
                    name="stayNight"
                    min="1"
                    value={form.stayNight}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded text-brown-900"
                  />
                </div>
              )}

              {/* Meal Type */}
              <fieldset className="mt-6">
                <legend className="font-semibold mb-2">
                  {content.mealType}
                </legend>
                <div className="flex gap-6">
                  <label
                    htmlFor="mealType-veg"
                    className={`cursor-pointer border rounded px-4 py-2 select-none ${
                      form.mealType === "veg"
                        ? "bg-green-100 border-green-600"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      id="mealType-veg"
                      name="mealType"
                      value="veg"
                      checked={form.mealType === "veg"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {content.vegMeal} (₹{vegRate})
                  </label>
                  <label
                    htmlFor="mealType-nonveg"
                    className={`cursor-pointer border rounded px-4 py-2 select-none ${
                      form.mealType === "non-veg"
                        ? "bg-green-100 border-green-600"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      id="mealType-nonveg"
                      name="mealType"
                      value="non-veg"
                      checked={form.mealType === "non-veg"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {content.nonVegMeal} (₹{nonVegRate})
                  </label>
                </div>
              </fieldset>

              {user.mobile ? (
                <button
                  type="submit"
                  className="mt-8 w-full py-3 bg-green-700 hover:bg-green-800 text-beige-50 rounded font-bold flex justify-center items-center gap-2 transition"
                >
                  {content.submitBtn} <FaArrowRight />
                </button>
              ) : (
                <button
                  type="submit"
                  className="mt-8 w-full py-3 bg-gray-300 hover:bg-gray-400 text-beige-50 rounded font-bold flex justify-center items-center gap-2 transition cursor-not-allowed"
                >
                  {content.submitBtn} <FaArrowRight />
                </button>
              )}
            </form>
          </section>

          {/* Right Pricing */}
          <aside className="bg-beige-200 p-6 rounded-lg shadow-inner">
            <h2 className="text-xl font-bold mb-6">{content.pricingTitle}</h2>
            <dl className="space-y-4 text-brown-900">
              <div className="flex justify-between">
                <dt>{content.perPersonMeal}</dt>
                <dd>₹{basePricePerPerson}</dd>
              </div>
              <div className="flex justify-between">
                <dt>{content.totalPersons}</dt>
                <dd>{form.groupSize}</dd>
              </div>
              <div className="flex justify-between">
                <dt>{content.mealAmount}</dt>
                <dd>
                  ₹
                  {form.needStay
                    ? basePricePerPerson * form.stayNight * form.groupSize
                    : basePricePerPerson * form.groupSize}
                </dd>
              </div>
              {form.needStay && (
                <div className="flex justify-between">
                  <dt>{content.stayAmount}</dt>
                  <dd>₹{pricePerNight * form.stayNight * form.groupSize}</dd>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-brown-700 pt-2 mt-2">
                <dt>{content.totalAmount}</dt>
                <dd>₹{form.amount}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </main>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default BookingPage;
