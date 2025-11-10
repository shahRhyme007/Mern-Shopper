import './AddProduct.css';
import { useState } from 'react';
import { API_ENDPOINTS } from "../../config/api";
import { 
  Package, 
  DollarSign, 
  Tag, 
  ImagePlus, 
  Save, 
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

const AddProduct = () => {
    // State for multiple image uploads (3-10 images)
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    
    //gathering product details 
    const [productDetails, setProductDetails] = useState({
        name: "",
        images: [],
        category: "women",
        new_price: "",
        old_price: ""
    });

    const imageHandler = (e) => {
        const files = Array.from(e.target.files)
        const currentImages = [...images]
        
        // Check if adding these files would exceed maximum limit
        if (currentImages.length + files.length > 10) {
            setErrors({...errors, images: `Maximum 10 images allowed. You can add ${10 - currentImages.length} more images.`})
            return
        }
        
        // Validate file types and sizes
        const validFiles = []
        const invalidFiles = []
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                if (file.size <= 5 * 1024 * 1024) { // 5MB limit
                    validFiles.push(file)
                } else {
                    invalidFiles.push(`${file.name} (file too large)`)
                }
            } else {
                invalidFiles.push(`${file.name} (not an image)`)
            }
        })
        
        if (invalidFiles.length > 0) {
            setErrors({...errors, images: `Invalid files: ${invalidFiles.join(', ')}`})
            return
        }
        
        setImages([...currentImages, ...validFiles])
        // Clear any previous image errors
        if (errors.images) {
            setErrors({...errors, images: ""})
        }
    }

    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index)
        setImages(updatedImages)
    }

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (images.length < 10) {
            e.currentTarget.classList.add('drag-over')
        }
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.remove('drag-over')
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.remove('drag-over')
        
        if (images.length >= 10) return
        
        const files = Array.from(e.dataTransfer.files)
        
        // Create a mock event object for imageHandler
        const mockEvent = {
            target: {
                files: files
            }
        }
        
        imageHandler(mockEvent)
    }

    // function for getting the information put in the input fields by the user
    const changeHandler = (e) => {
        setProductDetails({
            ...productDetails, [e.target.name]: e.target.value
        })
        // Clear field-specific errors when user starts typing
        if (errors[e.target.name]) {
            setErrors({...errors, [e.target.name]: ""})
        }
    }

    // Form validation
    const validateForm = () => {
        const newErrors = {}
        
        if (!productDetails.name.trim()) {
            newErrors.name = "Product name is required"
        }
        
        if (!productDetails.new_price || isNaN(productDetails.new_price) || parseFloat(productDetails.new_price) <= 0) {
            newErrors.new_price = "New price must be a positive number"
        }
        
        if (!productDetails.old_price || isNaN(productDetails.old_price) || parseFloat(productDetails.old_price) <= 0) {
            newErrors.old_price = "Old price must be a positive number"
        }
        
        if (images.length < 3) {
            newErrors.images = "Please upload at least 3 product images"
        } else if (images.length > 10) {
            newErrors.images = "Maximum 10 images allowed"
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // function for add product button
    const Add_Product = async () => {
        // Validate form first
        if (!validateForm()) {
            return
        }

        setLoading(true)
        setErrors({})

        try {
            // Upload all images first
            const imageUrls = []
            
            for (let i = 0; i < images.length; i++) {
                const image = images[i]
                const formData = new FormData()
                formData.append("product", image)

                const uploadResponse = await fetch(API_ENDPOINTS.UPLOAD, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                    },
                    body: formData,
                })
                
                const responseData = await uploadResponse.json()
                
                if (!responseData.success) {
                    throw new Error(responseData.message || `Failed to upload image ${i + 1}`)
                }
                
                imageUrls.push(responseData.image_url)
            }
            
            // Prepare product data with correct data types
            const product = {
                ...productDetails,
                images: imageUrls,
                image: imageUrls[0], // Keep first image as main for backward compatibility
                new_price: parseFloat(productDetails.new_price),
                old_price: parseFloat(productDetails.old_price)
            }
            
            console.log("Sending product data:", product);
            
            // Send product data to backend
            const addProductResponse = await fetch(API_ENDPOINTS.ADD_PRODUCT, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            })
            
            const addProductData = await addProductResponse.json()
            
            if (addProductData.success) {
                alert(`Product Added Successfully with ${imageUrls.length} images!`)
                // Reset form
                setProductDetails({
                    name: "",
                    images: [],
                    category: "women",
                    new_price: "",
                    old_price: ""
                })
                setImages([])
                setErrors({})
            } else {
                throw new Error(addProductData.errors || "Failed to add product")
            }
            
        } catch (error) {
            console.error('Error adding product:', error)
            alert(`Failed to Add Product: ${error.message}`)
            setErrors({general: error.message})
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className="modern-add-product">
      {/* Header */}
      <div className="add-product-header">
        <div className="header-content">
          <h1>
            <Package size={24} />
            Add New Product
          </h1>
          <p>Create a new product for your store inventory</p>
        </div>
        {loading && (
          <div className="loading-indicator">
            <Loader2 size={20} className="animate-spin" />
            Processing...
          </div>
        )}
      </div>

      {/* Error Alert */}
      {errors.general && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <div>
            <strong>Error</strong>
            <p>{errors.general}</p>
          </div>
          <button 
            onClick={() => setErrors({...errors, general: ''})}
            className="alert-close"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="add-product-content">
        {/* Main Form */}
        <div className="add-product-form">
          {/* Product Information Card */}
          <div className="form-card">
            <div className="card-header">
              <h3>
                <Package size={20} />
                Product Information
              </h3>
            </div>
            <div className="card-content">
              {/* Product Name */}
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <div className="input-wrapper">
                  <input 
                    id="name"
                    value={productDetails.name} 
                    onChange={changeHandler} 
                    type="text" 
                    name="name" 
                    placeholder="Enter product name"
                    disabled={loading}
                    className={errors.name ? 'error' : ''}
                  />
                </div>
                {errors.name && (
                  <div className="field-error">
                    <AlertCircle size={14} />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <div className="input-wrapper">
                  <Tag size={20} className="input-icon" />
                  <select 
                    id="category"
                    value={productDetails.category} 
                    onChange={changeHandler} 
                    name="category" 
                    disabled={loading}
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="form-card">
            <div className="card-header">
              <h3>
                <DollarSign size={20} />
                Pricing
              </h3>
            </div>
            <div className="card-content">
              <div className="price-grid">
                {/* Regular Price */}
                <div className="form-group">
                  <label htmlFor="old_price">Regular Price *</label>
                  <div className="input-wrapper">
                    <DollarSign size={20} className="input-icon" />
                    <input 
                      id="old_price"
                      value={productDetails.old_price} 
                      onChange={changeHandler} 
                      type="number" 
                      name="old_price" 
                      placeholder="0.00"
                      disabled={loading}
                      min="0"
                      step="0.01"
                      className={errors.old_price ? 'error' : ''}
                    />
                  </div>
                  {errors.old_price && (
                    <div className="field-error">
                      <AlertCircle size={14} />
                      {errors.old_price}
                    </div>
                  )}
                </div>

                {/* Sale Price */}
                <div className="form-group">
                  <label htmlFor="new_price">Sale Price *</label>
                  <div className="input-wrapper">
                    <DollarSign size={20} className="input-icon" />
                    <input 
                      id="new_price"
                      value={productDetails.new_price} 
                      onChange={changeHandler} 
                      type="number" 
                      name="new_price" 
                      placeholder="0.00"
                      disabled={loading}
                      min="0"
                      step="0.01"
                      className={errors.new_price ? 'error' : ''}
                    />
                  </div>
                  {errors.new_price && (
                    <div className="field-error">
                      <AlertCircle size={14} />
                      {errors.new_price}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Difference Display */}
              {productDetails.old_price && productDetails.new_price && (
                <div className="price-summary">
                  <div className="discount-info">
                    <span className="discount-label">Discount:</span>
                    <span className="discount-amount">
                      ${(parseFloat(productDetails.old_price) - parseFloat(productDetails.new_price)).toFixed(2)}
                      ({Math.round(((parseFloat(productDetails.old_price) - parseFloat(productDetails.new_price)) / parseFloat(productDetails.old_price)) * 100)}% off)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload Card */}
        <div className="upload-card">
          <div className="card-header">
            <h3>
              <ImagePlus size={20} />
              Product Images ({images.length}/10)
            </h3>
            <span className="image-requirement">
              {images.length < 3 ? `${3 - images.length} more required` : 'Complete'}
            </span>
          </div>
          <div className="card-content">
            {/* Upload Area */}
            <div 
              className={`upload-area ${errors.images ? 'error' : ''} ${images.length >= 10 ? 'disabled' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label htmlFor="file-input" className="upload-label">
                <div className="upload-content">
                  <div className="upload-placeholder">
                    <ImagePlus size={48} />
                    <h4>Upload Product Images</h4>
                    <p>Click here or drag and drop multiple images</p>
                    <span className="file-types">PNG, JPG, JPEG up to 5MB each</span>
                    <span className="upload-requirement">
                      Minimum 3 images, Maximum 10 images
                    </span>
                  </div>
                </div>
              </label>
              <input 
                onChange={imageHandler} 
                type="file" 
                name='images' 
                id="file-input" 
                hidden
                disabled={loading || images.length >= 10}
                accept="image/*"
                multiple
              />
            </div>
            
            {/* Error Display */}
            {errors.images && (
              <div className="field-error">
                <AlertCircle size={14} />
                {errors.images}
              </div>
            )}
            
            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="image-gallery">
                <h4>Selected Images ({images.length})</h4>
                <div className="image-grid">
                  {images.map((image, index) => (
                    <div key={index} className="image-item">
                      <div className="image-preview">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`Product ${index + 1}`}
                          className="preview-image"
                        />
                        <div className="image-overlay">
                          <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="remove-image-btn"
                            disabled={loading}
                            title="Remove image"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {index === 0 && (
                          <div className="main-image-badge">Main</div>
                        )}
                      </div>
                      <div className="image-info">
                        <span className="image-name">{image.name}</span>
                        <span className="image-size">
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add More Button */}
                {images.length < 10 && (
                  <button 
                    type="button"
                    onClick={() => document.getElementById('file-input').click()}
                    className="add-more-btn"
                    disabled={loading}
                  >
                    <ImagePlus size={16} />
                    Add More Images ({images.length}/10)
                  </button>
                )}
              </div>
            )}
            
            {/* Progress Indicator */}
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min((images.length / 3) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {images.length < 3 
                  ? `${images.length}/3 minimum required` 
                  : `${images.length}/10 images selected`
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <button 
          type="button"
          onClick={() => {
            setProductDetails({
              name: "",
              images: [],
              category: "women",
              new_price: "",
              old_price: ""
            });
            setImages([]);
            setErrors({});
          }}
          className="btn btn-secondary"
          disabled={loading}
        >
          Reset Form
        </button>
        <button 
          onClick={Add_Product} 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Adding Product...
            </>
          ) : (
            <>
              <Save size={18} />
              Add Product
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default AddProduct