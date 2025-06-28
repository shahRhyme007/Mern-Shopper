// Here we will render the different pages(eg. Shop, men, women, etc.)
import React, { useContext, useState, useEffect, useRef } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/EnhancedShopContext'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Item/Item'

const ShopCategory = (props) => {

  const {all_product} = useContext(ShopContext)
  const [sortBy, setSortBy] = useState('recommendation')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const dropdownRef = useRef(null)
  
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

  const sortOptions = [
    { value: 'recommendation', label: 'Recommendation' },
    { value: 'low-to-high', label: 'Price: Low to High' },
    { value: 'high-to-low', label: 'Price: High to Low' }
  ]

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
    setShowSortDropdown(false)
  }

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      {/* shop category index and sort */}
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-{Math.min(12, sortedProducts.length)}</span> out of {sortedProducts.length} products
        </p>
        <div className="shopcategory-sort" ref={dropdownRef}>
          <div 
            className="sort-dropdown"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <span>Sort by: {sortOptions.find(option => option.value === sortBy)?.label}</span>
            <img 
              src={dropdown_icon} 
              alt="dropdown icon" 
              className={`dropdown-icon ${showSortDropdown ? 'open' : ''}`}
            />
            {showSortDropdown && (
              <div className="sort-dropdown-menu">
                {sortOptions.map(option => (
                  <div
                    key={option.value}
                    className={`sort-option ${sortBy === option.value ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSortChange(option.value)
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* here we will map different category products */}
      <div className="shopcategory-products">
        {sortedProducts.map((item, i)=>{
            return <Item key={i} id={item.id} name={item.name} image = {item.image} new_price = {item.new_price} old_price = {item.old_price}/>
        })}
      </div>

      {/* load more button */}
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  )
}

export default ShopCategory