import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const Backend_URL = "https://trekrest.onrender.com/api/v1/admin";
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    accommodation: {},
    AllUsers: [],
    AllBookings: [], // ✅ new state
    error: null,
    loading: false,
    message: null,
    AllRefundRequests: [], 
    // Pagination info
    totalUsers: 0,
    totalBookings: 0, // ✅ new
    totalRefundRequests: 0,
    totalPages: 0,
    page: 1,
    bookedMembersByDate:0
  },
  reducers: {
    successForAccommodation(state, action) {
      state.accommodation = action.payload;
    },

    // --- Users ---
    getAllUserRequest(state) {
      state.loading = true;
    },
    getAllUserSuccess(state, action) {
      state.loading = false;
      state.AllUsers = action.payload.users;
      state.totalUsers = action.payload.totalUsers;
      state.totalPages = action.payload.totalPages;
      state.page = action.payload.page;
    },
    getAllUserFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    getBookingByDateRequest(state)
    {
     state.loading=true;
     state.error=null;
     state.message=null;


    },
    getBookingByDateSuccess(state,action)
    {
      state.loading=false;
      state.error=null;
  state.bookedMembersByDate=action.payload.totalBooked
    },
    getBookingByDateFail(state,action)
    {
      state.loading=false;
      state.error=action.payload
    },

    // --- Bookings ---
    getAllBookingRequest(state) {
      state.loading = true;
    },
    getAllBookingSuccess(state, action) {
      state.loading = false;
      state.AllBookings = action.payload.bookings;
      state.totalBookings = action.payload.totalRecords;
      state.totalPages = action.payload.totalPages;
      state.page = action.payload.currentPage;
    },
    getAllBookingFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updatePaymentStatusRequest(state) {
      state.loading = true;
    },
    updatePaymentStatusSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updatePaymentStatusFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    updateAccommodationStart(state,action)
    {
       state.loading=true;
       state.message=null;
      
    },
    updateAccommodationSuccess(state, action) {
      state.loading = false;
      state.message = action.payload?.message;
    },
    updateAccommodationFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

     // --- Refund Requests ---
    getAllRefundRequestStart(state) {            // ✅ new
      state.loading = true;
    },
    getAllRefundRequestSuccess(state, action) {  // ✅ new
      state.loading = false;
      state.AllRefundRequests = action.payload.data;
      state.totalRefundRequests = action.payload.total;
      state.totalPages = action.payload.pages;
      state.page = action.payload.page;
    },
    getAllRefundRequestFailure(state, action) {  // ✅ new
      state.loading = false;
      state.error = action.payload;
    },

    // --- Resetters ---
    resetMessage(state) {
      state.message = null;
    },
    resetError(state) {
      state.error = null;
    },
    resetLoading(state) {
      state.loading = false;
    },
    resetSlice(state) {
      console.log("Resetting admin slice to initial state");
      state.accommodation = {};
      state.AllUsers = [];
      state.AllBookings = [];
      state.AllRefundRequests=[];

      state.error = null;
      state.loading = false;
      state.message = null;
      state.totalUsers = 0;
      state.totalBookings = 0;
      state.totalRefundRequests=0;
      state.totalPages = 0;
      state.page = 1;
    },
  },
});

export const {
  successForAccommodation,
  getAllUserRequest,
  getAllUserSuccess,
  getAllUserFailure,
  getAllBookingRequest,
  getAllBookingSuccess,
  getAllBookingFailure,
  updatePaymentStatusRequest,
  updatePaymentStatusSuccess,
  updatePaymentStatusFailure,
  updateAccommodationStart,
  updateAccommodationSuccess,
  updateAccommodationFailure,
  getAllRefundRequestStart,           // ✅
  getAllRefundRequestSuccess,         // ✅
  getAllRefundRequestFailure,
  getBookingByDateRequest,
  getBookingByDateSuccess,
  getBookingByDateFail, 
  resetMessage,
  resetError,
  resetLoading,
  resetSlice
} = adminSlice.actions;

