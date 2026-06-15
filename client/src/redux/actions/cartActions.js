// cartActions.js
import axios from "axios";
import { setLoading, setCart, setError, clearCart } from "../slices/cartSlice";
import { cartApis } from "../../config/apis";
import toast from 'react-hot-toast'; 

const BASE_URL = "http://localhost:8000";

// ✅ Simple refresh token function
const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token");
  
  try {
    const { data } = await axios.post("http://localhost:8000/api/token/refresh/", { 
      refresh: refresh 
    });
    
       localStorage.setItem("access", data.access);
    return data.access;
  } catch (error) {
    console.error("Refresh token error:", error);
    // اگر 404 آئے تو یہ API موجود نہیں
    if (error.response?.status === 404) {
      throw new Error("Refresh token API not available. Please login again.");
    }
    throw error;
  }
};

// cartActions.js mein fetchCart function
export const fetchCart = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const token = localStorage.getItem("access");
    
    if (!token) {
      console.log("No token, user not logged in");
      // ✅ SIRF ERROR DISPATCH KAREIN
      dispatch(setError("Please login to view cart"));
      return;
    }
    
    console.log("Fetching cart...");
    
    const response = await axios.get(cartApis.list, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Cart API response:", response.data);
    
    let cartItems = [];
    
    if (response.data) {
      if (response.data.items && Array.isArray(response.data.items)) {
        cartItems = response.data.items;
      } else if (Array.isArray(response.data)) {
        cartItems = response.data;
      }
    }
    
    // ✅ DISPATCH CART ITEMS
    dispatch(setCart(cartItems));
    
    // ✅ Event dispatch (optional)
    window.dispatchEvent(new CustomEvent('cartRefreshed'));
    
  } catch (error) {
    console.error("Fetch cart error:", error);
    
    if (error.response?.status === 401) {
      console.log("Token expired or invalid");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      dispatch(setError("Session expired. Please login again."));
    } else {
      dispatch(setError(error.response?.data?.detail || "Failed to fetch cart"));
    }
    // ❌ dispatch(setCart([])) HATA DEIN COMPLETELY
  }
};
// cartActions.js - addToCart function
// cartActions.js - addToCart function update
export const addToCart = (productId, quantity = 1, productType = 'product') => async (dispatch) => {
  dispatch(setLoading());
  try {
    const token = localStorage.getItem("access");
    
    if (!token) {
      dispatch(setError("Please login first to add to cart"));
      toast.error("Please login first");
      return;
    }
    
    console.log("Adding to cart:", { productId, quantity, productType });
    
    const response = await axios.post(cartApis.add, 
      { 
        product_id: productId,
        quantity: quantity,
        product_type: productType  // ✅ Send product type
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log("Add to cart successful:", response.data);
    
    // Refresh cart
    await dispatch(fetchCart());
    
    return response.data;
    
  } catch (error) {
    console.error("Add to cart error:", error);
    
    if (error.response?.status === 401) {
      dispatch(setError("Session expired. Please login again."));
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      toast.error("Session expired. Please login again.");
    } else {
      const errorMsg = error.response?.data?.detail || error.response?.data?.error || "Failed to add to cart";
      dispatch(setError(errorMsg));
      toast.error(errorMsg);
    }
    throw error;
  }
};
export const triggerCartUpdate = () => {
  // Dispatch custom event for cart update
  const event = new CustomEvent('cartUpdated');
  window.dispatchEvent(event);
  
  // Also update localStorage for immediate feedback
  const cartUpdateTime = Date.now();
  localStorage.setItem('lastCartUpdate', cartUpdateTime.toString());
};

// addToCart function کے بعد یہ function شامل کریں
export const debugCartState = () => (dispatch, getState) => {
  const state = getState();
  console.log("=== REDUX STATE DEBUG ===");
  console.log("Full cart state:", state.cartSlice);
  console.log("Cart items:", state.cartSlice.cartItems);
  console.log("Cart items length:", state.cartSlice.cartItems?.length);
  console.log("=========================");
};
export const removeFromCart = (productId) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const token = localStorage.getItem("access");
    
    if (!token) {
      dispatch(setError("Please login first"));
      return;
    }
    
    await axios.post(cartApis.remove, 
      { product_id: productId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    await dispatch(fetchCart());

        window.dispatchEvent(new CustomEvent('cartUpdated'));

    
  } catch (error) {
    console.error("Remove from cart error:", error);
    dispatch(setError(error.response?.data?.detail || "Failed to remove from cart"));
  }
};

// cartActions.js میں empptyCart function
export const empptyCart = () => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    const state = getState();
    const cartItems = state.cartSlice.cartItems;

    if (!cartItems || cartItems.length === 0) {
      toast.info("Cart is already empty");
      return;
    }

    // ❌ DELETE کی بجائے POST use karein
    await axios.post( // ✅ POST use karein
      "http://localhost:8000/api/cart/clear/",
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // ✅ Redux state صاف کریں
    dispatch(clearCart());
    
    toast.success("Cart cleared successfully");
    window.dispatchEvent(new CustomEvent('cartUpdated'));

  } catch (error) {
    console.error("Error clearing cart:", error);
    toast.error("Failed to clear cart");
  }
};