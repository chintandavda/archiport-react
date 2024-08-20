import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Upload, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import DesignPostAPI from "../../services/DesignPostAPI";
import imageCompression from "browser-image-compression";
import { useDesigns } from "../../context/DesignContext";

const { TextArea } = Input;
const { Dragger } = Upload;

const CreatePostModal = ({ isOpen, onRequestClose }) => {
    const { refreshDesigns } = useDesigns();
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCaption("");
        setFile(null);
        setPreview(null);
        setLoading(false);
    }, [isOpen]);

    const handleFileChange = async (info) => {
        let selectedFile = info.file.originFileObj || info.file;
        console.log(
            "Original file size:",
            selectedFile.size / 1024 / 1024,
            "MB",
        );

        // If the file is larger than 3MB, compress it
        if (selectedFile.size > 2 * 1024 * 1024) {
            try {
                const options = {
                    maxSizeMB: 2, // Max size is 3MB
                    maxWidthOrHeight: 1920, // You can set the maximum width or height
                    useWebWorker: true, // Enable web workers for faster compression
                };
                const compressedBlob = await imageCompression(
                    selectedFile,
                    options,
                );
                selectedFile = new File([compressedBlob], info.file.name, {
                    type: info.file.type,
                    lastModified: Date.now(),
                });
                notification.success({
                    message: "Image Compression Success",
                    description: "The image has been compressed successfully.",
                });
            } catch (error) {
                notification.error({
                    message: "Image Compression Error",
                    description: "An error occurred during image compression.",
                });
            }
        }

        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile); // This will now work correctly
    };

    const handleSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("image", file);
        formData.append("location", "default location"); // Default value for location

        try {
            await DesignPostAPI.createDesign(formData);
            onRequestClose(); // Close the modal on success
            refreshDesigns();
            notification.success({
                message: "Design Post Created",
                description: "Your design post has been created successfully.",
            });
        } catch (error) {
            notification.error({
                message: "Upload Error",
                description:
                    "An error occurred while creating the design post.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Create Design Post"
            visible={isOpen}
            onCancel={onRequestClose}
            footer={[
                <Button key="close" onClick={onRequestClose}>
                    Close
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    disabled={!caption || !file} // Disable if caption or file is missing
                    loading={loading}
                >
                    Post
                </Button>,
            ]}
        >
            <div style={{ marginBottom: "16px" }}>
                <label
                    htmlFor="caption"
                    style={{ display: "block", marginBottom: "8px" }}
                >
                    Enter Caption:
                </label>
                <TextArea
                    id="caption"
                    placeholder="Enter caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={1}
                />
            </div>

            {preview ? (
                <>
                    <div style={{ marginBottom: 16 }}>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                width: "100%",
                                maxHeight: 300,
                                objectFit: "cover",
                            }}
                        />
                    </div>
                    <Upload
                        beforeUpload={() => false} // Prevent automatic upload
                        onChange={handleFileChange}
                        showUploadList={false} // Hide the default file list
                    >
                        <Button icon={<UploadOutlined />}>Change Image</Button>
                    </Upload>
                </>
            ) : (
                <Dragger
                    beforeUpload={() => false} // Prevent automatic upload
                    onChange={handleFileChange}
                    showUploadList={false} // Hide the default file list
                    style={{ width: "100%", padding: 16 }}
                >
                    <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                        Support for a single upload of image files.
                    </p>
                </Dragger>
            )}
        </Modal>
    );
};

export default CreatePostModal;
