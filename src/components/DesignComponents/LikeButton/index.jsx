import React, { useState, useEffect } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { notification } from "antd";
import "./LikeButton.css";
import DesignPostAPI from "../../../services/DesignPostAPI";

const LikeButton = ({
    designId,
    username,
    initialLikes = 0,
    initiallyLiked = false,
    onLike,
}) => {
    const [liked, setLiked] = useState(initiallyLiked);
    const [likeCount, setLikeCount] = useState(initialLikes);

    useEffect(() => {
        setLiked(initiallyLiked);
        setLikeCount(initialLikes);
    }, [initiallyLiked, initialLikes]);

    const handleLike = async () => {
        if (!username) {
            notification.error({
                message: "Login Required",
                description: "Please log in to like the post.",
            });
            return;
        }

        try {
            console.log(liked, username, designId);
            if (liked) {
                // Unlike the post
                await DesignPostAPI.unlikeDesign(designId, username); // Pass username instead of userId
                setLikeCount(likeCount - 1);
                notification.success({ message: "Unliked!" });
            } else {
                // Like the post
                await DesignPostAPI.likeDesign(designId, username); // Pass username instead of userId
                setLikeCount(likeCount + 1);
                notification.success({ message: "Liked!" });
            }
            setLiked(!liked);
            if (onLike) onLike(!liked); // Notify parent component if needed
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to update like status.",
            });
        }
    };

    return (
        <div className="like-button-container">
            <div className="like-button" onClick={handleLike}>
                {liked ? (
                    <HeartFilled style={{ color: "red" }} />
                ) : (
                    <HeartOutlined style={{ color: "black" }} />
                )}
            </div>
            <div className="like-count">{likeCount}</div>
        </div>
    );
};

export default LikeButton;
