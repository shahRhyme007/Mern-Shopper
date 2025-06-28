import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchFilter from '../Components/SearchFilter/SearchFilter'
import Item from '../Components/Item/Item'
import Loading from '../Components/Loading/Loading'
import './CSS/SearchResults.css'

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentQuery, setCurrentQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  // Get search query from URL parameters
  const searchParams = new URLSearchParams(location.search)
  const initialQuery = searchParams.get('q') || ''

  // Update current query when URL changes
  useEffect(() => {
    setCurrentQuery(initialQuery)
  }, [initialQuery, location.search])

  useEffect(() => {
    // Set page title
    if (currentQuery) {
      document.title = `Search Results for "${currentQuery}" - SHOPPER`
    } else {
      document.title = 'Search Products - SHOPPER'
    }
  }, [currentQuery])

  const handleResultsChange = (results) => {
    setSearchResults(results)
    setLoading(false)
  }

  const handleSearchStart = () => {
    setLoading(true)
  }

  return (
    <div className="search-results-page">
      <div className="search-results-container">
        <div className="search-header">
          <h1>Search Products</h1>
          {currentQuery && (
            <p className="search-query-display">
              Results for: "<span className="query-text">{currentQuery}</span>"
            </p>
          )}
        </div>

        {/* Search and Filter Component */}
        <SearchFilter 
          key={location.search} // Force re-render when URL changes
          onResultsChange={handleResultsChange}
          onSearchStart={handleSearchStart}
          showFilters={true}
          initialQuery={currentQuery}
        />

        {/* Search Results */}
        <div className="search-results-content">
          {loading ? (
            <Loading message="Searching products..." />
          ) : searchResults.length > 0 ? (
            <div className="search-results-grid">
              {searchResults.map((item, i) => (
                <Item 
                  key={i} 
                  id={item.id} 
                  name={item.name} 
                  image={item.image} 
                  new_price={item.new_price} 
                  old_price={item.old_price}
                />
              ))}
            </div>
          ) : currentQuery || searchResults.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search terms or filters to find what you're looking for.</p>
              <div className="search-suggestions">
                <h4>Search Tips:</h4>
                <ul>
                  <li>Check your spelling</li>
                  <li>Try more general terms</li>
                  <li>Try different keywords</li>
                  <li>Remove some filters</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="search-placeholder">
              <div className="search-placeholder-icon">🛍️</div>
              <h3>Start your search</h3>
              <p>Use the search bar above to find products you love!</p>
            </div>
          )}
        </div>

        {/* Quick Search Suggestions */}
        <div className="quick-search-section">
          <h3>Popular Searches</h3>
          <div className="quick-search-tags">
            {['shirts', 'jackets', 'dresses', 'shoes', 'accessories'].map(tag => (
              <button
                key={tag}
                className="quick-search-tag"
                onClick={() => navigate(`/search?q=${tag}`)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResults 