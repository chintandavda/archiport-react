import React from "react";
import { Route } from "react-router-dom";
import Home from "../containers/Home/HomePage";
import Profile from "../containers/Profile/Profile";

const mainRoutes = [
    <Route key="home" path="/" element={<Home />} />,
    <Route key="profile" path="/profile" element={<Profile />} />,
];

export default mainRoutes;
