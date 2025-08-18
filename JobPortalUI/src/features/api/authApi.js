import { createApi } from "@reduxjs/toolkit/query/react";
import { setLoginUser } from "../slice/userSlice";
import { createBaseQuery } from "./baseQueryWithAuthHandling";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: createBaseQuery("api/Auth"), // custom baseUrl
  tagTypes: ["user"], // allows cache invalidation/refetch for "user"
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
    getProfile: builder.query({
      query: () => "/me",
      providesTags: ["user"], // cache tagged as "User" for easy invalidation
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
      query(updatedFields) {
        return {
          url: "/UpdateUserProfile",
          method: "PUT",
          body: updatedFields, // sending updated profile data
        };
      },
      // runs before mutation(optimistic updates go here) is sent to server
      async onQueryStarted(updatedFields, { dispatch, queryFulfilled }) {
        // wait for API response
        await queryFulfilled;

        // Manually refetch the getProfile query to get updated user
        const updatedUser = await dispatch(
          authApi.endpoints.getProfile.initiate()
        ).unwrap();

        // update RTK Query cache for getProfile (use this if you are not refetching 'getProfile' like above)
        // dispatch(
        //   authApi.util.updateQueryData("getProfile", undefined, (draft) => {
        //     Object.assign(draft, updatedUser); // merge new fields into cached
        //   })
        // );

        // Update localstorage copy of user
        const updatedUserDataInLocalStorage = {
          id: updatedUser.id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          profileImage: updatedUser.profileImagePath,
          role: updatedUser.role,
        };
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUserDataInLocalStorage)
        );

        // updating user login state in userSlice
        dispatch(setLoginUser(updatedUserDataInLocalStorage));
      },

      invalidatesTags: ["user"], // refetch getMe after mutation
    }),
    updateCompanyProfile: builder.mutation({
      query(updatedFields) {
        return {
          url: "/UpdateCompanyProfile",
          method: "PUT",
          body: updatedFields,
        };
      },
      async onQueryStarted(updatedFields, { dispatch, queryFulfilled }) {
        // waiting for API response
        await queryFulfilled;

        // refetch getProfile
        const updatedCompanyUser = await dispatch(
          authApi.endpoints.getProfile.initiate()
        ).unwrap();

        // update localstorage "user"
        const updatedUserDataInLocalStorage = {
          id: updatedCompanyUser.id,
          fullName: updatedCompanyUser.companyName,
          email: updatedCompanyUser.email,
          companyImage: updatedCompanyUser.companyImagePath,
          role: updatedCompanyUser.role,
        };
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUserDataInLocalStorage)
        );

        // update user loggedIn in Slice
        dispatch(setLoginUser(updatedCompanyUser));
      },

      invalidatesTags: ["user"],
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

/*
What’s Happening in onQueryStarted():

1. getProfile query → fetches current user and caches it with tag "user".
2. updateUserProfile mutation → sends updated profile to backend.
3. onQueryStarted runs before mutation finishes:
  1. await queryFulfilled → wait for success or throw error.
  2. If success → update RTK Query cache (updateQueryData).
  3. Also update localStorage and Redux slice so the UI shows updated data instantly.
// if try/catch is used
  4. Error handling → if backend fails, catch block is executed:
  1. Log the error
  2. Show toast/alert if needed
  3. Optionally rollback cache changes.
*/
