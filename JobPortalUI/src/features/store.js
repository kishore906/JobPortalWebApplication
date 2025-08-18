import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { companyApi } from "./api/companyApi";
import { adminApi } from "./api/adminApi";
import { userApi } from "./api/userApi";
import userReducer from "./slice/userSlice";
import jobSearchReducer from "./slice/jobSearchSlice";

const store = configureStore({
  reducer: {
    authResult: userReducer,
    jobSearch: jobSearchReducer,
    [authApi.reducerPath]: authApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      companyApi.middleware,
      adminApi.middleware,
      userApi.middleware,
    ]),
});

export default store;
