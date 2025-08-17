import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { companyApi } from "./api/companyApi";
import userReducer from "./slice/userSlice";

const store = configureStore({
  reducer: {
    authResult: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware, companyApi.middleware]),
});

export default store;
