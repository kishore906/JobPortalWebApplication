import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7091/api/Auth",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query(body) {
        return {
          url: "/Register",
          method: "POST",
          body,
        };
      },
    }),
    registerCompany: builder.mutation({
      query(body) {
        return {
          url: "/RegisterRecruiter",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useRegisterMutation, useRegisterCompanyMutation } = authApi;
