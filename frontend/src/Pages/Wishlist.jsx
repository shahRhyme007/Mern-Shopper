import React, { useContext } from 'react'
import { ShopContext } from '../Context/EnhancedShopContext'
import { Trash2 } from 'lucide-react'
import Item from '../Components/Item/Item'
import Loading from '../Components/Loading/Loading'
import './CSS/Wishlist.css'

const Wishlist = () => {
  const { wishlist, isAuthenticated, loading, removeFromWishlist } = useContext(ShopContext)

  const handleRemoveFromWishlist = async (itemId, itemName) => {
    if (window.confirm(`Remove "${itemName}" from your wishlist?`)) {
      await removeFromWishlist(itemId);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        <div className="wishlist-empty">
          <p>Please login to view your wishlist</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loading message="Loading your wishlist..." />
  }

  return (
    <div className="wishlist-container">
      <h1>My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <h2>Your wishlist is empty</h2>
          <p>Start adding items you love to keep track of them here!</p>
        </div>
      ) : (
        <div className="wishlist-items">
          <p className="wishlist-count">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
          </p>
          <div className="wishlist-products">
            {wishlist.map((item, i) => (
              <div key={i} className="wishlist-item-wrapper">
                <Item 
                  id={item.id} 
                  name={item.name} 
                  image={item.image} 
                  new_price={item.new_price} 
                  old_price={item.old_price}
                />
                <button 
                  className="wishlist-remove-btn"
                  onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                  Remove from Wishlist
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Wishlist 