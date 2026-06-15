import React from 'react'
import FallingText from './Animation'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';



const TopHeader = () => {
  return (
    <div>
      <FallingText/>
      <h3 className='text-center'></h3>
    </div>
  )
}

export default TopHeader
