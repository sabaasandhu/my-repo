import { createSlice } from "@reduxjs/toolkit";
import { calculateSubTotal } from "../../helpers/CartFunc";

const cartSlice = createSlice({
name: "cart",
  initialState: {
    loading: false,
    error: null,
    cartItems: [],  // ✅ یہ array ہونی چاہیے
    subtotal: 0,
    shipping: 500,
     hasLoaded: false
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;

      state.error = null;
    },

    setCart: (state, action) => {
      console.log("setCart called with payload:", action.payload);
      
      try {
        // Ensure payload is an array
        if (Array.isArray(action.payload)) {
          state.cartItems = action.payload;
        } else if (action.payload && Array.isArray(action.payload.items)) {
          // If payload has items property (backend structure)
          state.cartItems = action.payload.items;
        } else {
          console.warn("Invalid payload for setCart:", action.payload);
           return;
        }
        
        // Calculate subtotal safely
        state.subtotal = calculateSubTotal(state.cartItems);
        state.loading = false;
        state.error = null;
         state.hasLoaded = true;
        
        console.log("Cart set successfully. Items:", state.cartItems.length);
        
      } catch (error) {
        console.error("Error in setCart reducer:", error);

        state.loading = false;
        state.error = "Failed to update cart";
        state.hasLoaded = true;

      }
    },


    clearCart: (state) => {
    state.cartItems = [];
      state.subtotal = 0;
      state.shipping = 500;
      state.error = null;
      state.loading = false;
      state.hasLoaded = true;


    },

    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.hasLoaded = true;
    },
  },
});

export const { setLoading, setCart, clearCart, setError } = cartSlice.actions;
export default cartSlice.reducer;
