import React, {useEffect,useState} from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaCheckCircle, FaTruck, FaHome, FaShoppingBag } from "react-icons/fa";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order data from location state
  const { order: apiOrderData } = location.state || {};
  
  // Transform API data to match component structure
  const orderData = apiOrderData ? {
    orderId: apiOrderData.order_number || apiOrderData.id,
    customer_email: apiOrderData.customer_email,
    customer_name: apiOrderData.customer_name,
    shipping_address: apiOrderData.shipping_address,
    shipping_city: apiOrderData.shipping_city,
    total_price: apiOrderData.total_price,
    items: apiOrderData.items || []
  } : {
    orderId: `ORD-${Date.now()}`,
    customer_email: "",
    customer_name: "",
    shipping_address: "",
    shipping_city: "",
    total_price: 0,
    items: []
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-8 text-center text-white">
            <FaCheckCircle className="text-6xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-teal-100">Thank you for your purchase</p>
            <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="font-mono font-bold tracking-wider">Order #: {orderData.orderId}</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Your order has been received
              </h2>
              <p className="text-gray-600">
                We've sent a confirmation email to {orderData.customer_email || "your email"}
              </p>
            </div>
            
            {/* Order Details */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Order Details</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="font-bold">{orderData.customer_name || "Guest"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipping City</p>
                  <p className="font-medium">{orderData.shipping_city || "Your City"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Total</p>
                  <p className="font-bold text-xl text-teal-600">
                    Rs. {orderData.total_price?.toLocaleString() || "0"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">Cash on Delivery</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">Shipping Address</p>
                <p className="font-medium">{orderData.shipping_address || "Address not provided"}</p>
              </div>
              
              {/* Order Items Preview */}
              <div className="mt-6">
                <h4 className="font-bold text-gray-800 mb-3">Items in your order</h4>
                <div className="space-y-3">
                  {orderData.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.product_name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <FaShoppingBag className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product_name || item.name}</p>
                        <p className="text-gray-600 text-sm">
                          Qty: {item.quantity} × Rs. {item.product_price || item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                  {orderData.items.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      + {orderData.items.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaTruck className="text-teal-600 text-xl" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">Track Your Order</h4>
                <p className="text-sm text-gray-600">Real-time tracking updates</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaShoppingBag className="text-blue-600 text-xl" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">Shop More</h4>
                <p className="text-sm text-gray-600">Discover new products</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaHome className="text-purple-600 text-xl" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">Go Home</h4>
                <p className="text-sm text-gray-600">Return to homepage</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-lg text-center transition shadow-md hover:shadow-lg"
              >
                Continue Shopping
              </Link>
              
            
            </div>
            
            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm mb-2">
                Need help? Contact our support team
              </p>
              <p className="font-medium">📞 042-111-123-456 | ✉️ support@sabanosh.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;