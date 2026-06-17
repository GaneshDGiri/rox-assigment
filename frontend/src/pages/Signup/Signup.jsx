import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import './Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    
    // Ensure 'role' is included in the initial state so it gets sent to the backend
    const [formData, setFormData] = useState({
        name: '', 
        email: '', 
        password: '', 
        address: '',
        role: 'Normal User' // Default role
    });
    const [error, setError] = useState('');

    const validateForm = () => {
        if (formData.name.length < 20 || formData.name.length > 60) return "Name must be between 20 and 60 characters.";
        if (formData.address.length > 400) return "Address cannot exceed 400 characters.";
        
        const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        if (!pwdRegex.test(formData.password)) return "Password must be 8-16 chars, with 1 uppercase and 1 special character.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) return setError(validationError);

        try {
            await api.post('/auth/signup', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role Selection Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">I want to register as a:</label>
                        <select 
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary bg-white text-slate-700"
                        >
                            <option value="Normal User">Normal User</option>
                            <option value="Store Owner">Store Owner</option>
                        </select>
                    </div>

                    <input type="text" placeholder="Full Name (20-60 chars)" required 
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary"
                        onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    
                    <input type="email" placeholder="Email Address" required 
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary"
                        onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    
                    <input type="password" placeholder="Password (8-16 chars, 1 Upper, 1 Special)" required 
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary"
                        onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    
                    <textarea placeholder="Address (Max 400 chars)" required rows="3"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary resize-none"
                        onChange={(e) => setFormData({...formData, address: e.target.value})} />
                    
                    <button type="submit" className="w-full bg-primary text-white py-2 mt-2 rounded hover:bg-blue-700 transition">
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-slate-600">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;