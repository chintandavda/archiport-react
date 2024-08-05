import React from "react";
import { TextField } from "@mui/material";

const CustomTextField = ({ ...props }) => {
    return (
        <TextField
            margin="normal"
            required
            fullWidth
            variant="outlined"
            {...props}
        />
    );
};

export default CustomTextField;
