"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAccommodation,
  getAllBookings,
  getAllUsers,
  resetSlice,
  getBookingsByDate,
} from "../../store/slices/adminSlice";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  FaUsers,
  FaClipboardList,
  FaRupeeSign,
  FaCalendarAlt,
  FaUtensils,
  FaLanguage,
  FaBed,
  FaSearch,
  FaChartLine,
} from "react-icons/fa";

function AdminDashboard() {
  const dispatch = useDispatch();
  const {
    accommodation,
    AllUsers,
    AllBookings,
    totalUsers,
    totalBookings,
    loading,
    bookedMembersByDate,
  } = useSelector((store) => store.admin);

  const [language, setLanguage] = useState("en");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateSearchLoading, setDateSearchLoading] = useState(false);

  // Translations object
  const translations = {
    en: {
      title: "Karapewadi Homestay",
      subtitle: "Admin Dashboard",
      totalUsers: "Total Users",
      totalBookings: "Total Bookings",
      totalRevenue: "Total Revenue",
      bookedMembers: "Booked Members",
      bookingStatus: "Booking Status",
      mealPreferences: "Meal Preferences",
      monthlyRevenue: "Monthly Revenue",
      recentActivity: "Recent Activity",
      newUsers: "New Users",
      newBookings: "New Bookings",
      weeklyRevenue: "Weekly Revenue",
      last7Days: "Last 7 days",
      completed: "Completed",
      confirmed: "Confirmed",
      cancelled: "Cancelled",
      veg: "Veg",
      nonVeg: "Non-Veg",
      checkDate: "Check Date",
      selectDate: "Select date",
      membersOnDate: "Members on selected date",
      occupancyRate: "Occupancy Rate",
      avgStayDuration: "Avg. Stay (Nights)",
      footer: "Karapewadi Homestay Management",
      dailyOccupancy: "Daily Occupancy Trend",
    },
    mr: {
      title: "करपेवाडी होमस्टे",
      subtitle: "प्रशासन डॅशबोर्ड",
      totalUsers: "एकूण वापरकर्ते",
      totalBookings: "एकूण बुकिंग्स",
      totalRevenue: "एकूण उत्पन्न",
      bookedMembers: "बुक केलेले सदस्य",
      bookingStatus: "बुकिंग स्थिती",
      mealPreferences: "जेवण प्राधान्ये",
      monthlyRevenue: "मासिक उत्पन्न",
      recentActivity: "अलीकडील क्रियाकलाप",
      newUsers: "नवीन वापरकर्ते",
      newBookings: "नवीन बुकिंग",
      weeklyRevenue: "साप्ताहिक उत्पन्न",
      last7Days: "गेल्या 7 दिवस",
      completed: "पूर्ण",
      confirmed: "पुष्टी",
      cancelled: "रद्द",
      veg: "शाकाहारी",
      nonVeg: "मांसाहारी",
      checkDate: "तारीख तपासा",
      selectDate: "तारीख निवडा",
      membersOnDate: "निवडलेल्या तारखेचे सदस्य",
      occupancyRate: "ऑक्यूपन्सी दर",
      avgStayDuration: "सरासरी मुक्काम (रात्री)",
      footer: "करपेवाडी होमस्टे व्यवस्थापन",
      dailyOccupancy: "दैनंदिन ऑक्यूपन्सी ट्रेंड",
    },
  };

  const t = translations[language];

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllBookings());
    dispatch(getAccommodation());

    return () => {
      dispatch(resetSlice());
    };
  }, [dispatch]);

  // Handle date search
  const handleDateSearch = async () => {
    setDateSearchLoading(true);
    try {
      await dispatch(getBookingsByDate({ stayDate: selectedDate }));
    } catch (error) {
      console.error("Error fetching bookings by date:", error);
    } finally {
      setDateSearchLoading(false);
    }
  };

  // Color palette: earthy tones suitable for a homestay
  const colors = {
    darkGreen: "#2E7D32",
    mediumGreen: "#4CAF50",
    lightGreen: "#E8F5E9",
    darkBrown: "#5D4037",
    mediumBrown: "#8D6E63",
    lightBrown: "#D7CCC8",
    beige: "#F5F5DC",
    lightBeige: "#FFF9E6",
    cream: "#FFFDE7",
    orange: "#FF9800",
    lightOrange: "#FFE0B2",
  };

  // Custom tooltip style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-gray-200 rounded shadow-md">
          <p className="font-bold">{`${label}`}</p>
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate metrics
  const totalRevenue = AllBookings.reduce((sum, b) => {
    if (b.status === "completed") {
      return sum + (b.amount || 0);
    }
    if (b.status === "cancelled") {
      return sum + (b?.amount - b?.refundAmount || 0);
    }
    return sum; // ignore other statuses
  }, 0);

  const totalNights = AllBookings.reduce(
    (sum, b) => sum + b.stayNight * b.groupSize,
    0
  );

  const avgNights =
    AllBookings.length > 0 ? (totalNights / AllBookings.length).toFixed(1) : 0;

  // Calculate occupancy rate (assuming 10 rooms maximum)
  const maxCapacity = 10;
  const occupancyRate = (
    (AllBookings.filter((b) => b.status !== "cancelled").length / maxCapacity) *
    100
  ).toFixed(1);

  // Booking status breakdown
  const statusData = [
    {
      name: t.completed,
      value: AllBookings.filter((b) => b.status === "completed").length,
    },
    {
      name: t.confirmed,
      value: AllBookings.filter((b) => b.status === "confirmed").length,
    },
    {
      name: t.cancelled,
      value: AllBookings.filter((b) => b.status === "cancelled").length,
    },
  ];

  // Meal preference breakdown
  const mealData = [
    {
      name: t.veg,
      value: AllBookings.filter((b) => b.mealType === "veg").length,
    },
    {
      name: t.nonVeg,
      value: AllBookings.filter((b) => b.mealType === "nonveg").length,
    },
  ];

  // Last 7 days data for area chart
  const getLast7DaysData = () => {
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      const dayBookings = AllBookings.filter(
        (b) => b.stayDate === dateString && b.status !== "cancelled"
      );

      const totalMembers = dayBookings.reduce((sum, b) => sum + b.groupSize, 0);

      result.push({
        name: date.toLocaleDateString(language === "en" ? "en-IN" : "mr-IN", {
          weekday: "short",
        }),
        members: totalMembers,
        date: dateString,
      });
    }

    return result;
  };

  const last7DaysData = getLast7DaysData();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-beige-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-brown-800">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const CHART_COLORS = [
    colors.darkGreen,
    colors.mediumGreen,
    colors.darkBrown,
    colors.orange,
  ];

  return (
    <div className="min-h-screen bg-beige-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto mt-16 md:mt-0">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 relative">
          <button
            onClick={() => setLanguage(language === "en" ? "mr" : "en")}
            className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-200 transition-colors flex items-center text-brown-700"
          >
            <FaLanguage className="mr-1" />
            {language === "en" ? "मराठी" : "English"}
          </button>

          <div className="flex justify-center mb-3 md:mb-4">
            <div className="w-16 h-16 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg bg-white border-2 border-green-600">
              <FaBed className="text-2xl text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-brown-800">
            {t.title}
          </h1>
          <p className="text-sm md:text-base text-green-700">{t.subtitle}</p>
          <div className="w-16 h-1 mx-auto mt-2 rounded-full bg-green-600"></div>
        </div>

        {/* Date Search Card */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md mb-6 border border-green-200">
          <h3 className="text-lg font-semibold mb-4 text-brown-800 flex items-center">
            <FaCalendarAlt className="mr-2 text-green-600" />
            {t.checkDate}
          </h3>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-brown-700 mb-1">
                {t.selectDate}
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border border-brown-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button
              onClick={handleDateSearch}
              disabled={dateSearchLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center mt-5 md:mt-0 min-w-[120px]"
            >
              {dateSearchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaSearch className="mr-2" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

          {bookedMembersByDate !== null && (
            <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
              <p className="text-green-800">
                <span className="font-semibold">{t.membersOnDate}:</span>{" "}
                {bookedMembersByDate}
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Users Card */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-brown-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-brown-100">
                <FaUsers className="text-xl text-brown-600" />
              </div>
              <h3 className="font-semibold text-brown-800">{t.totalUsers}</h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl md:text-3xl font-bold text-green-700">
                {totalUsers || 0}
              </p>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-green-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-green-100">
                <FaClipboardList className="text-xl text-green-600" />
              </div>
              <h3 className="font-semibold text-brown-800">
                {t.totalBookings}
              </h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl md:text-3xl font-bold text-green-700">
                {totalBookings || 0}
              </p>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-brown-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-brown-100">
                <FaRupeeSign className="text-xl text-brown-600" />
              </div>
              <h3 className="font-semibold text-brown-800">{t.totalRevenue}</h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl md:text-3xl font-bold text-green-700">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Occupancy Card */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-green-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-green-100">
                <FaBed className="text-xl text-green-600" />
              </div>
              <h3 className="font-semibold text-brown-800">
                {t.occupancyRate}
              </h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl md:text-3xl font-bold text-green-700">
                {occupancyRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Occupancy Trend */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-brown-200">
            <h3 className="text-lg font-semibold mb-4 text-brown-800 flex items-center">
              <FaChartLine className="mr-2 text-green-600" />
              {t.dailyOccupancy}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7DaysData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="members"
                    stroke={colors.darkGreen}
                    fill={colors.lightGreen}
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Booking Status Chart */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-green-200">
            <h3 className="text-lg font-semibold mb-4 text-brown-800 flex items-center">
              <FaClipboardList className="mr-2 text-brown-600" />
              {t.bookingStatus}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Meal Preference Chart */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-brown-200">
            <h3 className="text-lg font-semibold mb-4 text-brown-800 flex items-center">
              <FaUtensils className="mr-2 text-green-600" />
              {t.mealPreferences}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mealData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {mealData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? colors.darkGreen : colors.orange}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-green-200">
            <h3 className="text-lg font-semibold mb-4 text-brown-800">
              {t.recentActivity}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center mb-2">
                  <FaUsers className="mr-2 text-green-600" />
                  <span className="font-semibold text-brown-800">
                    {t.newUsers}
                  </span>
                </div>
                <p className="text-xl font-bold text-green-700">
                  {
                    AllUsers.filter((user) => {
                      const created = new Date(user.createdAt);
                      const now = new Date();
                      return now - created < 7 * 24 * 60 * 60 * 1000;
                    }).length
                  }
                </p>
                <p className="text-sm text-green-600">{t.last7Days}</p>
              </div>

              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                <div className="flex items-center mb-2">
                  <FaClipboardList className="mr-2 text-orange-600" />
                  <span className="font-semibold text-brown-800">
                    {t.newBookings}
                  </span>
                </div>
                <p className="text-xl font-bold text-green-700">
                  {
                    AllBookings.filter((booking) => {
                      const created = new Date(booking.createdAt);
                      const now = new Date();
                      return now - created < 7 * 24 * 60 * 60 * 1000;
                    }).length
                  }
                </p>
                <p className="text-sm text-green-600">{t.last7Days}</p>
              </div>

              <div className="p-4 rounded-lg bg-brown-50 border border-brown-200 col-span-2">
                <div className="flex items-center mb-2">
                  <FaRupeeSign className="mr-2 text-brown-600" />
                  <span className="font-semibold text-brown-800">
                    {t.weeklyRevenue}
                  </span>
                </div>
                <p className="text-xl font-bold text-green-700">
                  ₹
                  {AllBookings.filter((booking) => {
                    const created = new Date(booking.createdAt);
                    const now = new Date();
                    return now - created < 7 * 24 * 60 * 60 * 1000;
                  })
                    .reduce((sum, b) => sum + (b.amount || 0), 0)
                    .toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-green-600">{t.last7Days}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-brown-600">
          <p>
            {t.footer} • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
