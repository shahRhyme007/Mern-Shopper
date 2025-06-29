import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ShoppingCart,
  ArrowRight,
  Package,
  Truck,
  CreditCard
} from 'lucide-react'
import { ShopContext } from '../../Context/EnhancedShopContext'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart, addToCart } = useContext(ShopContext)
    const [promoCode, setPromoCode] = useState('')
    const [isPromoApplied, setIsPromoApplied] = useState(false)

    // Get cart items with details (handle both old format and new format with sizes)
    const cartProducts = Object.keys(cartItems)
        .filter(cartKey => cartItems[cartKey] > 0)
        .map(cartKey => {
            // Extract product ID and size from cart key
            const productId = cartKey.includes('_') ? parseInt(cartKey.split('_')[0]) : parseInt(cartKey);
            const size = cartKey.includes('_') ? cartKey.split('_')[1] : null;
            
            const product = all_product.find(p => p.id === productId);
            if (!product) return null;
            
            return {
                ...product,
                cartKey,
                selectedSize: size,
                quantity: cartItems[cartKey]
            };
        })
        .filter(item => item !== null);
    
    const isEmpty = cartProducts.length === 0

    const handleQuantityChange = (cartKey, change) => {
        if (change > 0) {
            // Extract product ID and size from cart key
            const productId = cartKey.includes('_') ? parseInt(cartKey.split('_')[0]) : parseInt(cartKey);
            const size = cartKey.includes('_') ? cartKey.split('_')[1] : null;
            addToCart(productId, size)
        } else if (change < 0 && cartItems[cartKey] > 1) {
            removeFromCart(cartKey)
        }
    }

    const handlePromoSubmit = () => {
        if (promoCode.trim()) {
            setIsPromoApplied(true)
            // Add promo code logic here
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.4 }
        },
        exit: { 
            opacity: 0, 
            x: 20,
            transition: { duration: 0.3 }
        }
    }

    if (isEmpty) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
            >
                <Card className="w-full max-w-md text-center">
                    <CardContent className="p-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto mb-6 w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center"
                        >
                            <ShoppingCart className="w-12 h-12 text-gray-400" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Link to="/">
                            <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Continue Shopping
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-gray-50 py-8"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <ShoppingCart className="w-8 h-8 text-red-500" />
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {cartProducts.length} item{cartProducts.length !== 1 ? 's' : ''} in your cart
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Cart Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <AnimatePresence>
                                    {cartProducts.map((product, index) => (
                                        <motion.div
                                            key={product.cartKey}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            layout
                                            className={`p-6 ${index !== cartProducts.length - 1 ? 'border-b border-gray-200' : ''}`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                {/* Product Image - Clickable */}
                                                <Link to={`/product/${product.id}`} onClick={() => window.scrollTo(0,0)}>
                                                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:shadow-lg transition-shadow">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </Link>

                                                {/* Product Details - Clickable */}
                                                <div className="flex-1 min-w-0">
                                                    <Link to={`/product/${product.id}`} onClick={() => window.scrollTo(0,0)}>
                                                        <h3 className="text-lg font-medium text-gray-900 truncate hover:text-red-500 transition-colors cursor-pointer">
                                                            {product.name}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Price: ${product.new_price}
                                                    </p>
                                                    {product.selectedSize && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Size: <span className="font-medium bg-gray-100 px-2 py-1 rounded text-xs">{product.selectedSize}</span>
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <button
                                                            onClick={() => handleQuantityChange(product.cartKey, -1)}
                                                            className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                                            disabled={product.quantity <= 1}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                                                            {product.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleQuantityChange(product.cartKey, 1)}
                                                            className="p-2 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Total Price */}
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        ${(product.new_price * product.quantity).toFixed(2)}
                                                    </p>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeFromCart(product.cartKey)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        {/* Promo Code */}
                        <motion.div variants={itemVariants}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Tag className="w-5 h-5 text-red-500" />
                                        Promo Code
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Have a promo code? Enter it here to get a discount.
                                    </p>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            placeholder="Enter promo code"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                        />
                                        <Button
                                            onClick={handlePromoSubmit}
                                            variant="outline"
                                            className="px-4"
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                    {isPromoApplied && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                                        >
                                            <p className="text-sm text-green-700">
                                                ✅ Promo code applied successfully!
                                            </p>
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div variants={itemVariants}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-red-500" />
                                        Order Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">${getTotalCartAmount().toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <Truck className="w-4 h-4" />
                                            Shipping
                                        </span>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>

                                    {isPromoApplied && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Promo Discount</span>
                                            <span>-$10.00</span>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-xl font-bold text-gray-900">
                                                ${(getTotalCartAmount() - (isPromoApplied ? 10 : 0)).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <Link to="/checkout" className="block">
                                        <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]">
                                            <CreditCard className="w-5 h-5 mr-2" />
                                            Proceed to Checkout
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </Link>

                                    <div className="text-center">
                                        <Link 
                                            to="/" 
                                            className="text-sm text-gray-600 hover:text-red-500 transition-colors inline-flex items-center gap-1"
                                        >
                                            <ArrowRight className="w-4 h-4 rotate-180" />
                                            Continue Shopping
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Security Features */}
                        <motion.div variants={itemVariants}>
                            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">Secure Checkout</p>
                                            <p className="text-xs text-gray-600">Your payment information is protected</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default CartItems