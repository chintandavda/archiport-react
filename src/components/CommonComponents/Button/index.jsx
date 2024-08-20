import React from "react";
import "./Button.css";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Button = ({
    onClick,
    children,
    type = "button",
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    to,
    loading = false,
}) => {
    const classNames = `custom-button ${variant} ${size} ${className}`;
    if (to) {
        return (
            <Link to={to} className="link" onClick={onClick}>
                {children}
            </Link>
        );
    }
    return (
        <button
            type={type}
            className={classNames}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading && (
                <Spin
                    size="medium"
                    indicator={<LoadingOutlined spin />}
                    style={{
                        marginRight: "8px",
                        color: "white",
                    }}
                />
            )}
            {children}
        </button>
    );
};

export default Button;
