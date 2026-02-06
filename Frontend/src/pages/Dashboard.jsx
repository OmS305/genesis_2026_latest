import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getTickets,
  getTicketAnalytics,
  getFrequentProblems,
  updateProblemSolution
} from '../services/api';
import TicketTable from '../components/TicketTable';
import TicketAnalytics from '../components/TicketAnalytics';
import FrequentProblemsTable from '../components/FrequentProblemsTable';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthError = (err) => {
    if (err.response?.status === 401) {
      logout();
      navigate('/login');
    } else {
      setError('Failed to fetch data');
    }
  };

  const fetchAllData = async () => {
    setError('');
    await Promise.all([fetchTickets(), fetchAnalytics(), fetchProblems()]);
  };

  const fetchTickets = async () => {
    try {
      setTicketsLoading(true);
      const data = await getTickets();
      setTickets(data.tickets || []);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setTicketsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const data = await getTicketAnalytics();
      setAnalytics(data.analytics || null);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchProblems = async () => {
    try {
      setProblemsLoading(true);
      const data = await getFrequentProblems();
      setProblems(data.problems || []);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setProblemsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateSolution = async (subject, solution) => {
    const response = await updateProblemSolution(subject, solution);
    const updated = response.problem;

    setProblems((prev) =>
      prev.map((p) =>
        p.subject === updated.subject
          ? { ...p, solution: updated.solution }
          : p
      )
    );
  };

  const isLoadingAnything = ticketsLoading || analyticsLoading || problemsLoading;

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
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Global error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Analytics section (visible for both admin and user) */}
        {analyticsLoading ? (
          <div className="bg-dark-secondary rounded-lg p-6">
            <p className="text-gray-400 text-sm">Loading analytics...</p>
          </div>
        ) : (
          <TicketAnalytics analytics={analytics} role={user?.role} />
        )}

        {/* Frequent problems & solutions section */}
        <FrequentProblemsTable
          problems={problems}
          isAdmin={user?.role === 'admin'}
          onUpdateSolution={handleUpdateSolution}
          loading={problemsLoading}
        />

        {/* Tickets table section */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Tickets</h2>
            {isLoadingAnything && (
              <span className="text-xs text-gray-400">Refreshing data…</span>
            )}
          </div>

          {ticketsLoading && (
            <div className="bg-dark-secondary rounded-lg p-8 text-center">
              <p className="text-gray-300">Loading tickets...</p>
            </div>
          )}

          {!ticketsLoading && tickets.length === 0 && (
            <div className="bg-dark-secondary rounded-lg p-12 text-center">
              <p className="text-gray-400 text-lg">No tickets found</p>
              <p className="text-gray-500 text-sm mt-2">
                {user?.role === 'admin'
                  ? 'There are no tickets in the system yet.'
                  : 'You have no tickets associated with your email.'}
              </p>
            </div>
          )}

          {!ticketsLoading && tickets.length > 0 && (
            <div className="bg-dark-secondary rounded-lg overflow-hidden">
              <TicketTable tickets={tickets} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
