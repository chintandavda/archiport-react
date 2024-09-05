import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Skeleton, Card, notification, Row, Col, message } from "antd";
import ProfileAPI from "../../../services/ProfileAPI"; // Make sure to adjust the path
import { Container } from "@mui/material";
import AllDesigns from "../../../components/DesignComponents/GetDesignPosts";
import {
    LinkedinOutlined,
    InstagramOutlined,
    GlobalOutlined,
} from "@ant-design/icons";

const UserProfilePage = () => {
    const { id } = useParams(); // Get the user ID from the URL
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("access_token");
                const data = await ProfileAPI.getProfileById(id, token); // Fetch user profile by ID
                setProfile(data);
            } catch (error) {
                notification.error({
                    message: "Error",
                    description:
                        error.response?.data?.error ||
                        "Failed to load profile.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [id]);

    if (loading) {
        return (
            <Container>
                <Row gutter={16}>
                    {/* Section 1 */}
                    <Col xs={24} md={8} lg={6}>
                        <Skeleton active avatar paragraph={{ rows: 4 }} />
                    </Col>

                    {/* Section 2 */}
                    <Col xs={24} md={16} lg={18}>
                        <div style={{ width: "100%", height: "100%" }}>
                            <Skeleton active />
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (!profile) {
        return <p>No profile found.</p>;
    }

    const handleNoLinkClick = (platform) => {
        message.info(`No ${platform} linked`, 2); // Duration is set to 2 seconds
    };

    return (
        <Container>
            <Row gutter={16}>
                {/* Left column - User Details */}
                <Col xs={24} md={8} lg={6}>
                    <Card className="friends-profile">
                        <div>
                            <Avatar size={128} src={profile.profile_image} />
                        </div>
                        <h2 className="text-capitalize">
                            {profile.full_name || profile.username}
                        </h2>
                        <span>{profile.email}</span>
                        {profile.designation && (
                            <span>{profile.designation}</span>
                        )}
                        {profile.about && (
                            <span>
                                <strong>About:</strong> {profile.about}
                            </span>
                        )}

                        {(profile.city || profile.state || profile.country) && (
                            <p>
                                <strong>Location:</strong>{" "}
                                {[profile.city, profile.state, profile.country]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>
                        )}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <p>
                                {profile.linkedin_url ? (
                                    <a
                                        href={profile.linkedin_url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <LinkedinOutlined
                                            style={{ fontSize: "24px" }}
                                        />
                                    </a>
                                ) : (
                                    <span
                                        onClick={() =>
                                            handleNoLinkClick("LinkedIn")
                                        }
                                    >
                                        <LinkedinOutlined
                                            style={{
                                                fontSize: "24px",
                                                cursor: "pointer",
                                            }}
                                        />
                                    </span>
                                )}
                            </p>
                            <p>
                                {profile.instagram_url ? (
                                    <a
                                        href={profile.instagram_url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <InstagramOutlined
                                            style={{ fontSize: "24px" }}
                                        />
                                    </a>
                                ) : (
                                    <span
                                        onClick={() =>
                                            handleNoLinkClick("Instagram")
                                        }
                                    >
                                        <InstagramOutlined
                                            style={{
                                                fontSize: "24px",
                                                cursor: "pointer",
                                            }}
                                        />
                                    </span>
                                )}
                            </p>
                            <p>
                                {profile.website_url ? (
                                    <a
                                        href={profile.website_url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <GlobalOutlined
                                            style={{ fontSize: "24px" }}
                                        />
                                    </a>
                                ) : (
                                    <span
                                        onClick={() =>
                                            handleNoLinkClick("Website")
                                        }
                                    >
                                        <GlobalOutlined
                                            style={{
                                                fontSize: "24px",
                                                cursor: "pointer",
                                            }}
                                        />{" "}
                                    </span>
                                )}
                            </p>
                        </div>
                    </Card>
                </Col>

                {/* Right column - User's Design Posts */}
                <Col xs={24} md={16} lg={18} className="friend-design-div">
                    <h2
                        style={{
                            fontFamily: "'Dancing Script', cursive",
                            textAlign: "center",
                            textTransform: "capitalize",
                        }}
                    >
                        {profile.full_name || profile.username}'s Designs
                    </h2>
                    {/* Use the AllDesigns component to display the user's designs */}
                    <AllDesigns username={profile.username} />
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfilePage;
