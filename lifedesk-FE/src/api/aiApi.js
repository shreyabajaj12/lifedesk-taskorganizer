import axiosClient from "./axiosClient"

export const sendAiMessage=async(message,conversationId=null)=>{
    const response=await axiosClient.post("/api/ai/chat",{
        message,
        conversationId,
    });
    return response.data;
}