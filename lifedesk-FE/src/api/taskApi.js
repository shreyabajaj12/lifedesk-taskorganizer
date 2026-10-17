import axiosClient from "./axiosClient";

export const getTasks = async ({
    search ="",
    priority="",
    status="",
    sort="newest",
}={}) => {
    const params ={};
    if(search) params.search =search;
    if(priority)params.priority=priority;
    if(status)params.status=status;
    if(sort)params.sort=sort;

    const response = await axiosClient.get("/api/tasks",{
        params,
    });
    return response.data;
};

export const getTask = async (taskId) => {
    const response = await axiosClient.get(`/api/tasks/${taskId}`);
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await axiosClient.post("/api/tasks", taskData);
    return response.data;
};

export const updateTask = async (taskId, taskData) => {
    const response = await axiosClient.put(
        `/api/tasks/${taskId}`,
        taskData
    );
    return response.data;
};

export const deleteTask = async (taskId) => {
    const response = await axiosClient.delete(`/api/tasks/${taskId}`);
    return response.data;
};

export const getTaskAnalytics = async () => {
    const response = await axiosClient.get("/api/tasks/analytics");
    return response.data;
};

export const getProductivityHistory = async () => {
    const response = await axiosClient.get(
        "/api/tasks/analytics/productivity"
    );
    return response.data;
};