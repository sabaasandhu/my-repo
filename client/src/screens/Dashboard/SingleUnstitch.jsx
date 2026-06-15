import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Rating from "../../components/Rating";
import salePriceFunc from "../../helpers/func";
import apis from "../../config/apis";
import { singleUnstitch } from "../../redux/actions/productActions";
import { addToCart } from "../../redux/actions/cartActions"; // ✅ import Add to Cart action
import MetaData from "../../components/MetaData";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../../redux/actions/cartActions"; // ✅ import fetchCart action



const SingleUnstitch = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.prodSlice);
const user = useSelector((state) => state.auth.user);  
  const navigate = useNavigate();
  



  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  
  useEffect(() => {
      dispatch(singleUnstitch(id));  
   }, [dispatch, id]);

  const handleMouseEnter = () => setShowMagnifier(true);
  const handleMouseLeave = () => setShowMagnifier(false);
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMagnifierPosition({ x, y });
    setCursorPosition({ x: e.pageX - left, y: e.pageY - top });
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  const {
    name,
    brand,
    price,
    category,
    rating,
    discount,
    stock,
    onSale,
    images,
    description,
  } = product;

  function inc() {
    setQuantity((q) => Math.min(stock, q + 1)); // ✅ limit by stock
  }

  function dec() {
    setQuantity((q) => Math.max(1, q - 1));
  }


const handleAddToCart = async () => {
  const token = localStorage.getItem("access");

  if (!token) {
    toast.error("Please login first");
    navigate("/login");
    return;
  }

  try {
    console.log("Adding unstitch to cart:", {
      product_id: product.id,
      quantity: quantity,
      product_type: 'unstitch'  // ✅ IMPORTANT: Specify product type
    });
    
    // ✅ Use SAME API but with product_type parameter
    await dispatch(addToCart(product.id, quantity, 'unstitch'));  // 'unstitch' pass karein
    
    // ✅ Refresh cart
    await dispatch(fetchCart());
    
    toast.success("Unstitch added to cart! 🛒");
    
  } catch (error) {
    console.error("Add to cart failed:", error);
    toast.error("Failed to add to cart");
  }
};
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Product Images */}
      <div>
        <MetaData title={product && product.brand + " " + product.name} />

        <div
          className="relative aspect-square bg-white rounded-xl shadow-lg overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <img
            ref={imgRef}
           src={`${apis[2]}${images?.[selectedImage]?.image || ""}`}  
            alt={`${name} thumbnail`}
            className="w-full h-full object-contain cursor-zoom-in"
          />

          {showMagnifier && (
            <div
              className="absolute pointer-events-none w-48 h-48 border-2 border-gray-300 rounded-full overflow-hidden"
              style={{
                left: `${cursorPosition.x - 99}px`,
                top: `${cursorPosition.y - 99}px`,
                backgroundImage: `url('${apis[2]}${images?.[selectedImage]?.image || ""}')`,
                backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                backgroundSize: `${imgRef.current?.offsetWidth * 2}px ${imgRef.current?.offsetHeight * 2}px`,
                backgroundRepeat: "no-repeat",
                zIndex: 12,
              }}
            />
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 mt-4">
          {images?.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`w-20 h-20 rounded-md border ${
                selectedImage === i
                  ? "border-blue-600"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <img
                src={`${apis[2]}${img.image}`}
                alt={`${name} thumbnail`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Product Details */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-800">
          {brand} {name}
        </h1>

        <span className="text-purple-600 text-sm bg-purple-100 px-2 py-1 rounded w-fit">
          {category}
        </span>

        <div className="flex items-center gap-4">
          <span className="text-2xl text-red-600 font-semibold">
            Rs.{salePriceFunc(price, discount || 0)}
            {onSale && (
              <sup className="text-gray-500 line-through text-sm ml-1">
                Rs.{price}
              </sup>
            )}
          </span>
          <Rating rating={rating} />
        </div>

        {stock > 0 ? (
          <p className="text-green-600">{stock} items left in stock</p>
        ) : (
          <p className="text-red-500">Out of stock</p>
        )}

        <p className="text-gray-700">{description}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={dec}
              className="px-3 py-2 hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <div className="px-4 py-2">{quantity}</div>
            <button
              onClick={inc}
              className="px-3 py-2 hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
  onClick={handleAddToCart} 
  title="Add to Cart"
  className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg shadow hover:bg-teal-700"
>
  Add to Cart
</button>


          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm hover:bg-teal-500 hover:shadow-md"
          >
            Share
          </button>

          <Link
            to="/"
            className="px-4 py-2 border border-orange-400 rounded-lg hover:bg-orange-400 h-10 mt-7 text-teal-600"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleUnstitch;
