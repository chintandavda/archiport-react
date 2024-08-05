import api from "./api";

const ProfileAPI = {
    getUserProfile: async (token) => {
        try {
            const response = await api.get("get_user/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            throw error;
        }
    },

    getPersonalDetails: async (token) => {
        try {
            const response = await api.get("personal_details/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
                    formData.append(key, data[key].file.originFileObj);
                } else {
                    formData.append(key, data[key]);
                }
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
};

export default ProfileAPI;
