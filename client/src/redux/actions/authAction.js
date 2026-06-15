// authActions.js
import axios from "axios";
import { setLoading, setUser, setError, logout, setRefreshToken } from "../slices/authSlice";
import { fetchCart } from "./cartActions";
import { clearCart } from "../slices/cartSlice";
import { authApis } from "../../config/apis";

const BASE_URL = "http://localhost:8000";

// ✅ Auto-check token validity on app start
export const checkAuth = () => async (dispatch) => {
  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  if (token && user) {
    // Token exists, verify it
    try {
      // Optional: Verify token with backend
      // const response = await axios.get(`${BASE_URL}/api/verify-token/`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // If we reach here, token is still valid
      dispatch(setUser({ user, token }));
      
      // Fetch user's cart
      dispatch(fetchCart());
      
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired, try to refresh
        await dispatch(refreshAuthToken());
      } else {
        console.log("Auth check error:", error);
      }
    }
  }
};

// ✅ Refresh token function
export const refreshAuthToken = () => async (dispatch) => {
  const refresh = localStorage.getItem("refresh");
  
  if (!refresh) {
    // No refresh token, force logout
    dispatch(logout());
    return;
  }
  
  try {
    const { data } = await axios.post(`${BASE_URL}/api/token/refresh/`, {
      refresh: refresh
    });
    
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "null");
    
    // Save new tokens
    localStorage.setItem("access", data.access);
    
    // Update Redux
dispatch(setRefreshToken({  
  newAccessToken: data.access,
  newRefreshToken: data.refresh 
}));


    
    // If user exists, update state
    if (user) {
      dispatch(setUser({ user, token: data.access }));
    }
    
    return data.access;
    
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Refresh failed, logout user
    dispatch(logout());
    dispatch(clearCart());
    throw error;
  }
};

// ✅ Register user
export const registerUser = (name, email, password) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const { data } = await axios.post(`${BASE_URL}/api/auth/register/`, {
      username: name,
      email: email,
      password: password
    });
    
    // Save tokens and user data
    const userData = {
      username: name,
      email: email,
      id: data.user?.id,
      is_staff: false
    };
    
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    
    dispatch(setUser({ 
      user: userData, 
      token: data.access,
      refresh: data.refresh 
    }));
    
    // Fetch cart for new user
    dispatch(fetchCart());
    
  } catch (error) {
    const msg = error.response?.data?.detail || error.message || "Registration failed";
    dispatch(setError(msg));
    throw error;
  }
};

// authActions.js میں loginUser function
// authActions.js میں
export const loginUser = (email, password) => async (dispatch) => {
  dispatch(setLoading());
  try {
    // OPTION 1: Direct JWT token request (email ko username ki tarah use karein)
    const { data } = await axios.post("http://localhost:8000/api/token/", {
      username: email,  // ✅ Email ko direct username ki tarah bhejein
      password: password
    });
    
    // Get user info
    let userInfo;
    try {
      // Try to get user details from your existing endpoint
      const userResponse = await axios.get("http://localhost:8000/api/auth/user/", {
        headers: { Authorization: `Bearer ${data.access}` }
      });
      userInfo = userResponse.data;
    } catch (err) {
      // If no user endpoint, create basic user object
      userInfo = {
        username: email.split('@')[0],
        email: email,
        is_staff: false

      };
    }
    
    // Save everything
    localStorage.setItem("user", JSON.stringify(userInfo));
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    
    dispatch(setUser({ 
      user: userInfo, 
      token: data.access,
      refresh: data.refresh 
    }));
    
    // Fetch user's cart
    dispatch(fetchCart());
    
    return data; // Success
    
  } catch (error) {
    console.error("Login error:", error.response?.data);
    
    // اگر email سے نہیں ہوا تو username تلاش کریں
    if (error.response?.status === 401) {
      try {
        // Email سے username تلاش کریں
        const users = await User.objects.filter(email=email).first();
        if (users) {
          // Dobara try karein with actual username
          const { data } = await axios.post("http://localhost:8000/api/token/", {
            username: users.username,
            password: password
          });
          
          // Save data...
          return data;
        }
      } catch (secondError) {
        // Both failed
        const msg = "Invalid email or password";
        dispatch(setError(msg));
        throw new Error(msg);
      }
    }
    
    const msg = error.response?.data?.detail || error.message || "Login failed";
    dispatch(setError(msg));
    throw new Error(msg);
  }
};

// ✅ Logout user (only when user manually logs out)
export const logoutUser = () => (dispatch) => {
  // Clear all data
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  
  dispatch(logout());
  dispatch(clearCart());
  
  // Optional: Call backend logout endpoint if exists
  // axios.post(`${BASE_URL}/api/auth/logout/`);
};

// FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const config = { headers: { "Content-Type": "application/json" } };
    await axios.post(authApis.forgotPassword, { email }, config);
    alert("Password reset link sent to your email!");
    dispatch(setError(null));
  } catch (error) {
    const msg = error.response?.data?.detail || error.message || "Failed to send reset email";
    dispatch(setError(msg));
  }
};
