import { createContext, useEffect } from 'react'
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {

    const backendURI = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const getAuthState = async () => {
        try {
            console.log("Getting auth state from backend:", backendURI);
            const { data } = await axios.get(`${backendURI}/api/v1/auth/isloggedIn`, {
                withCredentials: true, // ensure cookies are sent
            });
            console.log("Auth state data: ", data);
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData(); // get user data after confirming auth
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        } catch (error) {
            console.log("Error getting auth state:", error);
            setIsLoggedIn(false);
            setUserData(null); // silently handle failed auth
        }
    };


    useEffect(() => {
        getAuthState();
    }, []);

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendURI}/api/v1/users/data`, {
                withCredentials: true, // <- important
            });
            console.log("Data inside getuserdata is: ", data.data);
            data.success ? setUserData(data.data) : toast.error(data.message);
        } catch (error) {
            console.log("Error getting user data:", error);
            // handle silently or toast if you want
        }
    }


    const value = {
        backendURI,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppContextProvider };

