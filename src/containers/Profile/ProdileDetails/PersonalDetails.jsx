import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ProfileAPI from "../../../services/ProfileAPI";

const PersonalDetails = ({ user }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch profile details
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await ProfileAPI.getPersonalDetails(token);
                form.setFieldsValue({
                    ...response,
                    profile_image: null, // Reset file input
                });
            } catch (error) {
                message.error("Failed to fetch profile details.");
            }
        };

        fetchProfile();
    }, [form]);

    const handleSave = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            await ProfileAPI.updatePersonalDetails(token, values);
            message.success("Profile updated successfully.");
        } catch (error) {
            message.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
                profile_image: null,
            }}
        >
            <Form.Item name="profile_image" label="Profile Image">
                <Upload
                    listType="picture"
                    beforeUpload={() => false}
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>Upload</Button>
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

            <Form.Item name="about" label="About">
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Save
                </Button>
                <Button
                    style={{ marginLeft: "10px" }}
                    onClick={() => form.resetFields()}
                >
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
};

export default PersonalDetails;
