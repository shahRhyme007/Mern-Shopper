import './Sidebar.css'
import { Link } from 'react-router-dom'
import add_product_icon from "../../assets/Product_Cart.svg"
import list_product_icon from "../../assets/Product_list_icon.svg"

// the sidebar is mounted to the admin page(Admin.jsx)
const Sidebar = () => {
  return (
    <div className='sidebar'>
        {/* link for adding products */}
        <Link to= {'/addproduct'} style={{ textDecoration: 'none' }}>
            <div className="sidebar-item">
                <img src={add_product_icon} alt="" />
                <p>Add Product</p>
            </div>
        </Link>

        {/* link for list of products  */}
        <Link to= {'/listproduct'} style={{ textDecoration: 'none' }}>
            <div className="sidebar-item">
                <img src={list_product_icon} alt="" />
                <p>Product List</p>
            </div>
        </Link>
    </div>
  )
}

export default Sidebar