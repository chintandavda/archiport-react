import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Button from "../../../components/CommonComponents/Button";
import Message from "../../../components/CommonComponents/Message";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import {
    UserOutlined,
    InfoCircleOutlined,
    LockOutlined,
    ProfileOutlined,
    // BellOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import PersonalDetails from "./PersonalDetails";

const { Sider, Content } = Layout;

const ProfileDetails = ({ user }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [selectedKey, setSelectedKey] = useState("personal");

    const handleDeleteAccount = async () => {
        if (
            window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone.",
            )
        ) {
            try {
                const token = localStorage.getItem("token");
                await api.delete(`delete-user/${user.id}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                logout();
                navigate("/register", {
                    state: {
                        message: "Account deleted successfully",
                        type: "success",
                    },
                });
            } catch (error) {
                setMessageType("error");
                setMessage(error.response.data.error || "An error occurred");
            }
        }
    };

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };

    const renderContent = () => {
        switch (selectedKey) {
            case "personal":
                return <PersonalDetails user={user} />;
            case "additional":
                return <h1>Additional Details</h1>;
            case "security":
                return <h1>Security and Privacy</h1>;
            case "profile":
                return <h1>Profile Details</h1>;
            case "notifications":
                return <h1>Notifications</h1>;
            case "account":
                return (
                    <div>
                        <h1>Account Management</h1>
                        <Message message={message} type={messageType} />
                        <Button
                            variant="secondary"
                            onClick={handleDeleteAccount}
                        >
                            Delete Account
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Layout>
            <Sider theme="light">
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                >
                    <Menu.Item key="personal" icon={<UserOutlined />}>
                        Personal Details
                    </Menu.Item>
                    <Menu.Item key="additional" icon={<InfoCircleOutlined />}>
                        Additional Details
                    </Menu.Item>
                    <Menu.Item key="security" icon={<LockOutlined />}>
                        Security & Privacy
                    </Menu.Item>
                    <Menu.Item key="profile" icon={<ProfileOutlined />}>
                        Profile Details
                    </Menu.Item>
                    {/* <Menu.Item key="notifications" icon={<BellOutlined />}>
                        Notifications
                    </Menu.Item> */}
                    <Menu.Item key="account" icon={<SettingOutlined />}>
                        Account Management
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content style={{ margin: "0" }}>
                    <div
                        style={{
                            padding: 24,
                            background: "#fff",
                            minHeight: 480,
                        }}
                    >
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProfileDetails;
