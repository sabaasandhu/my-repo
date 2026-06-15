import React from 'react'
import Rating from './Rating'

const ProductDetailpage = ({productDetail}) => {
    

    const {images, title, price, category} = productDetail

  return (
    <div className='max--w-[1350px] bg-grey-200 p-4 mx-auto '>

        <div className='grid grid-cols px-5 py-4 gap-5 md:grid-cols-2 '>

            <div className='bg-bg-grey-300 p-4 shadow-md hover'>

                <img className='w-full h-auto object-contain'src={productDetail.images[0]}/>
            </div>
             
             <div className='p-4'>
                <h1 className='text-4x1 font-semibold text-teal-500 italic mt-8'>{productDetail.title}</h1>
                <div className='text-lg font-bold mt-5'>${price}</div>
                <div className='mt-5'><Rating rating={productDetail.rating} w={8} h={8}/></div>

             </div>
        </div>
      
    </div>
  )
}

export default ProductDetailpage
