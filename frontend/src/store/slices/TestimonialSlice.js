import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Backend_URL = "https://trekrest.onrender.com/api/v1/testimonial";

const testimonialSlice = createSlice({
  name: "testimonial",
initialState: {
  testimonials: [],
  myTestimonials: [],
  loading: false,
  error: null,
  message: null,
  // Pagination info
  totalReviews: 0,
  totalPages: 0,
  page: 1,
  limit: 10, // default reviews per page
},
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.message = action.payload?.message || "Success";
    },
    requestFailure(state, action) {
      state.loading = false;
      state.error = action.payload?.error || action.payload?.message || "Request failed";
    },

    // CRUD reducers
setTestimonials(state, action) {
  state.testimonials = action.payload. testimonials || [];
  state.totalReviews = action.payload.
totalRecords || 0;
  state.totalPages = action.payload.totalPages|| 0;
  state.page = action.payload.
currentPage || 1;
  state.loading = false;
  state.message = action.payload.message || "Fetched testimonials";
},

    addTestimonialSuccess(state, action) {
      state.loading = false;
      const testimonialData = action.payload.testimonial || action.payload;
      state.testimonials.push(testimonialData);
      state.message = action.payload.message || "Testimonial added successfully";
    },
    deleteTestimonialSuccess(state, action) {
      state.loading = false;
      state.testimonials = state.testimonials.filter(
        (t) => t._id !== action.payload
      );
      state.message = "Testimonial deleted successfully";
    },
    setMyTestimonials(state, action) {
      state.myTestimonials = action.payload.data || [];
      state.totalReviews = action.payload.meta?.total || 0;
      state.totalPages = action.payload.meta?.pages || 0;
      state.page = action.payload.meta?.page || 1;
      state.loading = false;
      
    },

    resetTestimonialState(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.myTestimonials = [];
      state.testimonials = [];
      state.totalReviews = 0;
      state.totalPages = 0;
      state.page = 1;

    },
  },
});

export const {
  requestStart,
  requestSuccess,
  requestFailure,
  setTestimonials,
  addTestimonialSuccess,
  deleteTestimonialSuccess,
  setMyTestimonials,
  resetTestimonialState,
} = testimonialSlice.actions;

export default testimonialSlice.reducer;

//
// ---------- Thunks ----------
//

// Add testimonial
export const submitTestimonial = (testimonialData) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await axios.post(`${Backend_URL}/add-testimonial`, testimonialData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch(addTestimonialSuccess(data));
  } catch (error) {
    dispatch(requestFailure(error.response?.data || error.message));
  }
};


// Get all testimonials (public: only approved shown by backend)
export const fetchTestimonials = (page = 1, limit = 10, status="",keyword="") => async (dispatch) => {
  console.log(status);
  dispatch(requestStart());
  try {
    const { data } = await axios.get(`${Backend_URL}/all-reviews?page=${page}&limit=${limit}&keyword=${keyword}&status=${status}`, {
      withCredentials: true,
    });
    console.log(data);
    dispatch(setTestimonials(data)); // backend should return { reviews, total, pages, page }
    dispatch(requestSuccess({ message: "Fetched testimonials" }));
  } catch (error) {
    dispatch(requestFailure(error.response?.data || error.message));
  }
};


export const fetchMyTestimonials =
  (page = 1, limit = 10) =>
  async (dispatch) => {
    dispatch(requestStart());
    try {
      const { data } = await axios.get(
        `${Backend_URL}/my-reviews?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      dispatch(setMyTestimonials(data));
     
    } catch (error) {
      dispatch(requestFailure(error.response?.data || error.message));
    }
  };

// Delete testimonial (owner or admin)
export const deleteTestimonial = ({reviewId}) => async (dispatch) => {
  dispatch(requestStart());
  try {
    await axios.delete(`${Backend_URL}/delete-review/${reviewId}`, { withCredentials: true });
    dispatch(deleteTestimonialSuccess(reviewId));
  } catch (error) {
    dispatch(requestFailure(error.response?.data || error.message));
  }
};

// Admin: update review status
export const updateReviewStatus = ({reviewId, status}) => async (dispatch) => {
  console.log("updateReviewStatus called with:", reviewId, status);
  dispatch(requestStart());
  try {
    const { data } = await axios.put(
      `${Backend_URL}/update-review-status/${reviewId}`,
      { status },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    dispatch(requestSuccess({ message: data.message }));
    // Optionally refresh testimonials list
  } catch (error) {
    dispatch(requestFailure(error.response?.data || error.message));
    console.error("updateReviewStatus error:", error);
  }
};
