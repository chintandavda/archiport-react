import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./login.css";
import { AuthContext } from "../../../context/AuthContext";
import GoogleSignInButton from "../GoogleSignInButton";
import Button from "../../../components/CommonComponents/Button";
import logo from "../../../assets/images/Logo/logo.png";
import logoText from "../../../assets/images/Logo/logo-text.png";
import FeatureList from "../../../components/Website/FeatureList";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { notification, Input, Modal, Form, message } from "antd";
import ProfileAPI from "../../../services/ProfileAPI";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState("");
    const { login } = useContext(AuthContext);
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingOTP, setLoadingOTP] = useState(false);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [forgotPasswordModalVisible, setForgotPasswordModalVisible] =
        useState(false);
    const [resetOtp, setResetOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef([]);
    const [stage, setStage] = useState(1);

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
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("login/", {
                email,
                password,
            });

            const { access, refresh } = response.data;

            await login(access, refresh); // Login user

            message.success({
                content: response.data.message || "Logged in successfully",
                duration: 1,
            });

            navigate("/");
        } catch (error) {
            message.error({
                content: error.response.data.error || "An error occurred",
                duration: 1,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        console.log("Google sign-in clicked");
    };

    const handleSendOTP = async () => {
        if (!email) {
            message.error({
                content: "Please enter your email.",
                duration: 3,
            });
            return;
        }

        if (emailError) {
            message.error({
                content: emailError,
                duration: 3,
            });
            return;
        }

        setLoadingOTP(true);

        try {
            await api.post("send-login-otp/", { email });
            setOtpSent(true);
            notification.success({
                message: "Success",
                description: "OTP sent to your email",
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.response.data.error || "An error occurred",
            });
        } finally {
            setLoadingOTP(false);
        }
    };

    const handleForgotPasswordClick = () => {
        setForgotPasswordModalVisible(true);
    };

    const handleRequestResetOTP = async () => {
        if (!email) {
            notification.error({
                message: "Error",
                description: "Please enter your email.",
            });
            return;
        }

        setLoadingOTP(true);

        try {
            await ProfileAPI.requestResetOtp(email);
            notification.success({
                message: "Success",
                description: "OTP sent to your email for password reset.",
            });
            setStage(2);
        } catch (error) {
            notification.error({
                message: "Error",
                description:
                    error.response?.data?.error || "Failed to send OTP.",
            });
        } finally {
            setLoadingOTP(false);
        }
    };

    const handleVerifyResetOTP = async () => {
        let otpValue = resetOtp.join("");
        setLoading(true);
        console.log(otpValue);

        try {
            await ProfileAPI.verifyResetOtp(email, otpValue);

            notification.success({
                message: "Success",
                description: "Password reset successfully.",
            });

            setStage(3); // Close modal
        } catch (error) {
            notification.error({
                message: "Error",
                description:
                    error.response?.data?.error || "Failed to reset password.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (values) => {
        setLoading(true);
        try {
            const { newPassword } = values;

            await ProfileAPI.changeResetPassword(email, newPassword);
            notification.success({
                message: "Success",
                description: "Password reset successfully.",
            });
            setForgotPasswordModalVisible(false); // Close modal
            setStage(1); // Reset to initial stage
        } catch (error) {
            notification.error({
                message: "Error",
                description:
                    error.response?.data?.error || "Failed to reset password.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelForgotPassword = () => {
        setForgotPasswordModalVisible(false);
    };

    const handleOtpChange = (value, index, otpType = "login") => {
        if (otpType === "reset") {
            const otpArray = [...resetOtp];
            otpArray[index] = value;
            setResetOtp(otpArray);

            if (value && index < otpArray.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        } else {
            const otpArray = [...otp];
            otpArray[index] = value;
            setOtp(otpArray);

            if (value && index < otpArray.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        let otpValue = otp.join("");
        setLoading(true);

        try {
            const response = await api.post("verify-login-otp/", {
                email,
                otp: otpValue,
            });
            const { access, refresh } = response.data;
            await login(access, refresh);
            notification.success({
                message: "Success",
                description: "OTP verified successfully",
            });
            navigate("/profile", {
                state: { message: "Logged in successfully", type: "success" },
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.response.data.error || "An error occurred",
            });
            setOtp(["", "", "", ""]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setOtpSent(false);
    };

    return (
        <div className="login-container">
            <div className="login-info">
                <div
                    className="logos cp"
                    onClick={homePage}
                    style={{ cursor: "pointer" }}
                >
                    <img className="logo" src={logo} alt="logo" />
                    <img className="logo-text" src={logoText} alt="Logo Text" />
                </div>
                <h3 className="mb-0">Welcome Back to Your Design Space</h3>
                <div className="feature-list-container">
                    <FeatureList slidesToShow={2} interval={2000} />
                </div>
            </div>
            <div className="login-bg">
                <div className="login">
                    <h1>Login</h1>
                    {otpSent ? (
                        <form onSubmit={handleVerifyOTP}>
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
                                            handleOtpChange(
                                                e.target.value,
                                                index,
                                            )
                                        }
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
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                loading={loading}
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
                                <span className="error-text">{emailError}</span>
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
                                    type={showPassword ? "text" : "password"}
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
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <span
                                className="link fbold"
                                onClick={handleForgotPasswordClick}
                                style={{ cursor: "pointer" }}
                            >
                                Forget password?
                            </span>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                loading={loading}
                            >
                                Sign in
                            </Button>
                            <Button
                                type="button"
                                variant="primary-2-outline"
                                size="md"
                                onClick={handleSendOTP}
                                loading={loadingOTP}
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

            {/* Forgot Password Modal */}
            <Modal
                visible={forgotPasswordModalVisible}
                title="Forgot Password"
                onCancel={handleCancelForgotPassword}
                footer={null}
            >
                {stage === 1 && (
                    <Form onFinish={handleRequestResetOTP}>
                        <Form.Item
                            label="Email"
                            style={{
                                marginTop: "1em",
                            }}
                        >
                            <Input
                                value={email}
                                onChange={handleEmailChange}
                                disabled={stage !== 1}
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loadingOTP}
                        >
                            Send OTP
                        </Button>
                    </Form>
                )}

                {stage === 2 && (
                    <Form onFinish={handleVerifyResetOTP}>
                        <h4>Enter OTP sent to your email</h4>
                        <div className="otp-input-container">
                            {resetOtp.map((value, index) => (
                                <Input
                                    key={index}
                                    maxLength={1}
                                    value={value}
                                    ref={(el) =>
                                        (inputRefs.current[index] = el)
                                    }
                                    onChange={(e) => {
                                        const newValue = e.target.value;

                                        // Update OTP array
                                        setResetOtp((prev) => {
                                            const updated = [...prev];
                                            updated[index] = newValue;
                                            return updated;
                                        });

                                        // Automatically move to the next input field
                                        if (
                                            newValue &&
                                            index < resetOtp.length - 1
                                        ) {
                                            inputRefs.current[
                                                index + 1
                                            ].focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Move to previous input field when pressing backspace
                                        if (
                                            e.key === "Backspace" &&
                                            !resetOtp[index] &&
                                            index > 0
                                        ) {
                                            inputRefs.current[
                                                index - 1
                                            ].focus();
                                        }
                                    }}
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
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Verify OTP
                        </Button>
                    </Form>
                )}

                {stage === 3 && (
                    <Form onFinish={handleResetPassword}>
                        <Form.Item
                            label="New Password"
                            name="newPassword"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your new password!",
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Confirm New Password"
                            name="confirmNewPassword"
                            dependencies={["newPassword"]} // Depends on newPassword field
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please confirm your new password!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("newPassword") ===
                                                value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "The two passwords do not match!",
                                            ),
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Reset Password
                        </Button>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default Login;
