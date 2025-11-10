import { useState, useEffect } from "react";
import "./ListProduct.css";
import { 
  Edit3, 
  X, 
  Check, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { API_ENDPOINTS } from "../../config/api";

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [editingProduct, setEditingProduct] = useState(null)
    const [editForm, setEditForm] = useState({
        name: '',
        old_price: '',
        new_price: '',
        category: ''
    })
    const [updateLoading, setUpdateLoading] = useState(false)
    
    // Search and Filter states
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [priceFilter, setPriceFilter] = useState('all')
    const [sortBy, setSortBy] = useState('name')
    const [sortOrder, setSortOrder] = useState('asc')
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    const fetchInfo = async () => {
        try {
            setLoading(true)
            setError("")
            const response = await fetch(API_ENDPOINTS.ALL_PRODUCTS)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            setAllProducts(data || [])
            console.log("Products fetched successfully:", data?.length || 0)
        } catch (err) {
            console.error('Error fetching products:', err)
            setError("Failed to fetch products. Please check if the backend server is running.")
            setAllProducts([])
        } finally {
            setLoading(false)
        }
    }
    
    // Filter and search products
    useEffect(() => {
        let filtered = [...allproducts]
        
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        
        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(product => product.category === categoryFilter)
        }
        
        // Price filter
        if (priceFilter !== 'all') {
            switch (priceFilter) {
                case 'under-50':
                    filtered = filtered.filter(product => parseFloat(product.new_price) < 50)
                    break
                case '50-100':
                    filtered = filtered.filter(product => 
                        parseFloat(product.new_price) >= 50 && parseFloat(product.new_price) < 100
                    )
                    break
                case 'over-100':
                    filtered = filtered.filter(product => parseFloat(product.new_price) >= 100)
                    break
                default:
                    break
            }
        }
        
        // Sort products
        filtered.sort((a, b) => {
            let aValue, bValue
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase()
                    bValue = b.name.toLowerCase()
                    break
                case 'price':
                    aValue = parseFloat(a.new_price)
                    bValue = parseFloat(b.new_price)
                    break
                case 'category':
                    aValue = a.category
                    bValue = b.category
                    break
                default:
                    return 0
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })
        
        setFilteredProducts(filtered)
        setCurrentPage(1) // Reset to first page when filters change
    }, [allproducts, searchTerm, categoryFilter, priceFilter, sortBy, sortOrder])
    
    useEffect(() => {
        fetchInfo()
    }, [])
    
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    // function for removing product from the product list 
    const remove_product = async (id) => {
        try {
            const response = await fetch(API_ENDPOINTS.REMOVE_PRODUCT, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
            })
            
            const data = await response.json()
            
            if (data.success) {
                alert(`Product "${data.name}" removed successfully`)
        // updated product list will be shown 
                await fetchInfo()
            } else {
                throw new Error(data.errors || "Failed to remove product")
            }
        } catch (err) {
            console.error('Error removing product:', err)
            alert(`Failed to remove product: ${err.message}`)
        }
    }

    // Start editing a product
    const startEdit = (product) => {
        setEditingProduct(product.id)
        setEditForm({
            name: product.name,
            old_price: product.old_price,
            new_price: product.new_price,
            category: product.category
        })
    }

    // Cancel editing
    const cancelEdit = () => {
        setEditingProduct(null)
        setEditForm({
            name: '',
            old_price: '',
            new_price: '',
            category: ''
        })
    }

    // Update product
    const updateProduct = async (productId) => {
        try {
            setUpdateLoading(true)
            
            // Validate form data
            if (!editForm.name.trim()) {
                alert('Product name cannot be empty')
                return
            }
            
            if (parseFloat(editForm.old_price) < 0 || parseFloat(editForm.new_price) < 0) {
                alert('Prices cannot be negative')
                return
            }
            
            const response = await fetch(API_ENDPOINTS.UPDATE_PRODUCT, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: productId,
                    name: editForm.name.trim(),
                    old_price: parseFloat(editForm.old_price),
                    new_price: parseFloat(editForm.new_price),
                    category: editForm.category
                }),
            })
            
            const data = await response.json()
            
            if (data.success) {
                alert('Product updated successfully!')
                await fetchInfo()
                cancelEdit()
            } else {
                throw new Error(data.errors || "Failed to update product")
            }
        } catch (err) {
            console.error('Error updating product:', err)
            alert(`Failed to update product: ${err.message}`)
        } finally {
            setUpdateLoading(false)
        }
    }

    // Handle form input changes
    const handleInputChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }))
    }

  if (loading) {
    return (
      <div className='modern-product-list'>
        <div className="product-list-header">
          <h1>
            <Package size={24} />
            Product List
          </h1>
        </div>
        <div className="loading-container">
          <Loader2 size={48} className="animate-spin" />
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='modern-product-list'>
        <div className="product-list-header">
          <h1>
            <Package size={24} />
            Product List
          </h1>
        </div>
        <div className="error-container">
          <AlertCircle size={48} />
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchInfo} className="btn btn-primary">
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='modern-product-list'>
      {/* Header */}
      <div className="product-list-header">
        <div className="header-content">
          <h1>
            <Package size={24} />
            Product List
          </h1>
          <p>Manage your store inventory</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchInfo} className="btn btn-secondary">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-container">
          <div className="filter-group">
            <label>Category</label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kid">Kid</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Price Range</label>
            <select 
              value={priceFilter} 
              onChange={(e) => setPriceFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Prices</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="over-100">Over $100</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="category">Category</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Order</label>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <span className="results-count">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
        </span>
        {(searchTerm || categoryFilter !== 'all' || priceFilter !== 'all') && (
          <button 
            className="clear-filters"
            onClick={() => {
              setSearchTerm('')
              setCategoryFilter('all')
              setPriceFilter('all')
              setSortBy('name')
              setSortOrder('asc')
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <Package size={64} />
          <h3>No products found</h3>
          <p>
            {allproducts.length === 0 
              ? "Add some products to get started!" 
              : "Try adjusting your search or filters."
            }
          </p>
        </div>
      ) : (
        <>
          <div className="products-table">
            <div className="table-header">
              <div className="header-cell image-cell">Image</div>
              <div className="header-cell name-cell">Product Name</div>
              <div className="header-cell price-cell">Regular Price</div>
              <div className="header-cell price-cell">Sale Price</div>
              <div className="header-cell category-cell">Category</div>
              <div className="header-cell actions-cell">Actions</div>
            </div>
            
            <div className="table-body">
              {currentProducts.map((product, index) => {
                const isEditing = editingProduct === product.id
                return (
                  <div key={product.id || index} className="table-row">
                    {/* Image */}
                    <div className="table-cell image-cell">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNkMyMyAyNiAyNS41IDIzLjUgMjUuNSAyMC41QzI1LjUgMTcuNSAyMyAxNSAyMCAxNUMxNyAxNSAxNC41IDE3LjUgMTQuNSAyMC41QzE0LjUgMjMuNSAxNyAyNiAyMCAyNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
                          e.target.alt = 'Image not found'
                        }}
                      />
                    </div>
                    
                    {/* Product Name */}
                    <div className="table-cell name-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="edit-input name-input"
                          placeholder="Enter product name"
                          maxLength="200"
                        />
                      ) : (
                        <span className="product-name">{product.name}</span>
                      )}
                    </div>
                    
                    {/* Regular Price */}
                    <div className="table-cell price-cell">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.old_price}
                          onChange={(e) => handleInputChange('old_price', e.target.value)}
                          className="edit-input"
                          step="0.01"
                          min="0"
                        />
                      ) : (
                        <span className="price">${product.old_price}</span>
                      )}
                    </div>
                    
                    {/* Sale Price */}
                    <div className="table-cell price-cell">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.new_price}
                          onChange={(e) => handleInputChange('new_price', e.target.value)}
                          className="edit-input"
                          step="0.01"
                          min="0"
                        />
                      ) : (
                        <span className="price sale-price">${product.new_price}</span>
                      )}
                    </div>
                    
                    {/* Category */}
                    <div className="table-cell category-cell">
                      {isEditing ? (
                        <select
                          value={editForm.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="edit-select"
                        >
                          <option value="men">Men</option>
                          <option value="women">Women</option>
                          <option value="kid">Kid</option>
                        </select>
                      ) : (
                        <span className={`category-badge ${product.category}`}>
                          {product.category}
                        </span>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="table-cell actions-cell">
                      <div className="action-buttons">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => updateProduct(product.id)}
                              disabled={updateLoading}
                              className="action-btn save-btn"
                              title="Save changes"
                            >
                              {updateLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={updateLoading}
                              className="action-btn cancel-btn"
                              title="Cancel editing"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(product)}
                              className="action-btn edit-btn"
                              title="Edit product"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove "${product.name}"?`)) {
                                  remove_product(product.id)
                                }
                              }}
                              className="action-btn delete-btn"
                              title="Delete product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ListProduct