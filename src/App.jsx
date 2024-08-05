import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import mainRoutes from "./routes/mainRoutes";
import authRoutes from "./routes/authRoutes";

function App() {
    const location = useLocation();
    const hideNavbarPaths = ["/login", "/register"];
    return (
        <div>
            {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
            <Routes>
                {mainRoutes}
                {authRoutes}
            </Routes>
        </div>
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
