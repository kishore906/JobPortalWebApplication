import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQueryWithAuthHandling";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: createBaseQuery("api/User"),
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
    }),
  }),
});

export const { useJobSearchQuery, useGetJobByIdQuery } = userApi;
