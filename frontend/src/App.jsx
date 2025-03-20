import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/Login'
import Register from './pages/Register'
import DriverRegister from './pages/DriverRegister '
import DriverLogin from './pages/DriverLogin'
import DriverDashboard from './pages/DriverDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import ServicesPage from './pages/ServicesPage'
import PostJobPage from './pages/PostJobPage'
import PaymentPage from './pages/PaymentPage'
import AdminPanel from './pages/AdminPanel'

const App = () => {
  return (
    <Routes>
      <Route path='/home' element={<Home/>}/>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/driverRegister' element={<DriverRegister/>}/>
      <Route path='/driverlogin' element={<DriverLogin/>}/>
      <Route path='/driver-dashboard' element={<DriverDashboard/>}/>
      <Route path='/customer-dashboard' element={<CustomerDashboard/>}/>
      <Route path='/services' element={<ServicesPage/>}/>
      <Route path='/postjob' element={<PostJobPage/>}/>
      <Route path='/payment' element={<PaymentPage/>}/>
      <Route path='/admin-panel' element={<AdminPanel/>}/>
    </Routes>
  )
}

export default App