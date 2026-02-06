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

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="text-left py-4 px-4 text-gray-400 font-medium">ID</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Email</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Subject</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Message</th>
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
              <td className="py-4 px-4 text-white">{ticket.email}</td>
              <td className="py-4 px-4 text-white">{ticket.subject}</td>
              <td className="py-4 px-4 text-gray-300 max-w-md truncate">
                {ticket.message}
              </td>
              <td className="py-4 px-4 text-gray-400 text-sm">
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
