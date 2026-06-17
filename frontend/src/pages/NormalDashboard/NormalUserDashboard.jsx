import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';
import './NormalUserDashboard.css';

const NormalUserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitStatus, setSubmitStatus] = useState({ message: '', error: false });

    // Password Update State
    const [showPwdModal, setShowPwdModal] = useState(false);
    const [pwdData, setPwdData] = useState({ newPassword: '', confirmPassword: '' });
    const [pwdStatus, setPwdStatus] = useState({ message: '', error: false });

    // Address Update State
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressData, setAddressData] = useState('');
    const [addressStatus, setAddressStatus] = useState({ message: '', error: false });

    // Fetch stores whenever the search term changes
    useEffect(() => {
        fetchStores();
    }, [searchTerm]);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/stores', { params: { search: searchTerm } });
            setStores(data);
        } catch (error) {
            console.error("Error fetching stores:", error);
            setStores([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle Rating Submission
    const handleRateStore = async (storeId, ratingValue) => {
        try {
            await api.post('/ratings', { store_id: storeId, rating: ratingValue });
            setSubmitStatus({ message: 'Rating submitted successfully!', error: false });
            
            // Refresh data to show updated average ratings
            fetchStores(); 
            
            setTimeout(() => setSubmitStatus({ message: '', error: false }), 3000);
        } catch (error) {
            setSubmitStatus({ 
                message: error.response?.data?.message || 'Failed to submit rating', 
                error: true 
            });
            setTimeout(() => setSubmitStatus({ message: '', error: false }), 3000);
        }
    };

    // Handle Password Update
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPwdStatus({ message: '', error: false });

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
            await api.put('/auth/update-address', { address: addressData });
            setAddressStatus({ message: "Address updated successfully!", error: false });
            
            setTimeout(() => {
                setShowAddressModal(false);
                setAddressData('');
                setAddressStatus({ message: '', error: false });
            }, 2000);
        } catch (error) {
            setAddressStatus({ message: error.response?.data?.message || "Failed to update address.", error: true });
        }
    };

    return (
        <div className="normal-user-container space-y-6">
            {/* Header and Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800">Stores Directory</h1>
                
                <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or address..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-80 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-slate-50"
                    />
                    <button 
                        onClick={() => setShowAddressModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap shadow-sm"
                    >
                        Edit Address
                    </button>
                    <button 
                        onClick={() => setShowPwdModal(true)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-medium whitespace-nowrap shadow-sm"
                    >
                        Update Password
                    </button>
                </div>
            </div>

            {/* Notification Toast */}
            {submitStatus.message && (
                <div className={`p-4 rounded-lg shadow-sm font-medium ${submitStatus.error ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                    {submitStatus.message}
                </div>
            )}

            {/* Store Grid */}
            {loading ? (
                <div className="text-center py-10 text-slate-500 font-medium text-lg">Loading stores...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.length === 0 ? (
                        <div className="col-span-full text-center bg-white p-10 rounded-xl border border-slate-200 text-slate-500">
                            No stores found matching your search.
                        </div>
                    ) : (
                        stores.map(store => (
                            <div key={store.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col h-full">
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{store.name}</h3>
                                    <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2" title={store.address}>
                                        {store.address}
                                    </p>
                                </div>
                                
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                                    <span className="text-slate-600 font-medium">Overall Rating:</span>
                                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-md font-bold">
                                        {Number(store.overall_rating).toFixed(1)} ★
                                    </span>
                                </div>
                                
                                <div className="flex flex-col items-center gap-3 bg-slate-50 p-4 rounded-lg">
                                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                                        {store.user_rating ? 'Modify your rating' : 'Rate this store'}
                                    </span>
                                    <StarRating 
                                        initialRating={store.user_rating || 0} 
                                        onRate={(val) => handleRateStore(store.id, val)} 
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Update Password Modal */}
            {showPwdModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in duration-200">
                        <button 
                            onClick={() => {
                                setShowPwdModal(false);
                                setPwdStatus({ message: '', error: false });
                            }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-2xl font-bold leading-none"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-6 text-slate-800">Update Password</h2>
                        
                        {pwdStatus.message && (
                            <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${pwdStatus.error ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                {pwdStatus.message}
                            </div>
                        )}
                        
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                                <input type="password" required 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                    value={pwdData.newPassword} 
                                    onChange={(e) => setPwdData({...pwdData, newPassword: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                                <input type="password" required 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                    value={pwdData.confirmPassword} 
                                    onChange={(e) => setPwdData({...pwdData, confirmPassword: e.target.value})} 
                                />
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                    Must be 8-16 characters, with at least 1 uppercase letter and 1 special character.
                                </p>
                            </div>
                            
                            <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium mt-4 shadow-sm">
                                Save New Password
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in duration-200">
                        <button 
                            onClick={() => {
                                setShowAddressModal(false);
                                setAddressStatus({ message: '', error: false });
                            }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-2xl font-bold leading-none"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-6 text-slate-800">Edit Address</h2>
                        
                        {addressStatus.message && (
                            <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${addressStatus.error ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                {addressStatus.message}
                            </div>
                        )}
                        
                        <form onSubmit={handleUpdateAddress} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Address</label>
                                <textarea 
                                    required 
                                    rows="4"
                                    placeholder="Enter your address (Max 400 characters)"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition resize-none"
                                    value={addressData} 
                                    onChange={(e) => setAddressData(e.target.value)} 
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    {addressData.length}/400 characters
                                </p>
                            </div>
                            
                            <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium mt-4 shadow-sm">
                                Save Address
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NormalUserDashboard;