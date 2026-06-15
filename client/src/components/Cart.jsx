import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, addToCart } from "../redux/actions/cartActions";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from "react-icons/fa";
import salePriceFunc from "../helpers/Func";

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
      
      // Check discount field
      const firstItem = cartItems[0];
      console.log("Discount check:");
      console.log("1. product?.discount:", firstItem.product?.discount);
      console.log("2. product_discount:", firstItem.product_discount);
      console.log("3. discount:", firstItem.discount);
      console.log("4. product?.product_discount:", firstItem.product?.product_discount);
    }
  }, [cartItems]);

const handleQuantityChange = async (productId, change , size, color) => {
  console.log("🔄 Quantity update called:", { productId, change, size, color });
  
  // Item find karein
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
    // Agar quantity 0 ho jaye, item remove karein
    await dispatch(removeFromCart(productId));
    return;
  }
  
  setUpdating({ ...updating, [productId]: true });
  
  try {
    console.log("📦 Calling addToCart with new quantity:", newQty);
    
    // ✅ IMPORTANT: addToCart ko NEW quantity ke sath call karein
    await dispatch(addToCart(productId, newQty, 'product', size, color));
    
    // ✅ Thoda wait karein phir refresh karein
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

// Cart.js - getItemDetails function update
const getItemDetails = (item) => {
  // ✅ Now we have product_type field
  const productType = item.product_type || 'product';
  const productId = item.product_id;
  const productName = item.product_name || 'Product';
  const originalPrice = parseFloat(item.product_price || 0);
  const discount = item.product_discount || 0;
  const salePrice = salePriceFunc(originalPrice, discount);
  const productImage = item.product_image;
  const quantity = item.quantity || 1;
  const selectedSize = item.size || item.selected_size || item.product_size || '';
  const selectedColor = item.color || item.selected_color || item.product_color || '';

  return {
    productType,
    productId,
    productName,
    originalPrice,
    discount,
    salePrice,
    productImage,
    quantity,
    selectedSize,    // ✅ ADDED
    selectedColor    
  };
};

  // Calculate subtotal with discount
  const calculateSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    return cartItems.reduce((total, item) => {
      const { originalPrice, discount, quantity } = getItemDetails(item);
      const salePrice = salePriceFunc(originalPrice, discount);
      return total + (salePrice * quantity);
    }, 0);
  };

  // Calculate total discount savings
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
    <div className="container mx-auto p-4 md:p-6 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
        Your Shopping Cart
      </h1>
      
      {!cartItems || cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
            <FaShoppingBag className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Your cart is empty
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Cart Items ({cartItems.length})
                  </h2>
                  <Link 
                    to="/" 
                    className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {cartItems.map((item) => {
                  const { 
                    productId, 
                    productName, 
                    originalPrice, 
                    discount, 
                    salePrice, 
                    productImage, 
                    quantity ,
                    selectedSize,    // ✅ YEH ADD KIYA
                    selectedColor    
                  } = getItemDetails(item);
                  
                  // Image URL
                  let imageUrl = '/default-product.jpg';
                  if (productImage) {
                    if (productImage.startsWith('http')) {
                      imageUrl = productImage;
                    } else if (productImage.startsWith('/uploads/')) {
                      imageUrl = `http://localhost:8000${productImage}`;
                    } else if (productImage.startsWith('uploads/')) {
                      imageUrl = `http://localhost:8000/${productImage}`;
                    } else {
                      imageUrl = `http://localhost:8000/uploads/${productImage}`;
                    }
                  }
                  
                  return (
                    <div key={item.id || productId} className="p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <img 
                              src={imageUrl}
                              alt={productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/default-product.jpg';
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-1">
                                {productName}
                              </h3>
                                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                {selectedSize && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-200">
                                    <FaRuler className="w-3 h-3" />
                                    Size: {selectedSize}
                                  </span>
                                )}
                                {selectedColor && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                                    <FaPalette className="w-3 h-3" />
                                    Color: {selectedColor}
                                  </span>
                                )}
</div>

                              {/* Price with discount */}
                              <div className="mb-2">
                                <p className="text-teal-600 dark:text-teal-400 font-bold text-lg">
                                  Rs. {salePrice.toLocaleString()}
                                </p>
                                
                                {discount > 0 ? (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                      Rs. {originalPrice.toLocaleString()}
                                    </span>
                                    <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-1 rounded">
                                      {discount}% OFF
                                    </span>
                                  </div>
                                ) : (
                                  <div className="h-6"></div>
                                )}
                              </div>
                            </div>
                            
                            {/* Remove button */}
                            <button
                             onClick={() => handleRemoveItem(productId, selectedSize, selectedColor)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Remove item"
                              disabled={updating[productId]}
                            >
                              <FaTrash className="text-lg" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                              <button
                                                       onClick={() => handleQuantityChange(productId, -1, selectedSize, selectedColor)}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                                disabled={quantity <= 1 || updating[productId]}
                              >
                                <FaMinus />
                              </button>
                              <span className="px-6 py-2 bg-white dark:bg-gray-800 min-w-[60px] text-center font-medium">
                                {quantity}
                              </span>
                              <button
                                                         onClick={() => handleQuantityChange(productId, 1, selectedSize, selectedColor)}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                                disabled={updating[productId]}
                              >
                                <FaPlus />
                                
                              </button>
                            </div>
                            
                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Item Total</p>
                              <p className="font-bold text-lg">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>
                
                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium">Rs. {shipping.toLocaleString()}</span>
                </div>
                
                {/* Discount Savings */}
                {discountSavings > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount Savings</span>
                    <span className="font-bold">
                      - Rs. {discountSavings.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {/* Total */}
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-800 dark:text-white">Total</span>
                  <span className="text-teal-600 dark:text-teal-400">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Proceed to Checkout */}
              <Link
                to="/checkout"
                className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold py-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg text-center block"
              >
                Proceed to Checkout
              </Link>
              
              {/* Additional Info */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                <p>Free shipping on orders over Rs. 5000</p>
                <p className="mt-2">30-day return policy</p>
              </div>
              
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;