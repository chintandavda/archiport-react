import React from "react";
import { Route } from "react-router-dom";
import Login from "../containers/UserManagement/Login";
import Register from "../containers/UserManagement/Register";

const authRoutes = [
    <Route key="login" path="/login" element={<Login />} />,
    <Route key="register" path="/register" element={<Register />} />,
];

export default authRoutes;
