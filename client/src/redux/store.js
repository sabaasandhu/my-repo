import { configureStore, combineReducers } from '@reduxjs/toolkit'

import productSlice from './slices/productSlice'
import cartSlice from './slices/cartSlice'
import authSlice from './slices/authSlice'

const reducer = combineReducers({
     prodSlice: productSlice,
     cartSlice: cartSlice,
     auth: authSlice 
})

const store = configureStore({ reducer })

export default store;