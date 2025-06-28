import { useState, useEffect } from "react"
import "./ListProduct.css"
import cross_icon from '../../assets/cross_icon.png'
import { Edit3, X, Check } from 'lucide-react'

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [editingProduct, setEditingProduct] = useState(null)
    const [editForm, setEditForm] = useState({
        old_price: '',
        new_price: '',
        category: ''
    })
    const [updateLoading, setUpdateLoading] = useState(false)

    const fetchInfo = async () => {
        try {
            setLoading(true)
            setError("")
            const response = await fetch('http://localhost:4000/allproducts')
            
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
    
    useEffect(() => {
        fetchInfo()
    }, [])

    // function for removing product from the product list 
    const remove_product = async (id) => {
        try {
            const response = await fetch('http://localhost:4000/removeproduct', {
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
            old_price: product.old_price,
            new_price: product.new_price,
            category: product.category
        })
    }

    // Cancel editing
    const cancelEdit = () => {
        setEditingProduct(null)
        setEditForm({
            old_price: '',
            new_price: '',
            category: ''
        })
    }

    // Update product
    const updateProduct = async (productId) => {
        try {
            setUpdateLoading(true)
            
            // Validate prices
            if (parseFloat(editForm.old_price) < 0 || parseFloat(editForm.new_price) < 0) {
                alert('Prices cannot be negative')
                return
            }
            
            const response = await fetch('http://localhost:4000/updateproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: productId,
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
            <div className='list-product'>
                <h1>All Products List</h1>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading products...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='list-product'>
                <h1>All Products List</h1>
                <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    <p>{error}</p>
                    <button 
                        onClick={fetchInfo}
                        style={{
                            marginTop: '10px',
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

  return (
    <div className='list-product'>
        <h1>All Products List</h1>
            
            {allproducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>No products found. Add some products to get started!</p>
                </div>
            ) : (
                <>
        <div className="listproduct-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Old Price</p>
            <p>New Price</p>
            <p>Category</p>
            <p>Actions</p>
        </div>
        {/* here we will map our product data that we will fetch using the api   */}
        
        <div className="listproduct-allproducts">
            <hr />
                        {allproducts.map((product, index) => {
                            const isEditing = editingProduct === product.id
                            return (
                                <div key={product.id || index}>
                                    <div className="listproduct-format-main listproduct-format">
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="listproduct-product-icon"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-image.png'
                                                e.target.alt = 'Image not found'
                                            }}
                                        />
                                        <p>{product.name}</p>
                                        
                                        {/* Old Price */}
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
                                            <p>${product.old_price}</p>
                                        )}
                                        
                                        {/* New Price */}
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
                                            <p>${product.new_price}</p>
                                        )}
                                        
                                        {/* Category */}
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
                                            <p>{product.category}</p>
                                        )}
                                        
                                        {/* Actions */}
                                        <div className="product-actions">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => updateProduct(product.id)}
                                                        disabled={updateLoading}
                                                        className="action-btn save-btn"
                                                        title="Save changes"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        disabled={updateLoading}
                                                        className="action-btn cancel-btn"
                                                        title="Cancel editing"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(product)}
                                                        className="action-btn edit-btn"
                                                        title="Edit product"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <img 
                                                        onClick={() => {
                                                            if (window.confirm(`Are you sure you want to remove "${product.name}"?`)) {
                                                                remove_product(product.id)
                                                            }
                                                        }} 
                                                        src={cross_icon} 
                                                        alt="Remove product" 
                                                        className="listproduct-remove-icon"
                                                        style={{ cursor: 'pointer' }}
                                                        title="Remove product"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
  )
}

export default ListProduct