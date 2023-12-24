import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth slice",
  initialState: { value: false },
  reducers: {
    triger: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { triger } = authSlice.actions;

export default authSlice.reducer;
