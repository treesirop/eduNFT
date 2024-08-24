"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const TeacherDashboard = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string }; // 使用类型断言
  const [collectionName, setCollectionName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [collections, setCollections] = useState<{ id: number; name: string; description: string; imageUrl: string }[]>([]);

  // Fetch collections for the teacher with the given ID
  useEffect(() => {
    if (id) {
      fetchCollections(id);
    } else {
      router.push('/teachers'); // Redirect to login page if teacher ID is not found
    }
  }, [id, router]);

  const fetchCollections = async (teacherId: string) => {
    try {
      const response = await fetch(`/api/collections?teacherId=${teacherId}`);
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId: id, collectionName, description, imageUrl }),
      });
      const data = await response.json();
      console.log('Collection submission response:', data);
      fetchCollections(id); // Refresh collections after submission
    } catch (error) {
      console.error('Error submitting collection:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
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