import React from 'react'
import  { useEffect } from 'react';
import { fetchProducts } from "../../redux/actions/productActions";

import {useSelector, useDispatch} from 'react-redux';
import Loader from '../../components/Loader';
import ProductCard from '../../components/ProductCard';
import MetaData from '../../components/MetaData';
import {Link} from 'react-router-dom'
import Carasol from '../../components/Carasol'


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
      <h1 className='text-center italic font-extrabold text-2xl h-50  text-wrap bg-gradient-to-tl from-teal-500 via-teal-700 to-orange-500  shadow-lg sticky mt-2  text-black'> MOST SELLING PRODUCTS👇</h1>
      <MetaData title={'Main page'} />
      {
        loading ? <Loader /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {
              products.length > 0 ? products.map((product, index) =>
                <ProductCard key={index} product={product} />
              ) : <div className="bg-red-300 w-64 mx-auto p-3 rounded-lg text-sm text-center text-red-700 border-1 border-red-600">
                              No Products Found
                             {isAdmin && (
                                <Link className='text-red-900 font-bold underline' to="http://localhost:8000/admin/" > Add New Product </Link>
                              )}
              </div>
            }


          </div>)


      }




    </div>
  )
  
}

export default Home
