import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import { AuthContext } from "../../context/AuthContext";
import ProfileDetails from "./ProdileDetails/ProfileDetails";
import UserDesign from "./UserDesigns";
import "./Profile.css";
import loadingGif from "../../assets/images/loading.gif";
import { Container } from "@mui/material";
import ProfileAPI from "../../services/ProfileAPI";
import { SettingOutlined, LayoutOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const Profile = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, loading } = useContext(AuthContext);
    const [fullName, setFullName] = useState("");
    const [profileData, setProfileData] = useState({});
    const [profileImage, setProfileImage] = useState("");

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                try {
                    const token = localStorage.getItem("access_token");
                    const data = await ProfileAPI.getUserProfile(token);
                    setFullName(`${data.first_name} ${data.last_name}`);
                    setProfileData(data);
                    setProfileImage(data.profile_image);
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                }
            }
        };

        fetchUserProfile();
    }, [user]);

    if (loading) {
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
                {/* <img className="background-img" src={profileImage} alt="User" /> */}
                <div className="profile-info">
                    <img className="user-img" src={profileImage} alt="User" />
                    <div className="profile-details">
                        <div>
                            <h2 className="user-name">{fullName}</h2>
                            <h4 className="user-designation">
                                {profileData.designation}
                            </h4>
                        </div>
                        <p className="about">{profileData.about}</p>
                    </div>
                </div>
            </div>
            <Tabs defaultActiveKey="1" size="large">
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
