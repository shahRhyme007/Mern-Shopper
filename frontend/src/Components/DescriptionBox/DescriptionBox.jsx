import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Star, 
  Shield, 
  Truck,
  RotateCcw,
  Award,
  CheckCircle,
  Package
} from 'lucide-react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  const [activeTab, setActiveTab] = useState('description')

  const tabs = [
    { id: 'description', label: 'Description', icon: FileText },
    { id: 'reviews', label: 'Reviews', count: 122, icon: Star },
    { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
    { id: 'care', label: 'Care Instructions', icon: Shield }
  ]

  const features = [
    { icon: Award, text: 'Premium Quality Materials' },
    { icon: CheckCircle, text: 'Quality Assured' },
    { icon: Package, text: 'Secure Packaging' },
    { icon: Shield, text: '2-Year Warranty' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <motion.div
            key="description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="tab-content"
          >
            <div className="description-content">
              <div className="product-highlights">
                <h4>Product Highlights</h4>
                <ul className="highlights-list">
                  <li>Premium cotton blend for ultimate comfort</li>
                  <li>Modern slim-fit design with contemporary styling</li>
                  <li>Versatile piece perfect for casual and semi-formal occasions</li>
                  <li>Durable construction with reinforced seams</li>
                  <li>Available in multiple sizes for the perfect fit</li>
                </ul>
              </div>
              
              <div className="detailed-description">
                <h4>Detailed Description</h4>
                <p>
                  This premium garment combines modern style with exceptional comfort. Crafted from a carefully selected 
                  cotton blend, it offers breathability and durability for everyday wear. The contemporary cut ensures 
                  a flattering silhouette while maintaining comfort throughout the day.
                </p>
                <p>
                  Perfect for layering or wearing on its own, this versatile piece transitions seamlessly from casual 
                  weekend outings to office environments. The attention to detail in construction ensures this garment 
                  will remain a staple in your wardrobe for years to come.
                </p>
              </div>

              <div className="product-features">
                <h4>Key Features</h4>
                <div className="features-grid">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="feature-item"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="feature-icon" />
                      <span>{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )
      
      case 'reviews':
        return (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="tab-content"
          >
            <div className="reviews-redirect">
              <div className="reviews-summary-box">
                <Star className="reviews-icon" />
                <div className="reviews-info">
                  <h4>Customer Reviews</h4>
                  <p>See all 122 reviews for this product below in the reviews section.</p>
                  <div className="rating-display">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`star ${i < 4 ? 'filled' : ''}`} />
                      ))}
                    </div>
                    <span className="rating-text">4.2 out of 5 stars</span>
                  </div>
                </div>
              </div>
              <button 
                className="scroll-to-reviews-btn"
                onClick={() => {
                  const reviewsSection = document.querySelector('.product-reviews')
                  if (reviewsSection) {
                    reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                View All Reviews
              </button>
            </div>
          </motion.div>
        )
      
      case 'shipping':
        return (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="tab-content"
          >
            <div className="shipping-content">
              <div className="shipping-section">
                <div className="section-header">
                  <Truck className="section-icon" />
                  <h4>Shipping Information</h4>
                </div>
                <ul>
                  <li>Free standard shipping on orders over $50</li>
                  <li>Express shipping available for $9.99</li>
                  <li>Orders placed before 2 PM ship same day</li>
                  <li>Estimated delivery: 3-5 business days</li>
                  <li>International shipping available</li>
                </ul>
              </div>

              <div className="shipping-section">
                <div className="section-header">
                  <RotateCcw className="section-icon" />
                  <h4>Returns & Exchanges</h4>
                </div>
                <ul>
                  <li>30-day return policy</li>
                  <li>Free returns on all orders</li>
                  <li>Items must be in original condition</li>
                  <li>Easy online return process</li>
                  <li>Exchanges processed within 2-3 business days</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )
      
      case 'care':
        return (
          <motion.div
            key="care"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="tab-content"
          >
            <div className="care-content">
              <div className="care-section">
                <div className="section-header">
                  <Shield className="section-icon" />
                  <h4>Care Instructions</h4>
                </div>
                <div className="care-instructions">
                  <div className="care-item">
                    <strong>Washing:</strong> Machine wash cold with like colors
                  </div>
                  <div className="care-item">
                    <strong>Drying:</strong> Tumble dry low or hang to dry
                  </div>
                  <div className="care-item">
                    <strong>Ironing:</strong> Iron on low heat if needed
                  </div>
                  <div className="care-item">
                    <strong>Storage:</strong> Hang or fold neatly to prevent wrinkles
                  </div>
                </div>
              </div>

              <div className="care-tips">
                <h4>Care Tips</h4>
                <ul>
                  <li>Turn garment inside out before washing</li>
                  <li>Avoid bleach or harsh chemicals</li>
                  <li>Remove promptly from dryer to prevent wrinkles</li>
                  <li>Store in a cool, dry place</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className='modern-description-box'>
      <div className="description-navigator">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="tab-icon" />
            <span className="tab-label">
              {tab.label}
              {tab.count && <span className="tab-count">({tab.count})</span>}
            </span>
          </motion.button>
        ))}
      </div>
      
      <div className="description-content-container">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DescriptionBox