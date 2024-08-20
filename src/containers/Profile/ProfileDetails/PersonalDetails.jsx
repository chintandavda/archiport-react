import React, { useState, useEffect, useContext } from "react";
import {
    Form,
    Input,
    Button,
    Upload,
    notification,
    Row,
    Col,
    Skeleton,
    Modal,
    Slider,
    Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ProfileAPI from "../../../services/ProfileAPI";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import { AuthContext } from "../../../context/AuthContext";

const PersonalDetails = () => {
    const { user, setUser } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropping, setCropping] = useState(false);
    const [cropArea, setCropArea] = useState(null);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        // Fetch profile details
        const fetchProfile = async () => {
            setProfileLoading(true);
            try {
                const token = localStorage.getItem("access_token");
                const response = await ProfileAPI.getPersonalDetails(token);

                form.setFieldsValue({
                    ...response,
                });

                if (response.profile_image) {
                    setFileList([
                        {
                            uid: "-1",
                            name: "Profile Image",
                            status: "done",
                            url: response.profile_image, // URL of the image from the backend
                        },
                    ]);
                    setProfileImage(response.profile_image); // Set initial profile image
                }
            } catch (error) {
                notification.error({
                    message: "Error",
                    description: "Failed to fetch profile details.",
                });
            } finally {
                setProfileLoading(false); // Stop skeleton loading after fetching data
            }
        };

        fetchProfile();
    }, [form]);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCropArea(croppedAreaPixels);
    };

    const handleImageChange = (file) => {
        setProfileImage(URL.createObjectURL(file)); // Show image in cropper
        setCropping(true);
    };

    const confirmCrop = async () => {
        const croppedImg = await getCroppedImg(profileImage, cropArea);
        setCroppedImage(croppedImg);

        // Convert the cropped image (blob) to a File object
        const response = await fetch(croppedImg);
        const blob = await response.blob();
        const username = user.username || "user";
        const timestamp = new Date().getTime();
        const file = await new File([blob], `${username}_${timestamp}.jpg`, {
            type: "image/jpeg",
        });

        // Update the file list for Ant Design Upload
        setFileList([
            {
                uid: "-1",
                name: `${username}_${timestamp}.jpg`,
                status: "done",
                url: croppedImg,
                originFileObj: file,
            },
        ]);

        setProfileImage(file);

        setCropping(false);
    };

    useEffect(() => {
        if (profileImage) {
            console.log("Updated profileImage:", profileImage);
        }
    }, [profileImage]);

    const handleRemove = () => {
        setFileList([]); // Clear the file list
        setCroppedImage(null); // Clear the cropped image
    };

    const handleSave = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            console.log(profileImage);

            const formData = { ...values, profile_image: profileImage };
            await ProfileAPI.updatePersonalDetails(token, formData);
            notification.success({
                message: "Success",
                description: "Profile updated successfully.",
            });
            const userProfile = await ProfileAPI.getUserProfile(token);
            setUser({
                fullName: `${userProfile.first_name} ${userProfile.last_name}`,
                profileImage: userProfile.profile_image,
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to update profile.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (profileLoading) {
        return <Skeleton active paragraph={{ rows: 4 }} />;
    }

    return (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <h1
                style={{
                    fontFamily: "'Dancing Script', cursive",
                    textAlign: "center",
                }}
            >
                Personal Details
            </h1>

            <Form form={form} layout="vertical" onFinish={handleSave}>
                <Form.Item label="Profile Image">
                    <Upload
                        listType="picture"
                        fileList={fileList}
                        beforeUpload={(file) => {
                            handleImageChange(file); // Call the handleImageChange function
                            return false; // Prevent automatic upload
                        }}
                        onRemove={handleRemove}
                        maxCount={1}
                    >
                        {fileList.length < 1 && (
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        )}
                    </Upload>
                </Form.Item>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="email" label="Email">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="first_name" label="First Name">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="last_name" label="Last Name">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="mobile_number" label="Mobile Number">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="designation" label="Designation">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="about" label="Describe Yourself">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update Details
                    </Button>
                </Form.Item>
            </Form>

            <Modal
                visible={cropping}
                onCancel={() => setCropping(false)}
                onOk={confirmCrop}
                okText="Crop"
            >
                <div
                    style={{ position: "relative", width: "100%", height: 400 }}
                >
                    <Cropper
                        image={profileImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // Square crop
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(value) => setZoom(value)}
                />
            </Modal>
        </Space>
    );
};

export default PersonalDetails;
