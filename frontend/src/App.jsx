import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' // 1. Import Toaster
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard/Dashboard'

const App = () => {
  return (
    <Router>
      {/* 2. Add the Toaster component */}
      <Toaster 
        position="top-right"
        toastOptions={{
          // Define default styling that matches your NexusQR theme
          style: {
            background: '#1e293b', // slate-800
            color: '#fff',
            border: '1px solid #334155', // slate-700
          },
          success: {
            iconTheme: {
              primary: '#10b981', // emerald-500
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>

        {/* Protected Routes (after login) */}
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </Router>
  )
}

export default App