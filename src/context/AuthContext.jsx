import React, { useContext, createContext, useState, useEffect } from "react"

import api from "../axios/axiosInstance"

const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    login: () => { },
    logout: () => { },
    loading: true
})

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check auth on page refresh
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("/auth/me", {
                    withCredentials: true
                })

                setIsAuthenticated(true)
                setUser(res.data.user)
            } catch (err) {
                console.log(err)
                setIsAuthenticated(false)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    // Login function
    const login = async (identifier, password) => {
        const res = await api.post("/auth/login", { identifier, password }, {
            withCredentials: true
        })

        setIsAuthenticated(true)
        setUser(res.data.user)
    }

    // Logout function
    const logout = async () => {
        await api.get("/auth/logout", {}, { withCredentials: true })

        setIsAuthenticated(false)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
