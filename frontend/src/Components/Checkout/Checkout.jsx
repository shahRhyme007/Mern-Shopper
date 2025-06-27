import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../../Context/EnhancedShopContext'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import './Checkout.css'

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51...')

const CheckoutForm = ({ orderData, onPaymentSuccess }) => {
    const stripe = useStripe()
    const elements = useElements()
    const { makeAPICall } = useContext(ShopContext)
    const [processing, setProcessing] = useState(false)
    const [paymentError, setPaymentError] = useState(null)

    const handleSubmit = async (event) => {
        event.preventDefault()
        
        if (!stripe || !elements) return
        
        setProcessing(true)
        setPaymentError(null)

        try {
            // Create payment intent
            const { clientSecret } = await makeAPICall('/create-payment-intent', {
                method: 'POST',
                body: JSON.stringify({
                    orderId: orderData.orderId,
                    amount: orderData.finalAmount
                })
            })

            // Confirm payment
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: orderData.billingAddress.name,
                        address: {
                            line1: orderData.billingAddress.street,
                            city: orderData.billingAddress.city,
                            state: orderData.billingAddress.state,
                            postal_code: orderData.billingAddress.zipCode,
                            country: orderData.billingAddress.country
                        }
                    }
                }
            })

            if (error) {
                setPaymentError(error.message)
            } else if (paymentIntent.status === 'succeeded') {
                onPaymentSuccess(paymentIntent)
            }
        } catch (error) {
            setPaymentError(error.message)
        } finally {
            setProcessing(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="checkout-payment-form">
            <div className="card-element-container">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                        },
                    }}
                />
            </div>
            
            {paymentError && (
                <div className="payment-error">
                    {paymentError}
                </div>
            )}

            <button 
                type="submit" 
                disabled={!stripe || processing}
                className="payment-submit-btn"
            >
                {processing ? 'Processing...' : `Pay $${orderData.finalAmount.toFixed(2)}`}
            </button>
        </form>
    )
}

