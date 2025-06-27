import React, { useState, useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { ShopContext } from '../Context/EnhancedShopContext'
import Loading from '../Components/Loading/Loading'
import './CSS/UserProfile.css'

const UserProfile = () => {
  const { user, isAuthenticated, loading, makeAPICall } = useContext(ShopContext)
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })
  const [orders, setOrders] = useState([])
  const [profileLoading, setProfileLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      })
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await makeAPICall('/orders')
      if (response.success) {
        setOrders(response.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders()
    }
  }, [activeTab])

  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSaveProfile = async () => {
    setProfileLoading(true)
    setMessage('')
    
    try {
      const response = await makeAPICall('/updateprofile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      })

      if (response.success) {
        setMessage('Profile updated successfully!')
        setIsEditing(false)
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to update profile. Please try again.')
      }
    } catch (error) {
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setProfileLoading(false)
    }
  }

  if (loading) {
    return <Loading message="Loading profile..." />
  }

  const renderProfileTab = () => (
    <div className="profile-tab">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
        </div>
        <div className="profile-info">
          <h2>{user?.name || 'User'}</h2>
          <p>{user?.email}</p>
          <span className="member-since">
            Member since {new Date(user?.date).toLocaleDateString()}
          </span>
        </div>
        <button 
          className={`edit-btn ${isEditing ? 'save-btn' : ''}`}
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          disabled={profileLoading}
        >
          {profileLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="profile-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Address</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Street Address</label>
              <input
                type="text"
                name="address.street"
                value={profileData.address.street}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="123 Main Street"
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="address.city"
                value={profileData.address.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="New York"
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="address.state"
                value={profileData.address.state}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="NY"
              />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="address.zipCode"
                value={profileData.address.zipCode}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="10001"
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="address.country"
                value={profileData.address.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="United States"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button 
              className="cancel-btn"
              onClick={() => {
                setIsEditing(false)
                setMessage('')
                // Reset form data
                if (user) {
                  setProfileData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || {
                      street: '',
                      city: '',
                      state: '',
                      zipCode: '',
                      country: ''
                    }
                  })
                }
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const renderOrdersTab = () => (
    <div className="orders-tab">
      <h3>Order History</h3>
      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h4>No orders yet</h4>
          <p>When you place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-item">
              <div className="order-header">
                <span className="order-id">Order #{order.id}</span>
                <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div className="order-details">
                <span className="order-total">${order.total}</span>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderSettingsTab = () => (
    <div className="settings-tab">
      <h3>Account Settings</h3>
      <div className="settings-sections">
        <div className="settings-section">
          <h4>Notifications</h4>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Email notifications for new offers
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Order status updates
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              Newsletter subscription
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h4>Privacy</h4>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Allow personalized recommendations
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              Share data for analytics
            </label>
          </div>
        </div>

        <div className="settings-section danger-section">
          <h4>Danger Zone</h4>
          <button className="danger-btn">Delete Account</button>
          <p className="danger-text">Once you delete your account, there is no going back.</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 Orders
            </button>
            <button
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>
    </div>
  )
}

export default UserProfile 