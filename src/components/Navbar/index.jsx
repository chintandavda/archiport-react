import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { AuthContext } from "../../context/AuthContext";
import Button from "../CommonComponents/Button";
import Logo from "../CommonComponents/Logo";
import { Menu, Dropdown, Button as AntButton } from "antd";
import { DownOutlined } from "@ant-design/icons";
import userImg from "../../assets/images/user.jpg";
import {
    UserOutlined,
    // SettingOutlined,
    LogoutOutlined,
    HomeOutlined,
} from "@ant-design/icons";

const NavigationBar = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const menu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/profile">My Profile</Link>
            </Menu.Item>
            {/* <Menu.Item key="settings" icon={<SettingOutlined />}>
                <Link to="/settings">Settings</Link>
            </Menu.Item> */}
            <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
            >
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <div className="navbar-brand">
                    <Link to="/">
                        <Logo type="secondary-text" />
                    </Link>
                </div>
                <Link to="/">
                    <HomeOutlined /> Home
                </Link>
            </div>
            <div className="navbar-links">
                {isAuthenticated ? (
                    <Dropdown overlay={menu} trigger={["hover"]}>
                        <AntButton
                            type="default"
                            className="profile-button"
                            onClick={(e) => e.preventDefault()}
                            size="large"
                        >
                            <img
                                src={user.profileImage || userImg}
                                alt="Profile"
                                className="profile-image"
                            />
                            <span>{user.fullName}</span>
                            <DownOutlined />
                        </AntButton>
                    </Dropdown>
                ) : (
                    <>
                        <Link to="/register">Register</Link>
                        <Button
                            to="/login"
                            variant="primary"
                            size="md"
                            className="login-button"
                        >
                            Login
                        </Button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavigationBar;
