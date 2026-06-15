import React, { useEffect } from 'react'
import { successMesg, errorMesg } from '../../helpers/message'

import { useDispatch, useSelector } from 'react-redux'
import { fetchCategory } from '../../redux/actions/productActions'
import Loader from '../../components/Loader'
import MetaData from '../../components/MetaData'
import { Link, useParams } from 'react-router-dom'

import ProductCard from '../../components/ProductCard'

const Products = () => {


     const dispatch = useDispatch()
     const { loading, productsByCategory } = useSelector(state => state.prodSlice)
     const {category} = useParams()
   
      const { user } = useSelector(state => state.auth)
   useEffect(() => {
  if (category) {
    dispatch(fetchCategory(category.toLowerCase()));
  }
}, [category, dispatch]);
   
const isAdmin = user && user.is_staff === true


  return (
     <div className='max-w-8xl mx-auto px-5 sm:px-9 mb-3'>

           
      
      <MetaData  title={category} />
      {
        loading ? <Loader /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                  <h1 className='text-5xl mt-20 text-orange-600 font-bold italic col-span-full text-center mb-4 underline underline-offset-4 decoration-6'>
                     {category}
                  </h1>
           {
  productsByCategory.length > 0 ? productsByCategory.map((product, index) =>
    <ProductCard key={index} product={product} />
  ) : <div className="bg-red-300 w-64 items-center p-2 rounded-lg animate-bounce text-lg font-bold text-center text-red-700 border-1 border-red-600">
          Coming Soon 🎁
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

export default Products
