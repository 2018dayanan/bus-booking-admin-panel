import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner } from '@coreui/react'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)
  const location = useLocation()

  const token = localStorage.getItem('authToken')
  console.log('ProtectedRoute: isAuthenticated', isAuthenticated)
  console.log('ProtectedRoute: token in localStorage', token)

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    )
  }

  // Fallback: If no token in localStorage, treat as not authenticated
  if (!isAuthenticated || !token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Render children if authenticated
  return children
}

export default ProtectedRoute 