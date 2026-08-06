import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import Rating from "../../components/Rating";
import salePriceFunc from "../../helpers/Func.jsx";
import { singleProduct } from "../../redux/actions/productActions";
import { addToCart, fetchCart } from "../../redux/actions/cartActions";
import MetaData from "../../components/MetaData";
import toast from "react-hot-toast";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaLink,
  FaCheck,
  FaRuler,
  FaTshirt,
  FaChartBar,
  FaTimes,
  FaFemale,
  FaMale,
  FaShoppingCart,
  FaHeart,
  FaShareAlt,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaExpand,
  FaMinus,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";

const IMAGE_BASE_URL = "https://web-production-10987.up.railway.app";

const SIZE_CHART = {
  Small: { bust: "34", waist: "28", hips: "36", length: "42" },
  Medium: { bust: "36", waist: "30", hips: "38", length: "43" },
  Large: { bust: "38", waist: "32", hips: "40", length: "44" },
  XL: { bust: "40", waist: "34", hips: "42", length: "45" },
};

const UNSTITCH_SIZE_CHART = {
  "1 Meter": { length: "36", width: "44", fabric: "1 Meter" },
  "1.5 Meter": { length: "54", width: "44", fabric: "1.5 Meter" },
  "2 Meter": { length: "72", width: "44", fabric: "2 Meter" },
  "2.5 Meter": { length: "90", width: "44", fabric: "2.5 Meter" },
  "3 Meter": { length: "108", width: "44", fabric: "3 Meter" },
};

