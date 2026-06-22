import React from 'react'
import Loader from '../../components/Loader'
import ProductCard from '../../components/ProductCard.jsx'
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from "../../redux/actions/productActions";
import { Link } from 'react-router-dom'
import { useEffect } from 'react';

const Sales = () => {

  const dispatch = useDispatch()
  const { loading, products } = useSelector(state => state.prodSlice)
  const { user } = useSelector(state => state.auth)
  
  const isAdmin = user && user.is_staff === true
  const hasProducts = products && products.length > 0

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <div className="max-w-8xl mx-auto px-5 sm:px-9 mb-3">
      {loading ? (
        <Loader />
      ) : (
        <>
          {hasProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          ) : (
            <div className="col-span-full">
              <div className="text-center py-20">
                {/* Icon */}
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                {/* Title */}
                <h3 className="text-gray-500 font-medium text-lg mb-2">No Products Yet</h3>
                
                {/* Message */}
                <p className="text-gray-400 text-sm mb-6">
                  New collection is coming soon
                </p>
                
                {/* Admin Link - Only visible to admin */}
                {isAdmin && (
                  <Link 
                    className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm transition duration-200"
                    to="http://localhost:8000/admin/"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Product
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Sales