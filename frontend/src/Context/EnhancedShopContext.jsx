import React, { createContext, useState, useEffect, useCallback } from "react";
import all_product_static from "../Components/Assets/all_product";

// Enhanced Shop Context with backend integration
export const ShopContext = createContext(null)

// API base URL
const API_URL = 'http://localhost:4000';

const ShopContextProvider = (props) => {
    // Product state
    const [all_product, setAllProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApiOnline, setIsApiOnline] = useState(true);
    
    // Cart state
    const [cartItems, setCartItems] = useState({});
    const [cartLoading, setCartLoading] = useState(false);
    
    // User state
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Wishlist state
    const [wishlist, setWishlist] = useState([]);

    // Get auth token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('auth-token');
    };

    // Set auth token in localStorage
    const setAuthToken = (token) => {
        if (token) {
            localStorage.setItem('auth-token', token);
        } else {
            localStorage.removeItem('auth-token');
        }
    };

    // API call helper with error handling
    const makeAPICall = useCallback(async (url, options = {}) => {
        try {
            const token = getAuthToken();
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
            
            if (token) {
                headers['auth-token'] = token;
            }

            const response = await fetch(`${API_URL}${url}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errors || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }, []);

    // Load all products from API with enhanced features
    const fetchAllProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try enhanced API first
            let data = await makeAPICall('/allproducts');
            
            if (data && Array.isArray(data) && data.length > 0) {
                setAllProduct(data);
                setIsApiOnline(true);
                console.log(`✅ API Online: Loaded ${data.length} products`);
                console.log('🔍 Sample product:', data[data.length - 1]); // Log the last product
                return;
            }
            
            // Fallback to original API
            const response = await fetch('http://localhost:4000/allproducts');
            if (response.ok) {
                const originalData = await response.json();
                if (Array.isArray(originalData) && originalData.length > 0) {
                    setAllProduct(originalData);
                    setIsApiOnline(true);
                    console.log(`✅ API Online: Loaded ${originalData.length} products via fallback`);
                    return;
                }
            }
            
            // Final fallback to static data
            console.log('⚠️ API Offline: Using static data as fallback');
            setAllProduct(all_product_static);
            setIsApiOnline(false);
            
        } catch (error) {
            console.error('Error in fetchAllProducts:', error);
            setError(error.message);
            
            // Fallback to static data on error
            console.log('⚠️ API Error: Using static data as fallback');
            setAllProduct(all_product_static);
            setIsApiOnline(false);
        } finally {
            setLoading(false);
        }
    }, [makeAPICall]);

    // Load user cart from backend
    const fetchUserCart = useCallback(async () => {
        if (!isAuthenticated) return;
        
        try {
            setCartLoading(true);
            const data = await makeAPICall('/getcart');
            setCartItems(data || {});
        } catch (error) {
            console.error('Error fetching cart:', error);
            // Keep local cart if API fails
        } finally {
            setCartLoading(false);
        }
    }, [isAuthenticated, makeAPICall]);

    // Load user wishlist from backend
    const fetchUserWishlist = useCallback(async () => {
        if (!isAuthenticated) return;
        
        try {
            const data = await makeAPICall('/getwishlist');
            if (data.success) {
                setWishlist(data.wishlist || []);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    }, [isAuthenticated, makeAPICall]);

    // User logout function (moved up to resolve dependencies)
    const logout = useCallback(() => {
        setAuthToken(null);
        setIsAuthenticated(false);
        setUser(null);
        setCartItems({});
        setWishlist([]);
    }, []);

    // Load user profile
    const fetchUserProfile = useCallback(async () => {
        if (!getAuthToken()) return;
        
        try {
            const data = await makeAPICall('/profile');
            if (data.success) {
                setUser(data.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Token might be invalid, clear it
            logout();
        }
    }, [makeAPICall, logout]);

    // User authentication functions
    const login = async (email, password) => {
        try {
            const data = await makeAPICall('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (data.success) {
                setAuthToken(data.token);
                setIsAuthenticated(true);
                await fetchUserProfile();
                await fetchUserCart();
                await fetchUserWishlist();
                return { success: true };
            } else {
                return { success: false, error: data.errors };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const signup = async (username, email, password) => {
        try {
            const data = await makeAPICall('/signup', {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });

            if (data.success) {
                setAuthToken(data.token);
                setIsAuthenticated(true);
                await fetchUserProfile();
                await fetchUserCart();
                await fetchUserWishlist();
                return { success: true };
            } else {
                return { success: false, error: data.errors };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Cart functions with backend sync
    const addToCart = async (itemId) => {
        if (isAuthenticated) {
            try {
                setCartLoading(true);
                const data = await makeAPICall('/addtocart', {
                    method: 'POST',
                    body: JSON.stringify({ itemId })
                });
                
                if (data.success) {
                    setCartItems(data.cartData);
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                // Fallback to local cart update
                setCartItems((prev) => ({
                    ...prev, 
                    [itemId]: (prev[itemId] || 0) + 1
                }));
            } finally {
                setCartLoading(false);
            }
        } else {
            // Local cart for non-authenticated users
            setCartItems((prev) => ({
                ...prev, 
                [itemId]: (prev[itemId] || 0) + 1
            }));
        }
    };
    
    const removeFromCart = async (itemId) => {
        if (isAuthenticated) {
            try {
                setCartLoading(true);
                const data = await makeAPICall('/removefromcart', {
                    method: 'POST',
                    body: JSON.stringify({ itemId })
                });
                
                if (data.success) {
                    setCartItems(data.cartData);
                }
            } catch (error) {
                console.error('Error removing from cart:', error);
                // Fallback to local cart update
                setCartItems((prev) => ({
                    ...prev, 
                    [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
                }));
            } finally {
                setCartLoading(false);
            }
        } else {
            // Local cart for non-authenticated users
            setCartItems((prev) => ({
                ...prev, 
                [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
            }));
        }
    };

    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                setCartLoading(true);
                const data = await makeAPICall('/clearcart', {
                    method: 'POST'
                });
                
                if (data.success) {
                    setCartItems(data.cartData);
                }
            } catch (error) {
                console.error('Error clearing cart:', error);
                setCartItems({});
            } finally {
                setCartLoading(false);
            }
        } else {
            setCartItems({});
        }
    };

    // Cart calculation functions (enhanced to work with dynamic data)
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount = totalAmount + (itemInfo.new_price * cartItems[item]);
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    // Wishlist functions
    const addToWishlist = async (itemId) => {
        if (!isAuthenticated) {
            alert('Please login to add items to wishlist');
            return;
        }

        try {
            // Check if item is already in wishlist
            if (isInWishlist(itemId)) {
                // Remove from wishlist
                await removeFromWishlist(itemId);
            } else {
                // Add to wishlist
                const data = await makeAPICall('/addtowishlist', {
                    method: 'POST',
                    body: JSON.stringify({ itemId })
                });
                
                if (data.success) {
                    await fetchUserWishlist();
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const removeFromWishlist = async (itemId) => {
        if (!isAuthenticated) {
            alert('Please login to manage your wishlist');
            return;
        }

        try {
            const data = await makeAPICall('/removefromwishlist', {
                method: 'POST',
                body: JSON.stringify({ itemId })
            });
            
            if (data.success) {
                await fetchUserWishlist();
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const isInWishlist = (itemId) => {
        return wishlist.some(item => item.id === itemId);
    };

    // Search and filter functions
    const searchProducts = async (query, filters = {}) => {
        try {
            const params = new URLSearchParams({
                q: query,
                ...filters
            });
            
            const data = await makeAPICall(`/search?${params}`);
            return data;
        } catch (error) {
            console.error('Error searching products:', error);
            // Fallback to local search
            const filteredProducts = all_product.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            return { success: true, products: filteredProducts };
        }
    };

    const getProductsByCategory = (category) => {
        return all_product.filter(product => product.category === category);
    };

    const getProductById = (id) => {
        return all_product.find(product => product.id === Number(id));
    };

    // Initialize data on component mount
    useEffect(() => {
        fetchAllProducts();
        
        // Check if user is already logged in
        if (getAuthToken()) {
            fetchUserProfile();
        }
    }, [fetchAllProducts, fetchUserProfile]);

    // Fetch user data when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchUserCart();
            fetchUserWishlist();
        }
    }, [isAuthenticated, fetchUserCart, fetchUserWishlist]);

    // context value will be used to share data across the component tree
    const contextValue = {
        // Product data
        all_product,
        loading,
        error,
        isApiOnline,
        
        // Cart functionality (backward compatible)
        cartItems,
        cartLoading,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartAmount,
        getTotalCartItems,
        
        // User functionality
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        
        // Wishlist functionality
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        
        // Search and utility functions
        searchProducts,
        getProductsByCategory,
        getProductById,
        
        // API helper
        makeAPICall,
        
        // Refresh functions
        fetchAllProducts,
        fetchUserCart,
        fetchUserWishlist
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider; 