// Here we will render the different pages(eg. Shop, men, women, etc.)
import React, { useContext } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/EnhancedShopContext'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Item/Item'

const ShopCategory = (props) => {

  const {all_product} = useContext(ShopContext)
  
  // Filter products by category
  const filteredProducts = all_product?.filter(item => {
    return props.category === item.category
  }) || []

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      {/* shop category index and sort */}
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-{Math.min(12, filteredProducts.length)}</span> out of {filteredProducts.length} products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="dropdown icon" />
        </div>
      </div>
      {/* here we will map different category products */}
      <div className="shopcategory-products">
        {filteredProducts.map((item, i)=>{
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