// import React from 'react'
// import { Route, Routes, BrowserRouter } from 'react-router-dom'
// import Home from '../pages/Home'
// import Login from '../pages/Login'
// import Welcome from '../pages/Welcome'
// import About from '../pages/About'
// import Register from '../pages/Register'
// import Dashboard from '../pages/Dashboard'
// import Navbar from '../components/Navbar'

// function App() {
//   return (
//     <BrowserRouter>

//       <Routes>

//         <Route element={<Navbar />} >
//           <Route path='/' element={<Home />} />
//           <Route path='/login' element={<Login />} />
//           <Route path='/home' element={<Welcome />} />
//           <Route path="/about" element={<About />} />
//         </Route>

//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Welcome from './pages/Welcome'
import About from './pages/About'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Layout from './layouts/Layout'
import PageNotFound from './pages/PageNotFound'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
    <AuthProvider >
      <Routes>

        {/* Routes WITH Navbar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Route>

        {/* Routes WITHOUT Navbar */}

      </Routes>
    </AuthProvider>

  )
}

export default App
