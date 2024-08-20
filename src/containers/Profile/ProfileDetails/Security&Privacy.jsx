import React, { useState, useContext, useRef } from "react";
import { Form, Input, Button, notification } from "antd";
import { AuthContext } from "../../../context/AuthContext";
import ProfileAPI from "../../../services/ProfileAPI";

const SecurityAndPrivacy = () => {
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Change Password
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("access_token");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef([]);

    // Step 1: Request OTP
    const requestOtp = async () => {
        setLoading(true);
        try {
            await ProfileAPI.requestOtp(token);
            notification.success({
                message: "Success",
                description: "OTP has been sent to your email or phone.",
            });
            setStep(2); // Move to OTP and password form
        } catch (error) {
            notification.error({
                message: "Error",
                description:
                    error.response?.data?.error || "Failed to send OTP.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const verifyOtp = async () => {
        setLoading(true);
        const otpValue = otp.join("");

        try {
            await ProfileAPI.verifyOtp(token, otpValue); // Replace with your actual endpoint
            notification.success({
                message: "Success",
                description:
                    "OTP verified successfully. Now, you can change your password.",
            });
            setStep(3); // Move to Step 3: Change Password
        } catch (error) {
            notification.error({
                message: "Error",
                description:
                    error.response?.data?.error ||
                    "Failed to verify OTP. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Change Password
    const changePassword = async (values) => {
        setLoading(true);
        try {
            const { newPassword, confirmPassword } = values;

            if (newPassword !== confirmPassword) {
                notification.error({
                    message: "Error",
                    description: "New password and confirmation do not match.",
                });
                setLoading(false);
                return;
            }

            await ProfileAPI.changePassword(token, newPassword);

            notification.success({
                message: "Success",
                description: "Password has been changed successfully.",
            });
            setStep(1);
        } catch (error) {
            notification.error({
                message: "Error",
                description:
                    error.response?.data?.error || "Failed to change password.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1
                style={{
                    fontFamily: "'Dancing Script', cursive",
                    textAlign: "center",
                }}
            >
                {/* Security and Privacy */}
                Change Password
            </h1>

            {/* Step 1: Request OTP */}
            {step === 1 && (
                <div>
                    <p>
                        Your registered email: <strong>{user.email}</strong>
                    </p>
                    <Button
                        type="primary"
                        onClick={requestOtp}
                        loading={loading}
                        style={{ marginTop: "16px" }}
                    >
                        Request OTP
                    </Button>
                </div>
            )}

            {/* Step 2: Verify OTP */}
            {step === 2 && (
                <Form name="verify-otp" layout="vertical" onFinish={verifyOtp}>
                    <p>
                        Your registered email: <strong>{user.email}</strong>
                    </p>

                    <div className="otp-input-container">
                        {otp.map((value, index) => (
                            <Input
                                key={index}
                                maxLength={1}
                                value={value}
                                ref={(el) => (inputRefs.current[index] = el)}
                                onChange={(e) => {
                                    const newValue = e.target.value;

                                    // Update OTP array
                                    setOtp((prev) => {
                                        const updated = [...prev];
                                        updated[index] = newValue;
                                        return updated;
                                    });

                                    // Automatically move to the next input field
                                    if (newValue && index < otp.length - 1) {
                                        inputRefs.current[index + 1].focus();
                                    }
                                }}
                                onKeyDown={(e) => {
                                    // Move to previous input field when pressing backspace
                                    if (
                                        e.key === "Backspace" &&
                                        !otp[index] &&
                                        index > 0
                                    ) {
                                        inputRefs.current[index - 1].focus();
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

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{ marginTop: "16px" }}
                        >
                            Verify OTP
                        </Button>
                        <Button
                            type="default"
                            style={{ marginLeft: "10px", marginTop: "16px" }}
                            onClick={() => setStep(1)} // Go back to stage 1 on cancel
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            )}

            {/* Step 3: Change Password */}
            {step === 3 && (
                <Form
                    name="change-password"
                    layout="vertical"
                    onFinish={changePassword}
                >
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                min: 6,
                                message:
                                    "Please input your new password! (at least 6 characters)",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your new password!",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{ marginTop: "16px" }}
                        >
                            Change Password
                        </Button>
                        <Button
                            type="default"
                            style={{ marginLeft: "10px", marginTop: "16px" }}
                            onClick={() => setStep(1)} // Go back to stage 1 on cancel
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </>
    );
};

export default SecurityAndPrivacy;
