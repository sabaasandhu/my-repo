import React from 'react'

import { Helmet} from 'react-helmet'

const MetaData = ({title}) => {
  return (
    <div>

             <Helmet>
              <title>{`women clothing store | ${title}`}</title>
              </Helmet> 
    </div>
  )
}

export default MetaData
