import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import AdminDashboard from '../pages/AdminDashboard';
import StoreOwnerDashboard from '../pages/StoreOwnerDashboard';
import NormalUserDashboard from '../pages/NormalUserDashboard';
import MainLayout from '../layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import './AppRoutes.css';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Layout Wrapper for Protected Routes */}
            <Route element={<MainLayout />}>
                <Route element={<ProtectedRoute allowedRoles={['System Administrator']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['Store Owner']} />}>
                    <Route path="/owner" element={<StoreOwnerDashboard />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['Normal User']} />}>
                    <Route path="/dashboard" element={<NormalUserDashboard />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;