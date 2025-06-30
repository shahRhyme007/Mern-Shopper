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
  Camera,
  Upload,
  X,
  Info,
  Sparkles
} from 'lucide-react'
import { ShopContext } from '../../Context/EnhancedShopContext'
import './ProductDisplay.css'

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
  
  // Virtual fitting states
  const [showVirtualFitting, setShowVirtualFitting] = useState(false)
  const [uploadedPhoto, setUploadedPhoto] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [fittingResult, setFittingResult] = useState(null)
  
  // Refs for animations
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const detailsRef = useRef(null)
  const priceRef = useRef(null)
  const buttonRef = useRef(null)
  const fileInputRef = useRef(null)
  
  // Product images (using the same image multiple times as placeholder)
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ]
  
  // Product features
  const features = [
    { icon: Truck, text: 'Free shipping on orders over $50' },
    { icon: Shield, text: '2-year warranty included' },
    { icon: RotateCcw, text: '30-day return policy' }
  ]
  
  // Sizes
  const sizes = ['S', 'M', 'L', 'XL', 'XXL']
  
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

  // Virtual fitting handlers
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedPhoto(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTryDress = () => {
    if (!uploadedPhoto) return
    
    setIsProcessing(true)
    
    // Simulate AI processing time for virtual try-on
    setTimeout(() => {
      // Create a more realistic virtual try-on result
      // In a real implementation, this would use AI to blend the person's face/body with the dress
      setFittingResult({
        originalPhoto: uploadedPhoto,
        fittedPhoto: uploadedPhoto, // This would be the AI-generated image with the dress fitted on the person
        confidence: 92,
        recommendations: [
          "Great fit! This size looks perfect on you.",
          "The color complements your skin tone beautifully.",
          "Consider pairing with dark jeans for a casual look.",
          "This style suits your body type well."
        ],
        // Simulate that we've processed their photo with the dress
        isVirtualTryOn: true
      })
      setIsProcessing(false)
    }, 3000)
  }

  const resetVirtualFitting = () => {
    setUploadedPhoto(null)
    setFittingResult(null)
    setIsProcessing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
            <motion.img
              className="main-product-image"
              src={productImages[selectedImageIndex]}
              alt={product.name}
              onError={handleImageError}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
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
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </motion.button>
              <motion.button
                className="share-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </div>
          </div>

          {/* Virtual Fitting Section - Below Main Image */}
          <div className="virtual-fitting-below-image">
            <div className="virtual-fitting-header-below">
              <div className="header-content-below">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h4>Virtual Try-On</h4>
                <span className="beta-badge-below">AI</span>
              </div>
            </div>

            {!showVirtualFitting ? (
              <motion.button
                className="try-dress-btn-below"
                onClick={() => setShowVirtualFitting(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Camera className="w-4 h-4" />
                Try This Dress
              </motion.button>
            ) : (
              <div className="virtual-fitting-interface-below">
                {/* Upload Section */}
                {!fittingResult && (
                  <div className="upload-section-below">
                    <div className="upload-area-below">
                      {!uploadedPhoto ? (
                        <div className="upload-placeholder-below">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <motion.div
                            className="upload-content-below"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="upload-text-below">Upload Photo</span>
                            <span className="file-types-below">JPG, PNG</span>
                          </motion.div>
                        </div>
                      ) : (
                        <div className="uploaded-photo-below">
                          <img src={uploadedPhoto} alt="Uploaded" />
                          <button
                            className="remove-photo-below"
                            onClick={resetVirtualFitting}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Tips Section */}
                    <div className="tips-section-below">
                      <button
                        className="tips-toggle-below"
                        onClick={() => setShowTips(!showTips)}
                      >
                        <Info className="w-3 h-3" />
                        Tips
                      </button>
                      
                      <AnimatePresence>
                        {showTips && (
                          <motion.div
                            className="tips-content-below"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <ul>
                              <li>• Front-facing photo works best</li>
                              <li>• Good lighting recommended</li>
                              <li>• Stand straight, arms at sides</li>
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Action Buttons */}
                    <div className="fitting-actions-below">
                      <motion.button
                        className="try-button-below"
                        onClick={handleTryDress}
                        disabled={!uploadedPhoto || isProcessing}
                        whileHover={{ scale: uploadedPhoto ? 1.02 : 1 }}
                        whileTap={{ scale: uploadedPhoto ? 0.98 : 1 }}
                      >
                        {isProcessing ? (
                          <>
                            <div className="processing-spinner-below" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            Try It On
                          </>
                        )}
                      </motion.button>
                      
                      <button
                        className="cancel-button-below"
                        onClick={() => setShowVirtualFitting(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Results Section */}
                {fittingResult && (
                  <motion.div
                    className="fitting-results-below"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="results-header-below">
                      <h5>Virtual Try-On Result</h5>
                      <span className="confidence-score-below">
                        {fittingResult.confidence}% Match
                      </span>
                    </div>

                    <div className="results-comparison-below">
                      <div className="comparison-item-below">
                        <img src={fittingResult.originalPhoto} alt="Original" />
                        <span>Before</span>
                      </div>
                      <div className="comparison-arrow-below">→</div>
                      <div className="comparison-item-below">
                        <div className="virtual-result-image-below">
                          <img src={fittingResult.fittedPhoto} alt="With Dress" />
                          <div className="dress-overlay-below">
                            <img src={product.image} alt="Dress overlay" className="dress-overlay-img-below" />
                          </div>
                        </div>
                        <span>With Dress</span>
                      </div>
                    </div>

                    <div className="ai-recommendations-below">
                      <h6>AI Recommendations</h6>
                      <ul>
                        {fittingResult.recommendations.slice(0, 2).map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="results-actions-below">
                      <motion.button
                        className="add-to-cart-from-fitting-below"
                        onClick={handleAddToCart}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Add to Cart
                      </motion.button>
                      
                      <button
                        className="try-again-button-below"
                        onClick={resetVirtualFitting}
                      >
                        Try Again
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
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
            <h3>Select Size</h3>
            <div className="size-options">
              {sizes.map((size) => (
                <motion.button
                  key={size}
                  className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {size}
                </motion.button>
              ))}
            </div>
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
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={isLoading}
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
                    Add to Cart
                  </motion.div>
                )}
              </AnimatePresence>
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
    </div>
  )
}

export default ProductDisplay