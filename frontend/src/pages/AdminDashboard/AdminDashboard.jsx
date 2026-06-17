import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    // State for dashboard stats and active view
    const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
    const [activeTab, setActiveTab] = useState('users'); // 'users' | 'stores'
    const [loading, setLoading] = useState(true);

    // State for data lists
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    // State for Add User Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
    const [formError, setFormError] = useState('');

    // State for Add Store Modal
    const [showAddStoreModal, setShowAddStoreModal] = useState(false);
    const [newStore, setNewStore] = useState({ owner_id: '', name: '', email: '', address: '' });
    const [storeFormError, setStoreFormError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, storesRes] = await Promise.all([
                api.get('/stores/dashboard-stats'),
                api.get('/users'),
                api.get('/stores')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setStores(storesRes.data);
        } catch (err) {
            console.error("Failed to fetch admin data", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Add User Logic ---
    const handleAddUser = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            await api.post('/auth/signup', newUser);
            setShowAddModal(false);
            setNewUser({ name: '', email: '', password: '', address: '', role: 'Normal User' });
            fetchDashboardData();
        } catch (error) {
            setFormError(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to add user');
        }
    };

    // --- Add Store Logic ---
    const handleAddStore = async (e) => {
        e.preventDefault();
        setStoreFormError('');
        if (!newStore.owner_id) {
            return setStoreFormError('Please select a Store Owner.');
        }
        try {
            await api.post('/stores', newStore);
            setShowAddStoreModal(false);
            setNewStore({ owner_id: '', name: '', email: '', address: '' });
            fetchDashboardData();
            setActiveTab('stores'); // Switch to stores tab to see the new store
        } catch (error) {
            setStoreFormError(error.response?.data?.message || 'Failed to add store');
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const filteredStores = stores.filter(store => {
        return store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               store.address.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Get only store owners for the dropdown
    const storeOwners = users.filter(user => user.role === 'Store Owner');

    if (loading) return <div className="text-center py-10">Loading administrator dashboard...</div>;

    return (
        <div className="admin-container space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <h1 className="text-3xl font-bold text-slate-800">System Administrator</h1>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        + Add User
                    </button>
                    <button 
                        onClick={() => setShowAddStoreModal(true)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
                    >
                        + Add Store
                    </button>
                </div>
            </div>
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm uppercase tracking-wider">Total Users</h3>
                    <p className="text-3xl font-bold text-primary mt-2">{stats.total_users}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm uppercase tracking-wider">Total Stores</h3>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.total_stores}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm uppercase tracking-wider">Total Ratings</h3>
                    <p className="text-3xl font-bold text-amber-500 mt-2">{stats.total_ratings}</p>
                </div>
            </div>

            {/* Management Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Tabs and Filters */}
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex space-x-2">
                        <button 
                            className={`px-4 py-2 rounded-md font-medium transition ${activeTab === 'users' ? 'bg-white shadow text-primary' : 'text-slate-600 hover:bg-slate-200'}`}
                            onClick={() => setActiveTab('users')}
                        >
                            Users Directory
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-md font-medium transition ${activeTab === 'stores' ? 'bg-white shadow text-primary' : 'text-slate-600 hover:bg-slate-200'}`}
                            onClick={() => setActiveTab('stores')}
                        >
                            Stores Directory
                        </button>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        {activeTab === 'users' && (
                            <select 
                                value={roleFilter} 
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-3 py-2 border rounded-md outline-none focus:border-primary bg-white text-sm"
                            >
                                <option value="All">All Roles</option>
                                <option value="System Administrator">Admin</option>
                                <option value="Normal User">Normal</option>
                                <option value="Store Owner">Store Owner</option>
                            </select>
                        )}
                        <input 
                            type="text" 
                            placeholder="Search Name, Email, Address..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-3 py-2 border rounded-md outline-none focus:border-primary text-sm w-full md:w-64"
                        />
                    </div>
                </div>

                {/* Tables */}
                <div className="overflow-x-auto">
                    {activeTab === 'users' ? (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium">Email</th>
                                    <th className="p-4 font-medium">Role</th>
                                    <th className="p-4 font-medium w-1/3">Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="p-4 text-slate-800 font-medium">
                                            {user.name}
                                            {user.role === 'Store Owner' && (
                                                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Owner</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-600">{user.email}</td>
                                        <td className="p-4 text-slate-600">
                                            <span className={`px-2 py-1 text-xs rounded-md font-medium ${
                                                user.role === 'System Administrator' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'Store Owner' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm truncate max-w-xs" title={user.address}>{user.address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                                    <th className="p-4 font-medium">Store Name</th>
                                    <th className="p-4 font-medium">Email</th>
                                    <th className="p-4 font-medium">Rating</th>
                                    <th className="p-4 font-medium w-1/3">Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStores.map(store => (
                                    <tr key={store.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="p-4 text-slate-800 font-medium">{store.name}</td>
                                        <td className="p-4 text-slate-600">{store.email}</td>
                                        <td className="p-4">
                                            <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded font-bold text-sm">
                                                {Number(store.overall_rating).toFixed(1)} ★
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm truncate max-w-xs" title={store.address}>{store.address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {((activeTab === 'users' && filteredUsers.length === 0) || (activeTab === 'stores' && filteredStores.length === 0)) && (
                        <div className="text-center py-8 text-slate-500">No records found matching your filters.</div>
                    )}
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
                        <button 
                            onClick={() => setShowAddModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-xl font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Add New User</h2>
                        
                        {formError && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{formError}</div>}
                        
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <input type="text" placeholder="Full Name (20-60 chars)" required 
                                className="w-full px-3 py-2 border rounded focus:border-primary outline-none"
                                value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
                            
                            <input type="email" placeholder="Email Address" required 
                                className="w-full px-3 py-2 border rounded focus:border-primary outline-none"
                                value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                            
                            <input type="password" placeholder="Password (8-16 chars, 1 Upper, 1 Special)" required 
                                className="w-full px-3 py-2 border rounded focus:border-primary outline-none"
                                value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                            
                            <select 
                                value={newUser.role}
                                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                className="w-full px-3 py-2 border rounded focus:border-primary outline-none bg-white text-slate-700"
                            >
                                <option value="Normal User">Normal User</option>
                                <option value="System Administrator">System Administrator</option>
                                <option value="Store Owner">Store Owner</option>
                            </select>

                            <textarea placeholder="Address (Max 400 chars)" required rows="2"
                                className="w-full px-3 py-2 border rounded focus:border-primary outline-none resize-none"
                                value={newUser.address} onChange={(e) => setNewUser({...newUser, address: e.target.value})} />
                            
                            <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition font-medium">
                                Create User
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Store Modal */}
            {showAddStoreModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
                        <button 
                            onClick={() => setShowAddStoreModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-xl font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Add New Store</h2>
                        
                        {storeFormError && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{storeFormError}</div>}
                        
                        <form onSubmit={handleAddStore} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Store Owner</label>
                                <select 
                                    required
                                    value={newStore.owner_id}
                                    onChange={(e) => setNewStore({...newStore, owner_id: e.target.value})}
                                    className="w-full px-3 py-2 border rounded focus:border-primary outline-none bg-white text-slate-700"
                                >
                                    <option value="" disabled>Select an Owner...</option>
                                    {storeOwners.map(owner => (
                                        <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
                                    ))}
                                </select>
                                {storeOwners.length === 0 && (
                                    <p className="text-xs text-red-500 mt-1">No Store Owners found. Create a Store Owner user first!</p>
                                )}
                            </div>

                            <input type="text" placeholder="Store Name" required 
                                className="w-full px-3 py-2 border rounded focus:border-primary outline-none"
                                value={newStore.name} onChange={(e) => setNewStore({...newStore, name: e.target.value})} />
                            
                            <input type="email" placeholder="Store Public Email" required 
                                className="w-full px-3 py-2 border rounded focus:border-primary outline-none"
                                value={newStore.email} onChange={(e) => setNewStore({...newStore, email: e.target.value})} />

                            <textarea placeholder="Store Physical Address" required rows="2"
                                className="w-full px-3 py-2 border rounded focus:border-primary outline-none resize-none"
                                value={newStore.address} onChange={(e) => setNewStore({...newStore, address: e.target.value})} />
                            
                            <button 
                                type="submit" 
                                disabled={storeOwners.length === 0}
                                className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition font-medium disabled:bg-slate-300"
                            >
                                Create Store
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;