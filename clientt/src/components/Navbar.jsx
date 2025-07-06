import React, { useContext } from "react"; // Import React and useContext hook
import { assets } from "../assets/assets"; // Import assets like images and icons
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation
import { AppContent } from "../context/AppContext"; // Import app context for user data and auth state
import {toast}from "react-toastify"; // Import toast for notifications
import axios from 'axios'; // Import axios for HTTP requests

const Navbar = () => {
  const navigate = useNavigate(); // Initialize navigate function


  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent); // Get user data and auth functions from context

    // Function to send verification OTP email
    const sendVerificationOtp=async()=>{
      try {
        axios.defaults.withCredentials=true; // Ensure cookies are sent
        const {data}=await axios.post(backendUrl+'/api/auth/send-verify-otp') // Call backend to send OTP
        if(data.success){
          navigate('/email-verify') // Navigate to email verification page
          toast.success(data.message) // Show success notification
        }
        else{
          toast.error(data.message) // Show error notification
        }
      } catch (error) {
        toast.error(error.message) // Show error notification
      }
    }

    // Function to log out user
const logout=async()=>{
  try {
    axios.defaults.withCredentials=true // Ensure cookies are sent
    const {data}=await axios.post(backendUrl+'/api/auth/logout') // Call backend logout endpoint
    data.success&& setIsLoggedin(false) // Update auth state
    data.success&& setUserData(false) // Clear user data
    navigate('/') // Navigate to home page
  } catch (error) {
    toast.error(error.message) // Show error notification
    
  }
}

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">


      <img src={assets.logo} alt="" className="w-28 sm:w-32" /> {/* Logo image */}
      {userData ? 
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group ">
          {userData?.name?.[0]?.toUpperCase() || "U"} {/* Show first letter of user name or U */}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">

              {!userData?.isAccountVerified&& <li onClick={sendVerificationOtp}  className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                Verify email {/* Option to send verification OTP if not verified */}
              </li>}
              
              <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10 ">
                Logout {/* Logout option */}
              </li>
            </ul>
          </div>
        </div>
      : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer"
        >
          Login <img src={assets.arrow_icon} alt="" /> {/* Login button with arrow icon */}
        </button>
      )}
    </div>
  );
};

export default Navbar;
