import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setLogoutUser } from "../slice/userSlice";

export const createBaseQuery = (baseUrl) => {
  // Creating a reusable baseQuery
  const baseQuery = fetchBaseQuery({
    baseUrl: `https://localhost:7091/${baseUrl}`, // all endpoints starts from here
    credentials: "include", // sends cookie with requests
  });

  // Wrapping it to handle 401 globally
  const baseQueryWithAuthHandling = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    // Handle 401 Unauthorized globally
    if (result?.error?.status === 401) {
      api.dispatch(setLogoutUser()); // clear Redux auth state
      localStorage.removeItem("user"); // clear localStorage
      window.location.href = "/"; // redirect to home
    }

    return result;
  };

  return baseQueryWithAuthHandling;
};
