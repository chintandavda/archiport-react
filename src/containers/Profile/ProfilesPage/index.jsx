import React, { useState, useEffect, useContext, useCallback } from "react";
import {
    Avatar,
    Skeleton,
    message,
    Input,
    Row,
    Col,
    Layout,
    Card,
    Empty,
    Button,
} from "antd";
import ProfileAPI from "../../../services/ProfileAPI"; // Adjust the path accordingly
import { Link, useNavigate } from "react-router-dom";
import "./ProfilesPage.css"; // Create and import your CSS file for styling
import { Container } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";

const { Search } = Input;

const { Content } = Layout;

const ProfilesPage = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchProfiles = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const data = await ProfileAPI.getAllProfiles(token);
            setProfiles(data);
        } catch (error) {
            message.error(
                error.response?.data?.error || "Failed to load profiles.",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfiles();
        }
    }, [isAuthenticated, fetchProfiles]);

    const filteredProfiles = searchTerm
        ? profiles.filter(
              (profile) =>
                  profile.full_name
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  profile.username
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()),
          )
        : profiles; // Show all profiles when search term is empty

    if (!isAuthenticated) {
        return (
            <Container>
                <Content className="profiles-page-container">
                    <Empty description="Login to see user profiles">
                        <Button
                            type="primary"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </Button>
                    </Empty>
                </Content>
            </Container>
        );
    }

    return (
        <Container>
            <Content className="profiles-page-container">
                <Search
                    placeholder="Search profiles by name or username"
                    enterButton="Search"
                    size="large"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: "20px" }}
                />

                <Row gutter={[16, 16]}>
                    {filteredProfiles.length > 0 ? (
                        filteredProfiles.map((profile) => (
                            <Col xs={12} sm={12} md={8} lg={6} key={profile.id}>
                                <Card
                                    hoverable
                                    cover={
                                        <Avatar
                                            src={profile.profile_image}
                                            size={80}
                                            className="profile-avatar"
                                        />
                                    }
                                >
                                    <Card.Meta
                                        title={
                                            <Link to={`/profile/${profile.id}`}>
                                                {profile.full_name ||
                                                    profile.username}
                                            </Link>
                                        }
                                        description={
                                            profile.designation ||
                                            "No designation"
                                        }
                                    />
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <Skeleton loading={loading} active avatar />
                        </Col>
                    )}
                </Row>
            </Content>
        </Container>
    );
};

export default ProfilesPage;
