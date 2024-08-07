// src/services/DesignPostAPI.jsx
import axios from "axios";

const API_BASE_URL = process.env.NODE_DESIGN_SERVICE;

// NODE_DESIGN_SERVICE = http://127.0.0.1:8000/api/


const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const DesignPostAPI = {
    getDesigns: async () => {
        try {
            const response = await api.get("/designs");
            return response.data;
        } catch (error) {
            console.error("Error fetching designs:", error);
            throw error;
        }
    },
    getMyDesigns: async () => {
        try {
            const response = await api.get("/designs/my-designs");
            return response.data;
        } catch (error) {
            console.error("Error fetching user's designs:", error);
            throw error;
        }
    },
    createDesign: async (designData) => {
        try {
            const response = await api.post("/designs", designData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating design:", error);
            throw error;
        }
    },
    updateDesign: async (id, designData) => {
        try {
            const response = await api.put(`/designs/${id}`, designData);
            return response.data;
        } catch (error) {
            console.error("Error updating design:", error);
            throw error;
        }
    },
    deleteDesign: async (id) => {
        try {
            const response = await api.delete(`/designs/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting design:", error);
            throw error;
        }
    },
};

export default DesignPostAPI;
