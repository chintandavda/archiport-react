import React, { useState } from "react";
import {
    UserOutlined,
    InfoCircleOutlined,
    LockOutlined,
    // BellOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import PersonalDetails from "./PersonalDetails";
import SecurityAndPrivacy from "./Security&Privacy";
import AdditionalDetails from "./AdditionalDetails";
import AccountManagement from "./AccountManagement";
import { Card, Row, Col, Layout, Menu } from "antd";

const { Sider, Content } = Layout;

const ProfileDetails = ({ user }) => {
    const [selectedKey, setSelectedKey] = useState("personal");

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };

    const renderContent = () => {
        switch (selectedKey) {
            case "personal":
                return <PersonalDetails />;
            case "additional":
                return <AdditionalDetails />;
            case "security":
                return <SecurityAndPrivacy />;
            case "notifications":
                return <h1>Notifications</h1>;
            case "account":
                return <AccountManagement user={user} />;
            default:
                return null;
        }
    };

    return (
        <Layout>
            <Sider theme="light" style={{ borderRight: "1px solid #ddd" }}>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    style={{ borderRight: "none" }}
                >
                    <Menu.Item key="personal" icon={<UserOutlined />}>
                        Personal Details
                    </Menu.Item>
                    <Menu.Item key="additional" icon={<InfoCircleOutlined />}>
                        Additional Details
                    </Menu.Item>
                    <Menu.Item key="security" icon={<LockOutlined />}>
                        {/* Security & Privacy */}
                        Change Password
                    </Menu.Item>
                    {/* <Menu.Item key="notifications" icon={<BellOutlined />}>
                        Notifications
                    </Menu.Item> */}
                    <Menu.Item key="account" icon={<SettingOutlined />}>
                        Account Management
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout style={{ backgroundColor: "#fff" }}>
                <Content style={{ margin: "0" }}>
                    <div
                        style={{
                            padding: "0 24px",
                            minHeight: 480,
                        }}
                    >
                        <Row
                            justify="center"
                            align="middle"
                            style={{
                                minHeight: "60vh",
                                backgroundColor: "#f0f2f5",
                                padding: "24px",
                            }}
                        >
                            <Col xs={22} sm={18} md={12} lg={20}>
                                <Card
                                    bordered={false}
                                    style={{
                                        borderRadius: "8px",
                                        padding: "24px",
                                        backgroundColor: "#ffffff",
                                        boxShadow:
                                            "0 2px 8px rgba(0, 0, 0, 0.15)",
                                    }}
                                >
                                    {renderContent()}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProfileDetails;
