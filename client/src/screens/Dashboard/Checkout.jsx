import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart, empptyCart } from "../../redux/actions/cartActions";
import axios from "axios";
import { 
  FaLock, 
  FaCreditCard, 
  FaTruck, 
  FaCheckCircle, 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope 
} from "react-icons/fa";
import toast from "react-hot-toast";
import salePriceFunc from "../../helpers/Func";

// ✅ CORRECT URL with /api/ prefix - matches your Django backend
const ORDER_API_URL = "https://web-production-10987.up.railway.app/api/orders/create/";
const IMAGE_BASE_URL = "https://web-production-10987.up.railway.app";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, loading, hasLoaded } = useSelector(state => state.cartSlice);
  const { user } = useSelector(state => state.auth);
  
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const initialCheckDone = useRef(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan"
  });
  
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  
  const steps = [
    { number: 1, title: "Shipping", icon: <FaTruck /> },
    { number: 2, title: "Payment", icon: <FaCreditCard /> },
    { number: 3, title: "Confirm", icon: <FaCheckCircle /> }
  ];

  // Get image URL helper
  const getImageUrl = (item) => {
    if (item.product?.images && item.product.images.length > 0) {
      const imagePath = item.product.images[0].image;
      if (imagePath) {
        if (imagePath.startsWith('http')) {
          return imagePath;
        }
        return `${IMAGE_BASE_URL}${imagePath}`;
      }
    }
    
    if (item.product?.image) {
      if (item.product.image.startsWith('http')) {
        return item.product.image;
      }
      return `${IMAGE_BASE_URL}${item.product.image}`;
    }
    
    if (item.product_image) {
      if (item.product_image.startsWith('http')) {
        return item.product_image;
      }
      return `${IMAGE_BASE_URL}${item.product_image}`;
    }
    
    if (item.image) {
      if (item.image.startsWith('http')) {
        return item.image;
      }
      return `${IMAGE_BASE_URL}${item.image}`;
    }
    
    return '/placeholder.jpg';
  };

  useEffect(() => {
    if (!initialCheckDone.current) {
      initialCheckDone.current = true;
      
      const initCart = async () => {
        try {
          await dispatch(fetchCart());
          
          setTimeout(() => {
            if (hasLoaded && (!cartItems || cartItems.length === 0)) {
              toast.error("Your cart is empty");
              navigate("/cart");
            }
          }, 2000);
          
        } catch (err) {
          console.error("Cart init error:", err);
        }
      };
      
      initCart();
    }
  }, [dispatch, navigate, hasLoaded, cartItems]);

  const getItemDetails = (item) => {
    const productName = item.product?.name || item.product_name || "Product";
    const originalPrice = parseFloat(
      item.product?.price || 
      item.product_price || 
      item.price || 
      0
    );
    const discount = parseFloat(
      item.product?.discount || 
      item.product_discount || 
      item.discount || 
      0
    );
    const salePrice = salePriceFunc(originalPrice, discount);
    const quantity = item.quantity || 1;
    const imageUrl = getImageUrl(item);
    
    return {
      productName,
      originalPrice,
      discount,
      salePrice,
      quantity,
      imageUrl
    };
  };

  const calculateTotals = () => {
    if (!cartItems || cartItems.length === 0) { 
      return { 
        subtotal: 0, 
        discountSavings: 0,
        shipping: 0, 
        tax: 0, 
        total: 0 
      };
    }
    
    let subtotal = 0;
    let discountSavings = 0;
    
    cartItems.forEach(item => {
      const { originalPrice, discount, salePrice, quantity } = getItemDetails(item);
      subtotal += (salePrice * quantity);
      
      if (discount > 0) {
        const discountAmount = (originalPrice * discount) / 100;
        discountSavings += (discountAmount * quantity);
      }
    });
    
    const shipping = subtotal > 5000 ? 0 : 200;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;
    
    return { 
      subtotal: parseFloat(subtotal.toFixed(2)), 
      discountSavings: parseFloat(discountSavings.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)), 
      tax: parseFloat(tax.toFixed(2)), 
      total: parseFloat(total.toFixed(2)) 
    };
  };
  
  const { subtotal, discountSavings, shipping, tax, total } = calculateTotals();

  const handleNextStep = () => {
    if (step === 1) {
      if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
        toast.error("Please fill all required shipping details");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    
    try {
      const getBackendPaymentMethod = () => {
        switch(paymentMethod) {
          case "cashOnDelivery": return "cash_on_delivery";
          case "jazzcash": return "jazzcash";
          case "easypaisa": return "easypaisa";
          case "card": return "card";
          default: return "cash_on_delivery";
        }
      };

      const orderData = {
        customer_name: shippingAddress.fullName,
        customer_email: shippingAddress.email,
        customer_phone: shippingAddress.phone,
        shipping_address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state || ''}, ${shippingAddress.country}`,
        shipping_city: shippingAddress.city,
        shipping_state: shippingAddress.state || "",
        shipping_postal_code: shippingAddress.postalCode || "",
        shipping_country: shippingAddress.country || "Pakistan",
        payment_method: getBackendPaymentMethod(),
        items: cartItems.map(item => {
          const { originalPrice, discount, salePrice, quantity } = getItemDetails(item);
          const productId = item.product?.id || item.product_id;
          
          return {
            product: productId,
            product_name: item.product?.name || item.product_name,
            original_price: originalPrice,
            discount_percentage: discount,
            discounted_price: salePrice,
            quantity: quantity || 1,
          };
        }),
        items_price: subtotal,
        discount_savings: discountSavings,
        tax_price: tax,
        shipping_price: shipping,
        total_price: total,
      };
      
      console.log("📦 Sending order to:", ORDER_API_URL);
      console.log("📦 Order data:", JSON.stringify(orderData, null, 2));
      
      const token = localStorage.getItem("access");
      if (!token) {
        toast.error("Please login to place order");
        navigate("/login");
        return;
      }
      
      // ✅ Using the correct URL with /api/
      const response = await axios.post(
        ORDER_API_URL,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("✅ Order API response:", response.data);
      
      dispatch(empptyCart());
      toast.success("🎉 Order placed successfully!");
      
      navigate("/order-confirmation", { 
        state: { 
          order: response.data.order || response.data
        }
      });
      
    } catch (error) {
      console.error("❌ Order error:", error.response?.data);
      
      if (error.response?.status === 400) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
          Object.keys(errors).forEach(key => {
            toast.error(`${key}: ${JSON.stringify(errors[key])}`);
          });
        } else {
          toast.error(errors?.message || "Validation error");
        }
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error(`API not found. Please check: ${ORDER_API_URL}`);
        console.error("❌ The URL should match your Django backend pattern: api/orders/create/");
      } else {
        toast.error(error.response?.data?.error || "Failed to place order. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  if ((loading && !hasLoaded)) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30 text-black">
      <div className="container mx-auto p-4 md:p-6">
        
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between relative">
            {steps.map((s, index) => (
              <div key={s.number} className="flex flex-col items-center z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  step >= s.number 
                    ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-600/30" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {s.icon}
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  step >= s.number ? "text-teal-600" : "text-gray-500"
                }`}>
                  {s.title}
                </span>
              </div>
            ))}
            <div className="absolute top-6 left-12 right-12 h-1 bg-gray-200 -z-10">
              <div 
                className="h-full bg-gradient-to-r from-teal-600 to-teal-500 transition-all duration-500"
                style={{ width: `${(step - 1) * 50}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-teal-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/30 mr-4">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Shipping Address</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="03XX XXXXXXX"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      placeholder="Lahore"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-black mb-2">
                      Complete Address *
                    </label>
                    <textarea
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      rows="3"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      placeholder="House #, Street, Area"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-teal-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/30 mr-4">
                    <FaCreditCard className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
                </div>
                
                <div className="space-y-4">
                  <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "cashOnDelivery" 
                      ? "border-teal-500 bg-teal-50 shadow-md shadow-teal-100" 
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                  onClick={() => setPaymentMethod("cashOnDelivery")}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                        paymentMethod === "cashOnDelivery" 
                          ? "border-teal-500" 
                          : "border-gray-300"
                      }`}>
                        {paymentMethod === "cashOnDelivery" && (
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-600 to-teal-500"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "card" 
                      ? "border-teal-500 bg-teal-50 shadow-md shadow-teal-100" 
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                        paymentMethod === "card" 
                          ? "border-teal-500" 
                          : "border-gray-300"
                      }`}>
                        {paymentMethod === "card" && (
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-600 to-teal-500"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Credit/Debit Card</h3>
                        <p className="text-sm text-gray-600">Pay securely with your card</p>
                      </div>
                    </div>
                    
                    {paymentMethod === "card" && (
                      <div className="pl-9 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "jazzcash" 
                      ? "border-teal-500 bg-teal-50 shadow-md shadow-teal-100" 
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                  onClick={() => setPaymentMethod("jazzcash")}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                        paymentMethod === "jazzcash" 
                          ? "border-teal-500" 
                          : "border-gray-300"
                      }`}>
                        {paymentMethod === "jazzcash" && (
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-600 to-teal-500"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">JazzCash</h3>
                        <p className="text-sm text-gray-600">Pay via JazzCash wallet</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "easypaisa" 
                      ? "border-teal-500 bg-teal-50 shadow-md shadow-teal-100" 
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                  onClick={() => setPaymentMethod("easypaisa")}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                        paymentMethod === "easypaisa" 
                          ? "border-teal-500" 
                          : "border-gray-300"
                      }`}>
                        {paymentMethod === "easypaisa" && (
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-600 to-teal-500"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">EasyPaisa</h3>
                        <p className="text-sm text-gray-600">Pay via EasyPaisa wallet</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-teal-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/30 mr-4">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Review Your Order</h2>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                    <FaMapMarkerAlt className="text-teal-600 mr-2" />
                    Shipping Address
                  </h3>
                  <div className="bg-gradient-to-r from-gray-50 to-teal-50/50 p-4 rounded-xl border border-teal-100">
                    <p className="font-bold text-gray-800">{shippingAddress.fullName}</p>
                    <p className="text-gray-600">{shippingAddress.address}</p>
                    <p className="text-gray-600">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                    <p className="text-gray-600">{shippingAddress.country}</p>
                    <p className="text-gray-600">📱 {shippingAddress.phone}</p>
                    <p className="text-gray-600">📧 {shippingAddress.email}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                    <FaCreditCard className="text-teal-600 mr-2" />
                    Payment Method
                  </h3>
                  <div className="bg-gradient-to-r from-gray-50 to-teal-50/50 p-4 rounded-xl border border-teal-100">
                    <p className="font-bold text-gray-800 capitalize">
                      {paymentMethod === "cashOnDelivery" && "Cash on Delivery"}
                      {paymentMethod === "card" && "Credit/Debit Card"}
                      {paymentMethod === "jazzcash" && "JazzCash"}
                      {paymentMethod === "easypaisa" && "EasyPaisa"}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {paymentMethod === "cashOnDelivery" && "Pay when you receive your order"}
                      {paymentMethod === "card" && "Payment will be processed securely"}
                      {paymentMethod === "jazzcash" && "You'll be redirected to JazzCash"}
                      {paymentMethod === "easypaisa" && "You'll be redirected to EasyPaisa"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all hover:shadow-md"
                >
                  ← Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold rounded-xl hover:from-teal-700 hover:to-teal-600 transition-all shadow-lg shadow-teal-600/30 hover:shadow-xl"
                >
                  Continue to {step === 1 ? "Payment" : "Review"} →
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-600 transition-all shadow-lg shadow-green-600/30 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock className="text-sm" />
                      Place Order
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 border border-teal-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="max-h-80 overflow-y-auto mb-6 custom-scrollbar">
                {cartItems.map((item, index) => {
                  const { productName, originalPrice, discount, salePrice, quantity, imageUrl } = getItemDetails(item);
                  
                  return (
                    <div key={index} className="flex items-center py-3 border-b border-gray-100 last:border-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={imageUrl}
                          alt={productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm line-clamp-2">
                          {productName}
                        </h4>
                        <div className="mt-1">
                          <p className="text-teal-600 font-bold text-sm">
                            Rs. {salePrice.toLocaleString()} 
                            {discount > 0 && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-2">
                                -{discount}%
                              </span>
                            )}
                          </p>
                          {discount > 0 && (
                            <p className="text-xs text-gray-500 line-through">
                              Rs. {originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <p className="text-gray-600 text-xs mt-1">
                          Qty: {quantity}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-bold text-sm text-gray-800">
                          Rs. {(salePrice * quantity).toLocaleString()}
                        </p>
                        {discount > 0 && (
                          <p className="text-xs text-gray-500 line-through">
                            Rs. {(originalPrice * quantity).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                
                {discountSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount Savings</span>
                    <span className="font-bold">- Rs. {discountSavings.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold">{shipping === 0 ? "FREE" : `Rs. ${shipping.toLocaleString()}`}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Rs. {tax.toLocaleString()}</span>
                </div>
                
                <div className="pt-4 border-t-2 border-teal-200">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-teal-600">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-teal-50/50 p-4 rounded-xl border border-teal-100">
                <div className="flex items-center mb-2">
                  <FaLock className="text-green-600 mr-2" />
                  <span className="font-bold text-gray-800">Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-600">
                  Your personal and payment information is encrypted and secure.
                </p>
              </div>
              
              <div className="mt-6 space-y-1 text-center text-sm text-gray-500">
                <p className="flex items-center justify-center gap-1">✅ 7-day Exchange policy</p>
                <p className="flex items-center justify-center gap-1">✅ Free shipping on orders over Rs. 5,000</p>
                <p className="flex items-center justify-center gap-1">✅ 24/7 customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #14b8a6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0d9488;
        }
      `}</style>
    </div>
  );
};

export default Checkout;