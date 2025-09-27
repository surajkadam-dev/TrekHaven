import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Globe,
  Edit3,
  Check,
  X,
  Save,
  Crown,
  Star,
  Award,
} from "lucide-react";

const translations = {
  EN: {
    profile: "My Profile",
    name: "Full Name",
    email: "Email Address",
    mobile: "Mobile Number",
    role: "Account Role",
    createdAt: "Member Since",
    admin: "Administrator",
    user: "Standard User",
    language: "Language Preference",
    edit: "Edit Profile",
    save: "Save Changes",
    cancel: "Cancel",
    editSuccess: "Profile updated successfully!",
    personalInfo: "Personal Information",
    accountDetails: "Account Details",
    achievements: "Achievements",
    loyaltyLevel: "Loyalty Level",
    completedBookings: "Completed Treks",
    reviews: "Reviews Written",
  },
  MR: {
    profile: "माझा प्रोफाइल",
    name: "पूर्ण नाव",
    email: "ईमेल पत्ता",
    mobile: "मोबाईल नंबर",
    role: "खात्याची भूमिका",
    createdAt: "सदस्यता तारखेपासून",
    admin: "प्रशासक",
    user: "सामान्य वापरकर्ता",
    language: "भाषा प्राधान्य",
    edit: "प्रोफाइल संपादित करा",
    save: "बदल जतन करा",
    cancel: "रद्द करा",
    editSuccess: "प्रोफाइल यशस्वीरित्या अद्यतनित केले!",
    personalInfo: "वैयक्तिक माहिती",
    accountDetails: "खाता तपशील",
    achievements: "कामगिरी",
    loyaltyLevel: "निष्ठा स्तर",
    completedBookings: "पूर्ण ट्रेक",
    reviews: "लेखन समीक्षा",
  },
};

const MyProfile = ({ isMobile }) => {
  const { user } = useSelector((store) => store.user || {});

  const userData = user || {
    name: "Suraj Kadam",
    email: "suraj12@gmail.com",
    mobile: "9321803014",
    role: "admin",
    isAdmin: true,
    createdAt: "2025-08-08T13:49:44.170Z",
    stats: {
      completedBookings: 12,
      reviews: 8,
      loyaltyLevel: "Gold",
    },
  };

  const [lang, setLang] = useState("EN");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    setEditData({
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
    });
  }, [userData]);

  const formattedDate = new Date(userData.createdAt).toLocaleDateString(
    lang === "EN" ? "en-US" : "mr-IN",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <motion.div
        className={`mx-auto ${isMobile ? "w-full" : "max-w-4xl lg:max-w-6xl"}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.h1
            className="text-4xl lg:text-5xl font-bold text-green-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {t.profile}
          </motion.h1>
          <motion.div
            className="flex justify-center items-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Globe className="w-5 h-5 text-green-700" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-white border-2 border-green-300 rounded-full px-4 py-2 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="EN">English</option>
              <option value="MR">मराठी</option>
            </select>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Profile Card */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-200 lg:col-span-2"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-2xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                >
                  <User className="w-12 h-12 text-green-600" />
                </motion.div>
              </div>

              <motion.h2
                className="text-2xl font-bold text-white text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                {userData.name}
              </motion.h2>
              <p className="text-green-100 text-center">{userData.email}</p>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <motion.h3
                className="text-xl font-semibold text-green-800 mb-6 pb-2 border-b-2 border-green-200"
                variants={itemVariants}
              >
                {t.personalInfo}
              </motion.h3>

              <div className="space-y-6">
                {/* Name Field */}
                <motion.div
                  className="flex items-center gap-4"
                  variants={itemVariants}
                >
                  <div
                    className={`w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <User className="w-6 h-6 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-green-600 mb-1">
                      {t.name}
                    </label>

                    <p className="text-lg text-green-900">{userData.name}</p>
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div
                  className="flex items-center gap-4"
                  variants={itemVariants}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-green-600 mb-1">
                      {t.email}
                    </label>

                    <p className="text-lg text-green-900">{userData.email}</p>
                  </div>
                </motion.div>

                {/* Mobile Field */}
                <motion.div
                  className="flex items-center gap-4"
                  variants={itemVariants}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-green-600 mb-1">
                      {t.mobile}
                    </label>

                    <p className="text-lg text-green-900">
                      {userData.mobile || "N/A"}
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.h3
                className="text-xl font-semibold text-green-800 mt-8 mb-6 pb-2 border-b-2 border-green-200"
                variants={itemVariants}
              >
                {t.accountDetails}
              </motion.h3>

              <div className="space-y-6">
                {/* Role Field */}
                <motion.div
                  className="flex items-center gap-4"
                  variants={itemVariants}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-green-600 mb-1">
                      {t.role}
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userData.isAdmin
                            ? "bg-green-100 text-green-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {userData.isAdmin ? t.admin : t.user}
                      </span>
                      {userData.isAdmin && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Created At Field */}
                <motion.div
                  className="flex items-center gap-4"
                  variants={itemVariants}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-green-600 mb-1">
                      {t.createdAt}
                    </label>
                    <p className="text-lg text-green-900">{formattedDate}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>{t.editSuccess}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MyProfile;
