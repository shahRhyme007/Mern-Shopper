// A website hero section is a large banner displayed above the fold of a website.

import React from 'react'
import './Hero.css'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Marquee from 'react-fast-marquee'
import { Button } from '../ui/button'
import { fadeInUp, staggerContainer } from '../../lib/utils'

import hand_icon from '../Assets/hand_icon.png'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {
  const scrollToLatest = () => {
    const element = document.querySelector('.new-collections')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-gradient-to-r from-pink-300 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-gradient-to-r from-red-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 sm:bottom-20 left-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-gradient-to-r from-pink-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-16">
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-150px)] sm:min-h-[calc(100vh-200px)]"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Left Side */}
          <motion.div className="space-y-6 sm:space-y-8 text-center lg:text-left" variants={fadeInUp}>
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-pink-100 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-red-600"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>NEW ARRIVALS ONLY</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-2 sm:space-y-4">
              <motion.div 
                className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-4"
                variants={fadeInUp}
              >
                <motion.h1 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900"
                  whileHover={{ scale: 1.02 }}
                >
                  new
                </motion.h1>
                <motion.img 
                  src={hand_icon} 
                  alt="wave" 
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24"
                  animate={{ 
                    rotate: [0, 14, -8, 14, -4, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              </motion.div>
              
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent"
                variants={fadeInUp}
              >
                collections
              </motion.h1>
              
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900"
                variants={fadeInUp}
              >
                for everyone
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0"
              variants={fadeInUp}
            >
              Discover the latest trends and timeless classics in our curated collection. Fashion that speaks to your unique style.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start">
              <Button
                onClick={scrollToLatest}
                size="lg"
                variant="primary"
                className="group text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto"
              >
                <span>Latest Collection</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex justify-center lg:justify-start space-x-4 sm:space-x-6 lg:space-x-8 pt-6 sm:pt-8"
              variants={fadeInUp}
            >
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">500+</div>
                <div className="text-xs sm:text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">50+</div>
                <div className="text-xs sm:text-sm text-gray-600">Brands</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side */}
          <motion.div 
            className="relative order-first lg:order-last"
            variants={fadeInUp}
          >
            <motion.div
              className="relative z-10"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src={hero_image} 
                alt="Fashion model" 
                className="w-full h-auto max-w-sm sm:max-w-md lg:max-w-lg mx-auto rounded-2xl shadow-2xl"
              />
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-white rounded-full p-2 sm:p-4 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="text-lg sm:text-2xl">✨</div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full p-2 sm:p-4 shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <div className="text-xs sm:text-sm font-medium">50% OFF</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scrolling Marquee */}
      <div className="absolute bottom-0 left-0 right-0 bg-black text-white py-2 sm:py-3">
        <Marquee speed={50} gradient={false}>
          <span className="mx-4 sm:mx-8 text-xs sm:text-sm font-medium">🔥 FLASH SALE: Up to 70% OFF</span>
          <span className="mx-4 sm:mx-8 text-xs sm:text-sm font-medium">✨ Free Shipping on Orders $50+</span>
          <span className="mx-4 sm:mx-8 text-xs sm:text-sm font-medium">🎉 New Arrivals Every Week</span>
          <span className="mx-4 sm:mx-8 text-xs sm:text-sm font-medium">💎 Premium Quality Guaranteed</span>
          <span className="mx-4 sm:mx-8 text-xs sm:text-sm font-medium">🚚 Fast Delivery Worldwide</span>
        </Marquee>
      </div>
    </div>
  )
}

export default Hero