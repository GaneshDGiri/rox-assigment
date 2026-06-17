import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import './StoreOwnerDashboard.css';

const StoreOwnerDashboard = () => {
    const [dashboardData, setDashboardData] = useState({ average_rating: 0, ratings: [] });
    const [loading, setLoading] = useState(true);

    // Password Update State
    const [showPwdModal, setShowPwdModal] = useState(false);
    const [pwdData, setPwdData] = useState({ newPassword: '', confirmPassword: '' });
    const [pwdStatus, setPwdStatus] = useState({ message: '', error: false });

    // Address Update State
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressData, setAddressData] = useState('');
    const [addressStatus, setAddressStatus] = useState({ message: '', error: false });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/ratings/owner-dashboard');
                setDashboardData(data);
            } catch (error) {
                console.error("Error fetching store owner dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPwdStatus({ message: '', error: false });

        // Validations
        if (pwdData.newPassword !== pwdData.confirmPassword) {
            return setPwdStatus({ message: "Passwords do not match.", error: true });
        }
        
        const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        if (!pwdRegex.test(pwdData.newPassword)) {
            return setPwdStatus({ message: "Password must be 8-16 chars, with 1 uppercase and 1 special character.", error: true });
        }

        try {
            await api.put('/auth/update-password', { newPassword: pwdData.newPassword });
            setPwdStatus({ message: "Password updated successfully!", error: false });
            
            // Clear form and close modal after success
            setTimeout(() => {
                setShowPwdModal(false);
                setPwdData({ newPassword: '', confirmPassword: '' });
                setPwdStatus({ message: '', error: false });
            }, 2000);
        } catch (error) {
            setPwdStatus({ message: error.response?.data?.message || "Failed to update password.", error: true });
        }
    };

    // Handle Address Update
    const handleUpdateAddress = async (e) => {
        e.preventDefault();
        setAddressStatus({ message: '', error: false });

        if (!addressData || addressData.length > 400) {
            return setAddressStatus({ message: "Address is required and must not exceed 400 characters.", error: true });
        }

        try {
            await api.put('/stores/update-address', { address: addressData });
            setAddressStatus({ message: "Store address updated successfully!", error: false });
            
            setTimeout(() => {
                setShowAddressModal(false);
                setAddressData('');
                setAddressStatus({ message: '', error: false });
            }, 2000);
        } catch (error) {
            setAddressStatus({ message: error.response?.data?.message || "Failed to update address.", error: true });
        }
    };

    if (loading) return <div className="text-center mt-10">Loading dashboard...</div>;

    return (
        <div className="store-owner-container space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Store Dashboard</h1>
                    <p className="text-slate-500">See what users are saying about your store.</p>
                </div>
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setShowAddressModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium text-sm"
                    >
                        Edit Address
                    </button>
                    <button 
                        onClick={() => setShowPwdModal(true)}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition font-medium text-sm"
                    >
                        Change Password
                    </button>
                    <div className="text-right border-l border-slate-200 pl-6">
                        <p className="text-sm font-semibold text-slate-500 uppercase">Average Rating</p>
                        <p className="text-4xl font-bold text-amber-500">{dashboardData.average_rating} <span className="text-2xl">★</span></p>
                    </div>
                </div>
            </div>

            {/* Ratings Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-800">Recent Ratings</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                                <th className="p-4 font-medium">User Name</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Rating Given</th>
                                <th className="p-4 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.ratings.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-slate-500">No ratings submitted yet.</td>
                                </tr>
                            ) : (
                                dashboardData.ratings.map((rating, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="p-4 text-slate-800 font-medium">{rating.name}</td>
                                        <td className="p-4 text-slate-600">{rating.email}</td>
                                        <td className="p-4">
                                            <span className="bg-amber-100 text-amber-700 py-1 px-3 rounded-full font-bold text-sm">
                                                {rating.rating} ★
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm">
                                            {new Date(rating.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Password Modal */}
            {showPwdModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative">
                        <button 
                            onClick={() => {
                                setShowPwdModal(false);
                                setPwdStatus({ message: '', error: false });
                            }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-xl font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Update Password</h2>
                        
                        {pwdStatus.message && (
                            <div className={`p-3 rounded mb-4 text-sm ${pwdStatus.error ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                                {pwdStatus.message}
                            </div>
                        )}
                        
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                <input type="password" required 
                                    className="w-full px-3 py-2 border rounded focus:border-primary outline-none"
                                    value={pwdData.newPassword} 
                                    onChange={(e) => setPwdData({...pwdData, newPassword: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                <input type="password" required 
                                    className="w-full px-3 py-2 border rounded focus:border-primary outline-none"
                                    value={pwdData.confirmPassword} 
                                    onChange={(e) => setPwdData({...pwdData, confirmPassword: e.target.value})} 
                                />
                                <p className="text-xs text-slate-500 mt-2">Must be 8-16 characters, with at least 1 uppercase letter and 1 special character.</p>
                            </div>
                            
                            <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition font-medium mt-2">
                                Save New Password
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative">
                        <button 
                            onClick={() => {
                                setShowAddressModal(false);
                                setAddressStatus({ message: '', error: false });
                            }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-xl font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Edit Store Address</h2>
                        
                        {addressStatus.message && (
                            <div className={`p-3 rounded mb-4 text-sm ${addressStatus.error ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                                {addressStatus.message}
                            </div>
                        )}
                        
                        <form onSubmit={handleUpdateAddress} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Address</label>
                                <textarea 
                                    required 
                                    rows="4"
                                    placeholder="Enter your store address (Max 400 characters)"
                                    className="w-full px-3 py-2 border rounded focus:border-primary outline-none resize-none"
                                    value={addressData} 
                                    onChange={(e) => setAddressData(e.target.value)} 
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    {addressData.length}/400 characters
                                </p>
                            </div>
                            
                            <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition font-medium mt-2">
                                Save Address
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreOwnerDashboard;