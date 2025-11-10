import React, { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ShopContext } from '../Context/EnhancedShopContext'
import './CSS/OrderSuccess.css'

const OrderSuccess = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { makeAPICall } = useContext(ShopContext)
    const [orderDetails, setOrderDetails] = useState(null)
    const [loading, setLoading] = useState(true)

    const orderId = location.state?.orderId

    useEffect(() => {
        if (!orderId) {
            navigate('/')
            return
        }

        fetchOrderDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId, navigate])

    const fetchOrderDetails = async () => {
        try {
            const response = await makeAPICall(`/order/${orderId}`)
            if (response.success) {
                setOrderDetails(response.order)
            }
        } catch (error) {
            console.error('Error fetching order details:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="order-success-container">
                <div className="loading">Loading order details...</div>
            </div>
        )
    }

    if (!orderDetails) {
        return (
            <div className="order-success-container">
                <div className="error">
                    <h2>Order not found</h2>
                    <Link to="/" className="home-btn">Return to Home</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="order-success-container">
            <div className="success-content">
                <div className="success-header">
                    <div className="success-icon">✅</div>
                    <h1>Order Confirmed!</h1>
                    <p>Thank you for your purchase. Your order has been successfully placed.</p>
                </div>

                <div className="order-info-card">
                    <div className="order-header">
                        <h2>Order Details</h2>
                        <div className="order-id">Order ID: {orderDetails.orderId}</div>
                    </div>

                    <div className="order-summary">
                        <div className="summary-section">
                            <h3>Order Summary</h3>
                            <div className="order-items">
                                {orderDetails.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <img src={item.productImage} alt={item.productName} />
                                        <div className="item-info">
                                            <h4>{item.productName}</h4>
                                            <p>Quantity: {item.quantity}</p>
                                            <p className="item-price">${item.totalPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="summary-section">
                            <h3>Payment Information</h3>
                            <div className="payment-info">
                                <div className="info-row">
                                    <span>Subtotal:</span>
                                    <span>${orderDetails.orderTotal.toFixed(2)}</span>
                                </div>
                                {orderDetails.discountAmount > 0 && (
                                    <div className="info-row discount">
                                        <span>Discount:</span>
                                        <span>-${orderDetails.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="info-row total">
                                    <span>Total:</span>
                                    <span>${orderDetails.finalAmount.toFixed(2)}</span>
                                </div>
                                <div className="info-row">
                                    <span>Payment Method:</span>
                                    <span className="payment-method">
                                        {orderDetails.paymentMethod === 'stripe' ? 'Credit Card' : 
                                         orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                                         orderDetails.paymentMethod.toUpperCase()}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span>Payment Status:</span>
                                    <span className={`status ${orderDetails.paymentStatus}`}>
                                        {orderDetails.paymentStatus.charAt(0).toUpperCase() + orderDetails.paymentStatus.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="summary-section">
                            <h3>Shipping Address</h3>
                            <div className="address-info">
                                <p>{orderDetails.shippingAddress.street}</p>
                                <p>
                                    {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}
                                </p>
                                <p>{orderDetails.shippingAddress.country}</p>
                            </div>
                        </div>

                        <div className="summary-section">
                            <h3>Order Status</h3>
                            <div className="status-info">
                                <div className="current-status">
                                    <span className={`status-badge ${orderDetails.orderStatus}`}>
                                        {orderDetails.orderStatus.charAt(0).toUpperCase() + orderDetails.orderStatus.slice(1)}
                                    </span>
                                </div>
                                <p>Order Date: {new Date(orderDetails.orderDate).toLocaleDateString()}</p>
                                {orderDetails.expectedDeliveryDate && (
                                    <p>Expected Delivery: {new Date(orderDetails.expectedDeliveryDate).toLocaleDateString()}</p>
                                )}
                                {orderDetails.trackingNumber && (
                                    <p>Tracking Number: <strong>{orderDetails.trackingNumber}</strong></p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="success-actions">
                    <div className="action-buttons">
                        <Link to="/profile" className="view-orders-btn">
                            View All Orders
                        </Link>
                        <Link to="/" className="continue-shopping-btn">
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                <div className="next-steps">
                    <h3>What happens next?</h3>
                    <div className="steps">
                        <div className="step">
                            <div className="step-icon">📧</div>
                            <div className="step-content">
                                <h4>Email Confirmation</h4>
                                <p>You'll receive an email confirmation with your order details.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-icon">📦</div>
                            <div className="step-content">
                                <h4>Order Processing</h4>
                                <p>We'll start processing your order and prepare it for shipment.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-icon">🚚</div>
                            <div className="step-content">
                                <h4>Shipping Updates</h4>
                                <p>You'll receive tracking information once your order ships.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess 