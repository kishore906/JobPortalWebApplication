import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQueryWithAuthHandling";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: createBaseQuery("api/Admin"),
  tagTypes: ["users", "jobs", "companies"],
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => `/getStats`,
    }),
    getGraphsData: builder.query({
      query: ({ year }) => ({
        url: "/getJobsAndApplicationsByMonth",
        params: {
          year,
        },
      }),
    }),
    getAllUsers: builder.query({
      query: ({ pageNumber }) => ({
        url: `/users`,
        params: {
          pageNumber,
        },
      }),
      providesTags: ["users"],
    }),
    getAllCompanyUsers: builder.query({
      query: ({ pageNumber }) => ({
        url: `/companyUsers`,
        params: {
          pageNumber,
        },
      }),
      providesTags: ["companies"],
    }),
    getJobById: builder.query({
      query: (id) => `/allJobs/${id}`,
    }),
    getAllJobsByStatus: builder.query({
      query: ({ status, pageNumber }) => ({
        url: `/jobs/${status}`,
        params: {
          pageNumber,
        },
      }),
      providesTags: ["jobs"],
    }),
    deleteUser: builder.mutation({
      query: (id) => {
        return {
          url: `/user/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["users"],
    }),
    deleteCompanyUser: builder.mutation({
      query: (id) => {
        return {
          url: `/companyUser/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["companies"],
    }),
    deleteJob: builder.mutation({
      query: (id) => {
        return {
          url: `/job/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["jobs"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetStatsQuery,
  useGetAllCompanyUsersQuery,
  useGetJobByIdQuery,
  useGetAllJobsByStatusQuery,
  useDeleteUserMutation,
  useDeleteCompanyUserMutation,
  useDeleteJobMutation,
  useGetGraphsDataQuery,
} = adminApi;
