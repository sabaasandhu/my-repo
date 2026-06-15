import React, { useState, useEffect } from "react";
import { HiShoppingBag } from "react-icons/hi2";
import Rating from "./Rating";
import { useSelector, useDispatch } from "react-redux";
import {addToCartMesg} from '../helpers/message'
import salePriceFunc from "../helpers/Func";
import { Link,Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import apis from "../config/apis";
import { addToCart }  from '../redux/actions/cartActions'


const ProductCard = ({ product, index }) => {
  const [isHover, setIsHover] = useState(false);
  const {
    id,
    name,
    brand,
    image,
    price,
    category,
    rating,
    discount,
    stock,
    onSale,
  } = product;


  const {favorties} = useSelector((state) => state.prodSlice);
  const { cartItems } = useSelector((state) => state.cartSlice);
  const dispatch = useDispatch();


  const [cartDisabled, setCartDisabled] = useState(false);

  // const addCartItem = (id) => {
  //   if(cartItems.some(cartItem =>cartItem.id === id )){
  //     console.log('its is already in the cart')
  //     const item = cartItems.find(cartItem =>cartItem.id == id);
  //     dispatch(addCartItem(id, item.qty + 1))
  //   }
  //   else{
  //        dispatch(addCartItem(id, 1))
  //        console.log('its added first time')

  //   }
  //   addToCartMesg("Item has been added to the cart");
  // };

  //  useEffect(()=>{
  //           const item = cartItems.find(cartItem =>cartItem.id == id);
  //           if(item && item.qty == stock){
  //               setCartDisabled(true)
  //           }
  //  },[cartItems, product])


  return (
    
    <motion.div
      className=" dark:bg-gray-800 text-black dark:text-white text-gray-700 dark:text-gray-300

 border border-teal-500 bg-white mt-20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
    >
      <div
        className="p-2 overflow-hidden relative aspect-square"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
            -{discount}% Off
          </div>
        )}

        <div className="w-full h-50 flex items-center justify-center">
          <img
            src={
              isHover
                ? `${apis[2]}${product.images?.[0]?.image || product.images?.[0]?.image}`
                : `${apis[2]}${product.images?.[1]?.image}`

                // ? `${apis[2]}${product.images[0].image}`
                // : `${apis[2]}${product.images[1].image}`
            }
            alt={name}
            className={`w-full h-80 mt-5 object-contain transition-transform duration-300 ${
              isHover ? "scale-105" : "scale-100"
            }`}
            style={{ maxHeight: "full", maxWidth: "full" }}
          />
        </div>
      </div>

      <div className="p-4 flex flex-col ">
        <h3 className="text-lg font-bold text-center text-gray-800 mb-2 line-clamp-2">
          {brand} {name}
        </h3>

        <div className="flex  items-center justify-between">
          <span className="text-red-600 font-semibold">
            Rs.{salePriceFunc(price, discount || 0)}
            {onSale && (
              <sup className="text-gray-500 line-through text-sm ml-1">
                Rs.{price}
              </sup>
            )}
          </span>
          <span className="text-purple-600 text-sm bg-purple-100 px-2 py-1 rounded">
            {category}
          </span>
        </div>

        <div className="flex mt-3 items-center justify-between">
          <Rating rating={rating} />

          {stock > 0 ? (
            <span className="text-lg text-purple-500">
              {stock} item{stock > 1 && "s"} left
            </span>
          ) : (
            <span className="text-lg text-red-500"> out of stock </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Link
            to={`/products/${id}`}
            className="flex-grow text-center bg-blue-600 text-white hover:bg-blue-700 rounded-md py-2 px-4 text-sm transition-colors"
          >
            View Details
          </Link>
<button
  disabled={stock == 0}
  title={stock == 0 ? "You cannot add this item to the cart" : undefined}
  onClick={async () => {
    try {
      await dispatch(addToCart(id, 1));
      // Refresh cart after adding
      dispatch(fetchCart());
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  }}
  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
  aria-label="Add to cart"
>
  <HiShoppingBag className="w-5 h-5 text-orange-600" />
</button>

        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
