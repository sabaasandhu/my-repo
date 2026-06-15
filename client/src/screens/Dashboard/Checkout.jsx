import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart, empptyCart } from "../../redux/actions/cartActions";
import axios from "axios";
import { orderApis } from "../../config/apis";
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

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, loading, error, hasLoaded } = useSelector(state => state.cartSlice);
  const { user } = useSelector(state => state.auth);
  
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirm
  const [processing, setProcessing] = useState(false);
  const initialCheckDone = useRef(false);

  // Form states
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
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: ""
  });
  
  const steps = [
    { number: 1, title: "Shipping", icon: <FaTruck /> },
    { number: 2, title: "Payment", icon: <FaCreditCard /> },
    { number: 3, title: "Confirm", icon: <FaCheckCircle /> }
  ];

  useEffect(() => {
    console.log("🔄 Checkout useEffect called");
    
    if (!initialCheckDone.current) {
      initialCheckDone.current = true;
      
      const initCart = async () => {
        try {
          await dispatch(fetchCart());
          
          setTimeout(() => {
            if (hasLoaded && (!cartItems || cartItems.length === 0)) {
              console.log("Cart empty after load, redirecting...");
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

  // Calculate item price with discount
  const getItemDetails = (item) => {
    const productName = item.product?.name || item.product_name;
    const originalPrice = parseFloat(item.product?.price || item.product_price || 0);
    
    // Get discount from multiple possible fields (Navigation aur Cart ki tarah)
    const discount = parseFloat(
      item.product?.discount || 
      item.product_discount || 
      item.discount || 
      0
    );
    
    const salePrice = salePriceFunc(originalPrice, discount);
    const quantity = item.quantity || 1;
   const imageUrl = item.product_image 
  ? `http://localhost:8000${item.product_image}`
  : (item.product?.images?.[0]?.image 
      ? `http://localhost:8000${item.product.images[0].image}` 
      : '/default-product.jpg');
    
    return {
      productName,
      originalPrice,
      discount,
      salePrice,
      quantity,
      imageUrl
    };
  };

  // Calculate totals with discount
  const calculateTotals = () => {
    if (!cartItems || cartItems.length === 0) return { 
      subtotal: 0, 
      discountSavings: 0,
      shipping: 0, 
      tax: 0, 
      total: 0 
    };
    
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
    const tax = subtotal * 0.05; // 5% tax
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

      // Prepare order data with discounted prices
      const orderData = {
        customer_name: shippingAddress.fullName,
        customer_email: shippingAddress.email,
        customer_phone: shippingAddress.phone,
        shipping_address: shippingAddress.address,
        shipping_city: shippingAddress.city,
        shipping_state: shippingAddress.state,
        shipping_postal_code: shippingAddress.postalCode,
        shipping_country: shippingAddress.country,
        payment_method: getBackendPaymentMethod(), 
        items: cartItems.map(item => {
          const { originalPrice, discount, salePrice, quantity } = getItemDetails(item);
          
          return {
            product: item.product?.id || item.product_id,
            product_name: item.product?.name || item.product_name,
            original_price: originalPrice,  // Original price
            discount_percentage: discount,   // Discount percentage
            discounted_price: salePrice,     // Price after discount
            quantity: quantity || 1,
            image: item.product?.images?.[0]?.image || item.product_image || ''
          };
        }),
        items_price: subtotal,      
        discount_savings: discountSavings, // Total discount savings
        tax_price: tax,            
        shipping_price: shipping,  
        total_price: total, 
      };
      
      console.log("Sending order data:", orderData);
      
      const token = localStorage.getItem("access");
      const response = await axios.post(
        orderApis.create, 
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Order API response:", response.data);
      
      // Clear cart from Redux
      dispatch(empptyCart());
      
      toast.success("🎉 Order placed successfully!");
      
      navigate("/order-confirmation", { 
        state: { 
          orderId: response.data.order.order_number,
          orderData: response.data.order
        }
      });
      
    } catch (error) {
      console.error("❌ Order error:", error.response?.data);
      
      if (error.response?.status === 400) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
          Object.keys(errors).forEach(key => {
            toast.error(`${key}: ${errors[key]}`);
          });
        } else {
          toast.error(errors || "Validation error");
        }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-6">
        
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between relative">
            {steps.map((s, index) => (
              <div key={s.number} className="flex flex-col items-center z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                  step >= s.number 
                    ? "bg-teal-600 text-white" 
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
                className="h-full bg-teal-600 transition-all duration-500"
                style={{ width: `${(step - 1) * 50}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <FaMapMarkerAlt className="text-teal-600 text-xl mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Shipping Address</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                      className="w-full text-black border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="03XX XXXXXXX"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complete Address *
                    </label>
                    <textarea
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="House #, Street, Area"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <FaCreditCard className="text-teal-600 text-xl mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
                </div>
                
                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    paymentMethod === "cashOnDelivery" 
                      ? "border-teal-500 bg-teal-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("cashOnDelivery")}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        paymentMethod === "cashOnDelivery" 
                          ? "border-teal-500" 
                          : "border-gray-300"
                      }`}>
                        {paymentMethod === "cashOnDelivery" && (
                          <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Credit/Debit Card */}
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    paymentMethod === "card" 
                      ? "border-teal-500 bg-teal-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        paymentMethod === "card" 
                          ? "border-teal-500" 
                          : "border-gray-300"
                      }`}>
                        {paymentMethod === "card" && (
                          <div className="w-3 h-3 rounded-full bg-teal-500"></div>
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
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* JazzCash */}
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    paymentMethod === "jazzcash" 
                      ? "border-teal-500 bg-teal-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("jazzcash")}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        paymentMethod === "jazzcash" 
                          ? "border-teal-500" 
                          : "border-gray-300"
                      }`}>
                        {paymentMethod === "jazzcash" && (
                          <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">JazzCash</h3>
                        <p className="text-sm text-gray-600">Pay via JazzCash wallet</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Order Review */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <FaCheckCircle className="text-teal-600 text-xl mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Review Your Order</h2>
                </div>
                
                {/* Shipping Address Review */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{shippingAddress.fullName}</p>
                    <p className="text-gray-600">{shippingAddress.address}</p>
                    <p className="text-gray-600">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                    <p className="text-gray-600">{shippingAddress.country}</p>
                    <p className="text-gray-600">📱 {shippingAddress.phone}</p>
                    <p className="text-gray-600">📧 {shippingAddress.email}</p>
                  </div>
                </div>
                
                {/* Payment Method Review */}
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Payment Method</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium capitalize">
                      {paymentMethod === "cashOnDelivery" && "Cash on Delivery"}
                      {paymentMethod === "card" && "Credit/Debit Card"}
                      {paymentMethod === "jazzcash" && "JazzCash"}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {paymentMethod === "cashOnDelivery" && "Pay when you receive your order"}
                      {paymentMethod === "card" && "Payment will be processed securely"}
                      {paymentMethod === "jazzcash" && "You'll be redirected to JazzCash"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="ml-auto px-8 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition shadow-md hover:shadow-lg"
                >
                  Continue to {step === 1 ? "Payment" : "Review"} →
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="ml-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" />
                      Place Order 
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="max-h-80 overflow-y-auto mb-6">
                {cartItems.map((item, index) => {
                  const { productName, originalPrice, discount, salePrice, quantity, imageUrl } = getItemDetails(item);
                  
                  return (
                    <div key={index} className="flex items-center py-3 border-b border-gray-100">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
    src={imageUrl.startsWith('/') ? `http://localhost:8000${imageUrl}` : imageUrl} 
    alt={productName}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.src = '/default-product.jpg';
    }}
  />

                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-gray-800 text-sm line-clamp-2">
                          {productName}
                        </h4>
                        <div className="mt-1">
                          <p className="text-teal-600 font-bold text-sm">
                            Rs. {salePrice.toLocaleString()} 
                            {discount > 0 && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded ml-2">
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
                      <div className="text-right">
                        <p className="font-bold text-sm">
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
              
              {/* Order Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                
                {/* Discount Savings */}
                {discountSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount Savings</span>
                    <span className="font-bold">- Rs. {discountSavings.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `Rs. ${shipping.toLocaleString()}`}</span>
                </div>
                
              
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-teal-600">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Security Badge */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <FaLock className="text-green-600 mr-2" />
                  <span className="font-medium text-gray-800">Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-600">
                  Your personal and payment information is encrypted and secure.
                </p>
              </div>
              
              {/* Return Policy */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>✅ 7-day Exchange policy</p>
                <p>✅ Free shipping on orders over Rs. 5,000</p>
                <p>✅ 24/7 customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;