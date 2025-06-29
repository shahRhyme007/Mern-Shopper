import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ChevronRight, Home, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Breadcrum.css'

const Breadcrum = (props) => {
  const { product } = props
  const breadcrumbRef = useRef(null)

  useEffect(() => {
    // GSAP animation for breadcrumb entrance
    const timer = setTimeout(() => {
      try {
        if (breadcrumbRef.current && breadcrumbRef.current.children.length > 0) {
          gsap.fromTo(breadcrumbRef.current.children,
            { opacity: 0, x: -20 },
            { 
              opacity: 1, 
              x: 0, 
              duration: 0.5, 
              stagger: 0.1, 
              ease: "none",
              delay: 0.2 
            }
          )
        }
      } catch (error) {
        console.warn('Breadcrumb animation error:', error);
        // Fallback: just show breadcrumb without animation
        if (breadcrumbRef.current) breadcrumbRef.current.style.opacity = '1';
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [product])

  const breadcrumbItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/shop', icon: Store },
    { name: product.category, path: `/${product.category?.toLowerCase()}` },
    { name: product.name, path: null }
  ]

  return (
    <motion.div 
      className="modern-breadcrumb"
      ref={breadcrumbRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="breadcrumb-container">
        {breadcrumbItems.map((item, index) => (
          <motion.div
            key={index}
            className="breadcrumb-item"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.path ? (
              <Link to={item.path} className="breadcrumb-link">
                {item.icon && <item.icon className="breadcrumb-icon" />}
                <span className="breadcrumb-text">{item.name}</span>
              </Link>
            ) : (
              <span className="breadcrumb-current">
                <span className="breadcrumb-text">{item.name}</span>
              </span>
            )}
            
            {index < breadcrumbItems.length - 1 && (
              <ChevronRight className="breadcrumb-separator" />
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Decorative gradient line */}
      <motion.div 
        className="breadcrumb-line"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
    </motion.div>
  )
}

export default Breadcrum