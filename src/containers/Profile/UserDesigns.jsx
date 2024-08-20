// src/pages/Design/index.jsx
import React, { useState } from "react";
import CreatePostModal from "../../components/DesignComponents/CreatePostModal";
import Button from "../../components/CommonComponents/Button";
import AllDesigns from "../../components/DesignComponents/GetDesignPosts";
import { Row, Col } from "antd";
import { RiImageAddFill } from "react-icons/ri";

const DesignPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <h1>My Designs</h1>
                </Col>
                <Col>
                    <Button variant="primary-2" size="md" onClick={openModal}>
                        <RiImageAddFill /> Create Post
                    </Button>
                </Col>
            </Row>
            <CreatePostModal isOpen={isModalOpen} onRequestClose={closeModal} />
            <AllDesigns personalFeed={true} />
        </>
    );
};

export default DesignPage;
