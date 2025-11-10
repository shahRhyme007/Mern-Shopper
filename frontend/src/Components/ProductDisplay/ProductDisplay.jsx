import React, { useContext, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Clock,
  ZoomIn,
  Ruler,
  GitCompare,
  CheckCircle,
  MapPin
} from 'lucide-react'
import { ShopContext } from '../../Context/EnhancedShopContext'
import './ProductDisplay.css'
// Removed unused star icons - using Lucide icons instead

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const ProductDisplay = (props) => {
  const { product } = props
  const { addToCart, addToWishlist, isInWishlist } = useContext(ShopContext)
  
  // State management
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [stockLevel] = useState(Math.floor(Math.random() * 50) + 10) // Simulated stock
  const [isInStock] = useState(true)
  

  
  // Refs for animations
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const detailsRef = useRef(null)
  const priceRef = useRef(null)
  const buttonRef = useRef(null)

  
  // Product images - support both single image and multiple images array
  const productImages = React.useMemo(() => {
    // If product has images array (new format), use it
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(Boolean)
    }
    // Fallback to single image (old format) for backward compatibility
    return product.image ? [product.image] : []
  }, [product.image, product.images])
  
  // Product features
  const features = [
    { icon: Truck, text: 'Free shipping on orders over $50' },
    { icon: Shield, text: '2-year warranty included' },
    { icon: RotateCcw, text: '30-day return policy' }
  ]
  
  // Sizes with availability
  const sizes = [
    { size: 'S', available: true, lowStock: false },
    { size: 'M', available: true, lowStock: true },
    { size: 'L', available: true, lowStock: false },
    { size: 'XL', available: true, lowStock: false },
    { size: 'XXL', available: stockLevel > 5, lowStock: stockLevel <= 5 }
  ]

  // Calculate delivery date
  useEffect(() => {
    const today = new Date()
    const delivery = new Date(today.getTime() + (Math.floor(Math.random() * 3) + 2) * 24 * 60 * 60 * 1000)
    setDeliveryDate(delivery.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    }))
  }, [])

  // Enhanced image zoom functionality
  const handleMouseMove = (e) => {
    if (!isZoomed) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
  }

  const handleImageZoom = () => {
    setIsZoomed(!isZoomed)
  }
  
  useEffect(() => {
    // Simple setup without animations to prevent tilted appearance
    const timer = setTimeout(() => {
      try {
        // Just ensure all elements are visible and properly positioned
        if (containerRef.current) {
          containerRef.current.style.opacity = '1';
          containerRef.current.style.transform = 'none';
        }
        if (imageRef.current) {
          imageRef.current.style.opacity = '1';
          imageRef.current.style.transform = 'none';
        }
        if (detailsRef.current) {
          detailsRef.current.style.opacity = '1';
          detailsRef.current.style.transform = 'none';
        }
        if (priceRef.current) {
          priceRef.current.style.opacity = '1';
          priceRef.current.style.transform = 'none';
        }
        if (buttonRef.current) {
          buttonRef.current.style.opacity = '1';
          buttonRef.current.style.transform = 'none';
        }
      } catch (error) {
        console.warn('Element setup error:', error);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [product])
  
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg=='
  }
  
  const handleAddToCart = async () => {
    if (!selectedSize) {
      // Simple shake effect for size selection
      try {
        const sizeSelector = document.querySelector('.size-selector');
        if (sizeSelector) {
          sizeSelector.style.animation = 'shake 0.5s ease-in-out';
          setTimeout(() => {
            sizeSelector.style.animation = '';
          }, 500);
        }
      } catch (error) {
        console.warn('Size selector animation error:', error);
      }
      return
    }
    
    setIsLoading(true)
    
    // Simple button feedback
    try {
      if (buttonRef.current) {
        buttonRef.current.style.transform = 'scale(0.95)';
        setTimeout(() => {
          buttonRef.current.style.transform = 'scale(1)';
        }, 100);
      }
    } catch (error) {
      console.warn('Button animation error:', error);
    }
    
    await addToCart(product.id, selectedSize)
    
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }
  
  const handleWishlistToggle = () => {
    // Simple CSS-based heart animation
    try {
      const wishlistBtn = document.querySelector('.wishlist-btn');
      if (wishlistBtn) {
        wishlistBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
          wishlistBtn.style.transform = 'scale(1)';
        }, 150);
      }
    } catch (error) {
      console.warn('Wishlist animation error:', error);
    }
    
    addToWishlist(product.id)
  }
  
  const handleImageSelect = (index) => {
    setSelectedImageIndex(index)
    
    // Simple CSS-based image transition
    try {
      const mainImage = document.querySelector('.main-product-image');
      if (mainImage) {
        mainImage.style.opacity = '0.7';
        setTimeout(() => {
          mainImage.style.opacity = '1';
        }, 150);
      }
    } catch (error) {
      console.warn('Image transition animation error:', error);
    }
  }
  
  const renderStars = (rating = 4) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }



  return (
    <div className="modern-product-container" ref={containerRef}>
      <div className="modern-product-display">
        
        {/* Left Side - Image Gallery */}
        <div className="product-gallery" ref={imageRef}>
          <div className="image-section">
            {/* Thumbnail Images */}
            <div className="thumbnail-gallery">
              {productImages.map((image, index) => (
                <motion.div
                  key={index}
                  className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => handleImageSelect(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    onError={handleImageError}
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="main-image-container">
              <motion.div
                className={`image-wrapper ${isZoomed ? 'zoomed' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <motion.img
                  className="main-product-image"
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  onError={handleImageError}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={isZoomed ? {
                    transform: `scale(2.5)`,
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    cursor: 'zoom-out'
                  } : { cursor: 'zoom-in' }}
                  onClick={handleImageZoom}
                />
                
                {/* Zoom Indicator */}
                {!isZoomed && (
                  <motion.div 
                    className="zoom-indicator"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ZoomIn className="w-5 h-5" />
                    <span>Click to zoom</span>
                  </motion.div>
                )}
              </motion.div>
            
              {/* Image Navigation */}
              <button 
                className="image-nav prev"
                onClick={() => handleImageSelect(selectedImageIndex > 0 ? selectedImageIndex - 1 : productImages.length - 1)}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                className="image-nav next"
                onClick={() => handleImageSelect(selectedImageIndex < productImages.length - 1 ? selectedImageIndex + 1 : 0)}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Quick Actions */}
              <div className="quick-actions">
                <motion.button
                  className="wishlist-btn"
                  onClick={handleWishlistToggle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Add to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </motion.button>
                <motion.button
                  className="share-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Share Product"
                >
                  <Share2 className="w-5 h-5 text-gray-400" />
                </motion.button>
                <motion.button
                  className="compare-btn"
                  onClick={() => setShowComparison(!showComparison)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Compare Product"
                >
                  <GitCompare className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </div>
          </div>


        </div>

        {/* Right Side - Product Details */}
        <div className="product-details" ref={detailsRef}>
          {/* Product Title */}
          <div className="product-header">
            <motion.h1 
              className="product-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {product.name}
            </motion.h1>
            
            {/* Rating */}
            <motion.div 
              className="product-rating"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="stars">
                {renderStars(4)}
              </div>
              <span className="rating-text">(122 reviews)</span>
              <span className="rating-badge">
                <Award className="w-4 h-4" />
                Best Seller
              </span>
            </motion.div>
          </div>

          {/* Price Section */}
          <motion.div 
            className="price-section"
            ref={priceRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="price-container">
              <span className="current-price">${product.new_price}</span>
              <span className="original-price">${product.old_price}</span>
              <span className="discount-badge">
                {Math.round(((product.old_price - product.new_price) / product.old_price) * 100)}% OFF
              </span>
            </div>
            <div className="price-features">
              <span className="feature">
                <Zap className="w-4 h-4" />
                Flash Sale
              </span>
              <span className="feature">
                <Clock className="w-4 h-4" />
                Limited Time
              </span>
            </div>
          </motion.div>

          {/* Stock & Delivery Info */}
          <motion.div 
            className="product-availability"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="stock-info">
              <div className="stock-indicator">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="stock-text">
                  {stockLevel > 10 ? 'In Stock' : `Only ${stockLevel} left!`}
                </span>
                {stockLevel <= 5 && (
                  <span className="low-stock-badge">Low Stock</span>
                )}
              </div>
              <div className="delivery-info">
                <div className="delivery-item">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Free delivery by {deliveryDate}</span>
                </div>
                <div className="delivery-item">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>Ships from New York</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Description */}
          <motion.div 
            className="product-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p>A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.</p>
          </motion.div>

          {/* Size Selector */}
          <motion.div 
            className="size-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="size-header">
              <h3>Select Size</h3>
              <motion.button
                className="size-guide-btn"
                onClick={() => setShowSizeGuide(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Ruler className="w-4 h-4" />
                Size Guide
              </motion.button>
            </div>
            <div className="size-options">
              {sizes.map((sizeInfo) => (
                <motion.button
                  key={sizeInfo.size}
                  className={`size-option ${selectedSize === sizeInfo.size ? 'selected' : ''} ${!sizeInfo.available ? 'unavailable' : ''} ${sizeInfo.lowStock ? 'low-stock' : ''}`}
                  onClick={() => sizeInfo.available && setSelectedSize(sizeInfo.size)}
                  whileHover={sizeInfo.available ? { scale: 1.05 } : {}}
                  whileTap={sizeInfo.available ? { scale: 0.95 } : {}}
                  disabled={!sizeInfo.available}
                >
                  {sizeInfo.size}
                  {sizeInfo.lowStock && sizeInfo.available && (
                    <span className="low-stock-indicator">!</span>
                  )}
                  {!sizeInfo.available && (
                    <span className="unavailable-overlay">✕</span>
                  )}
                </motion.button>
              ))}
            </div>
            {selectedSize && (
              <motion.div 
                className="size-confirmation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Size {selectedSize} selected</span>
              </motion.div>
            )}
          </motion.div>

          {/* Quantity Selector */}
          <motion.div 
            className="quantity-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <motion.button
                className="quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <span className="quantity-display">{quantity}</span>
              <motion.button
                className="quantity-btn"
                onClick={() => setQuantity(quantity + 1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="action-buttons"
            ref={buttonRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className="add-to-cart-btn primary"
              onClick={handleAddToCart}
              disabled={isLoading || !isInStock}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="loading-spinner"
                  />
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="button-content"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {!isInStock ? 'Out of Stock' : 'Add to Cart'}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              className="add-to-cart-btn secondary"
              onClick={() => {
                if (selectedSize) {
                  handleAddToCart()
                  // Navigate to checkout page
                  window.location.href = '/cart'
                }
              }}
              disabled={isLoading || !isInStock || !selectedSize}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div className="button-content">
                <Zap className="w-5 h-5" />
                Buy Now
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className="product-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="info-item">
              <span className="label">Category:</span>
              <span className="value">Women, T-Shirt, Crop Top</span>
            </div>
            <div className="info-item">
              <span className="label">Tags:</span>
              <span className="value">Modern, Latest</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div 
        className="features-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-card"
            whileHover={{ y: -5 }}
          >
            <feature.icon className="w-6 h-6 text-blue-500" />
            <span>{feature.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              className="size-guide-modal"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Size Guide</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowSizeGuide(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-content">
                <div className="size-chart">
                  <table>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Chest (in)</th>
                        <th>Waist (in)</th>
                        <th>Length (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>S</td>
                        <td>34-36</td>
                        <td>28-30</td>
                        <td>26</td>
                      </tr>
                      <tr>
                        <td>M</td>
                        <td>38-40</td>
                        <td>32-34</td>
                        <td>27</td>
                      </tr>
                      <tr>
                        <td>L</td>
                        <td>42-44</td>
                        <td>36-38</td>
                        <td>28</td>
                      </tr>
                      <tr>
                        <td>XL</td>
                        <td>46-48</td>
                        <td>40-42</td>
                        <td>29</td>
                      </tr>
                      <tr>
                        <td>XXL</td>
                        <td>50-52</td>
                        <td>44-46</td>
                        <td>30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="measurement-tips">
                  <h4>How to Measure:</h4>
                  <ul>
                    <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
                    <li><strong>Waist:</strong> Measure around your natural waistline</li>
                    <li><strong>Length:</strong> Measure from shoulder to hem</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductDisplay