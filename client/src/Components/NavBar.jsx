import React, { use, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import FetchUserLoading from './FetchUserLoading';

const NavBar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedIn, isLoading, setIsLoading } = useContext(AppContext)

  const logoutHandler = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.post(backendUrl + '/userAuthentication/Logout', { withCredentials: true });
      data.success === true && setIsLoggedIn(false);
      setUserData(false);
      navigate('/')
      setIsLoading(false)
    } catch (error) {
      toast.error(error.message)
    } finally { setIsLoading(false) }


  }

  const sendVerificationOtp = async () => {
    try {
      setIsLoading(true)

      const { data } = await axios.post(backendUrl + "/userAuthentication/sendOtp", { withCredentials: true });
      if (data.success === true) {
        navigate('/verifyEmail')
        toast.success(data.message)

      } else {
        toast.error(data.message)
        console.log(` otp data `, data)
      }
      setIsLoading(false)
    } catch (error) {
      toast.error(error.message)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading === true ? (
        <FetchUserLoading />
      ) :

        (<div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0' >
          <img className='w-28 sm:w-32' src={assets.logo} alt='logo' />
          {userData ?
            (<div className='h-8 w-8 flex justify-center items-center bg-[#292f9a] rounded text-white shadow-lg indigo-950 relative group'>
              {userData.user.name[0].toUpperCase()}
              <div className='absolute text-gray-700 hidden group-hover:block top-0 right-0 z-10 rounded pt-10 '>
                <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                  {!userData.user.isAccountVerified===true && (<li className='py-1 px-0 hover:bg-gray-400 cursor-pointer flex' onClick={sendVerificationOtp}>Verify Email</li>)}
                  <li className='py-1 px-0 hover:bg-gray-200 cursor-pointer pr-10' onClick={logoutHandler}>Logout</li>
                </ul>

              </div>
            </div>) :
            (<button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-200 transition-all' onClick={() => (navigate('/login'))} >Login <img src={assets.arrow_icon} alt="arrow-icon" /></button>)}

        </div>)}
    </>
  )
}

export default NavBar