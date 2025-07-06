import React from 'react' // Import React library
import {Routes,Route} from 'react-router-dom' // Import routing components from react-router-dom
import Home from './pages/Home' // Import Home page component
import Login from './pages/Login' // Import Login page component
import EmailVerify from './pages/EmailVerify' // Import EmailVerify page component
import ResetPassword from './pages/ResetPassword' // Import ResetPassword page component


import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast for notifications

  
const App = () => {
  return (
    <div >
      <ToastContainer/> {/* Container for toast notifications */}
      <Routes>
        <Route path='/' element={<Home />} /> {/* Route for Home page */}
        <Route path='/login' element={<Login />} /> {/* Route for Login page */}
        <Route path='/email-verify' element={<EmailVerify />} /> {/* Route for Email Verification page */}
        <Route path='/reset-password' element={<ResetPassword />} /> {/* Route for Reset Password page */}
      </Routes>
    </div>
  )
}

export default App
