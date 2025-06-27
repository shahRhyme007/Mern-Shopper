// now we are going to put the items for the products that will be displayed in the men  women and the kids categories

import React, { useContext } from 'react'
import './Item.css'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/EnhancedShopContext'

const Item = (props) => {
  const { addToWishlist, isInWishlist, isAuthenticated } = useContext(ShopContext)

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist')
      return
    }

    addToWishlist(props.id)
  }

  const handleImageError = (e) => {
    // Fallback to a simple gray placeholder if image fails to load
    console.error('❌ Image failed to load:', e.target.src);
    console.log('🔍 Product props:', props);
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
  }

  return (
    <div className='item'>
      <Link to={`/product/${props.id}`} onClick={() => window.scrollTo(0,0)}>
        <div className="item-image-container">
          <img 
            src={props.image} 
            alt={props.name}
            onError={handleImageError}
          />
          <button 
            className={`wishlist-btn ${isInWishlist(props.id) ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            title={isInWishlist(props.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            ❤️
          </button>
        </div>
      </Link>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">
          ${props.new_price}
        </div>
        <div className="item-price-old">
          ${props.old_price}
        </div>
      </div>
    </div>
  )
}

export default Item