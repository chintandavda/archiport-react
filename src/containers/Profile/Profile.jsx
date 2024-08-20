import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Skeleton } from "antd";
import { AuthContext } from "../../context/AuthContext";
import ProfileDetails from "./ProfileDetails/ProfileDetails";
import UserDesign from "./UserDesigns";
import "./Profile.css";
import loadingGif from "../../assets/images/loading.gif";
import { Container } from "@mui/material";
import ProfileAPI from "../../services/ProfileAPI";
import { SettingOutlined, LayoutOutlined } from "@ant-design/icons";
import userImg from "../../assets/images/user.jpg";

const { TabPane } = Tabs;

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        isAuthenticated,
        user,
        loading: authLoading,
    } = useContext(AuthContext);
    const [fullName, setFullName] = useState("");
    const [profileData, setProfileData] = useState({});
    const [profileLoading, setProfileLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("1");

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                setProfileLoading(true);
                try {
                    const token = localStorage.getItem("access_token");
                    const data = await ProfileAPI.getUserProfile(token);
                    setFullName(`${data.first_name} ${data.last_name}`);
                    setProfileData(data);
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                } finally {
                    setProfileLoading(false); // End loading
                }
            }
        };

        fetchUserProfile();
    }, [user]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const activeTabParam = queryParams.get("tab");

        if (activeTabParam === "settings") {
            setActiveTab("2");
        }
    }, [location.search]);

    if (authLoading) {
        return (
            <div className="loading-container">
                <img src={loadingGif} alt="Loading..." />
            </div>
        );
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="lg">
            <div className="profile-header">
                <div className="profile-info">
                    {profileLoading ? ( // Conditionally render loading spinner or profile info
                        <Skeleton
                            avatar={{ size: 200 }}
                            active
                            paragraph={{ rows: 2 }}
                        />
                    ) : (
                        <>
                            <img
                                className="user-img"
                                src={profileData.profile_image || userImg}
                                alt="User"
                            />
                            <div className="profile-details">
                                <div>
                                    <h2 className="user-name">{fullName}</h2>
                                    <h4 className="user-designation">
                                        {profileData.designation ||
                                            "Add your designation"}
                                    </h4>
                                </div>
                                <p className="about">
                                    {profileData.about ||
                                        "Write short description about yourself"}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                size="large"
                style={{ marginBottom: "40px" }}
            >
                <TabPane
                    tab={
                        <span>
                            <LayoutOutlined style={{ marginRight: 8 }} />
                            Designs
                        </span>
                    }
                    key="1"
                >
                    <UserDesign />
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <SettingOutlined style={{ marginRight: 8 }} />
                            Settings
                        </span>
                    }
                    key="2"
                >
                    <ProfileDetails user={user} />
                </TabPane>
            </Tabs>
        </Container>
    );
};

export default Profile;
