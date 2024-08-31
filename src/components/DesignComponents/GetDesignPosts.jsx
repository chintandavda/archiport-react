import React, { useEffect, useState, useContext } from "react";
import { Card, Skeleton, Button, Empty } from "antd";
import DesignDrawer from "./DesignDrawer";
import "./DesignComponents.css";
import Masonry from "react-masonry-css";
import userImg from "../../assets/images/user.jpg";
import LikeButton from "./LikeButton";
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import { AuthContext } from "../../context/AuthContext";
import { useDesigns } from "../../context/DesignContext";

const breakpointColumnsObj = {
    default: 4,
    1600: 3,
    1100: 2,
    700: 1,
};

const AllDesigns = ({ personalFeed, username }) => {
    const { user: loggedInUser } = useContext(AuthContext);
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { designs, refreshDesigns } = useDesigns();

    // const fetchDesigns = useCallback(async () => {
    //     setLoading(true); // Start loading
    //     try {
    //         let data;

    //         if (personalFeed) {
    //             // Fetch personal designs
    //             data = await DesignPostAPI.getMyDesigns();
    //         } else if (loggedInUser) {
    //             // Fetch designs visible to logged-in users
    //             data = await DesignPostAPI.getDesigns();
    //         } else {
    //             // Fetch public designs for unauthenticated users
    //             data = await DesignPostAPI.getPublicDesigns();
    //         }

    //         setdesigns(data); // Update local designs state
    //     } catch (error) {
    //         console.error("Error fetching designs:", error);
    //     } finally {
    //         setLoading(false); // Stop loading once data is fetched
    //     }
    // }, [personalFeed, loggedInUser]);

    useEffect(() => {
        setLoading(true);
        refreshDesigns(personalFeed, username).finally(() => setLoading(false)); // Refresh designs on component load
    }, [refreshDesigns, personalFeed, username]);

    const handleCardClick = (design) => {
        setSelectedDesign(design);
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setSelectedDesign(null);
    };

    return (
        <div>
            {loading ? (
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {/* Render skeletons while loading */}
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} style={{ width: "100%" }}>
                            <Card
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                }}
                            >
                                <Skeleton.Image
                                    className="custom-skeleton-image"
                                    active
                                />
                                <Card.Meta
                                    title={
                                        <Skeleton.Input
                                            active
                                            style={{ width: 250 }}
                                        />
                                    }
                                    description={
                                        <Skeleton.Input
                                            active
                                            style={{ width: 150 }}
                                        />
                                    }
                                />
                            </Card>
                        </div>
                    ))}
                </Masonry>
            ) : designs.length === 0 ? (
                <div className="no-data">
                    <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        imageStyle={{
                            height: 100,
                        }}
                        description={"No Designs Found"}
                    ></Empty>
                </div>
            ) : (
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {designs.map((design) => (
                        <div key={design._id}>
                            <Card
                                hoverable
                                className="custom-card"
                                cover={
                                    <img
                                        alt={design.caption}
                                        src={`${design.image}`}
                                        style={{
                                            width: "100%",
                                            objectFit: "cover",
                                            height: "auto",
                                        }}
                                    />
                                }
                            >
                                <p>{design.caption}</p>
                                <div className="post-card-details">
                                    <img
                                        src={design.userImage || userImg}
                                        alt="Profile"
                                        className="profile-image"
                                    />
                                    <h5>{design.fullName}</h5>
                                </div>
                                <div className="post-card-actions">
                                    <LikeButton
                                        designId={design._id}
                                        username={
                                            loggedInUser
                                                ? loggedInUser.username
                                                : null
                                        } // Pass null if not logged in
                                        initialLikes={design.likeCount}
                                        initiallyLiked={design.isLiked}
                                    />

                                    <Button
                                        type="default"
                                        onClick={() => handleCardClick(design)}
                                    >
                                        <HiMiniViewfinderCircle /> Open
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    ))}
                </Masonry>
            )}
            {/* Use the DesignDrawer component */}
            <DesignDrawer
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                design={selectedDesign}
                refreshDesigns={refreshDesigns}
                personalFeed={personalFeed}
            />
        </div>
    );
};

export default AllDesigns;
