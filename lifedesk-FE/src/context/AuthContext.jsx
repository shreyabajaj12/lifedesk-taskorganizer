import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, login as loginApi } from "../api/authApi";

const AuthContext =createContext(null);

export const AuthProvider = ({children}) => {
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);

    const refreshUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
            return userData;
        } catch (error) {
            localStorage.removeItem("token");
            setUser(null);
            throw error;
        }
    };
    useEffect(()=>{
        const token =localStorage.getItem("token");
        if(!token){
            setLoading(false);
            return;
        }
        getCurrentUser()
        .then((userData)=>{
            setUser(userData);
        })
        .catch(()=>{
            localStorage.removeItem("token");
            setUser(null);
        })
        .finally(()=>{
            setLoading(false);
        })
    },[]);

    const login =async(email,password)=>{
        const token =await loginApi(email,password);
        localStorage.setItem("token",token);
        const userData=await getCurrentUser();
        setUser(userData);
        return userData;
    }

    const logout=()=>{
        localStorage.removeItem("token");
        setUser(null);
    }

  return (
    <AuthContext.Provider
        value={{
            user,
            loading,
            isAuthenticated: !!user,
            login,
            logout,
            refreshUser
        }}
    >
        {children}

    </AuthContext.Provider>
  )
}

export const useAuth=()=>{
    return useContext(AuthContext);
};
