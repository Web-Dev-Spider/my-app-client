import React from 'react'
import { createContext } from 'react'
import Login from '../pages/Login'

const AuthenticationContext = createContext({
    isAuthenticated: false,
    Login: () => { },
    logout: () => { },
    role: null,
    loading: false,
})


export default AuthenticationContext
