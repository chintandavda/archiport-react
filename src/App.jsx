import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import mainRoutes from "./routes/mainRoutes";
import authRoutes from "./routes/authRoutes";
import { ConfigProvider } from "antd";

function App() {
    const location = useLocation();
    const hideNavbarPaths = ["/login", "/register"];
    const isAuthRoute = hideNavbarPaths.includes(location.pathname);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#dd6659",
                    colorPrimaryHover: "#c7665b",
                },
            }}
        >
            {!isAuthRoute && <Navbar />}
            <div className={`${isAuthRoute ? "" : "main-content"}`}>
                <Routes>
                    {mainRoutes}
                    {authRoutes}
                </Routes>
            </div>
        </ConfigProvider>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;
