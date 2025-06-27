import './AddProduct.css'
import upload_area from "../../assets/upload_area.svg"
import { useState } from 'react'

const AddProduct = () => {
    // Adding a state variable for the upload image option so that the image is 
    // displayed once uploaded
    const [image, setImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    
    //gathering product details 
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: ""
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0])
        // Clear any previous image errors
        if (errors.image) {
            setErrors({...errors, image: ""})
        }
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
        
        if (!image) {
            newErrors.image = "Please select an image"
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
        let responseData; 
        // creating a copy of productDetails object
        let product = productDetails; 

        let formData = new FormData()
        // we will append the img in the form data
        formData.append("product", image)

        // now we have to send the form data to the api(fetchapi) to send to backend
        const uploadResponse = await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
            })
            
            responseData = await uploadResponse.json()
        
            // Check if upload was successful
            if (!responseData.success) {
                throw new Error(responseData.message || "Failed to upload image")
            }
            
            // Prepare product data with correct data types
            product.image = responseData.image_url
            product.new_price = parseFloat(product.new_price)
            product.old_price = parseFloat(product.old_price)
            
            console.log("Sending product data:", product);
            
            // we received the image url now we can send it to the app product endpoint
        const addProductResponse = await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            })
            
            const addProductData = await addProductResponse.json()
            
            if (addProductData.success) {
                alert("Product Added Successfully")
                // Reset form
                setProductDetails({
                    name: "",
                    image: "",
                    category: "women",
                    new_price: "",
                    old_price: ""
                })
                setImage(false)
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
    <div className="add-product">
            {/* Display general errors */}
            {errors.general && (
                <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#fee', borderRadius: '4px' }}>
                    {errors.general}
                </div>
            )}
            
        {/* product name */}
        <div className="addproduct-itemfield">
            <p>Product title</p>
                <input 
                    value={productDetails.name} 
                    onChange={changeHandler} 
                    type="text" 
                    name="name" 
                    placeholder="Type here"
                    disabled={loading}
                    style={errors.name ? { borderColor: 'red' } : {}}
                />
                {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
        </div>

        {/* product Price */}
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                    <input 
                        value={productDetails.old_price} 
                        onChange={changeHandler} 
                        type="number" 
                        name="old_price" 
                        placeholder="Type here"
                        disabled={loading}
                        min="0"
                        step="0.01"
                        style={errors.old_price ? { borderColor: 'red' } : {}}
                    />
                    {errors.old_price && <span style={{ color: 'red', fontSize: '12px' }}>{errors.old_price}</span>}
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                    <input 
                        value={productDetails.new_price} 
                        onChange={changeHandler} 
                        type="number" 
                        name="new_price" 
                        placeholder="Type here"
                        disabled={loading}
                        min="0"
                        step="0.01"
                        style={errors.new_price ? { borderColor: 'red' } : {}}
                    />
                    {errors.new_price && <span style={{ color: 'red', fontSize: '12px' }}>{errors.new_price}</span>}
                </div>
            </div>
            
            {/* product category */}
        <div className="addproduct-itemfield">
            <p>Product Category</p>
                <select 
                    value={productDetails.category} 
                    onChange={changeHandler} 
                    name="category" 
                    className="add-product-selector"
                    disabled={loading}
                >
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">Kid</option>
            </select>
        </div>

        {/* image upload of the product */}
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                    {/* if image selected show the selected image otherwise show the upload area image */}
                    <img 
                        src={image ? URL.createObjectURL(image) : upload_area} 
                        className='addproduct-thumbnail-img' 
                        alt="" 
                        style={errors.image ? { border: '2px solid red' } : {}}
                    />
            </label>
            {/* hidden is used to hide the input field . so the img is just shown */}
                <input 
                    onChange={imageHandler} 
                    type="file" 
                    name='image' 
                    id="file-input" 
                    hidden
                    disabled={loading}
                    accept="image/*"
                />
                {errors.image && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.image}</div>}
        </div>

        {/* add button */}
            <button 
                onClick={() => Add_Product()} 
                className="addproduct-btn"
                disabled={loading}
                style={{ 
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? "ADDING..." : "ADD"}
            </button>
    </div>
  )
}

export default AddProduct