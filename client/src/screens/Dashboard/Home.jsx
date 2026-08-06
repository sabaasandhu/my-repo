import React from 'react'
import  { useEffect } from 'react';
import { fetchProducts } from "../../redux/actions/productActions";

import {useSelector, useDispatch} from 'react-redux';
import Loader from '../../components/Loader';
import ProductCard from '../../components/ProductCard';
import MetaData from '../../components/MetaData';
import {Link} from 'react-router-dom'
import Carasol from '../../components/Carasol'
import cc from "../../image/cc.webp";
import v from "../../image/v.jpg";
import w from "../../image/w.jpg";
import r from "../../image/r.png";


const Home = () => {

  const dispatch = useDispatch()
  const { loading, products } = useSelector(state => state.prodSlice)

  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [])

  const isAdmin = user && user.is_staff === true

  console.log(products && products)


  return (
        
    <div className='mt-2'>
          <Carasol/>
    {/* Hero Section */}
<section className="max-w-7xl mx-auto px-5 py-12">
  <div className="grid lg:grid-cols-2 gap-10 items-center">

    <div>
      <p className="text-pink-600 font-bold uppercase tracking-widest">
        New Collection 2026
      </p>

      <h1 className="text-5xl md:text-6xl font-extrabold mt-5 leading-tight">
        Discover Your <br />
        <span className="text-pink-600">Perfect Outfit</span>
      </h1>

      <p className="text-gray-600 mt-6 text-lg">
        Explore our latest fashion collection designed for elegance,
        comfort and confidence.
      </p>

      <a
        href="#products"
        className="inline-block mt-8 bg-black text-white px-8 py-4 rounded-full hover:bg-pink-600 duration-300"
      >
        Shop Now
      </a>
    </div>

    <div>
      <img
        src={cc}
        alt=""
        className="rounded-3xl shadow-2xl w-full h-[520px] object-cover"
      />
    </div>

  </div>
</section>

{/* Categories */}

<section className="max-w-7xl mx-auto px-5 py-10">

<div className="grid md:grid-cols-3 gap-6">

<div className="relative overflow-hidden rounded-3xl group">

<img
src={v}
className="h-96 w-full object-cover group-hover:scale-110 duration-500"
/>

<div className="absolute inset-0 bg-black/40 flex items-end p-6">

<div>

<h2 className="text-white text-3xl font-bold">
Summer Collection
</h2>

<p className="text-white mt-2">
Premium Fashion
</p>

</div>

</div>

</div>

<div className="relative overflow-hidden rounded-3xl group">

<img
src={w}
className="h-96 w-full object-cover group-hover:scale-110 duration-500"
/>

<div className="absolute inset-0 bg-black/40 flex items-end p-6">

<div>

<h2 className="text-white text-3xl font-bold">
Luxury Wear
</h2>

<p className="text-white mt-2">
Exclusive Designs
</p>

</div>

</div>

</div>

<div className="relative overflow-hidden rounded-3xl group">

<img
src={r}
className="h-96 w-full object-cover group-hover:scale-110 duration-500"
/>

<div className="absolute inset-0 bg-black/40 flex items-end p-6">

<div>

<h2 className="text-white text-3xl font-bold">
Trending
</h2>

<p className="text-white mt-2">
New Arrivals
</p>

</div>

</div>

</div>

</div>

</section>

{/* Features */}

<section className="max-w-7xl mx-auto py-12 px-5">

<div className="grid md:grid-cols-4 gap-6 text-center">

<div className="shadow-lg rounded-xl p-8">
<h2 className="text-4xl">🚚</h2>
<h3 className="font-bold mt-4">Free Delivery</h3>
<p className="text-gray-500 text-sm mt-2">
Fast delivery all over Pakistan.
</p>
</div>

<div className="shadow-lg rounded-xl p-8">
<h2 className="text-4xl">💎</h2>
<h3 className="font-bold mt-4">Premium Quality</h3>
<p className="text-gray-500 text-sm mt-2">
Only original premium fabrics.
</p>
</div>

<div className="shadow-lg rounded-xl p-8">
<h2 className="text-4xl">🔒</h2>
<h3 className="font-bold mt-4">Secure Payment</h3>
<p className="text-gray-500 text-sm mt-2">
100% Safe Checkout.
</p>
</div>

<div className="shadow-lg rounded-xl p-8">
<h2 className="text-4xl">❤️</h2>
<h3 className="font-bold mt-4">Customer Support</h3>
<p className="text-gray-500 text-sm mt-2">
24/7 Friendly Support.
</p>
</div>

</div>

</section>

<h1
id="products"
className="text-center text-4xl font-extrabold mt-16 mb-10"
>
✨ NEW ARRIVALS
</h1>
    </div>
  )
  
}

export default Home
