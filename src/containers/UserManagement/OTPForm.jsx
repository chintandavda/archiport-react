import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Message from "../../components/CommonComponents/Message";
import "./userManagement.css";
import Button from "../../components/CommonComponents/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const OTPForm = ({ email, onCancel }) => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [resendTimer, setResendTimer] = useState(120);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { login } = useContext(AuthContext);

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (!validatePassword(newPassword)) {
            setPasswordError(
                "Password must be 8+ chars and include a letter and a number.",
            );
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        if (newConfirmPassword !== password) {
            setConfirmPasswordError("Passwords do not match.");
        } else {
            setConfirmPasswordError("");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
    };

    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (passwordError) {
            setMessageType("error");
            setMessage(passwordError);
            return;
        }

        try {
            const response = await api.post("verify-otp/", {
                email,
                otp,
                password,
            });
            const { access, refresh } = response.data;
            login(access, refresh); // Perform login
            setMessageType("success");
            setMessage("OTP verified successfully");
            navigate("/profile", {
                state: { message: "Registered successfully", type: "success" },
            });
        } catch (error) {
            setMessageType("error");
            setMessage(error.response.data.error || "An error occurred");
        }
    };

    const handleResendOTP = async () => {
        setMessage("");
        try {
            await api.post("resend-otp/", { email });
            setMessageType("success");
            setMessage("OTP resent to your email");
            setResendTimer(120); // Reset the timer
        } catch (error) {
            setMessageType("error");
            setMessage(error.response.data.error || "An error occurred");
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="otp-form">
            <h1>Verify OTP</h1>
            <form onSubmit={handleSubmit}>
                <h4>{email}</h4>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP Here"
                    required
                />
                <div className="password-input-container">
                    <input
                        value={password}
                        type={showPassword ? "text" : "password"}
                        onChange={handlePasswordChange}
                        placeholder="Password"
                        required
                        disabled={otp.length !== 4}
                    />
                    <span
                        onClick={togglePasswordVisibility}
                        className="password-toggle-icon"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                {passwordError && (
                    <span className="error-text">{passwordError}</span>
                )}
                <div className="password-input-container">
                    <input
                        value={confirmPassword}
                        type={showConfirmPassword ? "text" : "password"}
                        onChange={handleConfirmPasswordChange}
                        placeholder="Confirm Password"
                        required
                        disabled={otp.length !== 4}
                    />
                    <span
                        onClick={toggleConfirmPasswordVisibility}
                        className="password-toggle-icon"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                {confirmPasswordError && (
                    <span className="error-text">{confirmPasswordError}</span>
                )}
                <Message message={message} type={messageType} />
                <Button type="submit">Verify OTP</Button>
                <Button
                    type="button"
                    variant="primary-2"
                    size="md"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
            </form>
            <span
                className="link fbold"
                onClick={handleResendOTP}
                disabled={resendTimer > 0}
            >
                Resend OTP {resendTimer > 0 && `(${resendTimer}s)`}
            </span>
        </div>
    );
};

export default OTPForm;
