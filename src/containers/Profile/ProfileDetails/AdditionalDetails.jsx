import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    Select,
    notification,
    Skeleton,
    Row,
    Col,
} from "antd";
import ProfileAPI from "../../../services/ProfileAPI";
import { InstagramOutlined, GlobalOutlined } from "@ant-design/icons";
import { FaLinkedinIn } from "react-icons/fa";

const { Option } = Select;

const AdditionalDetails = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);

    // Fetch additional details from backend
    useEffect(() => {
        const fetchAdditionalDetails = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const data = await ProfileAPI.getAdditionalDetails(token); // API call to fetch details
                setInitialData(data);
                form.setFieldsValue(data); // Pre-fill form
            } catch (error) {
                notification.error({
                    message: "Error",
                    description: "Failed to fetch additional details.",
                });
            } finally {
                setLoading(false); // Stop skeleton loading after fetching data
            }
        };

        fetchAdditionalDetails();
    }, [form]);

    const handleFormSubmit = async (values) => {
        setBtnLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            await ProfileAPI.updateAdditionalDetails(token, values); // API call to update details
            notification.success({
                message: "Success",
                description: "Details updated successfully.",
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to update details.",
            });
        } finally {
            setBtnLoading(false);
        }
    };

    if (loading) {
        return <Skeleton active paragraph={{ rows: 4 }} />; // Skeleton Loading
    }

    return (
        <>
            <h1
                style={{
                    fontFamily: "'Dancing Script', cursive",
                    textAlign: "center",
                }}
            >
                Additional Details
            </h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                initialValues={initialData}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        {/* Gender Field */}
                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[
                                {
                                    message: "Please select your gender!",
                                },
                            ]}
                        >
                            <Select placeholder="Select Gender">
                                <Option value="M">Male</Option>
                                <Option value="F">Female</Option>
                                <Option value="NB">Non-binary</Option>
                                <Option value="PNTS">Prefer not to say</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={16}>
                        {/* Address Fields */}
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[
                                {
                                    message: "Please enter your address!",
                                },
                            ]}
                        >
                            <Input placeholder="Enter your address" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="city"
                            label="City"
                            rules={[
                                {
                                    message: "Please enter your city!",
                                },
                            ]}
                        >
                            <Input placeholder="Enter your city" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="state"
                            label="State"
                            rules={[
                                {
                                    message: "Please enter your state!",
                                },
                            ]}
                        >
                            <Input placeholder="Enter your state" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="country"
                            label="Country"
                            rules={[
                                {
                                    message: "Please enter your country!",
                                },
                            ]}
                        >
                            <Input placeholder="Enter your country" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="linkedin_url"
                    label={
                        <span>
                            <FaLinkedinIn style={{ marginRight: 8 }} />
                            LinkedIn URL
                        </span>
                    }
                    rules={[
                        {
                            type: "url",
                            message: "Please enter a valid LinkedIn URL!",
                        },
                    ]}
                >
                    <Input placeholder="Enter LinkedIn profile URL" />
                </Form.Item>

                <Form.Item
                    name="instagram_url"
                    label={
                        <span>
                            <InstagramOutlined style={{ marginRight: 8 }} />
                            Instagram URL
                        </span>
                    }
                    rules={[
                        {
                            type: "url",
                            message: "Please enter a valid Instagram URL!",
                        },
                    ]}
                >
                    <Input placeholder="Enter Instagram profile URL" />
                </Form.Item>

                <Form.Item
                    name="website_url"
                    label={
                        <span>
                            <GlobalOutlined style={{ marginRight: 8 }} />
                            Website URL
                        </span>
                    }
                    rules={[
                        {
                            type: "url",
                            message: "Please enter a valid website URL!",
                        },
                    ]}
                >
                    <Input placeholder="Enter your website URL" />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={btnLoading}
                    >
                        Update Additional Details
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default AdditionalDetails;
