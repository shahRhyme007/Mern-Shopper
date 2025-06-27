import React, { useContext } from 'react'
import './ProductDisplay.css'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import { ShopContext } from '../../Context/EnhancedShopContext'

const ProductDisplay = (props) => {

    const {product} = props
    const {addToCart} = useContext(ShopContext)
    
    const handleImageError = (e) => {
        // Fallback to a simple gray placeholder if image fails to load
        console.warn('Product image failed to load:', e.target.src);
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
    }
    
  return (
    <div className='productdisplay'>

        {/* For the left side of the product display */}
        <div className="productdisplay-left">
            <div className="productdisplay-img-list">
                <img src={product.image} alt="" onError={handleImageError} />
                <img src={product.image} alt="" onError={handleImageError} />
                <img src={product.image} alt="" onError={handleImageError} />
                <img src={product.image} alt="" onError={handleImageError} />
            </div>
            <div className="productdisplay-img">
                <img className='productdisplay-main-img' src={product.image} alt="" onError={handleImageError} />
            </div>

        </div>

        {/* For the right side of the product display */}
        <div className="productdisplay-right">
            <h1>{product.name}</h1>
            {/* Ratings */}
            <div className="productdisplay-right-stars">
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_dull_icon} alt="" />
                <p>(122)</p>
            </div>

            {/* Price */}
            <div className="productdisplay-right-prices">
                <div className="productdisplay-right-price-old">
                    ${product.old_price}
                </div>
                <div className="productdisplay-right-price-new">
                    ${product.new_price}
                </div>
            </div>

            {/* Description */}
            <div className="productdisplay-right-description">
            A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.
            </div>
            {/* product size */}
            <div className="productdisplay-right-size">
                <h1>Select Size</h1>
                <div className="productdisplay-right-sizes">
                    <div>S</div>
                    <div>M</div>
                    <div>L</div>
                    <div>XL</div>
                    <div>XXL</div>
                </div>
            </div>
            <button onClick={()=>{addToCart(product.id)}}>ADD TO CART</button>
            <p className='productdisplay-right-category'><span>Category:</span> Women, T-Shirt , Crop  Top</p>
            <p className='productdisplay-right-category'><span>Tags:</span> Modern, Latest</p>
        </div>

    </div>
  )
}

export default ProductDisplay