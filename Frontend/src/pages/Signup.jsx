import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      setLoading(false);
      return;
    }

    const result = await signup(formData);
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-dark-secondary rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">
            Create Account
          </h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
