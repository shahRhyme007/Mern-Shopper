import React, { useContext } from 'react'
import './RelatedProducts.css'
import Item from '../Item/Item'
import { ShopContext } from '../../Context/EnhancedShopContext'

const RelatedProducts = ({ currentProductId }) => {
  const { all_product } = useContext(ShopContext)
  
  // Get related products (excluding current product) and limit to 4
  const relatedProducts = all_product
    .filter(item => item.id !== currentProductId)
    .slice(0, 4)

  return (
    <div className='relatedproducts'>
        <h1>Related Products</h1>
        <hr />
        <div className="relatedproducts-item">
            {relatedProducts.map((item, i)=>{
                return  <Item key={i} id={item.id} name={item.name} image = {item.image} new_price = {item.new_price} old_price = {item.old_price}/>
            })}
        </div>
    </div>
  )
}

export default RelatedProducts