const Checkout = () => {
    const { 
        cartItems, 
        all_product, 
        getTotalCartAmount, 
        isAuthenticated, 
        user,
        makeAPICall,
        clearCart 
    } = useContext(ShopContext)
    
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [orderData, setOrderData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    // Form states
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
    })
    
    const [billingAddress, setBillingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
    })
    
    const [paymentMethod, setPaymentMethod] = useState('stripe')
    const [promoCode, setPromoCode] = useState('')
    const [promoDiscount, setPromoDiscount] = useState(null)
    const [useBillingForShipping, setUseBillingForShipping] = useState(true)

    // Calculate order summary
    const cartTotal = getTotalCartAmount()
    const shippingCost = cartTotal > 100 ? 0 : 15 // Free shipping over $100
    const tax = cartTotal * 0.08 // 8% tax
    const discountAmount = promoDiscount?.discountAmount || 0
    const finalTotal = cartTotal + shippingCost + tax - discountAmount

    // Get cart items for display
    const cartItemsForDisplay = all_product.filter(product => 
        cartItems[product.id] && cartItems[product.id] > 0
    ).map(product => ({
        ...product,
        quantity: cartItems[product.id],
        totalPrice: product.new_price * cartItems[product.id]
    }))

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }
        
        if (cartItemsForDisplay.length === 0) {
            navigate('/cart')
            return
        }
        
        // Pre-fill addresses if user has profile data
        if (user?.address) {
            setShippingAddress(user.address)
            setBillingAddress(user.address)
        }
    }, [isAuthenticated, user, cartItemsForDisplay.length, navigate])

    const validateAddress = (address) => {
        return address.street && address.city && address.state && address.zipCode
    }

    const handlePromoCodeApply = async () => {
        if (!promoCode.trim()) return
        
        try {
            setLoading(true)
            const response = await makeAPICall('/promo/validate', {
                method: 'POST',
                body: JSON.stringify({
                    code: promoCode,
                    orderTotal: cartTotal
                })
            })
            
            if (response.success) {
                setPromoDiscount(response.promo)
                setError('')
            }
        } catch (error) {
            setError(error.message)
            setPromoDiscount(null)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateOrder = async () => {
        if (!validateAddress(shippingAddress)) {
            setError('Please fill in all shipping address fields')
            return
        }
        
        if (!useBillingForShipping && !validateAddress(billingAddress)) {
            setError('Please fill in all billing address fields')
            return
        }

        setLoading(true)
        setError('')

        try {
            const orderItems = cartItemsForDisplay.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }))

            const response = await makeAPICall('/createorder', {
                method: 'POST',
                body: JSON.stringify({
                    items: orderItems,
                    shippingAddress: shippingAddress,
                    billingAddress: useBillingForShipping ? shippingAddress : billingAddress,
                    paymentMethod: paymentMethod,
                    promoCode: promoCode || undefined
                })
            })

            if (response.success) {
                setOrderData(response.order)
                if (paymentMethod === 'cod') {
                    // For COD, order is complete
                    handleOrderSuccess()
                } else {
                    // Move to payment step
                    setCurrentStep(3)
                }
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleOrderSuccess = async () => {
        await clearCart()
        navigate('/order-success', { 
            state: { orderId: orderData?.orderId } 
        })
    }

    const handlePaymentSuccess = () => {
        handleOrderSuccess()
    }

    const renderStepIndicator = () => (
        <div className="checkout-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                <span>1</span>
                <label>Shipping</label>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                <span>2</span>
                <label>Review</label>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <span>3</span>
                <label>Payment</label>
            </div>
        </div>
    )

    const renderShippingStep = () => (
        <div className="checkout-step">
            <h3>Shipping Information</h3>
            
            <div className="address-form">
                <h4>Shipping Address</h4>
                <div className="form-row">
                    <input
                        type="text"
                        placeholder="Street Address"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                        required
                    />
                </div>
                <div className="form-row">
                    <input
                        type="text"
                        placeholder="City"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        required
                    />
                    <input
                        type="text"
                        placeholder="State"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        required
                    />
                    <input
                        type="text"
                        placeholder="ZIP Code"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                        required
                    />
                </div>

                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={useBillingForShipping}
                            onChange={(e) => setUseBillingForShipping(e.target.checked)}
                        />
                        Billing address is the same as shipping address
                    </label>
                </div>

                {!useBillingForShipping && (
                    <>
                        <h4>Billing Address</h4>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Street Address"
                                value={billingAddress.street}
                                onChange={(e) => setBillingAddress({...billingAddress, street: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="City"
                                value={billingAddress.city}
                                onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="State"
                                value={billingAddress.state}
                                onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="ZIP Code"
                                value={billingAddress.zipCode}
                                onChange={(e) => setBillingAddress({...billingAddress, zipCode: e.target.value})}
                                required
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="payment-method-selection">
                <h4>Payment Method</h4>
                <div className="payment-options">
                    <label>
                        <input
                            type="radio"
                            value="stripe"
                            checked={paymentMethod === 'stripe'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Credit/Debit Card
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Cash on Delivery
                    </label>
                </div>
            </div>

            <button 
                className="continue-btn"
                onClick={() => setCurrentStep(2)}
            >
                Continue to Review
            </button>
        </div>
    )

    const renderReviewStep = () => (
        <div className="checkout-step">
            <h3>Order Review</h3>
            
            <div className="order-summary">
                <div className="order-items">
                    <h4>Items ({cartItemsForDisplay.length})</h4>
                    {cartItemsForDisplay.map((item) => (
                        <div key={item.id} className="order-item">
                            <img src={item.image} alt={item.name} />
                            <div className="item-details">
                                <h5>{item.name}</h5>
                                <p>Quantity: {item.quantity}</p>
                                <p>${item.new_price} × {item.quantity} = ${item.totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="promo-section">
                    <h4>Promo Code</h4>
                    <div className="promo-input">
                        <input
                            type="text"
                            placeholder="Enter promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button 
                            type="button"
                            onClick={handlePromoCodeApply}
                            disabled={loading}
                        >
                            Apply
                        </button>
                    </div>
                    {promoDiscount && (
                        <div className="promo-applied">
                            ✅ {promoDiscount.description} - Save ${promoDiscount.discountAmount.toFixed(2)}
                        </div>
                    )}
                </div>

                <div className="price-breakdown">
                    <div className="price-row">
                        <span>Subtotal:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="price-row">
                        <span>Shipping:</span>
                        <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="price-row">
                        <span>Tax:</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                        <div className="price-row discount">
                            <span>Discount:</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="price-row total">
                        <span>Total:</span>
                        <span>${finalTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="checkout-actions">
                <button 
                    className="back-btn"
                    onClick={() => setCurrentStep(1)}
                >
                    Back to Shipping
                </button>
                <button 
                    className="place-order-btn"
                    onClick={handleCreateOrder}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
            </div>
        </div>
    )

    const renderPaymentStep = () => (
        <div className="checkout-step">
            <h3>Payment</h3>
            
            <div className="payment-summary">
                <h4>Order #{orderData?.orderId}</h4>
                <p>Total: ${orderData?.finalAmount.toFixed(2)}</p>
            </div>

            <Elements stripe={stripePromise}>
                <CheckoutForm 
                    orderData={orderData} 
                    onPaymentSuccess={handlePaymentSuccess}
                />
            </Elements>
        </div>
    )

    if (!isAuthenticated || cartItemsForDisplay.length === 0) {
        return null // Will redirect in useEffect
    }

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <h2>Checkout</h2>
                {renderStepIndicator()}
            </div>

            <div className="checkout-content">
                <div className="checkout-main">
                    {currentStep === 1 && renderShippingStep()}
                    {currentStep === 2 && renderReviewStep()}
                    {currentStep === 3 && renderPaymentStep()}
                </div>

                <div className="checkout-sidebar">
                    <div className="order-summary-card">
                        <h4>Order Summary</h4>
                        <div className="summary-items">
                            {cartItemsForDisplay.slice(0, 3).map((item) => (
                                <div key={item.id} className="summary-item">
                                    <img src={item.image} alt={item.name} />
                                    <div>
                                        <p>{item.name}</p>
                                        <p>Qty: {item.quantity}</p>
                                    </div>
                                    <span>${item.totalPrice.toFixed(2)}</span>
                                </div>
                            ))}
                            {cartItemsForDisplay.length > 3 && (
                                <p>+{cartItemsForDisplay.length - 3} more items</p>
                            )}
                        </div>
                        <div className="summary-total">
                            <strong>Total: ${finalTotal.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout 