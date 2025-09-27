// src/store/slices/bookSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://trekrest.onrender.com/api/v1/booking";

const initialState = {
  bookings: [],
  loading: false,
  error: null,
  message: null,
  singleBooking: {},
  myBooking: [],
  lastBooking: null, // holds latest backend payload (razorpayOrder / booking / etc.)
};

const bookSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    createBookingStart(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    createBookingSuccess(state, action) {
      state.loading = false;
      //state.message = action.payload?.message || "Booking created";
      state.error = null;
      state.lastBooking = action.payload || null; // store full payload for UI
    },
    createBookingFailure(state, action) {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    },

    getMyBookingsStart(state) {
      state.loading = true;
      state.error = null;
    },
    getMyBookingsSuccess(state, action) {
      state.loading = false;
      state.myBooking = action.payload || [];
      state.error = null;
    },
    getMyBookingsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    cancelBookingStart(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    cancelBookingSuccess(state, action) {
      state.loading = false;
      state.message = action.payload?.message;
      state.error = null;
    },
    cancelBookingFailure(state, action) {
      state.loading = false;
      state.error = action.payload|| "Cancel failed";
      state.message = null;
    },

    deleteUserBookingStart(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteUserBookingSuccess(state, action) {
      state.loading = false;
      state.message = action.payload?.message || "Booking deleted";
      state.error = null;
    },
    deleteUserBookingFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    verifyPaymentStart(state) {
      state.loading = true;
      state.error = null;
    },
    verifyPaymentSuccess(state, action) {
      state.loading = false;
      state.message = action.payload?.message || "Payment verified";
      state.error = null;
      // optionally set lastBooking to booking returned by verification
      if (action.payload?.booking) state.lastBooking = action.payload.booking;
    },
    verifyPaymentFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    clearAllBookingErrors(state) {
      state.error = null;
      state.message = null;
    },

    resetSlice(state) {
      Object.assign(state, initialState);

    },
  },
});

export const {
  createBookingStart,
  createBookingSuccess,
  createBookingFailure,
  getMyBookingsStart,
  getMyBookingsSuccess,
  getMyBookingsFailure,
  cancelBookingStart,
  cancelBookingSuccess,
  cancelBookingFailure,
  deleteUserBookingStart,
  deleteUserBookingSuccess,
  deleteUserBookingFailure,
  verifyPaymentStart,
  verifyPaymentSuccess,
  verifyPaymentFailure,
  clearAllBookingErrors,
  resetSlice,
} = bookSlice.actions;

// Thunks (return data so UI can use result.payload)
export const createBooking = ({ bookingData, accommodationId }) => async (dispatch) => {
  dispatch(createBookingStart());
  try {
    const response = await axios.post(
      `${API_BASE}/${accommodationId}`,
      bookingData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    // response.data should be the full backend payload (see CheckoutPage expectations)
    const payload = response.data || {};
    dispatch(createBookingSuccess(payload));

    // return object with payload so CheckoutPage can use result.payload
    return { payload };
  } catch (error) {
    console.log(error); 
    // normalize message
    const msg = error.response?.data?.error || error.response?.data?.error || error.message || "Booking failed";
    dispatch(createBookingFailure(msg));

    // return error so caller can inspect (CheckoutPage expects result.payload, so we return an object)
    return { error: msg };
  }
};

export const getMyBookings = () => async (dispatch) => {
  dispatch(getMyBookingsStart());
  try {
    const response = await axios.get(`${API_BASE}/my-bookings`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    const bookings = response.data?.bookings || [];
    dispatch(getMyBookingsSuccess(bookings));
    return { payload: bookings };
  } catch (error) {
    const msg = error.response?.data?.message || error.message || "Fetch failed";
    dispatch(getMyBookingsFailure(msg));
    return { error: msg };
  }
};

export const cancelBooking = ({ id, reason }) => async (dispatch) => {
  dispatch(cancelBookingStart());
  try {
    const response = await axios.put(
      `${API_BASE}/cancel-booking/${id}`,
      { reason },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    console.log("Cancel Booking Response:", response); 
    const payload = response.data || {};
    dispatch(cancelBookingSuccess(payload));
    return { payload };
  } catch (error) {
    const msg = error.response?.data?.message || error.message || "Cancel failed";
    console.log("Error:", msg);
    console.log("Cancel Booking Error:", error);
    dispatch(cancelBookingFailure(msg));
    return { error: msg };
  }
};

export const deleteUserBooking = (id) => async (dispatch) => {
  dispatch(deleteUserBookingStart());
  try {
    const response = await axios.put(
      `${API_BASE}/delete-booking/${id}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    console.log("Delete Booking Response:", response);
    const payload = response.data || {};
    dispatch(deleteUserBookingSuccess(payload));
    return { payload };
  } catch (error) {
    const msg = error.response?.data?.message || error.message || "Delete failed";
    console.log("Error:", msg);
    dispatch(deleteUserBookingFailure(msg));
    return { error: msg };
  }
};


export const verifyPayment = ({ razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingId }) => async (dispatch) => {
  dispatch(verifyPaymentStart());
  try {
    const body = { razorpay_payment_id, razorpay_order_id, razorpay_signature };
    if (bookingId) body.bookingId = bookingId;

    const response = await axios.post(`${API_BASE}/verify-payment`, body, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    const payload = response.data || {};
    dispatch(verifyPaymentSuccess(payload));
    return { payload };
  } catch (error) {
    const msg = error.response?.data?.message || error.message || "Verification failed";
    dispatch(verifyPaymentFailure(msg));
    return { error: msg };
  }
};

export default bookSlice.reducer;
