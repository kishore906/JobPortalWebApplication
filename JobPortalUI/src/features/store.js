import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import userReducer from "./slice/userSlice";

const store = configureStore({
  reducer: {
    authUser: userReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware]),
});

export default store;
