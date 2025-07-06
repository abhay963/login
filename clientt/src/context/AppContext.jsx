import { createContext, useEffect, useState } from "react"; // Import React hooks for state and lifecycle management
import { toast } from "react-toastify"; // Import toast for notifications
import axios from 'axios'; // Import axios for HTTP requests
axios.defaults.withCredentials = true; // Enable sending cookies with requests


export const AppContent = createContext(); // Create a context for app-wide state

export const AppContextProvider = (props) => {

  axios.defaults.withCredentials=true; // Ensure axios sends cookies
  const backendUrl = import.meta.env.VITE_BACKEND_URL // Get backend URL from environment variables
  const [isLoggedin, setIsLoggedin] = useState(false); // State to track if user is logged in
  const [userData, setUserData] = useState(null); // State to hold user data

// Function to check authentication state from backend
const getAuthState=async()=>{
  try {
    const {data}=await axios.get(backendUrl+'/api/auth/is-auth') // Call auth check endpoint
    if(data.success){
      setIsLoggedin(true) // Set logged in state
      getUserData() // Fetch user data if authenticated
    }


  } catch (error) {
    toast.error(error.message); // Show error notification
  }
}

// Run getAuthState once on component mount
useEffect(()=>{
  getAuthState()
},[])

// Function to fetch user data from backend
  const getUserData=async()=>{
    try {
      const {data}=await axios.get(backendUrl+'/api/user/data') // Call user data endpoint
      data.success?setUserData(data.userData):toast.error(data.message) // Set user data or show error
    } catch (error) {
      toast.error(error.message) // Show error notification
    }
  }

  // Context value to provide to children components
  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData
  };
  

  return (
    <AppContent.Provider value={value}>
      {props.children} {/* Render child components */}
    </AppContent.Provider>
  );
};
