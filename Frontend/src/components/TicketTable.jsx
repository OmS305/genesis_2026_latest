import React from 'react';

const TicketTable = ({ tickets }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-400 bg-red-400/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'low':
        return 'text-green-400 bg-green-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'text-blue-400 bg-blue-400/10';
      case 'in progress':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'closed':
        return 'text-green-400 bg-green-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="text-left py-4 px-4 text-gray-400 font-medium">ID</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">User</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Email</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Subject</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Category</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Priority</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Source</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr
              key={ticket._id}
              className={`border-b border-dark-border hover:bg-dark-border/30 transition ${
                index % 2 === 0 ? 'bg-dark-bg' : 'bg-dark-secondary'
              }`}
            >
              <td className="py-4 px-4 text-gray-300 text-sm font-mono">
                {ticket._id.slice(-6)}
              </td>
              <td className="py-4 px-4 text-white">{ticket.user_name || '-'}</td>
              <td className="py-4 px-4 text-gray-300">{ticket.email}</td>
              <td className="py-4 px-4 text-white max-w-xs truncate">{ticket.subject}</td>
              <td className="py-4 px-4 text-gray-300">{ticket.category || '-'}</td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority || '-'}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status || '-'}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-300">{ticket.source || '-'}</td>
              <td className="py-4 px-4 text-gray-400 text-sm whitespace-nowrap">
                {formatDate(ticket.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
