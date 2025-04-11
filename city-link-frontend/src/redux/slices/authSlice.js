import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.registerUser.matchPending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addMatcher(
      authApi.endpoints.registerUser.matchFulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = payload.user;
        state.error = null;
      }
    );
    builder.addMatcher(
      authApi.endpoints.registerUser.matchRejected,
      (state, { payload }) => {
        state.loading = false;
        state.error = payload?.data?.message || "Registration failed";
      }
    );

    builder.addMatcher(authApi.endpoints.loginUser.matchPending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addMatcher(
      authApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = payload.user;
        state.error = null;
      }
    );
    builder.addMatcher(
      authApi.endpoints.loginUser.matchRejected,
      (state, { payload }) => {
        state.loading = false;
        state.error = payload?.data?.message || "Login failed";
      }
    );

    builder.addMatcher(authApi.endpoints.logoutUser.matchFulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });

    builder.addMatcher(
      authApi.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.isAuthenticated = true;
      }
    );
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
