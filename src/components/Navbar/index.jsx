import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../CommonComponents/Logo";
import { Menu, Dropdown, Button as AntButton } from "antd";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import userImg from "../../assets/images/user.jpg";
import {
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import CreatePostModal from "../DesignComponents/CreatePostModal";
import { RiImageAddFill } from "react-icons/ri";
import { LoginOutlined } from "@mui/icons-material";
import { AiOutlineUserAdd } from "react-icons/ai";
import { LuUsers } from "react-icons/lu";
import { HiOutlineHome } from "react-icons/hi2";

const NavigationBar = () => {
    const { isAuthenticated, user, logout, setLoading } =
        useContext(AuthContext);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setLoading(false);
        navigate("/");
    };

    const menu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/profile">My Profile</Link>
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
                <Link to="/profile?tab=settings">Settings</Link>
            </Menu.Item>
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
            <div className="navbar-brand">
                <Link to="/">
                    <Logo type="secondary-text" />
                </Link>
            </div>

            {/* Hamburger Menu Icon */}
            <button className="hamburger" onClick={toggleMenu}>
                <MenuOutlined />
            </button>

            <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
                <Link to="/">
                    <HiOutlineHome /> Home
                </Link>
                <Link to="/profiles">
                    <LuUsers /> Profiles
                </Link>
                {isAuthenticated ? (
                    <>
                        <AntButton
                            type="primary"
                            size="large"
                            onClick={openModal}
                        >
                            <RiImageAddFill /> Post Your Design
                        </AntButton>
                        <Dropdown overlay={menu} trigger={["hover"]}>
                            <AntButton
                                className="profile-button"
                                onClick={(e) => e.preventDefault()}
                                size="large"
                            >
                                <img
                                    src={user.profileImage || userImg}
                                    alt="Profile"
                                    className="profile-image"
                                />
                                <span className="text-capitalize">
                                    {user.fullName}
                                </span>
                                <DownOutlined />
                            </AntButton>
                        </Dropdown>
                    </>
                ) : (
                    <>
                        <Link to="/register">
                            <AiOutlineUserAdd /> Register
                        </Link>
                        <Link to="/login">
                            <AntButton
                                type="primary"
                                size="large"
                                className="login-button"
                            >
                                <LoginOutlined /> Login
                            </AntButton>
                        </Link>
                    </>
                )}
            </div>

            <CreatePostModal isOpen={isModalOpen} onRequestClose={closeModal} />
        </nav>
    );
};

export default NavigationBar;
