import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { ShopContext } from '../../Context/EnhancedShopContext'
import './SearchFilter.css'

const SearchFilter = ({ onResultsChange, showFilters = true, initialQuery = '' }) => {
  const { searchProducts, all_product } = useContext(ShopContext)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'name',
    sortOrder: 'asc'
  })
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Categories for filtering
  const categories = ['men', 'women', 'kid']
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'new_price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'date', label: 'Date Added' }
  ]

  const performSearch = useCallback(async () => {
    if (!searchQuery.trim() && !Object.values(filters).some(f => f !== '' && f !== 'name' && f !== 'asc')) {
      setSearchResults([])
      onResultsChange && onResultsChange([])
      return
    }

    setIsSearching(true)
    try {
      const searchFilters = {
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      }

      const results = await searchProducts(searchQuery, searchFilters)
      
      if (results.success) {
        setSearchResults(results.products)
        onResultsChange && onResultsChange(results.products)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery, filters, searchProducts, onResultsChange])

  // Initialize search query when initialQuery prop changes
  useEffect(() => {
    setSearchQuery(initialQuery)
  }, [initialQuery])

  // Perform search when searchQuery or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [performSearch])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setShowSuggestions(e.target.value.length > 0)
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sortBy: 'name',
      sortOrder: 'asc'
    })
    setSearchResults([])
    onResultsChange && onResultsChange([])
  }

  // Generate search suggestions based on product names
  const getSuggestions = () => {
    if (!searchQuery.trim()) return []
    
    return all_product
      .filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5)
      .map(product => product.name)
  }

  const selectSuggestion = (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className="search-filter-container">
      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <div className="search-icon">
            {isSearching ? (
              <div className="search-spinner"></div>
            ) : (
              <Search className="h-4 w-4 text-gray-400" />
            )}
          </div>
          
          {/* Search Suggestions */}
          {showSuggestions && (
            <div className="search-suggestions">
              {getSuggestions().map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-container">
          <div className="filters-grid">
            {/* Category Filter */}
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Max Price</label>
              <input
                type="number"
                placeholder="$1000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <label>Min Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {/* Results Summary */}
      {searchResults.length > 0 && (
        <div className="results-summary">
          Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

export default SearchFilter 