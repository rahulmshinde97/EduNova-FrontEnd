import React from 'react';
import { Link } from 'react-router-dom';

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold">My App</h2>
      <ul className="mt-6">
        <li className="my-2">
          <Link to="/" className="text-gray-300 hover:text-white">Dashboard</Link>
        </li>
        <li className="my-2">
          <Link to="/people" className="text-gray-300 hover:text-white">People Directory</Link>
        </li>
      </ul>
    </div>
  );
}

export function Navbar() {
  return (
    <div className="bg-white p-4 shadow-md">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
    </div>
  );
}