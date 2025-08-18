import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { companyApi } from "./api/companyApi";
import { adminApi } from "./api/adminApi";
import userReducer from "./slice/userSlice";

const store = configureStore({
  reducer: {
    authResult: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      companyApi.middleware,
      adminApi.middleware,
    ]),
});

export default store;
