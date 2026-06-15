import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [],
    productsByCategory: [],
    sliders: [],
    unstitchs: [],
    error: null,
    product: '',
    loading: false,
    cart: 2
}

const ProductSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = true
        },
        setProducts: (state, { payload }) => {
            state.loading = false
            state.products = payload
              if (payload && Array.isArray(payload.products)) {
    state.products = payload.products  // ✅ Access products array
  } else if (Array.isArray(payload)) {
    state.products = payload  // ✅ Direct array
  } else {
    state.products = []  // ✅ Default empty array
  }

        },
        setProductsByCategory: (state, { payload }) => {
  state.loading = false
  
  // ✅ SAME LOGIC AS setProducts:
  if (payload && Array.isArray(payload.products)) {
    state.productsByCategory = payload.products  // ✅ Access products array
  } else if (Array.isArray(payload)) {
    state.productsByCategory = payload  // ✅ Direct array
  } else {
    state.productsByCategory = []  // ✅ Default empty array
  }
},

        setsliders: (state, { payload }) => {
            state.loading = false
            state.sliders = payload
        },
        setProduct: (state, { payload }) => {
            state.loading = false
            state.product = payload
        },
        setError: (state, { payload }) => {
            state.loading = false
            state.error = payload
        },
        setUnstitchs: (state, { payload }) => {
  state.loading = false
  
  console.log("🛍️ Unstitchs payload:", payload); // Debugging
  
  // ✅ DIRECT ARRAY: Agar backend se direct array aa raha hai
  state.unstitchs = payload || [];
},
    }
})

export const { setLoading, setProducts, setProduct, setError, setProductsByCategory, setsliders, setUnstitchs } = ProductSlice.actions

export default ProductSlice.reducer