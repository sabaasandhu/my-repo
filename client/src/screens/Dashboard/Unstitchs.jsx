import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import MetaData from '../../components/MetaData'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import { fetchUnstitchs } from '../../redux/actions/productActions'

const Unstitchs = () => {
  const dispatch = useDispatch()
  const { loading, unstitchs } = useSelector(state => state.prodSlice)
  const { user } = useSelector(state => state.auth)

  const isAdmin = user && user.is_staff === true
  const hasUnstitchs = unstitchs && unstitchs.length > 0

  useEffect(() => {
    dispatch(fetchUnstitchs())
  }, [dispatch])

  return (
    <div className='max-w-8xl mx-auto px-5 sm:px-9 mb-3'>
      <MetaData title="Unstitchs" />
      
      <h1 className='text-4xl md:text-5xl mt-10 text-orange-600 font-bold italic text-center mb-10 underline underline-offset-4 decoration-6'>
        Unstitch Dresses
      </h1>
      
      {loading ? (
        <Loader />
      ) : (
        <>
          {hasUnstitchs ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {unstitchs.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          ) : (
            <div className="col-span-full">
              <div className="text-center py-20">
                {/* Icon */}
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                {/* Title */}
                <h3 className="text-gray-500 font-medium text-lg mb-2">Coming Soon</h3>
                
                {/* Message */}
                <p className="text-gray-400 text-sm mb-6">
                  Our unstitch collection is on its way
                </p>
                
                {/* Admin Link - Only visible to admin */}
                {isAdmin && (
                  <Link 
                    className="inline-flex items-center gap-2 text-white bg-orange-600 hover:bg-orange-700 px-5 py-2 rounded-lg text-sm transition duration-200"
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

export default Unstitchs