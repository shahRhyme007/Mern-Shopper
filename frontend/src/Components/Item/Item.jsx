// now we are going to put the items for the products that will be displayed in the men  women and the kids categories

import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { ShopContext } from '../../Context/EnhancedShopContext'

const Item = (props) => {
  const { addToWishlist, isInWishlist, isAuthenticated, addToCart } = useContext(ShopContext)

  // Ensure prices are numbers and provide fallbacks
  const newPrice = Number(props.new_price) || 0;
  const oldPrice = Number(props.old_price) || 0;
  const productName = props.name || 'Product Name';

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist')
      return
    }

    addToWishlist(props.id)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      alert('Please login to add items to cart')
      return
    }

    addToCart(props.id)
  }

  const handleImageError = (e) => {
    // Fallback to a simple gray placeholder if image fails to load
    console.error('❌ Image failed to load:', e.target.src);
    console.log('🔍 Product props:', props);
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
  }

  const discountPercentage = Math.round(((oldPrice - newPrice) / oldPrice) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group w-full"
    >
      <div className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white h-full rounded-lg">
        <div className="relative overflow-hidden">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full"
            >
              -{discountPercentage}%
            </motion.div>
          )}

          {/* Image Container - Clickable */}
          <Link to={`/product/${props.id}`} onClick={() => window.scrollTo(0,0)} className="block">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
              <motion.img 
                src={props.image} 
                alt={productName}
                onError={handleImageError}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                whileHover={{ scale: 1.1 }}
              />
              
              {/* Overlay Actions - Hidden on mobile, visible on hover for larger screens */}
              <div className="absolute inset-0 bg-black/20 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <button
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg flex items-center justify-center"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <button className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg flex items-center justify-center">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </motion.div>
              </div>
            </div>
          </Link>

          {/* Wishlist Button - Outside Link */}
          <motion.button 
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full transition-all duration-200 shadow-lg ${
              isInWishlist(props.id) 
                ? "bg-red-500 text-white" 
                : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
            }`}
            onClick={handleWishlistToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart 
              size={14} 
              className="sm:w-4 sm:h-4"
              fill={isInWishlist(props.id) ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </motion.button>
        </div>

        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
          {/* Product Name - Clickable */}
          <Link to={`/product/${props.id}`} onClick={() => window.scrollTo(0,0)} className="block">
            <h3 className="font-medium text-gray-900 text-sm leading-relaxed group-hover:text-red-500 transition-colors flex-1">
              {productName}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`text-xs ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </motion.span>
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.0)</span>
          </div>

          {/* Pricing and Actions */}
          <div className="flex items-center justify-between mt-auto">
            {/* Price - Clickable */}
            <Link to={`/product/${props.id}`} onClick={() => window.scrollTo(0,0)} className="block">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    ${newPrice}
                  </span>
                  {oldPrice > newPrice && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                      ${oldPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            {/* Quick Add Button - Outside Link */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                className="h-7 sm:h-8 px-2 sm:px-3 text-xs border border-gray-300 hover:border-red-500 hover:text-red-500 rounded bg-white transition-colors"
                onClick={handleAddToCart}
              >
                Add
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Item