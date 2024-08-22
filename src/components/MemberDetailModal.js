import React from 'react';

export default function MemberDetailsModal({ isOpen, onClose, person }) {
  if (!isOpen || !person) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg w-[600px] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 text-lg">
          ✘
        </button>
        <div className="flex items-center space-x-8">
          <img
            src={person.profilePhoto || 'https://via.placeholder.com/150'}
            alt={person.name || 'No Name'}
            className="w-32 h-32 rounded-full object-cover border-4 border-sky-300"
          />
          <div className="flex-1">
            <div className="bg-sky-200 p-6 rounded-md shadow-sm">
              <h2 className="text-3xl font-semibold text-gray-800">{person.name || 'No Name'}</h2>
              <p className="text-xl text-gray-700">{person.role || 'No Role'}</p>
            </div>
            <div className="mt-8">
              <p className="text-lg text-gray-800"><strong>Email:</strong> {person.email || 'No Email'}</p>
              <p className="text-lg text-gray-800"><strong>Status:</strong> {person.status || 'No Status'}</p>
              <p className="text-lg text-gray-800"><strong>Teams:</strong> {person.teams ? person.teams.join(', ') : 'No Teams'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
