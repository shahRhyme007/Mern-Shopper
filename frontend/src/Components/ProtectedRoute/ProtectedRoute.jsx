import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { ShopContext } from '../../Context/EnhancedShopContext'
import Loading from '../Loading/Loading'

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useContext(ShopContext)

  // Show loading while checking authentication
  if (loading) {
    return <Loading message="Checking authentication..." />
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If route requires no authentication (like login page) and user is authenticated
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute 