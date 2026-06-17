import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
//import './ProtectedRoute.css';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('jwt_token');
    const userRole = localStorage.getItem('user_role');

    if (!token) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/login" replace />; // Or an unauthorized page
    }

    return <Outlet />;
};

export default ProtectedRoute;