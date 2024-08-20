import React, { useState, useContext } from "react";
import api from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Modal, Card, Button, Row, Col, Space, notification } from "antd";

const AccountManagement = ({ user }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        Modal.confirm({
            title: "Confirm Account Deletion",
            content:
                "Are you sure you want to delete your account? This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    const token = localStorage.getItem("token");
                    await api.delete(`delete-user/${user.id}/`, {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    });
                    logout();
                    notification.success({
                        message: "Success",
                        description: "Account Deleted Successfully.",
                    });
                    navigate("/register");
                } catch (error) {
                    notification.error({
                        message: "Error",
                        description:
                            error.response?.data?.error ||
                            "An error occurred while deleting your account.",
                    });
                }
            },
            onCancel() {
                notification.info({
                    message: "Cancellation",
                    description: "Account deletion has been canceled.",
                });
            },
        });
    };

    return (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <h1
                style={{
                    fontFamily: "'Dancing Script', cursive",
                    textAlign: "center",
                }}
            >
                Account Management
            </h1>

            <p
                style={{
                    textAlign: "center",
                    fontSize: "16px",
                    color: "#ff4d4f",
                    fontWeight: "bold",
                }}
            >
                Warning: This action is irreversible. Deleting your account will
                permanently remove all your data.
            </p>

            <Row justify="center">
                <Col>
                    <Button
                        type="primary"
                        danger
                        size="large"
                        onClick={handleDeleteAccount}
                        style={{
                            borderRadius: "6px",
                            backgroundColor: "#ff4d4f",
                            borderColor: "#ff4d4f",
                            padding: "0 24px",
                        }}
                    >
                        Delete Account
                    </Button>
                </Col>
            </Row>
        </Space>
    );
};

export default AccountManagement;
