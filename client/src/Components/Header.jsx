import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../Context/AppContext'

const Header = () => {
  const { userData, isLoggedIn } = useContext(AppContext);

  return (
    <div className='flex flex-col items-center mt-20 text-center text-gray-800'>
      <img src={assets.header_img} alt="Header-img" className='w-36 h-36 rounded-full mb-6' />
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Heyy {userData && isLoggedIn ? (userData.user.name) : (" developer")}<img src={assets.hand_wave} alt="handwave" className='w-8 aspect-square' /></h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome our app</h2>
      <p className='mb-8 max-w-md '>Let's start with a quick product tour and we will have you up abd running in no time!</p>
      <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-400 transition-all'>Get started</button>

    </div>
  )
}

export default Header