export default function SingleProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector((state) => state.prodSlice);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const imgRef = useRef(null);
  const shareMenuRef = useRef(null);
  const sizeChartRef = useRef(null);

  useEffect(() => {
    dispatch(singleProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    setSelectedSize("");
    setSelectedImage(0);
    setQuantity(1);
    setImageLoaded(false);
    setActiveTab("description");
  }, [id]);

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

  const MAGNIFIER_SIZE = 200;

  const handleMouseEnter = () => setShowMagnifier(true);
  const handleMouseLeave = () => setShowMagnifier(false);
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    
    const x = (relX / rect.width) * 100;
    const y = (relY / rect.height) * 100;
    setMagnifierPosition({ x, y });

    const half = MAGNIFIER_SIZE / 2;
    const clampedX = Math.min(Math.max(relX, half), rect.width - half);
    const clampedY = Math.min(Math.max(relY, half), rect.height - half);
    setCursorPosition({ x: clampedX, y: clampedY });
  };

  const shareOnWhatsApp = () => {
    const productName = product?.name || "";
    const productBrand = product?.brand || "";
    const productPrice = product?.price || 0;
    const productDiscount = product?.discount || 0;
    const text = `✨ Check out ${productBrand} ${productName} - Rs.${salePriceFunc(
      productPrice,
      productDiscount
    )}`;
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

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    if (!product?.stock) {
      toast.error("Out of stock!");
      return;
    }

    if (!product?.id) {
      toast.error("Product not found!");
      return;
    }

    try {
      setAddingToCart(true);
      await dispatch(addToCart(product.id, quantity));
      await dispatch(fetchCart());
      toast.success(`Added ${quantity} item(s) to cart ✨`);
      setShowSizeChart(false);
    } catch (error) {
      toast.error("Failed to add to cart!");
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-amber-500" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-amber-500" />);
    }
    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-amber-300" />);
    }
    return stars;
  };

  const getImageUrl = (img) => (img ? `${IMAGE_BASE_URL}${img.image}` : "/placeholder.jpg");

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-rose-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-amber-600 rounded-full animate-ping opacity-75" />
            </div>
          </div>
          <p className="text-amber-800 font-medium mt-6 text-lg">Loading product...</p>
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
    gender = "unisex",
  } = product;

  const inc = () => setQuantity((q) => Math.min(stock, q + 1));
  const dec = () => setQuantity((q) => Math.max(1, q - 1));

  const isUnstitch = category ? category.toLowerCase().includes("unstitch") : false;
  const sizeChart = isUnstitch ? UNSTITCH_SIZE_CHART : SIZE_CHART;
  const sizes = Object.keys(sizeChart);
  const GenderIcon = gender === "women" ? FaFemale : gender === "men" ? FaMale : null;
  const readyToAdd = stock > 0 && Boolean(selectedSize);
  const salePrice = salePriceFunc(price, discount || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-all mb-4 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-amber-100">
          <Link to="/" className="text-amber-600 hover:text-amber-800 transition-all hover:scale-105 font-medium">
            Home
          </Link>
          <span className="text-amber-300">▸</span>
          <Link
            to={`/category/${category ? category.toLowerCase() : ""}`}
            className="text-amber-600 hover:text-amber-800 transition-all hover:scale-105 font-medium capitalize"
          >
            {category}
          </Link>
          <span className="text-amber-300">▸</span>
          <span className="text-amber-800 font-semibold truncate max-w-[200px]">
            {brand} {name}
          </span>
        </nav>

        <MetaData title={product ? `${product.brand} ${product.name}` : ""} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Product Images */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            {images && images.length > 1 && (
              <div className="flex sm:flex-col gap-3 w-full sm:w-24 flex-shrink-0 overflow-x-auto sm:overflow-x-visible">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedImage(i);
                      setImageLoaded(false);
                    }}
                    className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 transition-all overflow-hidden bg-white shadow-md hover:shadow-xl ${
                      selectedImage === i
                        ? "border-amber-600 shadow-amber-200/50 ring-4 ring-amber-100 scale-105"
                        : "border-amber-200/50 hover:border-amber-400 hover:scale-105"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${name} thumbnail ${i + 1}`}
                      className="w-full h-full object-contain p-2"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 space-y-4">
              <div
                className="relative aspect-square bg-gradient-to-br from-amber-100/30 via-white to-orange-50/50 rounded-3xl shadow-2xl overflow-hidden border border-amber-200/50 group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                    <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                  </div>
                )}
                <img
                  ref={imgRef}
                  src={getImageUrl(images?.[selectedImage])}
                  alt={name}
                  className={`w-full h-full object-contain p-4 transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />

                {/* Magnifier */}
                {showMagnifier && images?.[selectedImage] && imageLoaded && (
                  <div
                    className="hidden sm:block absolute pointer-events-none rounded-2xl overflow-hidden transition-[left,top] duration-75 ease-out shadow-2xl"
                    style={{
                      width: `${MAGNIFIER_SIZE}px`,
                      height: `${MAGNIFIER_SIZE}px`,
                      left: `${cursorPosition.x - MAGNIFIER_SIZE / 2}px`,
                      top: `${cursorPosition.y - MAGNIFIER_SIZE / 2}px`,
                      backgroundImage: `url('${getImageUrl(images[selectedImage])}')`,
                      backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                      backgroundSize: `${imgRef.current ? imgRef.current.offsetWidth * 2.5 : 0}px ${
                        imgRef.current ? imgRef.current.offsetHeight * 2.5 : 0
                      }px`,
                      border: "3px solid white",
                      boxShadow: "0 0 0 3px #f59e0b, 0 20px 40px -10px rgba(0,0,0,0.4)",
                      zIndex: 50,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 rounded-2xl" />
                  </div>
                )}

                {/* Zoom indicator */}
                {!showMagnifier && (
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaExpand className="w-5 h-5 text-amber-600" />
                  </div>
                )}

                {/* Badges */}
                {onSale && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-red-500/30 flex items-center gap-2 animate-pulse">
                      ⚡ Sale {discount}% OFF
                    </div>
                  </div>
                )}

                {gender && gender !== "unisex" && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2">
                    <GenderIcon className="w-4 h-4" />
                    {gender === "women" ? "Women" : "Men"}
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={toggleWishlist}
                  className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-all hover:shadow-2xl group"
                  aria-label="Toggle wishlist"
                >
                  <FaHeart className={`w-5 h-5 transition-colors ${isWishlist ? "text-rose-500" : "text-gray-400 group-hover:text-rose-500"}`} />
                </button>

                {/* Out of Stock Overlay */}
                {stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                    <div className="bg-white/95 px-8 py-6 rounded-2xl shadow-2xl">
                      <p className="text-red-600 font-bold text-2xl">Out of Stock</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnails - Mobile */}
              {images && images.length > 1 && (
                <div className="flex sm:hidden gap-3 overflow-x-auto pb-2 px-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedImage(i);
                        setImageLoaded(false);
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl border-2 transition-all overflow-hidden bg-white shadow-md ${
                        selectedImage === i
                          ? "border-amber-600 shadow-amber-200/50 ring-2 ring-amber-100"
                          : "border-amber-200/50 hover:border-amber-400"
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${name} thumbnail ${i + 1}`}
                        className="w-full h-full object-contain p-1.5"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col gap-5">
            {/* Brand & Category */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-amber-600 uppercase tracking-wider bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-2xl border border-amber-200">
                  {brand}
                </span>
                {stock > 0 && (
                  <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    In Stock
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-amber-900 mt-2 leading-tight">{name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-amber-700 text-sm bg-amber-50 px-4 py-2 rounded-2xl font-medium border border-amber-200 capitalize flex items-center gap-2">
                  <FaTshirt className="w-3.5 h-3.5" />
                  {category}
                </span>
                {isUnstitch && (
                  <span className="text-orange-700 text-sm bg-orange-50 px-4 py-2 rounded-2xl font-medium border border-orange-200 flex items-center gap-2">
                    <FaRuler className="w-3.5 h-3.5" /> Unstitched
                  </span>
                )}
              </div>
            </div>

            {/* Price & Rating */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-sm text-amber-600 font-medium">Price</span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-3xl font-bold text-amber-700">
                      Rs.{salePrice}
                    </span>
                    {onSale && (
                      <span className="text-gray-400 line-through text-xl">Rs.{price}</span>
                    )}
                  </div>
                  {discount > 0 && (
                    <span className="inline-block bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 px-4 py-1.5 rounded-2xl text-sm font-bold mt-2 border border-emerald-200">
                      Save {discount}% 🔥
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
                    <div className="flex gap-0.5">{renderStars(rating)}</div>
                    <span className="text-amber-800 font-bold ml-1">({rating})</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">⭐ {rating} out of 5</span>
                </div>
              </div>
            </div>

            {/* Tabs - Description, Reviews, Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100 overflow-hidden">
              <div className="flex border-b border-amber-100">
                {["description", "reviews", "details"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                      activeTab === tab
                        ? "text-amber-700 bg-amber-50 border-b-2 border-amber-600"
                        : "text-gray-500 hover:text-amber-600 hover:bg-amber-50/50"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="p-6">
                {activeTab === "description" && (
                  <p className="text-amber-800/80 leading-relaxed">
                    {description || "No description available."}
                  </p>
                )}
                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                  </div>
                )}
                {activeTab === "details" && (
                  <div className="space-y-2 text-amber-800/80">
                    <p><span className="font-semibold">Brand:</span> {brand}</p>
                    <p><span className="font-semibold">Category:</span> {category}</p>
                    <p><span className="font-semibold">Gender:</span> {gender}</p>
                    <p><span className="font-semibold">Stock:</span> {stock} items</p>
                    {isUnstitch && <p><span className="font-semibold">Type:</span> Unstitched Fabric</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-amber-900 flex items-center gap-2">
                  <span className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-600/30">
                    <FaRuler className="w-5 h-5 text-white" />
                  </span>
                  Select Size
                </h3>
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-2xl hover:from-amber-100 hover:to-orange-100 transition-all font-medium flex items-center gap-2 text-sm border border-amber-200 shadow-sm hover:shadow-md"
                >
                  <FaChartBar className="w-4 h-4" /> Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-2xl border-2 transition-all font-bold min-w-[80px] ${
                      selectedSize === size
                        ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-600 shadow-lg shadow-amber-600/30 scale-105"
                        : "bg-white text-amber-800 border-amber-200 hover:border-amber-400 hover:bg-amber-50 hover:shadow-md"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {!selectedSize && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                  <p className="text-amber-700 text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    Please select a size to continue
                  </p>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-100">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <span className="text-amber-900 font-bold">Qty:</span>
                  <div className="flex items-center bg-white rounded-2xl border-2 border-amber-200 overflow-hidden shadow-sm">
                    <button
                      onClick={dec}
                      className="px-4 py-3 text-xl font-bold text-amber-600 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-amber-600"
                      disabled={quantity <= 1}
                    >
                      <FaMinus className="w-4 h-4" />
                    </button>
                    <div className="px-6 py-3 font-bold bg-amber-50 border-x-2 border-amber-200 min-w-[60px] text-center text-amber-900">
                      {quantity}
                    </div>
                    <button
                      onClick={inc}
                      className="px-4 py-3 text-xl font-bold text-amber-600 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-amber-600"
                      disabled={quantity >= stock}
                    >
                      <FaPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!readyToAdd || addingToCart}
                  className={`flex-1 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all text-lg ${
                    !readyToAdd
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-600/30 hover:shadow-xl hover:scale-[1.02]"
                  }`}
                >
                  <FaShoppingCart className="w-5 h-5" />
                  {stock === 0
                    ? "Out of Stock"
                    : addingToCart
                    ? "Adding..."
                    : `Add to Cart • Rs.${salePrice}`}
                </button>
              </div>

              {stock > 0 && !selectedSize && (
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl text-center">
                  <p className="text-yellow-700 text-sm font-medium">⚠️ Please select a size first</p>
                </div>
              )}
            </div>

            {/* Selected Size Summary */}
            {selectedSize && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-amber-800">✓ Selected:</span>
                  <span className="px-5 py-2.5 bg-white border-2 border-amber-300 rounded-2xl text-sm font-bold text-amber-700 shadow-sm">
                    Size: {selectedSize}
                  </span>
                  <span className="text-sm text-amber-600 font-medium">
                    Qty: {quantity}
                  </span>
                </div>
              </div>
            )}

            {/* Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: FaTruck, title: "Free Shipping", desc: "On orders above Rs.2000", color: "amber" },
                { icon: FaShieldAlt, title: "Secure Payment", desc: "100% secure", color: "emerald" },
                { icon: FaUndo, title: "Easy Returns", desc: "7 days return", color: "blue" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-100 flex items-center gap-3 hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className={`w-12 h-12 bg-${item.color}-100 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-amber-600/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Share & Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl hover:from-amber-700 hover:to-orange-700 transition-all flex items-center gap-3 font-bold shadow-lg shadow-amber-600/30 hover:shadow-xl"
                >
                  <FaShareAlt className="w-5 h-5" /> Share
                </button>

                {showShareMenu && (
                  <div className="absolute left-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden z-50">
                    <button
                      onClick={shareOnWhatsApp}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-green-50 transition-colors"
                    >
                      <FaWhatsapp className="text-green-600 text-xl" /> WhatsApp
                    </button>
                    <button
                      onClick={shareOnFacebook}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-blue-50 transition-colors"
                    >
                      <FaFacebook className="text-blue-600 text-xl" /> Facebook
                    </button>
                    <button
                      onClick={shareOnInstagram}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-pink-50 transition-colors"
                    >
                      <FaInstagram className="text-pink-600 text-xl" /> Instagram
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 border-t border-amber-100 transition-colors"
                    >
                      {linkCopied ? <FaCheck className="text-emerald-600" /> : <FaLink className="text-gray-600" />}
                      {linkCopied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                )}
              </div>

              <Link
                to="/"
                className="px-6 py-3.5 bg-white/80 backdrop-blur-sm text-amber-700 rounded-2xl hover:bg-amber-50 transition-all font-bold flex items-center gap-3 shadow-lg border border-amber-200 hover:shadow-xl hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-600/30">
              <FaTshirt className="w-5 h-5 text-white" />
            </span>
            You May Also Like
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-100 hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-amber-100/30 flex items-center justify-center text-amber-400">
                    <FaTshirt className="w-12 h-12 opacity-50" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-amber-900">Similar Product {i + 1}</p>
                  <p className="text-sm font-bold text-amber-700">Rs. {1999 + i * 500}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SIZE CHART MODAL */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div ref={sizeChartRef} className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-100">
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaRuler className="w-6 h-6" />
                {isUnstitch ? "Fabric Length Guide" : "Size Guide"}
              </h3>
              <button
                onClick={() => setShowSizeChart(false)}
                className="p-2.5 hover:bg-white/20 rounded-2xl transition-colors text-white"
                aria-label="Close size chart"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <th className="border border-amber-200 p-4 text-left font-bold text-amber-900">Size</th>
                    {isUnstitch ? (
                      <>
                        <th className="border border-amber-200 p-4 text-left font-bold text-amber-900">Length</th>
                        <th className="border border-amber-200 p-4 text-left font-bold text-amber-900">Width</th>
                        <th className="border border-amber-200 p-4 text-left font-bold text-amber-900">Fabric</th>
                      </>
                    ) : (
                      <>
                        <th className="border border-amber-200 p-4 text-left font-bold text-amber-900">Bust</th>
                        <th className="border border-amber-200 p-4 text-left font-bold text-amber-900">Waist</th>
                        <th className="border border-amber-200 p-4 text-left font-bold text-amber-900">Hips</th>
                        <th className="border border-amber-200 p-4 text-left font-bold text-amber-900">Length</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sizeChart).map(([size, data]) => (
                    <tr
                      key={size}
                      className={`hover:bg-amber-50 cursor-pointer transition-colors ${
                        selectedSize === size ? "bg-amber-100" : ""
                      }`}
                      onClick={() => {
                        setSelectedSize(size);
                        toast.success(`Size ${size} selected`);
                      }}
                    >
                      <td className="border border-amber-200 p-4 font-bold text-amber-900">{size}</td>
                      {isUnstitch ? (
                        <>
                          <td className="border border-amber-200 p-4 text-amber-800">{data.length}"</td>
                          <td className="border border-amber-200 p-4 text-amber-800">{data.width}"</td>
                          <td className="border border-amber-200 p-4 text-amber-800">{data.fabric}</td>
                        </>
                      ) : (
                        <>
                          <td className="border border-amber-200 p-4 text-amber-800">{data.bust}"</td>
                          <td className="border border-amber-200 p-4 text-amber-800">{data.waist}"</td>
                          <td className="border border-amber-200 p-4 text-amber-800">{data.hips}"</td>
                          <td className="border border-amber-200 p-4 text-amber-800">{data.length}"</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="sticky bottom-0 bg-white pt-6 mt-4 border-t border-amber-200">
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0 || addingToCart}
                  className={`w-full px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                    stock === 0
                      ? "bg-gray-300 cursor-not-allowed opacity-60"
                      : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-600/30 hover:shadow-xl"
                  }`}
                >
                  <FaShoppingCart className="w-6 h-6" />
                  {stock === 0
                    ? "Out of Stock"
                    : !selectedSize
                    ? "Select Size First"
                    : addingToCart
                    ? "Adding..."
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}