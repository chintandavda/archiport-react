import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./message.css";

const Message = ({ message, type }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (message) {
            setVisible(true);
        }
    }, [message]);

    if (!message || !visible) return null;

    let className = "";
    switch (type) {
        case "success":
            className = "message message-success";
            break;
        case "warning":
            className = "message message-warning";
            break;
        case "error":
            className = "message message-error";
            break;
        default:
            className = "message";
    }

    return (
        <div className={className}>
            <span>{message}</span>
            <button className="close-button" onClick={() => setVisible(false)}>
                &times;
            </button>
        </div>
    );
};

Message.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["success", "warning", "error"]),
};

Message.defaultProps = {
    type: "error",
};

export default Message;
