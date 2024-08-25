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
import { Card, Row, Col, Layout, Menu, Drawer, Button } from "antd";

const { Sider, Content } = Layout;

const ProfileDetails = ({ user }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedKey, setSelectedKey] = useState("personal");

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
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
            {/* Sidebar */}
            <Sider
                theme="light"
                collapsed={collapsed}
                breakpoint="md"
                collapsedWidth={0}
                trigger={null} // Disable the default trigger
                style={{
                    borderRight: "1px solid #ddd",
                    display: window.innerWidth >= 768 ? "block" : "none",
                }}
            >
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
                        Change Password
                    </Menu.Item>
                    <Menu.Item key="account" icon={<SettingOutlined />}>
                        Account Management
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Drawer for mobile view */}
            <Drawer
                title="Menu"
                placement="left"
                onClose={toggleDrawer}
                visible={drawerVisible}
                bodyStyle={{ padding: 0 }}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={(key) => {
                        handleMenuClick(key);
                        toggleDrawer();
                    }}
                >
                    <Menu.Item key="personal" icon={<UserOutlined />}>
                        Personal Details
                    </Menu.Item>
                    <Menu.Item key="additional" icon={<InfoCircleOutlined />}>
                        Additional Details
                    </Menu.Item>
                    <Menu.Item key="security" icon={<LockOutlined />}>
                        Change Password
                    </Menu.Item>
                    <Menu.Item key="account" icon={<SettingOutlined />}>
                        Account Management
                    </Menu.Item>
                </Menu>
            </Drawer>

            {/* Main Content */}
            <Layout style={{ backgroundColor: "#fff" }}>
                <Content className="profile-settings-content">
                    <Row
                        justify="center"
                        align="middle"
                        className="profile-settings-row"
                    >
                        <Col xs={24} sm={18} md={16} lg={20}>
                            <Card
                                bordered={false}
                                className="profile-settings-card"
                            >
                                {renderContent()}
                            </Card>
                        </Col>
                    </Row>

                    {/* Mobile Menu Toggle Button */}
                    <Button
                        type="primary"
                        onClick={toggleDrawer}
                        className="mobile-menu-button"
                        style={{
                            display: "none",
                            position: "fixed",
                            bottom: "20px",
                            left: "20px",
                            zIndex: 1000,
                        }}
                    >
                        Menu
                    </Button>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProfileDetails;
