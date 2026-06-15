// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("access") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    setUser: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      state.loading = false;
      state.error = null;
      
      // Save to localStorage (1 دن تک رہے گا)
      localStorage.setItem("user", JSON.stringify(payload.user));
      localStorage.setItem("access", payload.token);
      
      // Refresh token bhi save karen agar backend se aaye
      if (payload.refresh) {
        localStorage.setItem("refresh", payload.refresh);
      }
    },
    
    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    
    // ✅ Logout action - sirf jab user khud logout kare
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
    },
    
    // ✅ Token refresh action (auto matic refresh)
      setRefreshToken: (state, { payload }) => {
      state.token = payload.newAccessToken;
      localStorage.setItem("access", payload.newAccessToken);
      
      if (payload.newRefreshToken) {
        localStorage.setItem("refresh", payload.newRefreshToken);
      }
    }
  },
});
export const { setLoading, setUser, setError, logout,setRefreshToken } = authSlice.actions;
export default authSlice.reducer;