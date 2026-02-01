import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ allowedRoles }) => {

    const { isAuthenticated, role, loading } = useAuth()
    if (loading) {
        return null
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />

}

export default ProtectedRoute
