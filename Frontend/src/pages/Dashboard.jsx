import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTickets } from '../services/api';
import TicketTable from '../components/TicketTable';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(data.tickets);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to fetch tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-secondary border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Ticket Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Welcome, {user?.name} ({user?.role})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-6">
          <div className="bg-dark-secondary rounded-lg p-6 inline-block">
            <p className="text-gray-400 text-sm">Total Tickets</p>
            <p className="text-3xl font-semibold text-white mt-1">
              {tickets.length}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-white text-xl">Loading tickets...</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && tickets.length === 0 && (
          <div className="bg-dark-secondary rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg">No tickets found</p>
            <p className="text-gray-500 text-sm mt-2">
              {user?.role === 'admin'
                ? 'There are no tickets in the system yet.'
                : 'You have no tickets associated with your email.'}
            </p>
          </div>
        )}

        {/* Tickets Table */}
        {!loading && tickets.length > 0 && (
          <div className="bg-dark-secondary rounded-lg overflow-hidden">
            <TicketTable tickets={tickets} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
