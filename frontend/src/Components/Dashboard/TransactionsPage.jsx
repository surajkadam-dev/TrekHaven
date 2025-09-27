import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaFilter,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaReceipt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    from: "",
    to: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0,
  });
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  // Color theme
  const colors = {
    olive: "#556B2F",
    oliveLight: "#6B8E23",
    oliveLighter: "#8FBC8F",
    beige: "#F5F5DC",
    beigeDark: "#E8E4C9",
    white: "#FFFFFF",
    textDark: "#2D2D2D",
    textLight: "#6B7280",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    pending: "#F59E0B",
  };

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://trekrest.onrender.com/api/v1/payments/transactions?page=${currentPage}&limit=${itemsPerPage}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
            params: { status: filters.status },
          }
        );
        console.log(response);

        if (response.data.success) {
          const transactionsData = response.data.payments;
          setAllTransactions(transactionsData);
          setTransactions(transactionsData);
          setTotalPages(Math.ceil(response.data.total / itemsPerPage));

          // Calculate stats
          const totalAmount = transactionsData.reduce((sum, transaction) => {
            return sum + (transaction.amount || 0);
          }, 0);

          const completed = transactionsData.filter(
            (t) => t.status === "paid"
          ).length;
          const pending = transactionsData.filter(
            (t) => t.status === "pending"
          ).length;
          const failed = transactionsData.filter(
            (t) => t.status === "failed"
          ).length;

          setStats({
            total: response.data.total,
            paid: completed,
            pending,
            failed,
            totalAmount,
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filters.status, currentPage, itemsPerPage]);

  // Apply filters and search
  useEffect(() => {
    let filteredTransactions = [...allTransactions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredTransactions = filteredTransactions.filter(
        (transaction) =>
          transaction.razorpayPaymentId?.toLowerCase().includes(searchLower) ||
          transaction.razorpayOrderId?.toLowerCase().includes(searchLower) ||
          transaction.method?.toLowerCase().includes(searchLower) ||
          transaction.amount?.toString().includes(searchTerm)
      );
    }

    // Apply date filter only if both dates are provided
    if (filters.from && filters.to) {
      const fromDate = new Date(filters.from);
      const toDate = new Date(filters.to);
      toDate.setHours(23, 59, 59, 999); // Include the entire end date

      filteredTransactions = filteredTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        return transactionDate >= fromDate && transactionDate <= toDate;
      });
    }

    setTransactions(filteredTransactions);

    // Update stats based on filtered transactions
    const totalAmount = filteredTransactions.reduce((sum, transaction) => {
      return sum + (transaction.amount || 0);
    }, 0);

    const completed = filteredTransactions.filter(
      (t) => t.status === "paid"
    ).length;
    const pending = filteredTransactions.filter(
      (t) => t.status === "pending"
    ).length;
    const failed = filteredTransactions.filter(
      (t) => t.status === "failed"
    ).length;

    setStats((prev) => ({
      ...prev,
      paid: completed,
      pending,
      failed,
      totalAmount,
    }));
  }, [searchTerm, filters.from, filters.to, allTransactions]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      from: "",
      to: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const toggleExpandTransaction = (id) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null);
    } else {
      setExpandedTransaction(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <FaCheckCircle className="text-green-500" />;
      case "failed":
        return <FaTimesCircle className="text-red-500" />;
      case "pending":
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-700 bg-green-100";
      case "failed":
        return "text-red-700 bg-red-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.beige }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.olive }}
          ></div>
          <p style={{ color: colors.olive }}>Loading your transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.beige }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-100">
            <FaTimesCircle className="text-2xl text-red-500" />
          </div>
          <p
            className="text-lg font-medium mb-2"
            style={{ color: colors.textDark }}
          >
            Error Loading Transactions
          </p>
          <p className="mb-4" style={{ color: colors.textLight }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: colors.olive }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-2 mt-[60px] md:mt-0"
      style={{ backgroundColor: colors.beige }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: colors.olive }}
        >
          Your Transactions
        </motion.h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.textLight }}
                >
                  Total Transactions
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: colors.textDark }}
                >
                  {stats.total}
                </p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: `${colors.olive}20` }}
              >
                <FaReceipt
                  className="text-xl"
                  style={{ color: colors.olive }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.textLight }}
                >
                  Completed
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: colors.success }}
                >
                  {stats.paid || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <FaCheckCircle className="text-xl text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.textLight }}
                >
                  Pending
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: colors.warning }}
                >
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <FaClock className="text-xl text-yellow-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.textLight }}
                >
                  Failed
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: colors.error }}
                >
                  {stats.failed}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <FaTimesCircle className="text-xl text-red-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.textLight }}
                >
                  Total Amount
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: colors.textDark }}
                >
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: `${colors.olive}20` }}
              >
                <FaMoneyBillWave
                  className="text-xl"
                  style={{ color: colors.olive }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by transaction ID, order ID, method, or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                style={{ focusRingColor: colors.olive }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center">
                <div className="pr-2">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:outline-none"
                  style={{ focusRingColor: colors.olive }}
                >
                  <option value="">All Statuses</option>
                  <option value="paid">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:flex md:items-center">
                <div className="pr-2">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:outline-none"
                  style={{ focusRingColor: colors.olive }}
                  placeholder="From"
                />
                <span className="px-2">to</span>
                <input
                  type="date"
                  name="to"
                  value={filters.to}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:outline-none"
                  style={{ focusRingColor: colors.olive }}
                  placeholder="To"
                />
              </div>

              {(filters.status || filters.from || filters.to || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center px-3 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: colors.oliveLight }}
                >
                  <FaTimes className="mr-1" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
        >
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{ backgroundColor: colors.olive }}
                  className="text-white"
                >
                  <th className="px-6 py-4 text-left">Transaction ID</th>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Method</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <FaReceipt className="text-4xl mb-2 text-gray-400" />
                        <p className="text-gray-500">No transactions found</p>
                        {(filters.status ||
                          filters.from ||
                          filters.to ||
                          searchTerm) && (
                          <button
                            onClick={clearFilters}
                            className="mt-2 px-3 py-1 rounded text-sm"
                            style={{
                              backgroundColor: colors.olive,
                              color: "white",
                            }}
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <React.Fragment key={transaction._id}>
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="mr-2">
                              <FaReceipt className="text-gray-400" />
                            </div>
                            <span className="font-medium text-sm">
                              {transaction.razorpayPaymentId || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm">
                            {transaction.razorpayOrderId || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm">
                            {formatDateTime(transaction.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize text-sm">
                            {transaction.method || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              toggleExpandTransaction(transaction._id)
                            }
                            className="flex items-center text-sm font-medium"
                            style={{ color: colors.olive }}
                          >
                            {expandedTransaction === transaction._id ? (
                              <>
                                <span>Less details</span>
                                <FaChevronUp className="ml-1" />
                              </>
                            ) : (
                              <>
                                <span>More details</span>
                                <FaChevronDown className="ml-1" />
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedTransaction === transaction._id && (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4
                                  className="font-medium mb-2"
                                  style={{ color: colors.olive }}
                                >
                                  Transaction Details
                                </h4>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="font-medium">
                                      Transaction ID:
                                    </span>{" "}
                                    {transaction._id}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Razorpay Payment ID:
                                    </span>{" "}
                                    {transaction.razorpayPaymentId || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Razorpay Order ID:
                                    </span>{" "}
                                    {transaction.razorpayOrderId || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-medium">Method:</span>{" "}
                                    {transaction.method || "N/A"}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4
                                  className="font-medium mb-2"
                                  style={{ color: colors.olive }}
                                >
                                  Payment Details
                                </h4>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="font-medium">Amount:</span>{" "}
                                    {formatCurrency(transaction.amount)}
                                  </p>
                                  <p>
                                    <span className="font-medium">Status:</span>
                                    <span
                                      className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(
                                        transaction.status
                                      )}`}
                                    >
                                      {transaction.status}
                                    </span>
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Created:
                                    </span>{" "}
                                    {formatDateTime(transaction.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {transactions.length === 0 ? (
              <div className="p-8 text-center">
                <FaReceipt className="text-4xl mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">No transactions found</p>
                {(filters.status ||
                  filters.from ||
                  filters.to ||
                  searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 px-3 py-1 rounded text-sm"
                    style={{ backgroundColor: colors.olive, color: "white" }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="mr-2">
                            <FaReceipt className="text-gray-400" />
                          </div>
                          <span
                            className="font-medium text-sm"
                            style={{ color: colors.olive }}
                          >
                            ID:{" "}
                            {transaction.razorpayPaymentId
                              ? transaction.razorpayPaymentId.slice(-8)
                              : "N/A"}
                          </span>
                        </div>
                        <h3 className="font-medium">
                          {formatCurrency(transaction.amount)}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(transaction.createdAt)}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 capitalize">
                          {transaction.method}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        {transaction.razorpayOrderId
                          ? `Order: ${transaction.razorpayOrderId.slice(-8)}`
                          : "No Order ID"}
                      </p>
                      <button
                        onClick={() => toggleExpandTransaction(transaction._id)}
                        className="flex items-center text-sm font-medium"
                        style={{ color: colors.olive }}
                      >
                        {expandedTransaction === transaction._id ? (
                          <>
                            <span>Less</span>
                            <FaChevronUp className="ml-1" />
                          </>
                        ) : (
                          <>
                            <span>More</span>
                            <FaChevronDown className="ml-1" />
                          </>
                        )}
                      </button>
                    </div>

                    {expandedTransaction === transaction._id && (
                      <div className="mt-4 p-3 rounded-lg bg-gray-50">
                        <h4
                          className="font-medium mb-2"
                          style={{ color: colors.olive }}
                        >
                          Transaction Details
                        </h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Transaction ID</p>
                            <p className="truncate">{transaction._id}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Payment ID</p>
                            <p>{transaction.razorpayPaymentId || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Order ID</p>
                            <p>{transaction.razorpayOrderId || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Method</p>
                            <p className="capitalize">
                              {transaction.method || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p>{formatDateTime(transaction.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination - Only for status filter since date/search is client-side */}
          {allTransactions.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{transactions.length}</span> of{" "}
                  <span className="font-medium">{allTransactions.length}</span>{" "}
                  transactions
                  {(filters.from || filters.to || searchTerm) && " (filtered)"}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50"
                  style={{ color: colors.olive }}
                >
                  Previous
                </button>
                <span className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50"
                  style={{ color: colors.olive }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TransactionsPage;
