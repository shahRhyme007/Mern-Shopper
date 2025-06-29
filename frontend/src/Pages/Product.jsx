import React, { useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShopContext } from '../Context/EnhancedShopContext';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import ProductReviews from '../Components/ProductReviews/ProductReviews';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const pageRef = useRef(null);
  
  // Debugging logs
  console.log('Product ID:', productId);
  console.log('All Products:', all_product);
  
  const product = all_product.find((e) => e.id === Number(productId));

  console.log('Product:', product);

  useEffect(() => {
    if (product && pageRef.current) {
      // Scroll to top smoothly when product changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // GSAP animations for page sections
      const timer = setTimeout(() => {
        try {
          const sections = pageRef.current.querySelectorAll('.product-section');
          
          // Animate sections on scroll
          sections.forEach((section, index) => {
            gsap.fromTo(section,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 85%",
                  end: "bottom 15%",
                  toggleActions: "play none none reverse"
                },
                delay: index * 0.1
              }
            );
          });
        } catch (error) {
          console.warn('Page sections animation error:', error);
          // Fallback: just show sections without animation
          if (pageRef.current) {
            const sections = pageRef.current.querySelectorAll('.product-section');
            sections.forEach(section => {
              section.style.opacity = '1';
              section.style.transform = 'translateY(0)';
            });
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [product]);

  if (!product) {
    return (
      <motion.div 
        className="product-not-found"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '24px',
          margin: '2rem auto',
          maxWidth: '600px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <motion.div
          className="not-found-icon"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            fontSize: '4rem',
            marginBottom: '1rem'
          }}
        >
          🔍
        </motion.div>
        <motion.h2 
          style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '1rem'
          }}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Product not found
        </motion.h2>
        <motion.p
          style={{
            color: '#64748b',
            fontSize: '1.125rem',
            marginBottom: '2rem'
          }}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
        >
          The product you're looking for doesn't exist or has been removed.
        </motion.p>
        <motion.button
          onClick={() => window.history.back()}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 12px 35px rgba(59, 130, 246, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Go Back
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="modern-product-page"
      ref={pageRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
        paddingBottom: '2rem'
      }}
    >
      {/* Breadcrumb Section */}
      <motion.div 
        className="product-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Breadcrum product={product} />
      </motion.div>

      {/* Main Product Display Section */}
      <motion.div 
        className="product-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <ProductDisplay product={product} />
      </motion.div>

      {/* Description Section */}
      <motion.div 
        className="product-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <DescriptionBox />
      </motion.div>

      {/* Reviews Section */}
      <motion.div 
        className="product-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <ProductReviews productId={product.id} />
      </motion.div>

      {/* Related Products Section */}
      <motion.div 
        className="product-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <RelatedProducts />
      </motion.div>
    </motion.div>
  );
}

export default Product;
