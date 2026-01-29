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
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Welcome from './pages/Welcome'
import About from './pages/About'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Layout from './layouts/Layout'

function App() {

  return (

    <Routes>

      {/* Routes WITH Navbar */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Welcome />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Routes WITHOUT Navbar */}

    </Routes>

  )
}

export default App
