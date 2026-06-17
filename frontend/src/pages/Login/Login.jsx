import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', credentials);
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('user_role', data.role);
            localStorage.setItem('user_name', data.name);
            
            if (data.role === 'System Administrator') navigate('/admin');
            else if (data.role === 'Store Owner') navigate('/owner');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Login to Platform</h2>
                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email Address" required 
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-600"
                        onChange={(e) => setCredentials({...credentials, email: e.target.value})} />
                    
                    <input type="password" placeholder="Password" required 
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-600"
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
                    
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-slate-600">
                    Normal user? <Link to="/signup" className="text-blue-600 hover:underline">Sign up here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;