// src/components/CommonComponents/Logo/index.jsx

import React from "react";
import { FaDraftingCompass } from "react-icons/fa";
import PropTypes from "prop-types";
import "./Logo.css"; // Create this file for styling if needed

const Logo = ({ type }) => {
    const renderLogo = () => {
        switch (type) {
            case "primary":
                return <FaDraftingCompass className="logo-primary" />;
            case "secondary":
                return <FaDraftingCompass className="logo-secondary" />;
            case "primary-text":
                return (
                    <div className="logo-primary-text">
                        <FaDraftingCompass />
                        <span className="logo-text">ArchiPort</span>
                    </div>
                );
            case "secondary-text":
                return (
                    <div className="logo-secondary-text">
                        <FaDraftingCompass />
                        <span className="logo-text">ArchiPort</span>
                    </div>
                );
            default:
                return <FaDraftingCompass />;
        }
    };

    return <div className="logo-container">{renderLogo()}</div>;
};

Logo.propTypes = {
    type: PropTypes.oneOf([
        "primary",
        "secondary",
        "primary-text",
        "secondary-text",
    ]).isRequired,
};

export default Logo;
