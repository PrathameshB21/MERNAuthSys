import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import FetchUserLoading from '../Components/FetchUserLoading'


const Login = () => {
  const [state, setState] = useState('signUp')
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: ""
  })
 

  const { backendUrl, isloggedIn, setIsLoggedIn ,getUserData,userData,isLoading,setIsLoading} = useContext(AppContext)

  const navigate = useNavigate()

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const stateHandler = () => {
    if (state === 'signUp') {
      setState('signin')
    } else {
      setState('signUp')
    }
  }

  const onSubmitHandler = async (e) => {
    // console.log(`starting loop,url:-${backendUrl}`);

    e.preventDefault();
    axios.defaults.withCredentials = true;
    try {
      // console.log(`state check`)
      let response;
      setIsLoading(true)
      if (state === "signUp") {
        // console.log(`signUp,making api call`);
        
        response = await axios.post(backendUrl + '/userAuthentication/Register', { name:inputData.name, email: inputData.email, password: inputData.password  })

       
       
      } else {
        // console.log(`login,making api call`);
         response = await axios.post(backendUrl + '/userAuthentication/Login', { email: inputData.email, password: inputData.password })
      
      }
      if (response.data.success === true) {
        // console.log(response.data)
        setIsLoggedIn(true);
        await getUserData() //fetching user details 
       
        setIsLoading(false)
        navigate('/')
        toast.success(response.data.message)

      } else {
        // console.log(response.data.success)
        setIsLoading(false)
        toast.error(response.data.message)
      }

    } catch (error) {
      
      
      toast.error(error)
    }
    finally{
      setIsLoading(false)
    }
  }
  return (
    
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 '>
      <img src={assets.logo} alt="logo" onClick={() => (navigate('/'))} className='absolute left-5  sm:left-5 top-5 w-32 cursor-pointer' />

      
      
       {isLoading===true?(
        <FetchUserLoading/>
       ):(
        <div className='bg-[#041C32] p-10 rounded-lg shadow-lg w-full  sm:w-96 text-indigo-200 text-sm' >
         <h2 className='text-5xl font-semibold text-center mb-3'>{state === "signUp" ? "SignUp" : "SignIn"}</h2>
        <p className='text-center text-sm mb-3'>{state === "signUp" ? "Create your account" : "Login to your account"}</p>

        <form onSubmit={onSubmitHandler}>
          {state === 'signUp' && (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#2C3930] '>
            <img src={assets.person_icon} alt="" />
            <input name='name' value={inputData.name} onChange={onChangeHandler} type="text" placeholder='Full Name' required className='bg-transparent outline-none' />

          </div>)}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#2C3930] '>
            <img src={assets.mail_icon} alt="" />
            <input name='email' value={inputData.email} onChange={onChangeHandler} type="email" placeholder='Email Id' required className='bg-transparent outline-none' autoComplete="username" />

          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#2C3930] '>
            <img src={assets.lock_icon} alt="" />
            <input name='password' value={inputData.password} onChange={onChangeHandler} type="password" placeholder='Password' required className='bg-transparent outline-none' 
             autoComplete={state === 'signUp' ? "new-password" : "current-password"}
            />

          </div>
          <p className='mb-3 text-gray-300 cursor-pointer hover:text-[#8F87F1]' onClick={() => (navigate('/resetPassword'))}>Forgot password</p>
          <button className='text-xl w-full py-2.5 rounded-full bg-gradient-to-r from-[#916BBF] to-[#041C32] font-medium '>{state === "signUp" ? "SignUp" : "SignIn"}</button>
        </form>

        {state === 'signUp' ? (<p className='mt-4 text-center text-gray-500 text-xs '>Already have an account? {" "} <span className='text-blue-500 cursor-pointer underline' onClick={stateHandler}>Login here</span></p>)
          : (<p className='mt-4 text-center text-gray-500 text-xs '>Don't have an account? {" "} <span className='text-blue-500 cursor-pointer underline' onClick={stateHandler} >Register here</span></p>
          )}

        </div>
       )}

      
    </div>
  )
}

export default Login