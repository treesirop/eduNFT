"use client";

import React, { useState } from 'react';

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    // Implement login logic here
    console.log('Admin logging in with:', { email, password });
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
          <input
            className="w-full mb-4 p-2 border rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full mb-4 p-2 border rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Manage Users */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
        <p>View and manage user information, update profiles, or deactivate accounts.</p>
        {/* Add the logic or component for managing users here */}
      </div>

      {/* Manage Teachers */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Manage Teachers</h2>
        <p>View and manage teacher information, approve or reject teacher registrations.</p>
        {/* Add the logic or component for managing teachers here */}
      </div>

      {/* Review Applications */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Review NFT Collection Applications</h2>
        <p>Review and approve/reject NFT collection applications submitted by teachers.</p>
        {/* Add the logic or component for reviewing applications here */}
      </div>

      {/* Create Collection */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Create NFT Collection</h2>
        <p>Create NFT collections based on the provided information.</p>
        {/* Add the logic or component for creating collections here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
