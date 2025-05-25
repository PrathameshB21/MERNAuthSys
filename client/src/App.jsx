import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
   <>
   <ToastContainer/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/verifyEmail' element={<VerifyEmail/>}/>
      <Route path='/resetPassword' element={<ResetPassword/>}/>
      

    </Routes>
   </>
  )
}

export default App