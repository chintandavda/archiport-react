import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Skeleton, Card, notification, Row, Col } from "antd";
import ProfileAPI from "../../../services/ProfileAPI"; // Make sure to adjust the path
import { Container } from "@mui/material";
import AllDesigns from "../../../components/DesignComponents/GetDesignPosts";

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
                <Skeleton active avatar paragraph={{ rows: 4 }} />
            </Container>
        );
    }

    if (!profile) {
        return <p>No profile found.</p>;
    }

    return (
        <Container>
            <Row gutter={16}>
                {/* Left column - User Details */}
                <Col xs={24} md={8} lg={6}>
                    <Card>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Avatar size={128} src={profile.profile_image} />
                        </div>
                        <div style={{ marginLeft: "20px" }}>
                            <h2>{profile.full_name || profile.username}</h2>
                            <p>{profile.email}</p>
                            <p>{profile.designation}</p>
                        </div>
                        <p>
                            <strong>About:</strong>{" "}
                            {profile.about || "No about info"}
                        </p>
                        <p>
                            <strong>Location:</strong>{" "}
                            {`${profile.city}, ${profile.state}, ${profile.country}`}
                        </p>
                        <p>
                            <strong>LinkedIn:</strong>{" "}
                            <a
                                href={profile.linkedin_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Visit LinkedIn
                            </a>
                        </p>
                        <p>
                            <strong>Instagram:</strong>{" "}
                            <a
                                href={profile.instagram_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Visit Instagram
                            </a>
                        </p>
                        <p>
                            <strong>Website:</strong>{" "}
                            <a
                                href={profile.website_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Visit Website
                            </a>
                        </p>
                    </Card>
                </Col>

                {/* Right column - User's Design Posts */}
                <Col xs={24} md={16} lg={18}>
                    <Card>
                        <h2>
                            {profile.full_name || profile.username}'s Designs
                        </h2>
                        {/* Use the AllDesigns component to display the user's designs */}
                        <AllDesigns username={profile.username} />
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfilePage;
