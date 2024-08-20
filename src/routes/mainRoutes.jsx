import React from "react";
import { Route } from "react-router-dom";
import Home from "../containers/Home/HomePage";
import Profile from "../containers/Profile/Profile";
import ProfilesPage from "../containers/Profile/ProfilesPage";
import UserProfilePage from "../containers/Profile/ProfilesPage/UserProfilePage";

const mainRoutes = [
    <Route key="home" path="/" element={<Home />} />,
    <Route key="profile" path="/profile" element={<Profile />} />,
    <Route path="/profiles" element={<ProfilesPage />} />,
    <Route path="/profile/:id" element={<UserProfilePage />} />,
];

export default mainRoutes;
