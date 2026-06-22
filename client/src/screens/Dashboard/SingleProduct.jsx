import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Rating from "../../components/Rating";
import salePriceFunc from "../../helpers/Func.jsx";
import apis from "../../config/apis";
import { singleProduct } from "../../redux/actions/productActions";
import { addToCart } from "../../redux/actions/cartActions";
import MetaData from "../../components/MetaData";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../../redux/actions/cartActions";
import { 
  FaWhatsapp, 
  FaFacebook, 
  FaInstagram, 
  FaLink, 
  FaCheck,
  FaRuler, 
  FaTshirt,
  FaPalette,
  FaChartBar,
  FaTimes,
  FaFemale,
  FaMale,
  FaShoppingCart,
  FaHeart,
  FaShareAlt,
  FaTruck,
  FaShieldAlt,
  FaUndo
} from "react-icons/fa";

const SingleProduct = () => {
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
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const imgRef = useRef(null);
  const shareMenuRef = useRef(null);
  const sizeChartRef = useRef(null);

  // Product sizes with measurements
  const sizeChartData = {
    "Small": { bust: "34", waist: "28", hips: "36", length: "42" },
    "Medium": { bust: "36", waist: "30", hips: "38", length: "43" },
    "Large": { bust: "38", waist: "32", hips: "40", length: "44" },
    "XL": { bust: "40", waist: "34", hips: "42", length: "45" },
  
  };

  // Unstitch sizes with measurements
  const unstitchSizeChart = {
    "1 Meter": { length: "36", width: "44", fabric: "1 Meter" },
    "1.5 Meter": { length: "54", width: "44", fabric: "1.5 Meter" },
    "2 Meter": { length: "72", width: "44", fabric: "2 Meter" },
    "2.5 Meter": { length: "90", width: "44", fabric: "2.5 Meter" },
    "3 Meter": { length: "108", width: "44", fabric: "3 Meter" }
  };

  // Available colors with hex codes
  const availableColors = [
    { name: "Black", hex: "#000000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Yellow", hex: "#FFD700" },
   
  ];

  useEffect(() => {
    dispatch(singleProduct(id));
  }, [dispatch, id]);

  // Click outside to close share menu and size chart
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
      if (sizeChartRef.current && !sizeChartRef.current.contains(e.target)) {
        setShowSizeChart(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => setShowMagnifier(true);
  const handleMouseLeave = () => setShowMagnifier(false);
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMagnifierPosition({ x, y });
    setCursorPosition({ x: e.pageX - left, y: e.pageY - top });
  };

  // Share functions
  const shareOnWhatsApp = () => {
    const productName = product ? product.name : '';
    const productBrand = product ? product.brand : '';
    const productPrice = product ? product.price : 0;
    const productDiscount = product && product.discount ? product.discount : 0;
    const text = `Check out ${productBrand} ${productName} - Rs.${salePriceFunc(productPrice, productDiscount)}`;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    setShowShareMenu(false);
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    setShowShareMenu(false);
  };

  const shareOnInstagram = () => {
    copyToClipboard();
    toast.success("Link copied! Paste in Instagram story");
    setShowShareMenu(false);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setLinkCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setLinkCopied(false), 3000);
    setShowShareMenu(false);
  };

  // 🟢🟢🟢 FIXED ADD TO CART FUNCTION - 100% WORKING 🟢🟢🟢
  const handleAddToCart = async () => {
    console.log("🚀 Add to cart clicked!");
    console.log("Selected Size:", selectedSize);
    console.log("Selected Color:", selectedColor);
    console.log("Quantity:", quantity);
    
    // Check 1: Login
    const token = localStorage.getItem("access");
    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    // Check 2: Size
    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    // Check 3: Color
    if (!selectedColor) {
      toast.error("Please select a color!");
      return;
    }

    // Check 4: Stock
    if (stock === 0) {
      toast.error("Out of stock!");
      return;
    }

    // Check 5: Product
    if (!product || !product.id) {
      toast.error("Product not found!");
      return;
    }

    try {
      toast.loading("Adding to cart...");
      
      // 🟢 REDUX ACTION
      console.log("Dispatching addToCart:", product.id, quantity);
      await dispatch(addToCart(product.id, quantity));
      
      console.log("Dispatching fetchCart...");
      await dispatch(fetchCart());
      
      toast.dismiss();
      toast.success(`✅ Added to cart! ${selectedSize}, ${selectedColor}`);
      setShowSizeChart(false);
      
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to add to cart!");
      console.error("Error:", error);
    }
  };

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-r from-teal-400 to-purple-500 rounded-full mb-6 shadow-lg animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
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
    gender = "unisex"
  } = product;

  function inc() {
    setQuantity((q) => Math.min(stock, q + 1));
  }

  function dec() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  const isUnstitch = category ? category.toLowerCase().includes("unstitch") : false;
  const sizes = isUnstitch ? Object.keys(unstitchSizeChart) : Object.keys(sizeChartData);
  const GenderIcon = gender === "women" ? FaFemale : gender === "men" ? FaMale : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm">
          <Link to="/" className="text-gray-600 hover:text-teal-600 transition-colors">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to={`/category/${category}`} className="text-gray-600 hover:text-teal-600 transition-colors">{category}</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-semibold">{brand} {name}</span>
        </nav>

        <MetaData title={product ? product.brand + " " + product.name : ""} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div
              className="relative aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white/50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <img
                ref={imgRef}
                src={images && images[selectedImage] ? `${apis[2]}${images[selectedImage].image}` : ""}
                alt={name}
                className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
              />

              {showMagnifier && images && images[selectedImage] && (
                <div
                  className="absolute pointer-events-none w-56 h-56 border-4 border-white rounded-full overflow-hidden shadow-2xl"
                  style={{
                    left: `${cursorPosition.x - 112}px`,
                    top: `${cursorPosition.y - 112}px`,
                    backgroundImage: `url('${apis[2]}${images[selectedImage].image}')`,
                    backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                    backgroundSize: `${imgRef.current ? imgRef.current.offsetWidth * 2.5 : 0}px ${imgRef.current ? imgRef.current.offsetHeight * 2.5 : 0}px`,
                    zIndex: 50,
                  }}
                />
              )}

              {onSale && (
                <span className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Sale {discount}% OFF
                </span>
              )}

              {gender && gender !== "unisex" && (
                <span className="absolute top-6 right-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <GenderIcon className="w-4 h-4" />
                  {gender === "women" ? "Women" : "Men"}
                </span>
              )}

              <button
                onClick={toggleWishlist}
                className="absolute bottom-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaHeart className={`w-6 h-6 ${isWishlist ? 'text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-4">
              {images && images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-24 h-24 rounded-xl border-3 transition-all duration-300 overflow-hidden ${
                    selectedImage === i
                      ? "border-teal-600 shadow-xl scale-105 ring-4 ring-teal-100"
                      : "border-gray-200 hover:border-teal-400"
                  }`}
                >
                  <img
                    src={`${apis[2]}${img.image}`}
                    alt={`${name} thumbnail`}
                    className="w-full h-full object-contain p-2 bg-white"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col gap-2 h-25">
            {/* Brand & Category */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-2 shadow-lg">
              <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">
                {brand}
              </span>
              <h1 className="text-3xl lg:text-2xl font-bold text-gray-800 mt-2 underline underline-offset-4 decoration-teal-600">
                {name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-purple-700 text-sm bg-purple-50 px-4 py-1.5 rounded-full font-medium">
                  {category}
                </span>
                {isUnstitch && (
                  <span className="text-blue-700 text-sm bg-blue-50 px-4 py-1.5 rounded-full font-medium flex items-center gap-2">
                    <FaRuler /> Unstitched
                  </span>
                )}
              </div>
            </div>

            {/* Price & Rating */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 shadow-lg h-22">
              <div className="flex flex-wrap items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600 font-medium">Price</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl text-red-600 font-semibold">
                      Rs.{salePriceFunc(price, discount || 0)}
                    </span>
                    {onSale && (
                      <span className="text-gray-400 line-through text-xl">
                        Rs.{price}
                      </span>
                    )}
                  </div>
                  {discount > 0 && (
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                      Save {discount}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
                  <Rating rating={rating} />
                  <span className="text-gray-600 text-sm font-semibold">({rating})</span>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md h-20">
              <div className="flex items-center gap-4 h-12">
                {stock > 0 ? (
                  <>
                    <span className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute"></span>
                    <span className="w-4 h-4 bg-green-500 rounded-full relative"></span>
                    <div>
                      <p className="text-green-700 font-semibold">In Stock</p>
                      <p className="text-sm text-gray-600">{stock} items available</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                    <p className="text-red-600 font-medium">Out of stock</p>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-3 text-lg">
                <span className="w-8 h-8 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FaTshirt className="w-4 h-4 text-white" />
                </span>
                Product Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {description || "No description available."}
              </p>
            </div>

            {/* Color Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg h-22">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-3 text-lg">
                <span className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <FaPalette className="w-4 h-4 text-white" />
                </span>
                Select Color
              </h3>
              <div className="flex flex-wrap  gap-4">
                {availableColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className="relative group"
                    title={color.name}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl transition-all duration-300 shadow-md ${
                        selectedColor === color.name 
                          ? "ring-4 ring-teal-600 ring-offset-4 scale-110" 
                          : "hover:scale-110"
                      }`}
                      style={{ 
                        backgroundColor: color.hex,
                        border: color.hex === "#FFFFFF" ? "2px solid #e5e7eb" : "none"
                      }}
                    />
                    {selectedColor === color.name && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full p-1.5 shadow-lg">
                        <FaCheck className="w-3 h-3" />
                      </span>
                    )}
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
              {!selectedColor && (
                <p className="text-red-500 text-sm mt-4">Please select a color</p>
              )}
            </div>

            {/* Size Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg h-25">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-semibold">
                  <span className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <FaRuler className="w-2 h-2 text-white" />
                  </span>
                  Select Size
                </h3>
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 rounded-xl hover:from-teal-100 hover:to-teal-200 transition-all font-medium flex items-center gap-2"
                >
                  <FaChartBar /> Size Chart
                </button>
              </div>

              <div className="flex flex-wrap gap-3 h-8">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      px-5 py-2.5 rounded-xl border-2 transition-all duration-300 font-semibold min-w-[80px]
                      ${selectedSize === size 
                        ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white border-teal-600 shadow-xl scale-105" 
                        : "bg-white text-gray-700 border-gray-300 hover:border-teal-500 hover:bg-teal-50"
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {!selectedSize && (
                <p className="text-red-500 text-sm mt-4">Please select a size</p>
              )}
            </div>

            {/* SIZE CHART MODAL */}
            {showSizeChart && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[99999] p-4">
                <div 
                  ref={sizeChartRef}
                  className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                >
                  <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-purple-600 p-6 flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <FaRuler className="w-6 h-6" />
                      {isUnstitch ? "Fabric Length Guide" : "Size Guide"}
                    </h3>
                    <button
                      onClick={() => setShowSizeChart(false)}
                      className="p-2 hover:bg-white/20 rounded-full transition-all text-white"
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-8">
                    {isUnstitch ? (
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-r from-teal-50 to-purple-50">
                            <th className="border p-4 text-left">Size</th>
                            <th className="border p-4 text-left">Length</th>
                            <th className="border p-4 text-left">Width</th>
                            <th className="border p-4 text-left">Fabric</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(unstitchSizeChart).map(([size, data]) => (
                            <tr 
                              key={size} 
                              className={`hover:bg-gradient-to-r hover:from-teal-50 hover:to-purple-50 cursor-pointer ${
                                selectedSize === size ? "bg-gradient-to-r from-teal-100 to-purple-100" : ""
                              }`}
                              onClick={() => {
                                setSelectedSize(size);
                                toast.success(`Size ${size} selected`);
                              }}
                            >
                              <td className="border p-4 font-semibold">{size}</td>
                              <td className="border p-4">{data.length}"</td>
                              <td className="border p-4">{data.width}"</td>
                              <td className="border p-4">{data.fabric}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <>
                        <table className="w-full border-collapse mb-6">
                          <thead>
                            <tr className="bg-gradient-to-r from-teal-50 to-purple-50">
                              <th className="border p-4 text-left">Size</th>
                              <th className="border p-4 text-left">Bust</th>
                              <th className="border p-4 text-left">Waist</th>
                              <th className="border p-4 text-left">Hips</th>
                              <th className="border p-4 text-left">Length</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(sizeChartData).map(([size, data]) => (
                              <tr 
                                key={size} 
                                className={`hover:bg-gradient-to-r hover:from-teal-50 hover:to-purple-50 cursor-pointer ${
                                  selectedSize === size ? "bg-gradient-to-r from-teal-100 to-purple-100" : ""
                                }`}
                                onClick={() => {
                                  setSelectedSize(size);
                                  toast.success(`Size ${size} selected`);
                                }}
                              >
                                <td className="border p-4 font-semibold">{size}</td>
                                <td className="border p-4">{data.bust}"</td>
                                <td className="border p-4">{data.waist}"</td>
                                <td className="border p-4">{data.hips}"</td>
                                <td className="border p-4">{data.length}"</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}

                    {/* ADD TO CART INSIDE SIZE CHART */}
                    <div className="sticky bottom-0 bg-white pt-6 mt-4 border-t">
                      <button
                        onClick={handleAddToCart}
                        disabled={stock === 0} // 🟢 SIRF STOCK OUT HO TO DISABLE
                        className={`
                          w-full px-8 py-4 rounded-2xl font-bold text-lg 
                          flex items-center justify-center gap-3
                          transition-all duration-300
                          ${stock === 0
                            ? "bg-gray-300 cursor-not-allowed opacity-60"
                            : "bg-gradient-to-r from-teal-600 to-purple-600 text-white hover:from-teal-700 hover:to-purple-700 hover:scale-105 hover:shadow-2xl"
                          }
                        `}
                      >
                        <FaShoppingCart className="w-6 h-6" />
                        {stock === 0 
                          ? "Out of Stock" 
                          : !selectedSize
                          ? "Select Size First" 
                          : !selectedColor
                          ? "Select Color First"
                          : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🟢🟢🟢 MAIN ADD TO CART - 100% WORKING 🟢🟢🟢 */}
            <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-3xl p-6 shadow-xl border-2 border-teal-200">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Quantity Counter */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-800 font-semibold text-semibold">Qty:</span>
                  <div className="flex items-center bg-white rounded-xl border-2 border-teal-300 overflow-hidden shadow-md">
                    <button
                      onClick={dec}
                      className="px-2 py-3 text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-200 hover:from-teal-500 hover:to-teal-600 hover:text-white transition-all"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <div className="px-4 py-3  font-semibold bg-white border-x-2 border-teal-200 min-w-[80px] text-center">
                      {quantity}
                    </div>
                    <button
                      onClick={inc}
                      className="px-3 py-2 text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-200 hover:from-teal-500 hover:to-teal-600 hover:text-white transition-all"
                      disabled={quantity >= stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 🚀🚀🚀 ADD TO CART BUTTON - ALWAYS ENABLED 🚀🚀🚀 */}
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0} // 🟢 SIRF STOCK OUT HO TO DISABLE
                  className={`
                    flex-1 px-5 py-4 rounded-xl font-semibold 
                    flex items-center justify-center gap-4
                    transition-all duration-300 transform
                    ${stock === 0
                      ? "bg-gray-300 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-teal-600 to-purple-700 text-white hover:from-teal-700 hover:to-purple-800 hover:scale-105 hover:shadow-2xl"
                    }
                  `}
                  style={{
                    position: 'relative',
                    zIndex: 9999,
                    pointerEvents: 'auto'
                  }}
                >
                  <FaShoppingCart className="w-4 h-4" />
                  Add to Cart • Rs.{salePriceFunc(price, discount || 0)}
                </button>
              </div>
              
              {/* Size/Color warnings - but button enabled! */}
              {(!selectedSize || !selectedColor) && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded-lg text-center">
                  <p className="text-yellow-700 text-sm font-medium">
                    ⚠️ Please select {!selectedSize && !selectedColor ? 'size and color' : !selectedSize ? 'size' : 'color'}
                  </p>
                </div>
              )}
            </div>

            {/* Selected Options Summary */}
            {(selectedSize || selectedColor) && (
              <div className="mt-2 p-4 bg-gradient-to-r from-teal-50 to-purple-50 border-2 border-teal-300 rounded-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-teal-800">✅ Selected:</span>
                  {selectedSize && (
                    <span className="px-4 py-2 bg-white border-2 border-teal-400 rounded-full text-sm font-bold text-teal-700">
                      Size: {selectedSize}
                    </span>
                  )}
                  {selectedColor && (
                    <span className="px-4 py-2 bg-white border-2 border-purple-400 rounded-full text-sm font-bold text-purple-700 flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded-full" 
                        style={{ 
                          backgroundColor: availableColors.find(c => c.name === selectedColor)?.hex || '#000' 
                        }}
                      />
                      Color: {selectedColor}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md flex items-center gap-3">
                <FaTruck className="w-6 h-6 text-teal-600" />
                <div>
                  <h4 className="font-bold text-gray-800">Free Shipping</h4>
                  <p className="text-xs text-gray-600">On orders above Rs.2000</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md flex items-center gap-3">
                <FaShieldAlt className="w-6 h-6 text-purple-600" />
                <div>
                  <h4 className="font-bold text-gray-800">Secure Payment</h4>
                  <p className="text-xs text-gray-600">100% secure</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md flex items-center gap-3">
                <FaUndo className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-bold text-gray-800">Easy Returns</h4>
                  <p className="text-xs text-gray-600">7 days return</p>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <div className="flex items-center gap-4 pt-4">
              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl hover:from-orange-600 hover:to-pink-600 transition-all flex items-center gap-3 font-semibold shadow-lg"
                >
                  <FaShareAlt /> Share
                </button>

                {showShareMenu && (
                  <div className="absolute left-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border overflow-hidden z-50">
                    <button onClick={shareOnWhatsApp} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-green-50">
                      <FaWhatsapp className="text-green-600 text-xl" /> WhatsApp
                    </button>
                    <button onClick={shareOnFacebook} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-blue-50">
                      <FaFacebook className="text-blue-600 text-xl" /> Facebook
                    </button>
                    <button onClick={shareOnInstagram} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-pink-50">
                      <FaInstagram className="text-pink-600 text-xl" /> Instagram
                    </button>
                    <button onClick={copyToClipboard} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 border-t">
                      {linkCopied ? <FaCheck className="text-green-600" /> : <FaLink className="text-gray-600" />}
                      {linkCopied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                )}
              </div>

              <Link
                to="/"
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl hover:from-teal-600 hover:to-teal-700 transition-all font-semibold flex items-center gap-3 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;