import React, { useContext } from 'react'
import './NewCollections.css'
import { ShopContext } from '../../Context/EnhancedShopContext'
import Item from '../Item/Item';
import Loading from '../Loading/Loading';

const NewCollections = () => {
  const { all_product, loading, error } = useContext(ShopContext)

  // Get latest 8 products across all categories
  const newCollections = all_product
    ?.filter(item => item.available)
    ?.sort((a, b) => new Date(b.date) - new Date(a.date))
    ?.slice(0, 8) || []

  if (loading) {
    return (
      <div className='new-collections'>
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <Loading message="Loading new collections..." />
      </div>
    )
  }

  if (error && newCollections.length === 0) {
    return (
      <div className='new-collections'>
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <div className="error-message">
          <p>Unable to load new collections. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='new-collections'>
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <div className="collections">
            {newCollections.map((item, i) => {
                return <Item 
                  key={item.id || i} 
                  id={item.id} 
                  name={item.name} 
                  image={item.image} 
                  new_price={item.new_price} 
                  old_price={item.old_price}
                />
            })}
        </div>
    </div>
  )
}

export default NewCollections