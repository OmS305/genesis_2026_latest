import React, { useState } from 'react';

const FrequentProblemsTable = ({ problems, isAdmin, onUpdateSolution, loading }) => {
  const [editingSubject, setEditingSubject] = useState(null);
  const [draftSolution, setDraftSolution] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startEditing = (problem) => {
    setEditingSubject(problem.subject);
    setDraftSolution(problem.solution || '');
    setError('');
  };

  const cancelEditing = () => {
    setEditingSubject(null);
    setDraftSolution('');
    setError('');
  };

  const handleSave = async () => {
    if (!editingSubject) return;
    try {
      setSaving(true);
      setError('');
      await onUpdateSolution(editingSubject, draftSolution);
      setEditingSubject(null);
      setDraftSolution('');
    } catch (e) {
      setError('Failed to save solution. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-dark-secondary rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Most Frequent Problems</h2>
          <p className="text-gray-400 text-xs mt-1">
            Common ticket subjects with suggested solutions. {isAdmin ? 'Admins can edit solutions.' : 'Use these solutions to try resolving your issue before raising a new ticket.'}
          </p>
        </div>
      </div>

      {loading && (
        <div className="text-gray-400 text-sm py-4">Loading frequent problems...</div>
      )}

      {!loading && problems.length === 0 && (
        <p className="text-gray-400 text-sm py-2">
          No frequent problems identified yet. They will appear here as tickets are created.
        </p>
      )}

      {!loading && problems.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-3 text-gray-400 font-medium w-16">#</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Problem (Subject)</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium w-24">Count</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Solution</th>
                {isAdmin && <th className="py-3 px-3 text-gray-400 font-medium w-28 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => {
                const isEditing = editingSubject === problem.subject;
                return (
                  <tr
                    key={problem.subject}
                    className={`border-b border-dark-border hover:bg-dark-border/30 transition ${
                      index % 2 === 0 ? 'bg-dark-bg' : 'bg-dark-secondary'
                    }`}
                  >
                    <td className="py-3 px-3 text-gray-400 text-xs">{index + 1}</td>
                    <td className="py-3 px-3 text-white text-sm max-w-xs">
                      <div className="truncate" title={problem.subject}>
                        {problem.subject}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-300 text-sm">{problem.count}</td>
                    <td className="py-3 px-3 text-gray-200 text-sm">
                      {isEditing && isAdmin ? (
                        <textarea
                          className="w-full bg-dark-bg border border-dark-border rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          rows={3}
                          value={draftSolution}
                          onChange={(e) => setDraftSolution(e.target.value)}
                          placeholder="Enter a clear, step-by-step solution for this problem"
                        />
                      ) : (
                        <div
                          className={`whitespace-pre-wrap ${
                            problem.solution ? 'text-gray-200' : 'text-gray-500 italic'
                          }`}
                        >
                          {problem.solution || 'No solution documented yet.'}
                        </div>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-3 text-right align-top">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-1 text-xs rounded bg-dark-bg text-gray-300 hover:bg-gray-800"
                              disabled={saving}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSave}
                              className="px-3 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                              disabled={saving}
                            >
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing(problem)}
                            className="px-3 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <div className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500 px-3 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default FrequentProblemsTable;


