import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'

import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../../Context/EnhancedShopContext'
import nav_dropdown from '../Assets/nav_dropdown.png'

const Navbar = () => {
    // usestate to change the hr in the navmenu
    const [menu, setMenu] = useState('shop')
    const [showUserMenu, setShowUserMenu] = useState(false)
    const { getTotalCartItems, isAuthenticated, user, logout } = useContext(ShopContext)
    const navigate = useNavigate()

    // using a nav menu for the smaller screen
    const menuRef = useRef()

    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    };

    const handleLogout = () => {
        logout()
        setShowUserMenu(false)
        navigate('/')
    }

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu)
    }

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className='navbar'>
            {/* navlogo */}
            <div className="nav-logo">
                <img src={logo} alt="logo" />
                <p>SHOPPER</p>
            </div>

            {/* Search Bar */}
            <div className="nav-search">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        🔍
                    </button>
                </form>
            </div>

            {/* dropdown icon for smaller screens */}
            <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
            
            {/* Menu along with the usestate of hr */}
            <ul ref={menuRef} className="nav-menu">
                <li onClick={() => {setMenu("shop")}}><Link to={"/"}>Shop</Link> {menu === "shop" ? <hr/> : <></>}</li>
                <li onClick={() => {setMenu("mens")}}><Link to={"/mens"}>Men</Link> {menu === "mens" ? <hr/> : <></>}</li>
                <li onClick={() => {setMenu("womens")}}><Link to={"/womens"}>Women</Link> {menu === "womens" ? <hr/> : <></>}</li>
                <li onClick={() => {setMenu("kids")}}><Link to={"/kids"}>Kids</Link> {menu === "kids" ? <hr/> : <></>}</li>
            </ul>

            {/* login cart */}
            <div className="nav-login-cart">
                {isAuthenticated ? (
                    <div className="user-menu" style={{ position: 'relative' }}>
                        <button 
                            onClick={toggleUserMenu}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#515151',
                                cursor: 'pointer',
                                fontSize: '16px',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            Hi, {user?.name || 'User'} ▼
                        </button>
                        
                        {showUserMenu && (
                            <div 
                                className="dropdown-menu"
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: '0',
                                    background: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    minWidth: '150px',
                                    zIndex: 1000
                                }}
                            >
                                <Link 
                                    to="/profile" 
                                    style={{
                                        display: 'block',
                                        padding: '10px 15px',
                                        color: '#515151',
                                        textDecoration: 'none',
                                        borderBottom: '1px solid #eee'
                                    }}
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    My Profile
                                </Link>
                                <Link 
                                    to="/orders" 
                                    style={{
                                        display: 'block',
                                        padding: '10px 15px',
                                        color: '#515151',
                                        textDecoration: 'none',
                                        borderBottom: '1px solid #eee'
                                    }}
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    My Orders
                                </Link>
                                <Link 
                                    to="/wishlist" 
                                    style={{
                                        display: 'block',
                                        padding: '10px 15px',
                                        color: '#515151',
                                        textDecoration: 'none',
                                        borderBottom: '1px solid #eee'
                                    }}
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    Wishlist
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%',
                                        padding: '10px 15px',
                                        background: 'none',
                                        border: 'none',
                                        color: '#e74c3c',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to={"/login"}> 
                        <button>Login</button>
                    </Link>
                )}
                
                <Link to={"/cart"}> 
                    <img src={cart_icon} alt="cart" />
                </Link>
                
                {/* adding cart items count */}
                <div className="nav-cart-count">
                    {getTotalCartItems()}
                </div>
            </div>
        </div>
    )
}

export default Navbar