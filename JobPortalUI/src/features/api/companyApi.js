import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQueryWithAuthHandling";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: createBaseQuery("api/Company"),
  tagTypes: ["Job"],
  endpoints: (builder) => ({
    getAllJobs: builder.query({
      query: () => "/getAllJobs",
      providesTags: (result) =>
        result.length > 0
          ? [
              { type: "Job", id: "LIST" }, // Provide a tag for the whole list
              ...result.map(({ id }) => ({ type: "Job", id })), // And individual tags for each job
            ]
          : [{ type: "Job", id: "LIST" }],
    }),
    postJob: builder.mutation({
      query(body) {
        return {
          url: "/postJob",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Job", id: "LIST" }], // Invalidate the list so it refetches
    }),
    getJobById: builder.query({
      query: (id) => `/getJob/${id}`,
      providesTags: (result, error, id) => [{ type: "Job", id }], // single job
    }),
    updateJob: builder.mutation({
      query({ id, jobPostToBeUpdated }) {
        return {
          url: `/updateJob/${id}`,
          method: "PUT",
          body: jobPostToBeUpdated,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Job", id }, // refresh the specific job
        { type: "Job", id: "LIST" }, // refresh the list as well
      ],
    }),
    updateJobStatus: builder.mutation({
      query: (id) => ({
        url: `/updateJobStatus/${id}`, // route parameter
        method: "PATCH", // PATCH request
        // no body
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Job", id }, // invalidate this job
        { type: "Job", id: "LIST" }, // also invalidate the list
      ],
    }),
    deleteJob: builder.mutation({
      query: (id) => {
        return {
          url: `/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: "Job", id },
        { type: "Job", id: "LIST" },
      ],
    }),
    updateApplicationStatus: builder.mutation({
      query({ jobId, appId, status }) {
        return {
          url: `/updateJobApplicationStatus/${appId}`,
          method: "PUT",
          body: status,
        };
      },
      // Directly update cache for instant UI feedback
      async onQueryStarted(
        { jobId, appId, status },
        { dispatch, queryFulfilled }
      ) {
        await queryFulfilled;
        // Update the cached job immediately
        dispatch(
          companyApi.util.updateQueryData("getJobById", jobId, (draft) => {
            const app = draft.applications.find((a) => a.id === appId);
            if (app) app.status = status.status; // update field
          })
        );
      },
      invalidatesTags: (result, error, id) => [{ type: "Job", id }], // This will trigger any useGetJobByIdQuery(jobId) hook anywhere in your app to refetch
    }),
    getCompanyStats: builder.query({
      query: () => `/getCompanyStats`,
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  usePostJobMutation,
  useGetJobByIdQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useUpdateJobStatusMutation,
  useUpdateApplicationStatusMutation,
  useGetCompanyStatsQuery,
} = companyApi;
