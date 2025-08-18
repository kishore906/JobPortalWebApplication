import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  jobLocation: "",
};

const jobSearchSlice = createSlice({
  name: "jobSearch",
  initialState,
  reducers: {
    setSearchQueryAndJobLocation: (state, action) => {
      state.searchQuery = action.payload.searchQuery;
      state.jobLocation = action.payload.jobLocation;
    },
  },
});

export const { setSearchQueryAndJobLocation } = jobSearchSlice.actions; // action methods used in dispatch()
export default jobSearchSlice.reducer;
