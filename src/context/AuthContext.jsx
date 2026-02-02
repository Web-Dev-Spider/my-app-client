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
                console.log("res.data in checkAuth AuthContext", res.data)
                setIsAuthenticated(true)
                setUser(res.data.user)
                setAgency(res.data.agency)
            } catch (err) {
                // console.log("Error catched at ", err)

                if (err.response?.status !== 401) {
                    console.error(err)
                }
                setIsAuthenticated(false)
                setUser(null)
                return null
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    // Login function
    const login = async (identifier, password) => {
        try {
            const res = await api.post("/auth/login", { identifier, password }, {
                withCredentials: true
            })

            if (res.status === 200) {
                console.log("res.data in login AuthContext", res.data)
                localStorage.setItem("hasSession", "true")
                setIsAuthenticated(true)
                setUser(res.data.user)
                setAgency(res.data.agency)
            }


            return res.data

        } catch (error) {

            // console.log(error.response.data.message)
            return { success: false, message: error.response.data.message }
        }
    }

    // Logout function
    const logout = async () => {
        await api.get("/auth/logout", { withCredentials: true })
        localStorage.removeItem("hasSession")
        setIsAuthenticated(false)
        setUser(null)
        setAgency(null)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, agency }}>
            {children}
        </AuthContext.Provider>
    )
}

// export const useAuth = () => useContext(AuthContext)
export function useAuth() {
    return useContext(AuthContext)
}




