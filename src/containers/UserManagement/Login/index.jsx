import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./login.css";
import { AuthContext } from "../../../context/AuthContext";
import Message from "../../../components/CommonComponents/Message";
import GoogleSignInButton from "../GoogleSignInButton";
import Button from "../../../components/CommonComponents/Button";
import logo from "../../../assets/images/Logo/logo.png";
import logoText from "../../../assets/images/Logo/logo-text.png";
import FeatureList from "../../../components/Website/FeatureList";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const [message, setMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [messageType, setMessageType] = useState("");
    const { login } = useContext(AuthContext);
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const homePage = () => {
        navigate("/");
    };

    const handleSignUpClick = () => {
        navigate("/register");
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (!validateEmail(newEmail)) {
            setEmailError("Invalid email");
        } else {
            setEmailError("");
        }
    };

    const handleLoginWithPassword = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setMessage("");

        try {
            const response = await api.post("login/", {
                email,
                password,
            });

            const { access, refresh } = response.data;
            login(access, refresh); // Login user
            setMessageType("success");
            setMessage("Logged in successfully");
            navigate("/profile", {
                state: {
                    message: "Logged in successfully",
                    type: "success",
                },
            });
        } catch (error) {
            setMessageType("error");
            if (error.response && error.response.data) {
                setMessage(error.response.data.error || "An error occurred");
            } else {
                setMessage("An error occurred");
            }
        }
    };

    const handleGoogleSignIn = () => {
        // Handle Google sign-in logic here
        console.log("Google sign-in clicked");
    };

    const handleSendOTP = async () => {
        setMessage("");

        if (!email) {
            setMessageType("error");
            setMessage("Please enter your email.");
            return;
        }

        if (emailError) {
            setMessageType("error");
            setMessage(emailError);
            return;
        }

        try {
            await api.post("send-login-otp/", { email });
            setOtpSent(true);
            setMessageType("success");
            setMessage("OTP sent to your email");
        } catch (error) {
            setMessageType("error");
            setMessage(error.response.data.error || "An error occurred");
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await api.post("verify-login-otp/", {
                email,
                otp,
            });
            const { access, refresh } = response.data;
            login(access, refresh);
            setMessageType("success");
            setMessage("OTP verified successfully");
            navigate("/profile", {
                state: { message: "Logged in successfully", type: "success" },
            });
        } catch (error) {
            setMessageType("error");
            setMessage(error.response.data.error || "An error occurred");
        }
    };

    const handleCancel = () => {
        setOtpSent(false);
        setMessage("");
        setMessageType("");
    };

    return (
        <div className="login-page">
            <div className="auth-header">
                <h2 className="mb-0">Welcome Back to Your Design Space</h2>
            </div>
            <div className="login-container">
                <div className="login-info">
                    <div
                        className="logos cp"
                        onClick={homePage}
                        style={{ cursor: "pointer" }}
                    >
                        <img className="logo" src={logo} alt="logo" />
                        <img
                            className="logo-text"
                            src={logoText}
                            alt="Logo Text"
                        />
                    </div>
                    <div className="feature-list-container">
                        <FeatureList slidesToShow={3} interval={3000} />
                    </div>
                </div>
                <div className="login-bg">
                    <div className="login">
                        <h1>Login</h1>
                        {otpSent ? (
                            <form onSubmit={handleVerifyOTP}>
                                <input
                                    type="text"
                                    value={otp}
                                    placeholder="Enter OTP"
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                                <Message message={message} type={messageType} />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    disabled={otp.length !== 4}
                                >
                                    Verify OTP
                                </Button>
                                <Button
                                    type="button"
                                    variant="primary-2"
                                    size="md"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleLoginWithPassword}>
                                {emailError && (
                                    <span className="error-text">
                                        {emailError}
                                    </span>
                                )}
                                <input
                                    type="email"
                                    value={email}
                                    placeholder="Email"
                                    onChange={handleEmailChange}
                                    required
                                />
                                <div className="password-input-container">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        placeholder="Password"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                    <span
                                        onClick={togglePasswordVisibility}
                                        className="password-toggle-icon"
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </span>
                                </div>
                                <span className="link fbold">
                                    Forget password?
                                </span>
                                <Message message={message} type={messageType} />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                >
                                    Sign in
                                </Button>
                                <Button
                                    type="button"
                                    variant="primary-2-outline"
                                    size="md"
                                    onClick={handleSendOTP}
                                >
                                    Login with OTP
                                </Button>
                            </form>
                        )}
                        <hr />
                        <div>
                            <h6 className="text-capitalize">
                                Continue with google to access your account
                            </h6>
                            <GoogleSignInButton onClick={handleGoogleSignIn} />
                        </div>
                        <h5 className="text-capitalize">
                            Don't have account{" "}
                            <span className="link" onClick={handleSignUpClick}>
                                Sign Up
                            </span>{" "}
                            here...
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
