import React, { useContext } from 'react'
import { ShopContext } from '../../Context/EnhancedShopContext'
import './ApiStatus.css'

const ApiStatus = ({ isOnline = true }) => {
  const { retryApiConnection } = useContext(ShopContext)
  
  if (isOnline) return null

  const handleRetry = async () => {
    await retryApiConnection()
  }

  return (
    <div className="api-status-banner">
      <div className="api-status-content">
        <span className="api-status-icon">⚠️</span>
        <span className="api-status-text">
          Currently offline - showing cached products. Some features may be limited.
        </span>
        <button 
          className="api-status-retry"
          onClick={handleRetry}
        >
          Retry
        </button>
      </div>
    </div>
  )
}

export default ApiStatus 