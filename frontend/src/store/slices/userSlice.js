import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
//https://trekrest.onrender.com

const Backend_URL = "https://trekrest.onrender.com/api/v1/user";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: {}, 
    error: null,
    message: null,
    isAuthenticated: false,
    isUpdated:false
  },
  reducers: {
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    registerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.error = null;
    },
loginFail: (state, action) => {
  state.loading = false;
  if (state.error !== action.payload) {
    state.error = action.payload;
  }
},

    logoutRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.message = "Logout successful";
    },
    logoutFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    fetchUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updatePasswordRequest: (state) => {
      state.loading = true;

    },
    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.isUpdated = true;
    
      state.message = action.payload.message;
    },

    updatePasswordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.message = action.payload.message;
      state.user = action.payload.user;
    },
    updateProfileFail: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    googleAuthRequest: (state) => { state.loading = true; state.error = null; state.message = null; },
    googleAuthSuccess: (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; state.message = action.payload.message; },
    googleAuthFail: (state, action) => { state.loading = false; state.error = action.payload; },

    googleRegisterStart:(state)=>{
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    googleRegisterSuccess:(state,action)=>{
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    googleRegisterFail:(state,action)=>{
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    resetLoading: (state) => {
      state.loading = false;
    },
    resetMessage:(state)=>
    {
      state.message=null;
    }
    ,
    clearErrors: (state) => {
      state.error = null;
    },
   
  }
});

export const {
  registerRequest,
  registerSuccess,
  registerFail,
  loginRequest,
  loginSuccess,
  loginFail,
  logoutRequest,
  logoutSuccess,
  logoutFail,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFail,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  googleAuthRequest,
  googleAuthSuccess,
  googleAuthFail,
  googleRegisterStart,
  googleRegisterSuccess,
  googleRegisterFail,
  clearErrors,
  resetLoading,
  resetMessage,
 
} = userSlice.actions;

export const registerUser = (userdata) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const { data } = await axios.post(`${Backend_URL}/register`, userdata, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(registerSuccess(data));
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Something went wrong";
    dispatch(registerFail(message));
  }
};

export const loginUser = (userdata) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(`${Backend_URL}/login`, userdata, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(loginSuccess(data));
    console.log(data);  
  } catch (error) {
    console.log(error)
    const err = error.response?.data?.error || error.message || "Something went wrong";
    dispatch(loginFail(err));
  }
};

export const logoutUser = () => async (dispatch) => {
  try { 
    dispatch(logoutRequest());
    await axios.post(`${Backend_URL}/logout`, {}, {
      withCredentials: true
    });
    dispatch(logoutSuccess());
  } catch (error) {
    console.log(error);
    const err = error.response?.data?.error || error.message || "Something went wrong";
    console.log(err);
    dispatch(logoutFail(err));
  }
};


export const updatePassword = (passwordData) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());
    const { data } = await axios.put(`${Backend_URL}/update-password`, passwordData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    console.log(data)
    dispatch(updatePasswordSuccess(data));
  } catch (error) {
    console.log(error)
    const err = error.response?.data?.error || error.message || "Something went wrong";
    dispatch(updatePasswordFail(err));
  }
};

export const loginWithGoogle = (idToken, role) => async (dispatch) => {
  try {
    dispatch(googleAuthRequest());
    const { data } = await axios.post(`${Backend_URL}/auth/google`, { idToken, role }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" }
    });
    dispatch(googleAuthSuccess(data));
  } catch (error) {
    console.log(error)
    const err = error.response?.data?.error || error.message || "Something went wrong";
    console.log(err);
    dispatch(googleAuthFail(err));
  }
};

export const clearAllErrors = () => (dispatch) => {
  dispatch(clearErrors());
};
export const updateProfile = (profileData) => async (dispatch) => {
  try {
    dispatch(updateProfileRequest());
    const { data } = await axios.put(
      `${Backend_URL}/update-profile`,
      profileData,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
  console.log(data);
    if (!data.success) {
      // handle backend "error" properly
      dispatch(updateProfileFail({ error: data.error }));
    } else {
      dispatch(updateProfileSuccess(data));
    }
  } catch (error) {
    const err = error.response?.data?.error || error.message || "Something went wrong";
    dispatch(updateProfileFail({ error: err }));
  }
};

export const googleRegister = (idToken) => async (dispatch) => {
  try {
    dispatch(googleRegisterStart());
    const { data } = await axios.post(`${Backend_URL}/auth/google/register`, { idToken}, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" }
    });
    dispatch(googleRegisterSuccess(data));
  } catch (error) {
    const err = error.response?.data?.error || error.message || "Something went wrong";
    console.log(err);
    dispatch(googleRegisterFail(err));
  }
};

export default userSlice.reducer;