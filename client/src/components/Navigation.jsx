import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink,useLocation,useNavigate } from 'react-router-dom'
import profile from '../image/profile.jpg'
import { clearCart } from "../redux/slices/cartSlice";
import { FaHeart } from "react-icons/fa";
import { logout } from "../redux/slices/authSlice";
import { IoBulbSharp } from "react-icons/io5";
import { IoBulbOutline } from "react-icons/io5";
import axios from 'axios';
import { HiMiniShoppingCart } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";
import apis from '../config/apis'
import { useSelector,useDispatch } from 'react-redux'
import saa2 from '../image/saa2.png'
import { removeFromCart } from '../redux/actions/cartActions'
import { profile_link_login, profile_link_not_login, Navlink } from "../components/Navlink";
import toast from 'react-hot-toast';
import { fetchCart } from "../redux/actions/cartActions";
import { cartApis } from "../config/apis"; 
import salePriceFunc from '../helpers/Func';

const Navigation = () => {
  const categories = [
    { name : 'two piece', url: '/product/to-piece' },
    { name : 'Cotton', url: '/product/cotton'  },
    // { name : 'Crepe', url: '/product/crepe' },
    { name : 'three piece', url: '/product/three-piece'  },
  ];

  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [MenuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const refProfile = useRef(null);
  const refCart = useRef(null);
  const refMenu = useRef(null);
  const refMobileSearch = useRef(null);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cartSlice);
  const params = new URLSearchParams(location.search);
  const currentQuery = params.get('search') || '';
  
  const searchHandler = (e) => {
    e.preventDefault();
    setCartOpen(false);
    setIsMyProfileOpen(false);
    setMenuOpen(false);
    setShowMobileSearch(false);
    
    if (searchTerm.trim()) {
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    setCartOpen(false);
    setIsMyProfileOpen(false);
    setMenuOpen(false);
    setShowMobileSearch(false);
    
    if (searchTerm.trim()) {
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    console.log("CART ITEMS IN NAVIGATION:", cartItems);
  }, [cartItems]);

  useEffect(() => {
    console.log("Navigation mounted, fetching cart...");
    const token = localStorage.getItem("access");
    if (token) {
      dispatch(fetchCart());
    } else {
      console.log("No token, setting empty cart");
      dispatch({ type: 'cart/setCart', payload: [] });
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      console.log("User logged in, fetching cart...");
      dispatch(fetchCart());
    } else {
      console.log("User logged out, clearing cart...");
      dispatch({ type: 'cart/setCart', payload: [] });
    }
  }, [user, dispatch]);

  useEffect(() => {
    setSearchTerm(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (refMenu.current && !refMenu.current.contains(e.target)) {
        setMenuOpen(false);
      }
      
      if (refProfile.current && !refProfile.current.contains(e.target)) {
        setIsMyProfileOpen(false);
      }
      
      if (cartOpen && refCart.current) {
        const clickedOnCartIcon = refCart.current.contains(e.target);
        const cartDropdown = e.target.closest('.cart-dropdown');
        const clickedInsideDropdown = !!cartDropdown;
        
        if (!clickedOnCartIcon && !clickedInsideDropdown) {
          setCartOpen(false);
        }
      }
      
      if (showMobileSearch && refMobileSearch.current && !refMobileSearch.current.contains(e.target)) {
        const mobileSearchIcon = e.target.closest('.mobile-search-icon');
        if (!mobileSearchIcon) {
          setShowMobileSearch(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartOpen, showMobileSearch]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleMobileMenu = () => {
    setMenuOpen(!MenuOpen);
    setShowMobileSearch(false);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    setMenuOpen(false);
  };

  return (
    <nav className='sticky top-0 w-full bg-gradient-to-tl from-teal-500 via-teal-700 to-orange-500 shadow-lg z-50'>
      <div className='bg-teal-900 h-1'></div>

      <button 
        onClick={toggleMobileMenu}
        className="md:hidden absolute left-4 top-1/2 transform -translate-y-1/2 z-[10000] text-white"
      >
        {MenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <div className='h-20 mx-auto flex justify-between items-center space-x-4 relative z-[9999] px-4'>
        <div className='flex justify-between items-center'>
          {/* LOGO - BARA KIYA */}
          <div className='flex items-center ml-8 md:ml-0'>
            <Link to='/'>
              <img 
                src={saa2} 
                className='sabanosh h-14 md:h-20 w-auto' 
                alt="Logo" 
              />
            </Link>
          </div>

          <nav className='hidden items-center space-x-4 md:flex px-16'>
            <NavLink
              to="/"
              className="text-lg font-semibold font-mono italic transition duration-500 hover:text-teal-200"
            >
              Home
            </NavLink>

            <div className='group relative font-mono text-purple-950 text-lg'>
              <button className='hover:text-teal-200 transition duration-500 flex items-center text-lg font-semibold font-mono italic'>
                Category
              </button>
              <div className='absolute hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 min-w-[150px] z-[99999] border border-gray-200 dark:border-gray-700 top-full'>
                {categories.map((category, index) => (
                  <NavLink
                    key={index}
                    to={category.url}
                    className="block text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 font-semibold transition duration-300 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {category.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {Navlink.filter(item => item.url !== "/").map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className="text-lg font-semibold font-mono italic transition duration-500 hover:text-teal-200"
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end gap-1 md:gap-3">
          {/* Desktop Search */}
          <div className="hidden md:flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1.5 gap-2 w-60">
            <FaSearch className="text-gray-500 dark:text-gray-300 w-4 h-4" />
            <form onSubmit={searchHandler} className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 w-full text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          {/* Icons Section */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Mobile Search Icon */}
            <button 
              onClick={toggleMobileSearch}
              className="mobile-search-icon md:hidden text-white p-1"
            >
              <FaSearch className="w-5 h-5" />
            </button>

            {/* Cart Icon */}
            <div className="relative" ref={refCart}>
              <HiMiniShoppingCart
                className="cursor-pointer text-white w-6 h-6 md:w-7 md:h-7 transition-all duration-300 hover:scale-110 hover:text-yellow-200"
                onClick={() => {
                  setCartOpen(!cartOpen);
                  setShowMobileSearch(false);
                }}
              />
              {cartItems && cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 rounded-full text-white text-xs px-1.5 py-0.5 min-w-[18px] text-center">
                  {cartItems.length}
                </span>
              )}
            </div>

            {/* Wishlist Icon */}
            <FaHeart className="w-5 h-5 md:w-6 md:h-6 text-rose-600 hover:text-red-500 hover:animate-pulse cursor-pointer" />
            
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-white hover:scale-110 transition"
            >
              {darkMode ? <IoBulbSharp className="w-5 h-5 md:w-6 md:h-6" /> : <IoBulbOutline className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div>
        </div>

        {/* PROFILE SECTION - WELCOME TEXT + USERNAME DONO SHOW */}
        <div className="relative" ref={refProfile}>
          <button
            onClick={() => {
              setIsMyProfileOpen(!isMyProfileOpen);
              setShowMobileSearch(false);
            }}
            className="flex items-center focus:outline-none gap-2"
          >
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <img
                src={user?.profile_image || profile}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-white shadow-lg object-cover"
                alt="Profile"
              />
              {user && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            {/* Welcome Text + Username - Mobile par bhi show, lekin responsive */}
            {user && (
              <div className="flex flex-col leading-tight text-left">
                <span className="text-xs text-white/80">
                  Welcome to Sabanosh
                </span>
                <span className="text-white font-semibold text-sm md:text-base max-w-[120px] md:max-w-[150px] truncate">
                  {user.username}
                </span>
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          {isMyProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl py-3  top-full">
              {user && (
                <div className="px-4 pb-3 border-b border-gray-200 mb-2">
                  <div className="flex items-center mb-2">
                    <img
                      src={user?.profile_image || profile}
                      className="w-12 h-12 rounded-full border-2 border-teal-500 object-cover mr-3"
                      alt="Profile"
                    />
                    <div>
                      <p className="font-bold text-teal-700 text-lg">{user.username}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {user ? (
                <>
                  {profile_link_login.map((link, i) => (
                    <Link
                      key={i}
                      to={link.url}
                      className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 hover:text-teal-700 transition"
                      onClick={() => setIsMyProfileOpen(false)}
                    >
                      <span className="mr-2">{link.icon}</span>
                      {link.name}
                    </Link>
                  ))}

                  <button
                    onClick={() => {
                      localStorage.removeItem("access");
                      localStorage.removeItem("refresh");
                      dispatch(clearCart());
                      dispatch(logout());
                      localStorage.clear();
                      setIsMyProfileOpen(false);
                      toast.success("Logged out successfully 👋");
                      navigate("/login");
                    }}
                    className="block w-full text-left py-2 px-4 mt-2 text-red-600 hover:bg-red-50 font-semibold flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                profile_link_not_login.map((link, i) => (
                  <Link
                    key={i}
                    to={link.url}
                    className="block py-2 px-4 font-serif hover:bg-teal-300 text-orange-500 text-center font-bold hover:text-white transition"
                    onClick={() => setIsMyProfileOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div 
          ref={refMobileSearch}
          className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg z-[99999] p-3 border-t border-gray-200"
        >
          <form onSubmit={handleMobileSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button 
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {MenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg z-[99999] p-4 max-h-[80vh] overflow-y-auto">
          <NavLink
            to="/"
            className="block py-2 px-4 text-gray-800 dark:text-gray-200 hover:bg-teal-100 dark:hover:bg-gray-700 rounded"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          
          <div className="py-2 px-4">
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Categories</p>
            {categories.map((category, index) => (
              <NavLink
                key={index}
                to={category.url}
                className="block py-1 px-4 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
                onClick={() => setMenuOpen(false)}
              >
                {category.name}
              </NavLink>
            ))}
          </div>
          
          {Navlink.filter(item => item.url !== "/").map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              className="block py-2 px-4 text-gray-800 dark:text-gray-200 hover:bg-teal-100 dark:hover:bg-gray-700 rounded"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}

      {/* Cart Dropdown */}
      {cartOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl p-4 space-y-3 z-[99999] border border-gray-200 top-full cart-dropdown max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center border-b pb-2 sticky top-0 bg-white">
            <h3 className="font-bold text-gray-800">Shopping Cart</h3>
            <span className="text-sm text-gray-600">
              {cartItems?.length || 0} items
            </span>
          </div>
          
          {cartItems && cartItems.length > 0 ? (
            <>
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const productId = item.product?.id || item.product_id;
                  const productName = item.product?.name || item.product_name || 'Product';
                  const originalPrice = parseFloat(item.product_price || item.product?.price || 0);
                  const discount = parseFloat(item.product_discount || item.product?.discount || 0);
                  const salePrice = salePriceFunc(originalPrice, discount);
                  const productImage = item.product?.images?.[0]?.image || item.product_image;
                  const quantity = item.quantity || 1;

                  return (
                    <div key={item.id || productId} className="flex flex-col border-b pb-3">
                      <div className="flex">
                        <img
                          src={productImage ? `http://localhost:8000${productImage}` : '/default-product.jpg'}
                          alt={productName}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="ml-3 flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{productName}</h4>
                          <p className="text-gray-600 text-sm">Rs. {salePrice}</p>
                          {discount > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500 line-through">
                                Rs. {originalPrice.toFixed(2)}
                              </span>
                              <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded">
                                -{discount}%
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-500">Qty: {quantity}</span>
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                if (productId) {
                                  await dispatch(removeFromCart(productId));
                                  toast.success("Item removed");
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="text-sm font-semibold">
                            Rs. {(parseFloat(salePrice) * quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-3 border-t sticky bottom-0 bg-white">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    Rs. {cartItems.reduce((total, item) => {
                      const originalPrice = parseFloat(item.product?.price || item.product_price || 0);
                      const discount = parseFloat(item.product_discount || item.product?.discount || 0);
                      const salePrice = salePriceFunc(originalPrice, discount);
                      const quantity = item.quantity || 1;
                      return total + (parseFloat(salePrice) * quantity);
                    }, 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCartOpen(false);
                      navigate("/cart");
                    }}
                    className="flex-1 bg-teal-600 text-white text-center py-2 rounded hover:bg-teal-700 transition"
                  >
                    View Cart
                  </button>

                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      const token = localStorage.getItem("access");
                      if (!token) {
                        toast.error("Please login first");
                        return;
                      }
                      
                      try {
                        const response = await axios.post(
                          cartApis.clear,
                          {},
                          {
                            headers: {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json'
                            }
                          }
                        );
                        
                        dispatch({ type: 'cart/setCart', payload: [] });
                        toast.success("Cart cleared successfully");
                        setCartOpen(false);
                      } catch (error) {
                        console.error("Clear API error:", error);
                        toast.error("Failed to clear cart: " + (error.response?.data?.error || error.message));
                      }
                    }}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">Your cart is empty</p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate("/");
                }}
                className="inline-block mt-2 text-teal-600 hover:text-teal-800 text-sm"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;