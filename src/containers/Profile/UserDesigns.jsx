// src/pages/Design/index.jsx
import React, { useEffect, useState } from "react";
import DesignPostAPI from "../../services/DesignPostAPI";
import CreatePostModal from "../../components/CreatePostModal";
import Button from "../../components/CommonComponents/Button";
import AllDesigns from "../../components/AllDesigns/GetDesigns";

const DesignPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="">
            <h1>My Designs</h1>
            <Button variant="primary-2" onClick={openModal}>
                Create Post
            </Button>
            <CreatePostModal isOpen={isModalOpen} onRequestClose={closeModal} />
            <AllDesigns />
        </div>
    );
};

export default DesignPage;
