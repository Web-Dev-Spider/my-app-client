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
import Login from './pages/auth/Login'
import Welcome from './pages/Welcome'
import About from './pages/About'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Layout from './layouts/Layout'
import PageNotFound from './pages/PageNotFound'
import KycPage from './pages/KycPage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Profile from './pages/Profile'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import SuperAdminDashboard from './pages/superAdmin/SuperAdminDashboard'
import SuperAdminLogin from './pages/superAdmin/SuperAdminLogin'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import InventoryDashboard from './pages/inventory/InventoryDashboard'
import PlantPurchase from './pages/inventory/PlantPurchase'
import EmptyDispatch from './pages/inventory/EmptyDispatch'
import SupplierManagement from './pages/inventory/SupplierManagement'
import ProductManagement from './pages/inventory/ProductManagement'
import VehicleManagement from './pages/inventory/VehicleManagement'
import GlobalProductMaster from './pages/admin/GlobalProductMaster'
import PendingRegistrations from './pages/super-admin/PendingRegistrations'
import PendingStaff from './pages/admin/PendingStaff'
import OpenDeliveriesPage from './pages/deliveries/OpenDeliveriesPage'
import IssueStockPage from './pages/deliveries/IssueStockPage'
import VehicleStockPage from './pages/vehicles/VehicleStockPage'

import './app.css'
function App() {

  return (

    <ThemeProvider>
      <AuthProvider >
        <Routes>

          {/* Routes WITH Navbar */}
          <Route element={<Layout />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />


            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/inventory/dashboard" element={<InventoryDashboard />} />
              <Route path="/inventory/products" element={<ProductManagement />} />
              <Route path="/inventory/suppliers" element={<SupplierManagement />} />
              <Route path="/inventory/plant-receipt" element={<PlantPurchase />} />
              <Route path="/inventory/empty-dispatch" element={<EmptyDispatch />} />
              <Route path="/inventory/vehicles" element={<VehicleManagement />} />
              <Route path="/deliveries/open" element={<OpenDeliveriesPage />} />
              <Route path="/deliveries/issue" element={<IssueStockPage />} />
              <Route path="/vehicles/stock/:vehicleId" element={<VehicleStockPage />} />

            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER-ADMIN', 'SHOWROOM-STAFF']} />}>
              <Route path="/kyc" element={<KycPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Super Admin Routes (Outside standard layout) */}
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/products" element={<GlobalProductMaster />} />
            <Route path="/super-admin/pending-registrations" element={<PendingRegistrations />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/pending-staff" element={<PendingStaff />} />
          </Route>

          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>


  )
}

export default App
