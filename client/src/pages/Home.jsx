import React, { useContext } from 'react'
import NavBar from '../Components/NavBar'
import Header from '../Components/Header'
import { AppContext } from '../Context/AppContext'
import FetchUserLoading from '../Components/FetchUserLoading'

const Home = () => {
  const { isLoading, setIsLoading } = useContext(AppContext)
  return (
    <div className=' flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center '>
      {isLoading === true ? (
        <FetchUserLoading />
      ) : (
        <>
          <NavBar/>
          <Header/>
        </>
      )}
    </div>
  )
}

export default Home

