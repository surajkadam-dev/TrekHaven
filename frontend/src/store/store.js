// store.js
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import userReducer from "./slices/userSlice.js";
import adminReducer from "./slices/adminSlice.js";
import bookSlice from "./slices/bookSlice.js";
import testimonialReducer from "./slices/TestimonialSlice.js";
import refundReducer from "./slices/refundSlice.js";

// ✅ persist only user slice with specific keys
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ['user', 'isAuthenticated'], // persist user object and isAuthenticated
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  admin: adminReducer,
  booking: bookSlice,
  testimonial: testimonialReducer,
  refund: refundReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;