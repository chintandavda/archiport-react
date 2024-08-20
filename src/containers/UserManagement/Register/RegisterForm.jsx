import React, { useState } from "react";
import api from "../../../services/api";
import Button from "../../../components/CommonComponents/Button";
import { useNavigate } from "react-router-dom";
import GoogleSignInButton from "../GoogleSignInButton";
import { notification } from "antd";

const RegisterForm = ({ onSuccess }) => {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (!validateEmail(newEmail)) {
            setEmailError("Invalid email format");
        } else {
            setEmailError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post("register/", {
                email,
                full_name: fullName,
            });
            notification.success({
                message: "Success",
                description: response.data.message || "Registration successful",
            });
            onSuccess(email);
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.response?.data?.error || "An error occurred",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        // Handle Google sign-in logic here
        console.log("Google sign-in clicked");
    };

    const handleSignInClick = () => {
        navigate("/login");
    };

    return (
        <div className="register">
            <h1>Join Us Now</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="text-capitalize"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required
                />
                {emailError && <span className="error-text">{emailError}</span>}
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                    required
                />
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                >
                    Sign Up
                </Button>
            </form>
            <hr />
            <div>
                <h6 className="text-capitalize">
                    Continue with Google to access your account
                </h6>
                <GoogleSignInButton onClick={handleGoogleSignIn} />
            </div>
            <h5 className="text-capitalize">
                Already a member?{" "}
                <span className="link" onClick={handleSignInClick}>
                    Sign in
                </span>{" "}
                here...
            </h5>
        </div>
    );
};

export default RegisterForm;
