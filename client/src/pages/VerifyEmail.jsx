import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { AppContext } from '../Context/AppContext'
import { toast } from 'react-toastify';
import FetchUserLoading from '../Components/FetchUserLoading';

const VerifyEmail = () => {

  const { backendUrl,isLoggedIn, isLoading, setIsLoading, getUserData,userData } = useContext(AppContext)

  const navigate = useNavigate();
  const inputRef = useRef([]);


  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipBoardData.getData('text');
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char
      }
    })
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      const otpArray = inputRef.current.map(e => e.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(backendUrl + '/userAuthentication/sendVerifyOtp', { otp }, { withCredentials: true })
      if (data.success === true) {
        toast.success(data.message)
        getUserData()
        navigate('/')
        setIsLoading(false)
      } else {
        toast.error(data.message)
        setIsLoading(false)
      }

    } catch (error) {
      toast.error(error.message)
      setIsLoading(false)
    }
    finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (isLoggedIn && userData?.user?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData, navigate]);
  return (
    <>
      <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 '>
        <img src={assets.logo} alt="logo" onClick={() => (navigate('/'))} className='absolute left-5  sm:left-5 top-5 w-32 cursor-pointer' />

        {isLoading === true ? (
          <FetchUserLoading />
        ) : (

          <><form className='bg-[#041C32] p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitHandler}>
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verification</h1>
            <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit otp sent your registred email</p>

            <div className='flex justify-between mb-8' onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input type='text' maxLength='1' key={index} required
                  className='w-12 h-12 bg-[#333A5c] text-white text-center text-xl rounded-md'
                  ref={e => inputRef.current[index] = e} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} />
              ))}
            </div>
            <button type='submit' className='w-full mt-3 py-3 bg-gradient-to-r from-[#916BBF] to-[#041C32] text-white rounded-full cursor-pointer'>Verify</button>
          </form></>
        )}

      </div>

    </>
  )
}

export default VerifyEmail