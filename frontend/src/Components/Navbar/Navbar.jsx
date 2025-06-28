import React, { useContext, useState } from 'react'
import './Navbar.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, User, LogOut, Package, Heart, Menu, X } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import logo from '../Assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../../Context/EnhancedShopContext'
import { Button } from '../../Components/ui/button'
import { cn } from '../../lib/utils'

const Navbar = () => {
    const [menu, setMenu] = useState('shop')
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const { getTotalCartItems, isAuthenticated, user, logout } = useContext(ShopContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
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

    const navItems = [
        { name: 'Shop', path: '/', key: 'shop' },
        { name: 'Men', path: '/mens', key: 'mens' },
        { name: 'Women', path: '/womens', key: 'womens' },
        { name: 'Kids', path: '/kids', key: 'kids' },
    ]

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <motion.div 
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/" className="flex items-center space-x-2">
                            <img src={logo} alt="logo" className="h-8 w-8" />
                            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                                SHOPPER
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <motion.div key={item.key} className="relative">
                                <Link
                                    to={item.path}
                                    onClick={() => setMenu(item.key)}
                                    className={cn(
                                        "px-3 py-2 text-sm font-medium transition-colors hover:text-red-500",
                                        menu === item.key ? "text-red-500" : "text-gray-700"
                                    )}
                                >
                                    {item.name}
                                </Link>
                                {menu === item.key && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <motion.div 
                        className="hidden md:flex flex-1 max-w-md mx-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm transition-all focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                            />
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Button
                                type="submit"
                                size="sm"
                                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0"
                                variant="ghost"
                            >
                                <Search className="h-3 w-3" />
                            </Button>
                        </form>
                    </motion.div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* User Menu */}
                        {isAuthenticated ? (
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2">
                                        <User className="h-4 w-4" />
                                        <span className="hidden sm:inline">Hi, {user?.name || 'User'}</span>
                                    </Button>
                                </DropdownMenu.Trigger>
                                <AnimatePresence>
                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            className="min-w-[200px] rounded-lg bg-white p-2 shadow-lg border border-gray-200 z-50"
                                            sideOffset={5}
                                            asChild
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <DropdownMenu.Item asChild>
                                                    <Link
                                                        to="/profile"
                                                        className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                                                    >
                                                        <User className="h-4 w-4" />
                                                        <span>My Profile</span>
                                                    </Link>
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item asChild>
                                                    <Link
                                                        to="/orders"
                                                        className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Package className="h-4 w-4" />
                                                        <span>My Orders</span>
                                                    </Link>
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item asChild>
                                                    <Link
                                                        to="/wishlist"
                                                        className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Heart className="h-4 w-4" />
                                                        <span>Wishlist</span>
                                                    </Link>
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
                                                <DropdownMenu.Item asChild>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        <span>Logout</span>
                                                    </button>
                                                </DropdownMenu.Item>
                                            </motion.div>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </AnimatePresence>
                            </DropdownMenu.Root>
                        ) : (
                            <Button asChild variant="outline">
                                <Link to="/login">Login</Link>
                            </Button>
                        )}

                        {/* Cart */}
                        <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button asChild variant="ghost" size="icon">
                                <Link to="/cart">
                                    <ShoppingCart className="h-5 w-5" />
                                </Link>
                            </Button>
                            {getTotalCartItems() > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-medium"
                                >
                                    {getTotalCartItems()}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-gray-200 bg-white"
                        >
                            <div className="space-y-1 px-2 pb-3 pt-2">
                                {/* Mobile Search */}
                                <form onSubmit={handleSearchSubmit} className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                    />
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </form>

                                {/* Mobile Navigation */}
                                {navItems.map((item) => (
                                    <Link
                                        key={item.key}
                                        to={item.path}
                                        onClick={() => {
                                            setMenu(item.key)
                                            setShowMobileMenu(false)
                                        }}
                                        className={cn(
                                            "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                                            menu === item.key 
                                                ? "bg-red-50 text-red-500" 
                                                : "text-gray-700 hover:bg-gray-50 hover:text-red-500"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    )
}

export default Navbar