import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQueryWithAuthHandling";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: createBaseQuery("api/User"),
  tagTypes: ["savedJobs", "appliedJobs"],
  endpoints: (builder) => ({
    jobSearch: builder.query({
      query: ({
        searchQuery,
        jobLocation,
        jobCategory,
        jobLevel,
        jobType,
        pageNumber,
      }) => ({
        url: "/search",
        params: {
          searchQuery,
          jobLocation,
          jobCategory,
          jobLevel,
          jobType,
          pageNumber,
        },
      }),
    }),
    getJobById: builder.query({
      query: (id) => `/getJobById/${id}`,
      providesTags: ["savedJobs", "appliedJobs"],
    }),
    saveJob: builder.mutation({
      query(body) {
        return {
          url: "/saveJob",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["savedJobs"],
    }),
    unSaveJob: builder.mutation({
      query: (id) => {
        return {
          url: `/unsaveJob/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["savedJobs"],
    }),
    getAllSavedJobs: builder.query({
      query: () => "/savedJobs",
      providesTags: ["savedJobs"],
    }),
    applyJob: builder.mutation({
      query(body) {
        return {
          url: "/applyJob",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["savedJobs", "appliedJobs"],
    }),
    getAllAppliedJobs: builder.query({
      query: () => "/getAppliedJobs",
      providesTags: ["appliedJobs"],
    }),
    withdrawApplication: builder.mutation({
      query: (id) => ({
        url: `/cancelApplication/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["appliedJobs"],
    }),
    getSavedOrAppliedJobStatus: builder.query({
      query: (id) => `/getSavedOrAppliedJobStatus/${id}`,
      providesTags: ["savedJobs", "appliedJobs"],
    }),
  }),
});

export const {
  useJobSearchQuery,
  useGetJobByIdQuery,
  useSaveJobMutation,
  useApplyJobMutation,
  useUnSaveJobMutation,
  useGetAllSavedJobsQuery,
  useGetAllAppliedJobsQuery,
  useWithdrawApplicationMutation,
  useGetSavedOrAppliedJobStatusQuery,
} = userApi;
