import React, { useContext, useState } from "react";
import { Drawer, Image, notification, Button, Popconfirm } from "antd";
import DesignPostAPI from "../../services/DesignPostAPI";
import { AuthContext } from "../../context/AuthContext";
import LikeButton from "./LikeButton";
import { DeleteOutlined } from "@ant-design/icons";

const DesignDrawer = ({
    isOpen,
    onClose,
    design,
    refreshDesigns,
    personalFeed,
}) => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    // const [updateLoading, setUpdateLoading] = useState(false);
    const { user: loggedInUser } = useContext(AuthContext);

    // const handleUpdate = async () => {
    //     setUpdateLoading(true);
    //     try {
    //         await DesignPostAPI.updateDesign(design._id);
    //         notification.success({
    //             message: "Success",
    //             description: "Post Updated successfully",
    //         });
    //         refreshDesigns();
    //     } catch (error) {
    //         notification.error({
    //             message: "Error",
    //             description: "Failed to update the post",
    //         });
    //     } finally {
    //         setUpdateLoading(false);
    //     }
    // };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await DesignPostAPI.deleteDesign(design._id);
            notification.success({
                message: "Success",
                description: "Post deleted successfully",
            });
            onClose(); // Close the drawer after successful deletion
            refreshDesigns(personalFeed);
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to delete the post",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title={design?.full_name || "Design Details"}
            placement="right"
            onClose={onClose}
            visible={isOpen}
            width={550}
        >
            {design && (
                <div>
                    <div className="post-card-details">
                        <img
                            src={design.userImage}
                            alt="Profile"
                            className="profile-image"
                        />
                        <h5>{design.fullName}</h5>
                    </div>
                    <p>{design.caption}</p>
                    <Image
                        src={`${design.image}`}
                        alt={design.caption}
                        width="100%"
                    />
                    <br />
                    <div className="post-card-actions">
                        <LikeButton
                            designId={design._id}
                            username={
                                loggedInUser ? loggedInUser.username : null
                            } // Pass null if not logged in
                            initialLikes={design.likeCount}
                            initiallyLiked={design.isLiked}
                        />
                        {user?.username === design.username ? (
                            <div>
                                {/* <Button
                                    onClick={handleUpdate}
                                    loading={updateLoading}
                                    style={{ marginRight: 16 }}
                                >
                                    Edit Post
                                </Button> */}
                                <Popconfirm
                                    title="Are you sure you want to delete this post?"
                                    onConfirm={handleDelete}
                                    okText="Yes"
                                    cancelText="No"
                                    okButtonProps={{ loading: loading }}
                                >
                                    <Button danger loading={loading}>
                                        <DeleteOutlined />
                                        Delete Post
                                    </Button>
                                </Popconfirm>
                            </div>
                        ) : (
                            <Button danger onClick={onClose}>
                                Close
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </Drawer>
    );
};

export default DesignDrawer;
