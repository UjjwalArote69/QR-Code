import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard/Dashboard'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>

        //Protected Routes (after login)
           <Route path='/dashboard' element={<Dashboard/>}/>
          {/*<Route path='/qr-codes' element={<QrCodes/>}/>
          <Route path='/analytics' element={<Analytics/>}/>
          <Route path='/settings' element={<Settings/>}/> */}
      </Routes>
    </Router>
  )
}

export default App