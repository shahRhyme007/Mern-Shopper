import React from 'react'
import './ApiStatus.css'

const ApiStatus = ({ isOnline = true }) => {
  if (isOnline) return null

  return (
    <div className="api-status-banner">
      <div className="api-status-content">
        <span className="api-status-icon">⚠️</span>
        <span className="api-status-text">
          Currently offline - showing cached products. Some features may be limited.
        </span>
        <button 
          className="api-status-retry"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  )
}

export default ApiStatus 