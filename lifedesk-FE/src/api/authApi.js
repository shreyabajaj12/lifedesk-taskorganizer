import axiosClient from "./axiosClient";

export const register =async(name, email,password)=>{
    const response =await axiosClient.post("/api/auth/register",{
        name,email,password
    })
    return response.data;
};

export const verifyRegistrationOtp =async(email,otp)=>{
    const response =await axiosClient.post("/api/auth/verify-registration-otp",{
        email,otp
    })
    return response.data;
}

export const resendOtp =async(email)=>{
    const response =await axiosClient.post("/api/auth/resend-otp",{
        email,
    });
    return response.data;
}

export const login =async(email,password)=>{
    const response =await axiosClient.post("/api/auth/login",{
        email,password,
    })
    return response.data;
}

export const getCurrentUser =async()=>{
    const response =await axiosClient.get("/api/auth/me");
    return response.data;
}