import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('user_role');
    const name = localStorage.getItem('user_name');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                <div className="text-xl font-bold text-blue-700">StoreRater</div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600">Welcome, {name} ({role})</span>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <main className="flex-grow p-6 sm:p-10 max-w-7xl mx-auto w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;