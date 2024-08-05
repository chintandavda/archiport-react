import React, { useState } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import CustomTextField from "../CommonComponents/CustomTextField";
import DesignPostAPI from "../../services/DesignPostAPI";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const CreatePostModal = ({ isOpen, onRequestClose }) => {
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("image", file);
        formData.append("location", "default location"); // Default value for location

        try {
            await DesignPostAPI.createDesign(formData);
            onRequestClose(); // Close the modal on success
        } catch (error) {
            console.error("Error creating design post:", error);
        }
    };

    return (
        <Modal open={isOpen} onClose={onRequestClose}>
            <Box sx={style}>
                <h3>Create Design Post</h3>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 2 }}
                >
                    <CustomTextField
                        id="caption"
                        label="Caption"
                        name="caption"
                        autoComplete="caption"
                        multiline
                        rows={1}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        required
                    />
                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="raised-button-file">
                        <Button
                            variant="contained"
                            component="span"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Upload Image
                        </Button>
                    </label>
                    {file && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {file.name}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onRequestClose}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreatePostModal;
