import React, { useContext, useState } from 'react'; // Import React hooks
import { assets } from '../assets/assets'; // Import assets like icons and images
import { useNavigate } from 'react-router-dom'; // Import navigation hook

import { AppContent } from "../context/AppContext"; // Import app context for auth state
import axios from "axios"; // Import axios for HTTP requests
import { toast } from "react-toastify"; // Import toast for notifications

const Login = () => {
  const navigate = useNavigate(); // Initialize navigation

  const { backendUrl, setIsLoggedin ,getUserData} = useContext(AppContent); // Get backend URL and auth functions from context

  // State to toggle between Sign Up and Login
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState(""); // State for full name input
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input

  // Form submit handler for login or sign up
  const onSubmitHandler = async (e) => {
    try {
    e.preventDefault(); // Prevent default form submission
   
      axios.defaults.withCredentials = true; // Ensure cookies are sent

      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        }) // Call register endpoint
        if (data.success) {
          setIsLoggedin(true); // Set logged in state
         await  getUserData() // Fetch user data
          navigate("/"); // Navigate to home
        } else {
          toast.error(error.message); // Show error toast
        }
      } else {
      
          const { data } = await axios.post(backendUrl + "/api/auth/login", {
            email,
            password,
          }) // Call login endpoint
          if (data.success) {
            setIsLoggedin(true); // Set logged in state
            getUserData() // Fetch user data
            navigate("/"); // Navigate to home
          } else {
            toast.error(data.message); // Show error toast
          }
        }
      }
     catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong"); // Show error toast
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")} // Navigate home on logo click
        src={assets.logo} // Logo image
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt=""
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login "} {/* Title based on state */}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to you account!"} {/* Subtitle based on state */}
        </p>




        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" /> {/* Person icon */}

              <input
                onChange={(e) => setName(e.target.value)} // Update name state
                value={name} // Bind input value
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" /> {/* Mail icon */}
            <input
              onChange={(e) => setEmail(e.target.value)} // Update email state
              value={email} // Bind input value
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email id "
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" /> {/* Lock icon */}
            <input
              onChange={(e) => setPassword(e.target.value)} // Update password state
              value={password} // Bind input value
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")} // Navigate to reset password page
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password?
          </p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
            {state} {/* Button text based on state */}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            {" "}
            Already have an account?{"  "}
            <span
              onClick={() => setState("Login")} // Switch to login state
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            {" "}
            Don't Have an account?{"  "}
            <span
              onClick={() => setState("Sign Up")} // Switch to sign up state
              className="text-blue-400 cursor-pointer underline"
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
