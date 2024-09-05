import React, { createContext, useState, useContext, useCallback } from "react";
import DesignPostAPI from "../services/DesignPostAPI";
import { AuthContext } from "./AuthContext";

const DesignContext = createContext();

export const useDesigns = () => {
    return useContext(DesignContext);
};

export const DesignProvider = ({ children }) => {
    const [designs, setDesigns] = useState([]);
    const { user: loggedInUser } = useContext(AuthContext); // Access loggedInUser from AuthContext

    const refreshDesigns = useCallback(
        async (personalFeed = false, username = null) => {
            try {
                let data;
                console.log("personal feed", personalFeed);

                if (username) {
                    // Fetch designs for a specific user by their ID
                    data = await DesignPostAPI.getDesignsByUsername(username);
                } else if (personalFeed && loggedInUser) {
                    // Fetch personal designs for the logged-in user
                    data = await DesignPostAPI.getMyDesigns();
                } else if (loggedInUser) {
                    // Fetch designs for authenticated users
                    data = await DesignPostAPI.getDesigns();
                } else {
                    // Fetch public designs for unauthenticated users
                    data = await DesignPostAPI.getPublicDesigns();
                }
                setDesigns(data);
            } catch (error) {
                console.error("Error refreshing designs:", error);
            }
        },
        [loggedInUser],
    );

    return (
        <DesignContext.Provider value={{ designs, refreshDesigns }}>
            {children}
        </DesignContext.Provider>
    );
};
