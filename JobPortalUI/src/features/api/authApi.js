import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setLogoutUser } from "../slice/userSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://localhost:7091/api/Auth",
  credentials: "include",
});

const baseQueryWithAuthHandling = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized globally
  if (result.error?.status === 401) {
    api.dispatch(setLogoutUser()); // clear Redux auth state
    localStorage.removeItem("user"); // clear localStorage
    window.location.href = "/"; // redirect to home
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ["user"],
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
    login: builder.mutation({
      query(body) {
        return {
          url: "/Login",
          method: "POST",
          body,
        };
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
        // No body needed
      }),
    }),
    updatePassword: builder.mutation({
      query(body) {
        return {
          url: "/UpdatePassword",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateUserProfile: builder.mutation({
      query(body) {
        return {
          url: "/UpdateUserProfile",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateCompanyProfile: builder.mutation({
      query(body) {
        return {
          url: "/UpdateCompanyProfile",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["user"],
    }),
    getProfile: builder.query({
      query: () => "/me",
      providesTags: ["user"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useRegisterCompanyMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdatePasswordMutation,
  useUpdateUserProfileMutation,
  useGetProfileQuery,
  useUpdateCompanyProfileMutation,
} = authApi;
