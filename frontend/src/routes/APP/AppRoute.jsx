import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home';
import Login from '../../pages/Login/Login';
import Signup from '../../pages/Signup/Signup';
import AdminDashboard from '../../pages/AdminDashboard/AdminDashboard';
import StoreOwnerDashboard from '../../pages/StoreDashboard/StoreOwnerDashboard';
import NormalUserDashboard from '../../pages/NormalDashboard/NormalUserDashboard';
import MainLayout from '../../Layout/MainLayout';
import ProtectedRoute from '../Protected/ProtectedRoute';
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