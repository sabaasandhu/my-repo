import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, addToCart } from "../redux/actions/cartActions";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaRuler, FaPalette } from "react-icons/fa";
import salePriceFunc from "../helpers/Func";

// Image base URL - same as used in other components
const IMAGE_BASE_URL = "https://web-production-10987.up.railway.app";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, loading } = useSelector(state => state.cartSlice);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    console.log("=== CART PAGE LOADED ===");
    console.log("Cart items received:", cartItems);
    dispatch(fetchCart());
  }, [dispatch]);

  // Debug ke liye
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      console.log("=== CART ITEMS DEBUG ===");
      console.log("First item full:", cartItems[0]);
      console.log("Keys in first item:", Object.keys(cartItems[0]));
      
      const firstItem = cartItems[0];
      console.log("Discount check:");
      console.log("1. product?.discount:", firstItem.product?.discount);
      console.log("2. product_discount:", firstItem.product_discount);
      console.log("3. discount:", firstItem.discount);
      console.log("4. product?.product_discount:", firstItem.product?.product_discount);
    }
  }, [cartItems]);

  // Get image URL helper
  const getImageUrl = (item) => {
    let imagePath = null;
    
    // Check multiple possible image locations
    if (item.product?.images && item.product.images.length > 0) {
      imagePath = item.product.images[0].image;
    } else if (item.product?.image) {
      imagePath = item.product.image;
    } else if (item.product_image) {
      imagePath = item.product_image;
    } else if (item.image) {
      imagePath = item.image;
    }
    
    if (!imagePath) {
      return '/placeholder.jpg';
    }
    
    // If it already has http, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Add base URL
    return `${IMAGE_BASE_URL}${imagePath}`;
  };

  const handleQuantityChange = async (productId, change, size, color) => {
    console.log("🔄 Quantity update called:", { productId, change, size, color });
    
    const item = cartItems.find(item => 
      item.product?.id === productId || 
      item.product_id === productId
    );
    
    if (!item) {
      console.error("❌ Item not found");
      return;
    }
    
    const currentQty = item.quantity || 1;
    const newQty = currentQty + change;
    
    console.log("Current:", currentQty, "New:", newQty);
    
    if (newQty < 1) {
      await dispatch(removeFromCart(productId));
      return;
    }
    
    setUpdating({ ...updating, [productId]: true });
    
    try {
      console.log("📦 Calling addToCart with new quantity:", newQty);
      await dispatch(addToCart(productId, newQty, 'product', size, color));
      
      setTimeout(() => {
        console.log("🔄 Refreshing cart...");
        dispatch(fetchCart());
      }, 500);
      
      toast.success(`Quantity updated to ${newQty}`);
      
    } catch (error) {
      console.error("❌ Update failed:", error);
      toast.error("Failed to update quantity");
    } finally {
      setUpdating({ ...updating, [productId]: false });
    }
  };

  const handleRemoveItem = async (productId, size, color) => {
    if (!productId) return;
    
    try {
      await dispatch(removeFromCart(productId, size, color));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const getItemDetails = (item) => {
    const productType = item.product_type || 'product';
    const productId = item.product_id || item.product?.id;
    const productName = item.product_name || item.product?.name || 'Product';
    const originalPrice = parseFloat(item.product_price || item.product?.price || 0);
    const discount = parseFloat(item.product_discount || item.product?.discount || 0);
    const salePrice = salePriceFunc(originalPrice, discount);
    const productImage = getImageUrl(item);
    const quantity = item.quantity || 1;
    const selectedSize = item.size || item.selected_size || item.product_size || '';
    const selectedColor = item.color || item.selected_color || item.product_color || '';
    const id = item.id || item.cart_item_id;

    return {
      id,
      productType,
      productId,
      productName,
      originalPrice,
      discount,
      salePrice,
      productImage,
      quantity,
      selectedSize,
      selectedColor
    };
  };

  const calculateSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    return cartItems.reduce((total, item) => {
      const { originalPrice, discount, quantity } = getItemDetails(item);
      const salePrice = salePriceFunc(originalPrice, discount);
      return total + (salePrice * quantity);
    }, 0);
  };

  const calculateDiscountSavings = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    return cartItems.reduce((savings, item) => {
      const { originalPrice, discount, quantity } = getItemDetails(item);
      if (discount > 0) {
        const discountAmount = (originalPrice * discount) / 100;
        return savings + (discountAmount * quantity);
      }
      return savings;
    }, 0);
  };

  const shipping = 200;
  const subtotal = calculateSubtotal();
  const discountSavings = calculateDiscountSavings();
  const total = subtotal + shipping;
  
  // Free shipping on orders above Rs. 5000
  const finalShipping = subtotal > 5000 ? 0 : shipping;
  const finalTotal = subtotal + finalShipping;

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
        Your Shopping Cart 🛒
      </h1>
      
      {!cartItems || cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-teal-100">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gradient-to-r from-teal-50 to-teal-100 rounded-full">
            <FaShoppingBag className="text-4xl text-teal-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            Your cart is empty
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-medium py-3 px-8 rounded-xl transition duration-300 shadow-lg shadow-teal-600/30 hover:shadow-xl"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-teal-100 bg-gradient-to-r from-teal-50/50 to-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    Cart Items ({cartItems.length})
                  </h2>
                  <Link 
                    to="/" 
                    className="text-teal-600 hover:text-teal-800 font-medium text-sm hover:underline"
                  >
                    Continue Shopping →
                  </Link>
                </div>
              </div>
              
              <div className="divide-y divide-teal-50">
                {cartItems.map((item) => {
                  const { 
                    id,
                    productId, 
                    productName, 
                    originalPrice, 
                    discount, 
                    salePrice, 
                    productImage, 
                    quantity,
                    selectedSize,
                    selectedColor
                  } = getItemDetails(item);
                  
                  return (
                    <div key={id || productId} className="p-4 md:p-6 hover:bg-teal-50/30 transition">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-xl overflow-hidden border border-teal-100">
                            <img 
                              src={productImage}
                              alt={productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/placeholder.jpg';
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                                {productName}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {selectedSize && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-200">
                                    <FaRuler className="w-3 h-3" />
                                    Size: {selectedSize}
                                  </span>
                                )}
                                {selectedColor && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                                    <FaPalette className="w-3 h-3" />
                                    Color: {selectedColor}
                                  </span>
                                )}
                              </div>

                              {/* Price with discount */}
                              <div className="mb-2">
                                <p className="text-teal-600 font-bold text-lg">
                                  Rs. {salePrice.toLocaleString()}
                                </p>
                                
                                {discount > 0 && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-gray-500 line-through">
                                      Rs. {originalPrice.toLocaleString()}
                                    </span>
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                      {discount}% OFF
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Remove button */}
                            <button
                              onClick={() => handleRemoveItem(productId, selectedSize, selectedColor)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                              title="Remove item"
                              disabled={updating[productId]}
                            >
                              <FaTrash className="text-lg" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border-2 border-teal-200 rounded-xl overflow-hidden shadow-sm">
                              <button
                                onClick={() => handleQuantityChange(productId, -1, selectedSize, selectedColor)}
                                className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 transition disabled:opacity-50"
                                disabled={quantity <= 1 || updating[productId]}
                              >
                                <FaMinus />
                              </button>
                              <span className="px-6 py-2 bg-white min-w-[60px] text-center font-bold text-teal-700">
                                {quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(productId, 1, selectedSize, selectedColor)}
                                className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 transition disabled:opacity-50"
                                disabled={updating[productId]}
                              >
                                <FaPlus />
                              </button>
                            </div>
                            
                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Item Total</p>
                              <p className="font-bold text-lg text-teal-700">
                                Rs. {(salePrice * quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 border border-teal-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>
                
                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {subtotal > 5000 ? (
                      <span className="text-green-600 font-bold">FREE</span>
                    ) : (
                      `Rs. ${shipping.toLocaleString()}`
                    )}
                  </span>
                </div>
                
                {/* Discount Savings */}
                {discountSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount Savings</span>
                    <span className="font-bold">
                      - Rs. {discountSavings.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {/* Total */}
                <div className="flex justify-between text-lg font-bold pt-4 border-t-2 border-teal-200">
                  <span className="text-gray-800">Total</span>
                  <span className="text-teal-600 text-xl">
                    Rs. {finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Proceed to Checkout */}
              <Link
                to="/checkout"
                className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-bold py-4 rounded-xl transition duration-300 shadow-lg shadow-teal-600/30 hover:shadow-xl text-center block"
              >
                Proceed to Checkout →
              </Link>
              
              {/* Additional Info */}
              <div className="text-center text-sm text-gray-500 mt-4 space-y-2">
                <p className="flex items-center justify-center gap-1">✅ Free shipping on orders over Rs. 5,000</p>
                <p className="flex items-center justify-center gap-1">✅ 30-day return policy</p>
                <p className="flex items-center justify-center gap-1">✅ Secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;