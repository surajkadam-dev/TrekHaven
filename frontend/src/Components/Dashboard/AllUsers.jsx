import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  resetMessage,
  resetLoading,
  resetError,
  resetSlice,
} from "../../store/slices/adminSlice";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiShield,
  FiEye,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Simple debounce utility
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const AllUsers = () => {
  const dispatch = useDispatch();
  const { AllUsers, loading, error, totalUsers, totalPages } = useSelector(
    (state) => state.admin
  );

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

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

  // Debounced search handler
  const handleSearchChange = useMemo(
    () =>
      debounce((value) => {
        setKeyword(value.trim());
        setCurrentPage(1);
      }, 500),
    []
  );

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsFiltersOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getAllUsers(currentPage, limit, keyword));
  }, [dispatch, currentPage, limit, keyword]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 5000,
        style: {
          background: "#FEE2E2",
          color: "#B91C1C",
          border: "1px solid #FECACA",
        },
      });
      dispatch(resetError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetMessage());
      dispatch(resetLoading());
      dispatch(resetError());
      dispatch(resetSlice());
    };
  }, [dispatch]);

  const goToNextPage = () => {
    if (!loading && currentPage < (totalPages || 1)) {
      setCurrentPage((p) => p + 1);
    }
  };

  const goToPrevPage = () => {
    if (!loading && currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  // Filter by role on frontend
  const displayedUsers = useMemo(() => {
    if (!AllUsers) return [];
    let list = [...AllUsers];
    if (roleFilter !== "all") {
      list = list.filter(
        (u) => (u.role || "trekker").toLowerCase() === roleFilter
      );
    }
    return list;
  }, [AllUsers, roleFilter]);

  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("mr-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 mt-[60px] md:mt-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-oliveGreen">
              <FiShield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-800">
            सर्व वापरकर्ते आणि त्यांची माहिती
          </h1>

          <div className="w-24 h-1 mx-auto mt-2 rounded-full bg-oliveGreen"></div>
        </div>

        {/* Filters Section */}
        <div className="mb-6 rounded-xl shadow-md overflow-hidden bg-white border border-gray-200">
          <div className="h-2 bg-oliveGreen"></div>

          {/* Mobile Filter Toggle */}
          {isMobile && (
            <button
              onClick={toggleFilters}
              className="w-full flex items-center justify-between p-4 text-white bg-oliveGreen"
            >
              <span className="flex items-center">
                <FiFilter className="mr-2" />
                Filters{" "}
                {isFiltersOpen ? (
                  <FiChevronUp className="ml-1" />
                ) : (
                  <FiChevronDown className="ml-1" />
                )}
              </span>
              <span>{isFiltersOpen ? "Hide" : "Show"} Filters</span>
            </button>
          )}

          {/* Filters Content */}
          <div
            className={`${
              isMobile && !isFiltersOpen ? "hidden" : "block"
            } p-4 md:p-6`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-oliveGreen" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oliveGreen focus:border-oliveGreen focus:outline-none bg-white text-gray-800"
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-oliveGreen" />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-oliveGreen focus:border-oliveGreen focus:outline-none bg-white text-gray-800"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="trekker">Trekker</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <FiChevronDown className="text-oliveGreen" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl p-4 text-center shadow-md bg-oliveGreen text-white">
            <div className="text-2xl font-bold">{totalUsers || 0}</div>
            <div className="text-sm">Total Users</div>
          </div>
          <div className="rounded-xl p-4 text-center shadow-md bg-[#D4AF37] text-white">
            <div className="text-2xl font-bold">
              {AllUsers?.filter((u) => u.role === "admin").length || 0}
            </div>
            <div className="text-sm">Admins</div>
          </div>
          <div className="rounded-xl p-4 text-center shadow-md bg-green-600 text-white">
            <div className="text-2xl font-bold">
              {AllUsers?.filter((u) => u.role === "trekker").length || 0}
            </div>
            <div className="text-sm">Trekkers</div>
          </div>
          <div className="rounded-xl p-4 text-center shadow-md bg-[#8B0000] text-white">
            <div className="text-2xl font-bold">{displayedUsers.length}</div>
            <div className="text-sm">Filtered</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oliveGreen"></div>
          </div>
        )}

        {/* Users List */}
        {!loading && displayedUsers.length > 0 && (
          <>
            {/* Desktop Table View */}
            {!isMobile && (
              <div className="rounded-xl shadow-md overflow-hidden mb-6 bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="bg-oliveGreen text-white">
                      <th className="p-3 text-left">User</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Role</th>
                      <th className="p-3 text-left">Joined</th>

                      <th className="p-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-oliveGreen text-white">
                              <FiUser />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-600">
                                ID: {user._id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-800">{user.email}</td>
                        <td className="p-3">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-bold capitalize"
                            style={{
                              backgroundColor:
                                user.role === "admin" ? "#9AB973" : "#6B8E23",
                              color: "white",
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 text-gray-800">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => navigate(`/admin/users/${user._id}`)}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-oliveGreen text-white text-sm hover:bg-darkOlive transition-colors"
                          >
                            <FiEye size={14} />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile Card View */}
            {isMobile && (
              <div className="space-y-4 mb-6">
                {displayedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="rounded-xl p-4 shadow-md border border-gray-200 bg-white"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 bg-oliveGreen text-white">
                          <FiUser />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-bold capitalize"
                        style={{
                          backgroundColor:
                            user.role === "admin" ? "#9AB973" : "#6B8E23",
                          color: "white",
                        }}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-700 flex items-center">
                        <FiCalendar className="inline mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                      <div className="text-xs text-gray-600">
                        ID: {user._id.substring(0, 6)}...
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                        className="w-full py-2 rounded-lg bg-oliveGreen text-white text-sm hover:bg-darkOlive transition-colors flex items-center justify-center gap-1"
                      >
                        <FiEye size={14} />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700">
                Showing {displayedUsers.length} of {totalUsers} users
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1 || loading}
                  className="p-2 rounded-lg disabled:opacity-50 flex items-center bg-green-500 text-white hover:bg-darkOlive transition-colors"
                >
                  <FiChevronLeft />
                </button>

                <div className="flex gap-1">
                  {Array.from(
                    { length: Math.min(5, totalPages || 1) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm ${
                            currentPage === pageNum
                              ? "bg-darkOlive text-black font-bold"
                              : "bg-oliveGreen text-black"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  {totalPages > 5 && (
                    <span className="px-2 text-gray-700">...</span>
                  )}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || loading}
                  className="p-2 rounded-lg disabled:opacity-50 flex items-center bg-green-900 text-white hover:bg-darkOlive transition-colors"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </>
        )}

        {/* No Results */}
        {!loading && displayedUsers.length === 0 && (
          <div className="text-center py-12 rounded-xl border border-gray-200 bg-white">
            <div className="text-4xl mb-4">👑</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              No Users Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
