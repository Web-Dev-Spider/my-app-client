import React from 'react'
import { useContext, createContext, useState } from 'react'


const AuthContext = createContext({
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    role: null,
    loading: false
})


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'))
    const [role, setRole] = useState(() => localStorage.getItem('role'))
    const [loading, setLoading] = useState(false)

    const login = (token, role) => {
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        setIsAuthenticated(true)
        setRole(role)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        setIsAuthenticated(false)
        setRole(null)
        setLoading(false)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, role, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
