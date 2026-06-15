import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, forgotPassword } from "../../redux/actions/authAction";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart } from "../../redux/actions/cartActions";
import axios from "axios";
import { authApis } from "../../config/apis";


import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ redirect ONLY after successful login
 // ✅ Login.jsx

// Redirect after login & fetch cart
useEffect(() => {
  if (user) {
    const token = localStorage.getItem("access");
    if (token) {
      dispatch(fetchCart()); // ✅ only if token exists
    }
    navigate("/");
  }
}, [user, dispatch, navigate]);

  // ✅ درست handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    console.log("Login attempt with:", email);
    
    // ✅ OPTION 1: آپ کے CUSTOM LOGIN (/api/auth/login/)
    const response = await axios.post(authApis.login, {  // /api/auth/login/
      email: email,
      password: password
    });
    
    console.log("Login successful:", response.data);
    
    // ✅ Save token (آپ کے custom login response structure کے مطابق)
    localStorage.setItem("access", response.data.token);
    
    // ✅ Save user data
    const userData = response.data.user;
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Update Redux
    dispatch({ 
      type: 'auth/setUser', 
      payload: { 
        user: userData, 
        token: response.data.token 
      }
    });
    
    // Fetch cart
    dispatch(fetchCart());
    
    toast.success("Login successful!");
    navigate("/");
    
  } catch (error) {
    console.error("Login error:", error.response?.data);
    
    // ✅ اگر custom login fail ہو تو find-user + JWT try کریں
    try {
      // find-user API call
      const findRes = await axios.post(authApis.findUser, {
        email: email
      });
      
      const username = findRes.data.username;
      
      // JWT token (/api/token/)
      const tokenRes = await axios.post(authApis.token, {  // /api/token/
        username: username,
        password: password
      });
      
      // Save data
      localStorage.setItem("access", tokenRes.data.access);
      localStorage.setItem("refresh", tokenRes.data.refresh);
      
      const userData = {
        username: username,
        email: email
      };
      localStorage.setItem("user", JSON.stringify(userData));
      
      dispatch({ 
        type: 'auth/setUser', 
        payload: { 
          user: userData, 
          token: tokenRes.data.access 
        }
      });
      
      dispatch(fetchCart());
      toast.success("Login successful!");
      navigate("/");
      
    } catch (secondError) {
      toast.error("Invalid email or password");
    }
  }
};


  const handleForgotPassword = () => {
    if (!email) {
      toast.error("Enter email first");
      return;
    }
    dispatch(forgotPassword(email));
    toast.success("Reset link sent 📩");
  };

  return (
    <div className="container  text-orange-700 mx-auto p-6 max-w-md">
      <h1 className="text-2xl text-orange-700 font-bold mb-4 text-center text-wrap animate-bounce">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white fantacy py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex justify-between mt-3 text-sm">
        <button onClick={handleForgotPassword} className="text-red-500">
          Forgot Password?
        </button>
        <Link to="/signup" className="text-teal-600">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
