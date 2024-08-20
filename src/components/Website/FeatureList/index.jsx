import React from "react";
import { Carousel } from "antd";
import "./FeatureList.css";
import designInspiration from "../../../assets/images/FeatureList/designInspiration.png";
import connectWithArchitect from "../../../assets/images/FeatureList/connectWithArchitect.png";
import sellContent from "../../../assets/images/FeatureList/sellContent.png";
import portfolio from "../../../assets/images/FeatureList/portfolio.png";
import uploadDesign from "../../../assets/images/FeatureList/uploadDesign.png";

const FeatureList = ({ slidesToShow, interval = 3000 }) => {
    const features = [
        {
            image: designInspiration,
            title: "Design Inspirations",
            description:
                "Explore a wide range of design inspirations from top architects and designers worldwide.",
        },
        {
            image: uploadDesign,
            title: "Upload Designs",
            description:
                "Share your creative ideas by uploading your own designs and showcase your unique talent.",
        },
        {
            image: connectWithArchitect,
            title: "Connect With Architects",
            description:
                "Build connections with leading architects and collaborate on exciting projects okay done with this.",
        },
        {
            image: sellContent,
            title: "Sell Your Content",
            description:
                "Monetize your design skills by selling your creative content to a global audience.",
        },
        {
            image: portfolio,
            title: "Make Portfolio",
            description:
                "Create a professional portfolio to exhibit your work and attract potential clients and employers.",
        },
    ];

    return (
        <Carousel
            autoplay
            autoplaySpeed={interval}
            dots={false}
            vertical
            slidesToShow={slidesToShow}
            className="feature-list"
        >
            {features.map((feature, index) => (
                <div key={index} className="feature-item">
                    <img
                        src={feature.image}
                        alt={feature.title}
                        className="feature-image"
                    />
                    <div className="feature-content">
                        <h4 className="feature-title">{feature.title}</h4>
                        <p className="feature-description">
                            {feature.description}
                        </p>
                    </div>
                </div>
            ))}
        </Carousel>
    );
};

export default FeatureList;
