import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://trekrest.onrender.com/api/v1/refund";

const refundSlice = createSlice({
  name: "refund",
  initialState: {
    refundRequests: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Define your reducers here
    fetchRefundRequestsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRefundRequestsSuccess(state, action) {
      state.loading = false;
      state.refundRequests = action.payload;
      state.error = null;
    },
    fetchRefundRequestsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

        deleteRefundRequestStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteRefundRequestSuccess(state, action) {
      state.loading = false;
      state.error = null;
      // remove from state
      state.refundRequests = state.refundRequests.filter(
        (refund) => refund._id !== action.payload
      );
    },
    deleteRefundRequestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    resetRefundSlice(state) {
      state.refundRequests = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchRefundRequestsStart,
  fetchRefundRequestsSuccess,
  fetchRefundRequestsFailure,
  deleteRefundRequestStart,
  deleteRefundRequestSuccess,
  deleteRefundRequestFailure,
  resetRefundSlice
} = refundSlice.actions;


export const fetchRefundRequests = () => async (dispatch) => {
  dispatch(fetchRefundRequestsStart());
  try {
    const { data } = await axios.get(`${API_BASE}/my-refunds`, {
      withCredentials: true, // if auth cookie is used
    });
    dispatch(fetchRefundRequestsSuccess(data.refundRequests));
  } catch (error) {
    dispatch(fetchRefundRequestsFailure(
      error.response?.data?.message || error.message || "Failed to fetch refund requests"
    ));
  }
};

export const deleteRefundRequest = (id) => async (dispatch) => {
  dispatch(deleteRefundRequestStart());
  try {
    await axios.delete(`${API_BASE}/my-refunds/${id}`, {
      withCredentials: true,
    });
    dispatch(deleteRefundRequestSuccess(id));
  } catch (error) {
    dispatch(
      deleteRefundRequestFailure(
        error.response?.data?.message || error.message || "Failed to delete refund request"
      )
    );
  }
};


export default refundSlice.reducer;