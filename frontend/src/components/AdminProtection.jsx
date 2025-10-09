import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminProtection({ children }) {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.email !== "0971shariq@gmail.com") {
        return <Navigate to="/" replace />;
    }

    return children;
}
