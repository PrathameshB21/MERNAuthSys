import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const backendUrl = import.meta.env.VITE_backend_url;
// const backendUrl = "http://localhost:4000";


axios.defaults.withCredentials=true;

export const AppContextProvider = (props) => {



    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    axios.defaults.withCredentials = true;


    const getAuthStatus = async () => {
        if (isLoading === true) {
            try {
                const response = await axios.get(backendUrl + "/userAuthentication/isAuthenticated");
                if (response.data.success === true) {
                    setIsLoggedIn(true)
                    await getUserData();
                } else {
                    toast.error(`unauthorised user`)
                }
            } catch (error) {
                toast.error(`error`, error.message)
            }
        }
    }
    const getUserData = async () => {
        try {
            let response = await axios.post(backendUrl + "/userDetails/getUserDetails");
            if (response.data.success === true) {
                setUserData(response.data.UserDetails);

                localStorage.setItem('UserDetails', JSON.stringify(response.data.UserDetails));
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error(error.message)
        }
    }


    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
        isLoading, setIsLoading,
    }

    useEffect(() => {
        getAuthStatus();

    }, []);
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}