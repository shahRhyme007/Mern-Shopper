import React, { useContext } from 'react'
import './Popular.css'
import { ShopContext } from '../../Context/EnhancedShopContext'
import Item from '../Item/Item.jsx';
import Loading from '../Loading/Loading';

const Popular = () => {
  const { all_product, loading, error } = useContext(ShopContext)

  // Filter for women's products and get top 4 by rating
  const popularProducts = all_product
    ?.filter(item => item.category === 'women' && item.available)
    ?.sort((a, b) => {
      // Sort by rating first, then by review count, then by date
      if (b.rating !== a.rating) return b.rating - a.rating
      if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount
      return new Date(b.date) - new Date(a.date)
    })
    ?.slice(0, 4) || []

  if (loading) {
    return (
      <div className='popular'>
        <h1>POPULAR IN WOMEN</h1>
        <hr />
        <Loading message="Loading popular products..." />
      </div>
    )
  }

  if (error && popularProducts.length === 0) {
    return (
      <div className='popular'>
        <h1>POPULAR IN WOMEN</h1>
        <hr />
        <div className="error-message">
          <p>Unable to load popular products. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='popular'>
        <h1>POPULAR IN WOMEN</h1>
        <hr />
        <div className="popular-item">
            {popularProducts.map((item, i) => {
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

export default Popular