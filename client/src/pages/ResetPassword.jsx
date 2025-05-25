import React, { useContext, useState, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'
import FetchUserLoading from '../Components/FetchUserLoading'
import { AppContext } from '../Context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const { isLoading, setIsLoading, backendUrl, userData, getUserData } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [OTP, setOTP] = useState(0);

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

  const emailSubmitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await axios.post(backendUrl + "/userAuthentication/resetOtp", { email: email }, { withCreadentials: true })
      if (data.success) {
        
        setIsEmailSent(true)
        toast.success(data.message)
        setIsLoading(false)
      } else {
        
        toast.error(data.message)
        setIsLoading(false)
      }
    } catch (error) {
      toast.error(error.message)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }

  }
  const generateOTP = async (e) => {
    e.preventDefault()
    const otpArray = inputRef.current.map(e => e.value);
    const otp = otpArray.join("");
  
    setOTP(otp);
    setIsOtpSubmitted(true)
  }

  const sendResetPasswordOtp = async (e) => {
    
    setIsLoading(true)
    try {
      const { data } = await axios.post(backendUrl + "/userAuthentication/verifyResetOtp", {email, otp: OTP, newPassword: newPassword }, { withCreadentials: true })
      
      if (data.success === true) {
        toast.success(data.message);
        navigate('/login')
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }

  }
 
  return (
    <>
      <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 '>
        <img src={assets.logo} alt="logo" onClick={() => (navigate('/'))} className='absolute left-5  sm:left-5 top-5 w-32 cursor-pointer' />



        {isLoading === true ? (
          <FetchUserLoading />
        ) : (<>
          {!isEmailSent && <form onSubmit={emailSubmitHandler} className='bg-[#041C32] p-8 rounded-lg shadow-lg w-96 text-sm'>
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
            <p className='text-center mb-6 text-indigo-300'>Enter your registered email </p>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#2C3930] text-indigo-200 text-sm'>
              <img src={assets.mail_icon} className='w-3 h-3' />
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder='Email Id' className='bg-transparent outline-none tex' required />
            </div>
            <button className='text-lg mt-4 w-full py-2 rounded-full bg-gradient-to-r from-[#916BBF] to-[#041C32] font-medium  text-indigo-200' >Submit</button>
          </form>}

          {/* otpInput From */}

          {isEmailSent && !isOtpSubmitted && <form className='bg-[#041C32] p-5 rounded-lg shadow-lg w-96 text-sm'>
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Verify Otp</h1>
            <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit otp sent your registred email</p>

            <div className='flex justify-between mb-8' onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input type='text' maxLength='1' key={index} required
                  className='w-12 h-12 bg-[#333A5c] text-white text-center text-xl rounded-md'
                  ref={e => inputRef.current[index] = e} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} />
              ))}
            </div>
            <button type='submit' className='w-full mt-3 py-3 bg-gradient-to-r from-[#916BBF] to-[#041C32] text-white rounded-full cursor-pointer' onClick={generateOTP}>Verify</button>
          </form>}
        </>)}

        {/* New Password */}

        {isEmailSent && isOtpSubmitted &&
          <form className='bg-[#041C32] p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={(e) => {
            e.preventDefault(); // Prevent page reload
            sendResetPasswordOtp(); // Call your function
          }}>
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Enter New Password</h1>
            <p className='text-center mb-6 text-indigo-300'>Enter your new password </p>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#2C3930] text-indigo-200 text-sm'>
              <img src={assets.lock_icon} className='w-3 h-3' />
              <input name={newPassword} type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} placeholder='Enter new password' className='bg-transparent outline-none tex' required autoComplete='password' />
            </div>
            <button className='text-lg mt-4 w-full py-2 rounded-full bg-gradient-to-r from-[#916BBF] to-[#041C32] font-medium  text-indigo-200'  >Submit</button>
          </form>}

      </div>

    </>
  )
}

export default ResetPassword