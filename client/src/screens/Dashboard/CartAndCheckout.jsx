import React, { useState } from "react";

// SingleProductPage.jsx
// Default-exported React component for a responsive, accessible single product page.
// TailwindCSS classes are used for styling. Pass a `product` prop or rely on the built-in sample.

export default function SingleProductPage({ product = null, onAddToCart = () => {} }) {
  // sample fallback product data (used when no `product` prop is provided)
  const sample = {
    id: "sku-001",
    title: "Men's Classic Leather Sneaker",
    brand: "Arcadia Goods",
    price: 89.99,
    oldPrice: 129.99,
    rating: 4.6,
    reviewsCount: 128,
    colors: ["Black", "White", "Tan"],
    sizes: ["7", "8", "9", "10", "11"],
    description:
      "A versatile everyday sneaker made from premium leather. Cushioned insole and durable rubber outsole for long-lasting comfort.",
    features: [
      "Full-grain leather upper",
      "Removable cushioned insole",
      "Rubber outsole with traction",
      "Available in multiple colors",
    ],
    images: [
      "/images/sneaker-1.jpg",
      "/images/sneaker-2.jpg",
      "/images/sneaker-3.jpg",
      "/images/sneaker-4.jpg",
    ],
  };

  const p = product || sample;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(p.sizes?.[0] ?? null);
  const [selectedColor, setSelectedColor] = useState(p.colors?.[0] ?? null);

  function inc() {
    setQuantity((q) => Math.min(99, q + 1));
  }
  function dec() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function handleAdd() {
    // Prepare payload and call external handler
    const payload = {
      productId: p.id,
      title: p.title,
      price: p.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
    };
    onAddToCart(payload);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image gallery */}
        <section aria-labelledby="product-image" className="order-1 lg:order-none">
          <h2 id="product-image" className="sr-only">
            Product images
          </h2>

          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
              {/* Main image */}
              <img
                src={p.images[selectedImage]}
                alt={`${p.title} (image ${selectedImage + 1})`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // graceful fallback if image path missing during demo
                  e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='20'>Image not found</text></svg>";
                }}
              />
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-2 overflow-x-auto" role="list">
              {p.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-none w-20 h-20 rounded-lg overflow-hidden border ${
                    i === selectedImage ? "ring-2 ring-offset-2 ring-indigo-400" : "border-gray-200"
                  }`}
                  aria-current={i === selectedImage}
                  aria-label={`Show image ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`${p.title} thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='10'>No</text></svg>";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product info & actions */}
        <section aria-labelledby="product-info">
          <h1 id="product-info" className="text-2xl font-semibold text-gray-900">
            {p.title}
          </h1>

          <p className="mt-1 text-sm text-gray-600">by {p.brand}</p>

          <div className="mt-4 flex items-center gap-4">
            <div className="text-2xl font-bold">${p.price.toFixed(2)}</div>
            {p.oldPrice && (
              <div className="text-sm text-gray-500 line-through">${p.oldPrice.toFixed(2)}</div>
            )}
            <div className="ml-auto flex items-center text-sm text-gray-600">
              <svg aria-hidden className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.286 3.96c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.495 2.383c-.785.57-1.84-.197-1.54-1.118l1.286-3.96a1 1 0 00-.364-1.118L2.513 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
              </svg>
              <span>{p.rating} · {p.reviewsCount} reviews</span>
            </div>
          </div>

          <p className="mt-4 text-gray-700">{p.description}</p>

          <ul className="mt-4 space-y-2 list-disc list-inside text-gray-700">
            {p.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          {/* Options */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sizes */}
            {p.sizes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-2 rounded-lg border ${
                        selectedSize === s ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
                      }`}
                      aria-pressed={selectedSize === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {p.colors && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <div className="mt-2 flex gap-2">
                  {p.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-2 rounded-lg border ${
                        selectedColor === c ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
                      }`}
                      aria-pressed={selectedColor === c}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity + Add to cart */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={dec}
                className="px-3 py-2 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <div className="px-4 py-2" aria-live="polite">
                {quantity}
              </div>
              <button
                onClick={inc}
                className="px-3 py-2 hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add to cart
            </button>

            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="px-4 py-2 border rounded-lg text-sm"
              aria-label="Copy product link"
            >
              Share
            </button>
          </div>

          {/* Extra info */}
          <div className="mt-6 text-sm text-gray-600">
            <p>Free returns within 30 days · <span className="font-medium">Fast shipping</span></p>
          </div>
        </section>
      </div>

      {/* Reviews preview */}
      <div className="mt-10 bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold">Customer reviews</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <blockquote className="p-4 border rounded-lg">
            <p className="text-sm">"Very comfortable and the leather quality is excellent."</p>
            <footer className="mt-2 text-xs text-gray-500">— Ali</footer>
          </blockquote>
          <blockquote className="p-4 border rounded-lg">
            <p className="text-sm">"Great value for money. Will buy again."</p>
            <footer className="mt-2 text-xs text-gray-500">— Sara</footer>
          </blockquote>
        </div>
      </div>

      {/* Related products (simple footer) */}
      <div className="mt-10">
        <h4 className="text-lg font-semibold">You may also like</h4>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden bg-gray-100" />
              <div className="mt-2 text-sm font-medium">Casual Sneaker</div>
              <div className="text-sm text-gray-500">${59 + i * 10}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
