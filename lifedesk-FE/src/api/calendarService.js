import axiosClient from "./axiosClient"

export const connectGoogleCalendar =async()=>{
    const response =await axiosClient.post(
        "/api/calendar/connect/start"
    );

    const authorizationUrl=response.data.authorizationUrl;

    if(!authorizationUrl){
        throw new Error("Google authorization URL and not returned");
    }
    window.location.assign(authorizationUrl)
}

export const createCalendarEvent =async(taskId,startTime)=>{
    const response =await axiosClient.post(
        "/api/calendar/events",
        {
            taskId,
            startTime,
        }
    )
    return response.data
}