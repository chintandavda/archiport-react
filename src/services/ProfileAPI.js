import api from "./api";

export const getAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

const ProfileAPI = {
    getUserProfile: async (token) => {
        try {
            const response = await api.get("get_user/", getAuthHeaders(token));
            return response.data;
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            throw error;
        }
    },

    getPersonalDetails: async (token) => {
        try {
            const response = await api.get("personal_details/", getAuthHeaders(token));
            return response.data;
        } catch (error) {
            console.error("Failed to fetch personal details:", error);
            throw error;
        }
    },

    updatePersonalDetails: async (token, data) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                if (key === 'profile_image' && data[key]) {
                    formData.append(key, data[key]);
                } else {
                    formData.append(key, data[key]);
                }
            }
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            const response = await api.put("personal_details/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Failed to update personal details:", error);
            throw error;
        }
    },

    // New API Method 1: Request OTP
    requestOtp: async (token) => {
        try {
            const response = await api.post("request-otp/", {}, getAuthHeaders(token));
            return response.data;
        } catch (error) {
            console.error("Failed to request OTP:", error);
            throw error;
        }
    },

    // New API Method 1: Request OTP without token
    requestResetOtp: async (email) => {
        try {
            const response = await api.post("request-otp/", { email });
            return response.data;
        } catch (error) {
            console.error("Failed to request OTP:", error);
            throw error;
        }
    },

    // New API Method 2: Verify OTP
    verifyOtp: async (token, otp) => {
        try {
            const response = await api.post("verify-otp/", { otp }, getAuthHeaders(token));
            return response.data;
        } catch (error) {
            console.error("Failed to verify OTP:", error);
            throw error;
        }
    },

    // New API Method 2: Verify OTP without token
    verifyResetOtp: async (email, otp) => {
        try {
            const response = await api.post("verify-otp/", { email, otp });
            return response.data;
        } catch (error) {
            console.error("Failed to verify OTP:", error);
            throw error;
        }
    },

    // New API Method 3: Change Password
    changePassword: async (token, newPassword) => {
        try {
            const response = await api.post("change-password/", { new_password: newPassword }, getAuthHeaders(token));
            return response.data;
        } catch (error) {
            console.error("Failed to change password:", error);
            throw error;
        }
    },

    // New API Method 3: Change Password
    changeResetPassword: async (email, newPassword) => {
        try {
            const response = await api.post("change-password/", { email: email, new_password: newPassword });
            return response.data;
        } catch (error) {
            console.error("Failed to change password:", error);
            throw error;
        }
    },

    getAdditionalDetails: async (token) => {
        try {
            const response = await api.get("/additional-details/", getAuthHeaders(token),);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateAdditionalDetails: async (token, data) => {
        try {
            const response = await api.put("/additional-details/", data, getAuthHeaders(token));
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllProfiles: async (token) => {
        try {
            const response = await api.get("/all-profiles/", getAuthHeaders(token));
            return response.data;
        } catch (error) {
            console.error("Failed to fetch profiles:", error);
            throw error;
        }
    },

    getProfileById: async (id, token) => {
        try {
            const response = await api.get(`profile/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch profile by id:", error);
            throw error;
        }
    },
};

export default ProfileAPI;
