import React from 'react' // Import React library
import Navbar from '../components/Navbar' // Import Navbar component
import Header from '../components/Header' // Import Header component

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
     <Navbar/> {/* Render Navbar at the top */}
     <Header/> {/* Render Header below Navbar */}
    </div>
  )
}

export default Home
