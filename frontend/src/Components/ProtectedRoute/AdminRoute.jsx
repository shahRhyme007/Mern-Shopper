import React, { useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { ShopContext } from '../../Context/EnhancedShopContext'
import Loading from '../Loading/Loading'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(ShopContext)

  // Show loading while checking authentication
  if (loading) {
    return <Loading message="Verifying admin access..." />
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If user is authenticated but not admin, redirect to home
  if (isAuthenticated && !isAdmin()) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
