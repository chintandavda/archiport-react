import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import FeatureList from "../../../components/Website/FeatureList";
import logo from "../../../assets/images/Logo/logo.png";
import logoText from "../../../assets/images/Logo/logo-text.png";
import RegisterForm from "./RegisterForm";
import OTPForm from "../OTPForm";

const Register = () => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const homePage = () => {
        navigate("/");
    };

    const handleRegisterSuccess = (email) => {
        setEmail(email);
        setIsRegistered(true);
    };

    const handleCancel = () => {
        setIsRegistered(false);
    };

    return (
        <div className="register-page">
            <div className="auth-header">
                <div
                    className="logos cp"
                    onClick={homePage}
                    style={{ cursor: "pointer" }}
                >
                    <img className="logo" src={logo} alt="logo" />
                    <img className="logo-text" src={logoText} alt="Logo Text" />
                </div>
                <div>
                    <h2 className="mb-0">
                        Become Part of a Thriving Design Ecosystem
                    </h2>
                </div>
            </div>
            <div className="">
                <div className="signup-div">
                    <div className="feature-list-container">
                        <FeatureList slidesToShow={3} interval={2000} />
                    </div>
                    <div className="register">
                        {isRegistered ? (
                            <OTPForm email={email} onCancel={handleCancel} />
                        ) : (
                            <RegisterForm onSuccess={handleRegisterSuccess} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
