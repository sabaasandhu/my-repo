
import './App.css'
import { Toaster } from "react-hot-toast";
import{BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import  { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './redux/actions/authAction';

import React from 'react'
import Home from './screens/Dashboard/Home'
import Login from './screens/Authentication/Login'
import Signup from './screens/Authentication/Signup'
import Contacts from './screens/Dashboard/Contacts'
import SingleProduct from './screens/Dashboard/SingleProduct'

// components
//import TopHeader from './components/TopHeader'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Products from './screens/Dashboard/Products'
import SingleProductPage from './screens/Dashboard/CartAndCheckout'
import Unstitchs from './screens/Dashboard/Unstitchs'
import Cart from './components/Cart'
import Sales from './screens/Dashboard/Sales'
import Userdashboard from './screens/Dashboard/Userdashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { fetchCart } from './redux/actions/cartActions';
import Checkout from './screens/Dashboard/Checkout';
import OrderConfirmation from './screens/Dashboard/OrderConfirmation';

import Footer from './components/Footer' 
import SingleUnstitch from './screens/Dashboard/SingleUnstitch';


const App = () => {


    const dispatch = useDispatch();

    useEffect(() => {
    // ✅ App start پر ہمیشہ cart fetch کریں
    const initApp = async () => {
      const token = localStorage.getItem("access");
      const user = localStorage.getItem("user");
      
      console.log("App starting, token exists:", !!token);
      
      if (token && user) {
        try {
          // Verify token first
          await dispatch(checkAuth());
          // Then fetch cart
          await dispatch(fetchCart());
        } catch (error) {
          console.error("App init error:", error);
        }
      } else {
        // No user, clear cart
        dispatch({ type: 'cart/setCart', payload: [] });
      }
    };
    
    initApp();
  }, [dispatch]);


    return (
     <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Toaster position="top-right" />
    <Router>

      {/* <TopHeader/> */}
      <Header/>
      <Navigation/>
      
        <Routes>

          <Route path='/' element={<Home/>}/>
          <Route path='/product/:category' element={<Products/>} />
           {/* <Route path='/products/category' element={<Products/>}/> */}
          <Route path='/products/:id' element={<SingleProduct/>}/>
           <Route path='/unstitchs' element={<Unstitchs/>}/>
           <Route path='/unstitch/:id' element={<SingleUnstitch/>}/>
            <Route path='/login' element={<Login/>}/>
             <Route path='/signup' element={<Signup/>}/>
              <Route path='/cart' element={<Cart/>}/>
              <Route path='/contactus' element={<Contacts/>}/>
              <Route path='/sales' element={<Sales/>}/>
              <Route path='/userdashboard' element={<Userdashboard/>}/>
              <Route
                     path="/userdashboard"
                     element={
                     <ProtectedRoute>
                      <Userdashboard/>
                     </ProtectedRoute>}           />
            <Route path='/checkout' element={<Checkout/>}/>
            <Route path='/order-confirmation' element={<OrderConfirmation/>}/>

              <Route path='http://localhost:8000/admin/' />

              </Routes>
    </Router>
    <Footer/>
    </div>
    
  )
}

export default App
