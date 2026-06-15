const calculateSubTotal = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) {
    console.warn("calculateSubTotal: cartItems is not an array", cartItems);
    return 0;
  }
  
  let subTotal = 0;
  
  cartItems.forEach(item => {
    try {
      // Different possible structures
      if (item.product && item.product.price) {
        // Structure 1: {product: {price: ...}, quantity: ...}
        subTotal += parseFloat(item.product.price) * (item.quantity || 1);
      } else if (item.product_price) {
        // Structure 2: {product_price: ..., quantity: ...}
        subTotal += parseFloat(item.product_price) * (item.quantity || 1);
      } else if (item.price) {
        // Structure 3: {price: ..., quantity: ...}
        subTotal += parseFloat(item.price) * (item.quantity || 1);
      }
    } catch (error) {
      console.error("Error calculating price for item:", item, error);
    }
  });
  
  return subTotal;
};

const updateLocalStorage = (cartData) => {
  localStorage.setItem("cartItems", JSON.stringify(cartData));
 localStorage.setItem("subTotal", calculateSubTotal(cartData));
};

export { calculateSubTotal, updateLocalStorage };
