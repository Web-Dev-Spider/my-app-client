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
    const [agency, setAgency] = useState(null)
    const [loading, setLoading] = useState(true)
    const [accessDeniedMessage, setAccessDeniedMessage] = useState("")

    // Check auth on page refresh
    useEffect(() => {

        const hasSession = localStorage.getItem("hasSession")

        if (!hasSession) {
            setLoading(false)
            return
        }
        const checkAuth = async () => {
            try {
                const res = await api.get("/auth/me", {
                    withCredentials: true
                })

                // Must check success BEFORE setting state — axios resolves 401/403 due to validateStatus
                if (res.data.success && res.data.user) {
                    setIsAuthenticated(true)
                    setUser(res.data.user)
                    setAgency(res.data.agency || null)
                } else {
                    // Handle agency deactivation (403 Forbidden)
                    if (res.status === 403) {
                        localStorage.removeItem("hasSession")
                        setAccessDeniedMessage(res.data.message || "Access is denied, contact the administrator")
                    }
                    setIsAuthenticated(false)
                    setUser(null)
                    setAgency(null)
                }
            } catch (err) {
                // Only network errors or 500+ will land here (due to validateStatus)
                console.error(err)
                setIsAuthenticated(false)
                setUser(null)
                setAgency(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    // Login function
    const login = async (identifier, password) => {
        // console.log("identifier", identifier)
        // console.log("password", password)
        setAccessDeniedMessage("") // Clear any previous denial message
        try {
            const res = await api.post("/auth/login", { identifier, password }, {
                withCredentials: true
            })

            if (res.status === 200) {
                // console.log("res.data in login AuthContext", res.data)
                localStorage.setItem("hasSession", "true")
                setIsAuthenticated(true)
                setUser(res.data.user)
                setAgency(res.data.agency)
            }


            return res.data

        } catch (error) {

            // console.log(error.response.data.message)
            return { success: false, message: error.response?.data?.message || "Unable to login. Please try again." }
        }
    }

    // Logout function
    const logout = async () => {
        await api.get("/auth/logout", { withCredentials: true })
        localStorage.removeItem("hasSession")
        // Clean up stale keys from old code
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        setIsAuthenticated(false)
        setUser(null)
        setAgency(null)
        setAccessDeniedMessage("")
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, role: user?.role, login, logout, loading, agency, setIsAuthenticated, setUser, setAgency, accessDeniedMessage, setAccessDeniedMessage }}>
            {children}
        </AuthContext.Provider>
    )
}

// export const useAuth = () => useContext(AuthContext)
export function useAuth() {
    return useContext(AuthContext)
}




