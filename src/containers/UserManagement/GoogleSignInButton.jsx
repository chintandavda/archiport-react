import React, { useState } from "react";
import { Popover, Typography } from "@mui/material";
import { FcGoogle } from "react-icons/fc";

const GoogleSignInButton = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <div>
            <button className="google-signin-button" onClick={handleClick}>
                <FcGoogle size={24} />
                <span>Sign in with Google</span>
            </button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <Typography sx={{ p: 2 }}>Coming Soon</Typography>
            </Popover>
        </div>
    );
};

export default GoogleSignInButton;
