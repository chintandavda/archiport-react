import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./userManagement.css";
import Button from "../../components/CommonComponents/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { Input } from "antd";
import { notification } from "antd";

const OTPForm = ({ email, onCancel }) => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [otpVerified, setOtpVerified] = useState(false);
    const inputRefs = useRef([]);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [resendTimer, setResendTimer] = useState(120);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { login } = useContext(AuthContext);

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleOtpChange = (value, index) => {
        const otpArray = [...otp];
        otpArray[index] = value;
        setOtp(otpArray);

        if (value && index < otpArray.length - 1) {
            inputRefs.current[index + 1].focus();
        }
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

    const handleSubmitOTP = async (e) => {
        e.preventDefault();
        const otpValue = otp.join("");
        setLoading(true);

        try {
            const response = await api.post("verify-otp/", {
                email,
                otp: otpValue,
            });
            notification.success({
                message: "Success",
                description:
                    response.data.message || "OTP Verified successfully",
            });
            setOtpVerified(true); // Now show the password fields
        } catch (error) {
            notification.error({
                message: "Error",
                description:
                    error.response?.data?.error || "OTP verification failed!",
            });
            setOtp(["", "", "", ""]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (passwordError || confirmPasswordError) {
            notification.error({
                message: "Error",
                description: passwordError || confirmPasswordError,
            });
            return;
        }

        try {
            const response = await api.post("set-password-and-activate/", {
                email,
                password,
            });

            const { access, refresh } = response.data;

            await login(access, refresh);

            notification.success({
                message: "Success",
                description:
                    response.data.message || "Account activated successfully",
            });

            navigate("/profile", {
                state: { message: "Registered successfully", type: "success" },
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.response?.data?.error || "An error occurred",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            await api.post("resend-otp/", { email });
            notification.success({
                message: "Success",
                description: "OTP resent to your email",
            });
            setResendTimer(120); // Reset the timer
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.response?.data?.error || "An error occurred",
            });
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="otp-form">
            {!otpVerified ? (
                <>
                    <h1>Verify OTP</h1>
                    <form onSubmit={handleSubmitOTP}>
                        <h4>{email}</h4>
                        <div className="otp-input-container">
                            {otp.map((value, index) => (
                                <Input
                                    key={index}
                                    maxLength={1}
                                    value={value}
                                    ref={(el) =>
                                        (inputRefs.current[index] = el)
                                    } // Set ref for each input
                                    onChange={(e) =>
                                        handleOtpChange(e.target.value, index)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace key
                                    style={{
                                        width: "50px",
                                        marginRight: "10px",
                                        textAlign: "center",
                                        marginBottom: "1em",
                                        padding: "10px 20px",
                                    }}
                                />
                            ))}
                        </div>
                        <Button type="submit" loading={loading}>
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
                    <span
                        className="link fbold"
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0}
                    >
                        Resend OTP {resendTimer > 0 && `(${resendTimer}s)`}
                    </span>
                </>
            ) : (
                <>
                    <h1>Enter Password</h1>

                    <form onSubmit={handleSubmitPassword}>
                        <h4>{email}</h4>
                        <div className="password-input-container">
                            <input
                                value={password}
                                type={showPassword ? "text" : "password"}
                                onChange={handlePasswordChange}
                                placeholder="Password"
                                required
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
                            />
                            <span
                                onClick={toggleConfirmPasswordVisibility}
                                className="password-toggle-icon"
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </span>
                        </div>
                        {confirmPasswordError && (
                            <span className="error-text">
                                {confirmPasswordError}
                            </span>
                        )}
                        <Button type="submit" loading={loading}>
                            Submit Password
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
                </>
            )}
        </div>
    );
};

export default OTPForm;