// --- Accommodation fetch ---
export const getAccommodation = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${Backend_URL}/accommodation`,
      {
        headers:{
          "Content-Type":"application/json"
        },
        
      }
    );
    
    dispatch(successForAccommodation(data.data[0]));
  
  } catch (error) {
    console.log(error);
  }
};

// --- Get All Users with Pagination + Search ---
export const getAllUsers =
  (page = 1, limit = 10, keyword = "") =>
  async (dispatch) => {
    try {
      dispatch(getAllUserRequest());

      const { data } = await axios.get(
        `${Backend_URL}/users?page=${page}&limit=${limit}&keyword=${keyword}`,
        { withCredentials: true }
      );

      dispatch(getAllUserSuccess(data));
    } catch (error) {
      dispatch(
        getAllUserFailure(
          error.response?.data?.message || "Failed to fetch users"
        )
      );
    }
  };

// --- Get All Bookings with Pagination + Search + Filter by Group ---
export const getAllBookings =
  (page = 1, limit = 10, keyword = "", groupName = "", status = "", paymentMode = "", mealType = "") =>
  async (dispatch) => {
    try {
      dispatch(getAllBookingRequest());

      const { data } = await axios.get(
        `${Backend_URL}/All-bookings?page=${page}&limit=${limit}&keyword=${keyword}&groupName=${groupName}&status=${status}&paymentMode=${paymentMode}&mealType=${mealType}`,
        { withCredentials: true }
      );

      dispatch(getAllBookingSuccess(data));
    } catch (error) {
      dispatch(
        getAllBookingFailure(
          error.response?.data?.message || "Failed to fetch bookings"
        )
      );
    }
  };

  // --- Update Payment Status ---
  export const updatePaymentStatus =
    ({id, paymentStatus}) => async (dispatch) => {
      console.log(id, paymentStatus);
      try {
        dispatch(updatePaymentStatusRequest());

        const { data } = await axios.put(
          `${Backend_URL}/${id}/paymentsatus-update`,
          { paymentStatus },
          {
            headers: {
              "Content-Type": "application/json"
            },
            withCredentials: true
          }
        );

        dispatch(updatePaymentStatusSuccess(data));
      } catch (error) {
        console.log(error)
        const err = error.response?.data?.error || "Failed to update payment status";

        console.log(err);
        dispatch(
          updatePaymentStatusFailure(
            err
          )
        );
      }
    };
export const updateAccommodation =
  ({ id, updateData }) =>
  async (dispatch) => {
    console.log("Updating Accommodation:", id, updateData);
    try {
      dispatch(updateAccommodationStart());

      if (!id) return dispatch(updateAccommodationFailure("Accommodation id is required."));
      if (!updateData || Object.keys(updateData).length === 0)
        return dispatch(updateAccommodationFailure("At least one field must be provided to update."));

      const { data } = await axios.put(
        `${Backend_URL}/accommodation/${id}`,
        updateData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Inform reducers of success (but do NOT trigger getAccommodation here)
      dispatch(updateAccommodationSuccess(data));

      // If the API returned the updated object under a known key, update state.accommodation
      // (We also dispatch successForAccommodation so any UI relying on that slice updates)
      const updated =
        data?.data || data?.accommodation || data?.updatedAccommodation || null;
      if (updated) {
        dispatch(successForAccommodation(updated));
      }

      // Return the response in case the caller (component) wants to do additional work
      return data;
    } catch (error) {
      const err =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update accommodation";
      dispatch(updateAccommodationFailure(err));
      throw err; // rethrow optional — helpful if caller wants to await and react
    }
  };

  export const getAllRefundRequests =
  ({page = 1, limit = 10, status = "", method = "", email = "",name=""}) =>
  async (dispatch) => {

   // console.log(status);
    try {
      dispatch(getAllRefundRequestStart());

      const { data } = await axios.get(
        `${Backend_URL}/all-refunds?page=${page}&limit=${limit}&status=${status}&method=${method}&email=${email}&name=${name}`,
        { withCredentials: true }
      );

      dispatch(getAllRefundRequestSuccess(data));
    } catch (error) {
      dispatch(
        getAllRefundRequestFailure(
          error.response?.data?.message || "Failed to fetch refund requests"
        )
      );
    }
  };


  export const getBookingsByDate=({stayDate})=>async(dispatch)=>
  {
try {
  dispatch(getBookingByDateRequest());
  const {data}=await axios.get(`${Backend_URL}/booked-members?stayDate=${stayDate}`,{
    headers:{"Content-Type":"application/json"},
    withCredentials:true
  })
  dispatch(getBookingByDateSuccess(data))
} catch (error) {
  const err=error?.response?.data?.error || error.message || "something wrong";
  dispatch(getBookingByDateFail(err))
  console.log("error: ",error)
}
  }

export default adminSlice.reducer;
