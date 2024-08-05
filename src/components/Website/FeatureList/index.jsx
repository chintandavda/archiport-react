import React from "react";
import Slider from "react-slick";
import "./FeatureList.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import featureImage from "../../../assets/images/login-container.jpg"; // Example image path

const FeatureList = ({ slidesToShow, interval = 3000 }) => {
    const features = [
        {
            image: featureImage,
            title: "Design Inspirations",
            description: "Detail of feature 1",
        },
        {
            image: featureImage,
            title: "Feature 2",
            description: "Detail of feature 2",
        },
        {
            image: featureImage,
            title: "Feature 3",
            description: "Detail of feature 3",
        },
        {
            image: featureImage,
            title: "Feature 4",
            description: "Detail of feature 4",
        },
        {
            image: featureImage,
            title: "Feature 5",
            description: "Detail of feature 5",
        },
        {
            image: featureImage,
            title: "Feature 6",
            description: "Detail of feature 6",
        },
    ];

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        autoplay: true,
        autoplaySpeed: interval,
    };

    return (
        <Slider {...settings} className="feature-list">
            {features.map((feature, index) => (
                <div key={index} className="feature-item">
                    <img
                        src={feature.image}
                        alt={feature.title}
                        className="feature-image"
                    />
                    <div className="feature-content">
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-description">
                            {feature.description}
                        </p>
                    </div>
                </div>
            ))}
        </Slider>
    );
};

export default FeatureList;
