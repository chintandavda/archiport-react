import React, { createContext, useEffect, useState } from "react";
import api from "../services/api";
import ProfileAPI from "../services/ProfileAPI";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem("access_token");
            if (token) {
                try {
                    const response = await api.get("user/", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const userProfile = await ProfileAPI.getUserProfile(token);
                    setUser({
                        ...response.data,
                        fullName: `${userProfile.first_name} ${userProfile.last_name}`,
                        profileImage: userProfile.profile_image,
                    });
                    setIsAuthenticated(true);
                } catch (error) {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async (access, refresh) => {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        setIsAuthenticated(true);
        try {
            const response = await api.get("user/", {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });
            const userProfile = await ProfileAPI.getUserProfile(access);
            setUser({
                ...response.data,
                fullName: `${userProfile.first_name} ${userProfile.last_name}`,
                profileImage: userProfile.profile_image,
            });
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const logout = async () => {
        console.log("refreshToken");
        const refreshToken = localStorage.getItem("refresh_token");
        try {
            console.log(refreshToken);
            await api.post(
                "logout/",
                { refresh: refreshToken },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                },
            );
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.log("Failed to logout", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, loading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
