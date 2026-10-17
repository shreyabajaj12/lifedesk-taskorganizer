import axiosClient from "./axiosClient";

export const getTodayPlan = async () => {
    const today = new Date().toISOString().split("T")[0];

    const response = await axiosClient.get(
        `/api/daily-plans/${today}`
    );

    return response.data;
};

export const addTaskToTodayPlan = async (taskId) => {
    const today = new Date().toISOString().split("T")[0];

    const response = await axiosClient.post(
        `/api/daily-plans/${today}/tasks/${taskId}`
    );

    return response.data;
};

export const removeTaskFromTodayPlan = async (taskId) => {
    const today = new Date().toISOString().split("T")[0];

    const response = await axiosClient.delete(
        `/api/daily-plans/${today}/tasks/${taskId}`
    );

    return response.data;
};

export const getTodayPlanAnalytics = async () => {
    const today = new Date().toISOString().split("T")[0];

    const response = await axiosClient.get(
        `/api/daily-plans/${today}/analytics`
    );

    return response.data;
};