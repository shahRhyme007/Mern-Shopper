// Here we will render the different pages(eg. Shop, men, women, etc.)
import React, { useContext, useState, useEffect, useRef } from 'react'
import './CSS/ShopCategory.css'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Grid, List, Plus, Minus, ArrowUp } from 'lucide-react'
import { ShopContext } from '../Context/EnhancedShopContext'
import Item from '../Components/Item/Item'
import { Button } from '../Components/ui/button'
import { cn } from '../lib/utils'

const ShopCategory = (props) => {

  const {all_product} = useContext(ShopContext)
  const [sortBy, setSortBy] = useState('recommendation')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [visibleCount, setVisibleCount] = useState(10) // Track how many products to show
  const [maxLoadedCount, setMaxLoadedCount] = useState(10) // Track maximum products loaded so far
  const dropdownRef = useRef(null)
  
  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
    // Reset visible count when category changes
    setVisibleCount(10)
    setMaxLoadedCount(10)
  }, [props.category])
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Filter products by category
  const filteredProducts = all_product?.filter(item => {
    return props.category === item.category
  }) || []

  // Sort products based on selected option
  const sortProducts = (products, sortOption) => {
    const productsCopy = [...products]
    
    switch(sortOption) {
      case 'low-to-high':
        return productsCopy.sort((a, b) => a.new_price - b.new_price)
      case 'high-to-low':
        return productsCopy.sort((a, b) => b.new_price - a.new_price)
      case 'recommendation':
      default:
        // Sort by rating first, then by reviewCount, then by date (newest first)
        return productsCopy.sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating
          }
          if (b.reviewCount !== a.reviewCount) {
            return b.reviewCount - a.reviewCount
          }
          return new Date(b.date) - new Date(a.date)
        })
    }
  }

  const sortedProducts = sortProducts(filteredProducts, sortBy)
  const visibleProducts = sortedProducts.slice(0, visibleCount) // Only show products up to visibleCount
  const hasMoreProducts = visibleCount < sortedProducts.length // Check if there are more products to load
  const canShowLess = maxLoadedCount > 10 && visibleCount > 10 // Check if we can show less

  const sortOptions = [
    { value: 'recommendation', label: 'Recommended' },
    { value: 'low-to-high', label: 'Price: Low to High' },
    { value: 'high-to-low', label: 'Price: High to Low' }
  ]

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
    setShowSortDropdown(false)
    // Reset visible count when sorting changes
    setVisibleCount(10)
    setMaxLoadedCount(10)
  }

  const handleLoadMore = () => {
    const newCount = visibleCount + 10
    setVisibleCount(newCount)
    setMaxLoadedCount(Math.max(maxLoadedCount, newCount))
  }

  const handleShowLess = () => {
    setVisibleCount(10)
    // Smooth scroll to top of products section
    const productsSection = document.querySelector('.products-grid')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const categoryNames = {
    'men': 'Men\'s Collection',
    'women': 'Women\'s Collection', 
    'kid': 'Kids\' Collection'
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Banner */}
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <motion.img 
          className="w-full h-full object-cover" 
          src={props.banner} 
          alt={`${props.category} banner`}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4">
              {categoryNames[props.category] || 'Collection'}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">
              Discover the latest trends and styles
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header with filters and sort */}
        <motion.div 
          className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-4 mb-6 sm:mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {sortedProducts.length} Products
            </h2>
            <div className="text-sm text-gray-500">
              Showing 1-{visibleProducts.length} of {sortedProducts.length}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-4">
            {/* View Mode Toggle - Hidden on mobile */}
            <div className="hidden sm:flex rounded-lg border border-gray-300 p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="outline"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center space-x-2 text-sm"
              >
                <span className="hidden sm:inline">Sort: </span>
                <span>{sortOptions.find(option => option.value === sortBy)?.label}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  showSortDropdown && "rotate-180"
                )} />
              </Button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 sm:w-56 rounded-lg bg-white shadow-lg border border-gray-200 z-50"
                  >
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        className={cn(
                          "w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg",
                          sortBy === option.value && "bg-red-50 text-red-600"
                        )}
                        onClick={() => handleSortChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className={cn(
            "products-grid grid gap-4 sm:gap-6 mb-8 sm:mb-12",
            viewMode === 'grid' 
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
              : "grid-cols-1"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {visibleProducts.length > 0 ? (
            visibleProducts.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="w-full"
              >
                <Item 
                  id={item.id} 
                  name={item.name} 
                  image={item.image} 
                  new_price={item.new_price} 
                  old_price={item.old_price}
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Load More / Show Less Button */}
        {(hasMoreProducts || canShowLess) && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {hasMoreProducts ? (
              <Button 
                onClick={handleLoadMore}
                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
              >
                <span className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Load More Products</span>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
              </Button>
            ) : (
              <Button 
                onClick={handleShowLess}
                className="group relative overflow-hidden bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
              >
                <span className="flex items-center space-x-2">
                  <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
                  <span>Show Less Products</span>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ShopCategory