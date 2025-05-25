import React from 'react'
import Lottie from 'lottie-react';
import FetchingUser from '../assets/fetching users.json'


const FetchUserLoading = () => {
  return (
    <div className=' w-2/6'>
    <Lottie animationData={FetchingUser}/> 
    </div>
  )
}

export default FetchUserLoading