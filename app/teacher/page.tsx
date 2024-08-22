"use client";

import React, { useState, useEffect } from 'react';

const TeacherDashboard = () => {
  // State variables for account creation and login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State variables for NFT collection creation
  const [collectionName, setCollectionName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // State to manage viewing collections
  const [collections, setCollections] = useState<{ id: number; name: string; description: string; imageUrl: string }[]>([]);

  // Handlers for account creation and login
  const handleRegister = async () => {
    console.log('Registering with:', { email, password });
    // Call API to register the user
  };

  const handleLogin = async () => {
    console.log('Logging in with:', { email, password });
    // Call API to log the user in
  };

  // Handler for NFT collection submission
  const handleSubmit = async () => {
    console.log('Submitting collection:', { collectionName, description, imageUrl });
    // Call API to submit the NFT collection
  };

  // Fetch NFT collections
  useEffect(() => {
    const fetchCollections = async () => {
      const response = await fetch('/api/collections');
      const data = await response.json();
      setCollections(data);
    };

    fetchCollections();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* Account Creation/Login Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Create Account / Login</h1>
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
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleRegister}
          >
            Register
          </button>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>

      {/* NFT Collection Creation Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Create NFT Collection</h1>
        <input
          className="w-full mb-4 p-2 border rounded"
          type="text"
          placeholder="Collection Name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
        <textarea
          className="w-full mb-4 p-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      {/* View Created NFT Collections Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">My NFT Collections</h1>
        <div className="space-y-4">
          {collections.map((collection) => (
            <div key={collection.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{collection.name}</h2>
              <p className="text-gray-700">{collection.description}</p>
              <img src={collection.imageUrl} alt={collection.name} className="w-32 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
