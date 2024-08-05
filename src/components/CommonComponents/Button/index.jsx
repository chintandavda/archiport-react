import React from "react";
import "./Button.css";
import { Link } from "react-router-dom";

const Button = ({
    onClick,
    children,
    type = "button",
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    to,
}) => {
    const classNames = `custom-button ${variant} ${size} ${className}`;
    if (to) {
        return (
            <Link to={to} className={classNames} onClick={onClick}>
                {children}
            </Link>
        );
    }
    return (
        <button
            type={type}
            className={classNames}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
