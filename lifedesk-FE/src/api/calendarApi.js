import axiosClient from "./axiosClient"

export const startGoogleCalendarConnection =async()=>{
    const response =await axiosClient.post(
        "/api/calendar/connect/start",{},
        {withCredentials:true}
    );
    return response.data;
}

export const getGoogleCalendarStatus=async()=>{
    const response =await axiosClient.get("/api/calendar/status");
    return response.data;
}
export const createGoogleCalendarEvent=async(eventData)=>{
    const response=await axiosClient.post(
        "/api/calendar/events",
        eventData
    )
    return response.data;
}