import React, { useContext } from "react";
import AllDesigns from "../../../components/DesignComponents/GetDesignPosts";
import { AuthContext } from "../../../context/AuthContext";
import { Container } from "@mui/material";
import "./Home.css";
import Button from "../../../components/CommonComponents/Button";

const HomePage = () => {
    const { isAuthenticated } = useContext(AuthContext);
    return (
        <Container>
            {!isAuthenticated && (
                <div className="sign-up-here">
                    <div>
                        <Button to="/login">Sign In</Button> here and explore
                        more designs
                    </div>
                    <div>
                        or <Button to="/register">Sign Up</Button>
                    </div>
                </div>
            )}
            <div>
                <AllDesigns />
            </div>
        </Container>
    );
};

export default HomePage;
