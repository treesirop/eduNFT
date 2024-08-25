"use client";

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [collections, setCollections] = useState<{ id: number; name: string; is_approved: boolean; contractAddress: string; }[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<{ id: number; name: string; is_approved: boolean; contractAddress: string; } | null>(null);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log(data);
      
      if (data[0].id) {
        setAdminId(data[0].id);
        setIsLoggedIn(true);
      } else {
        console.error('Login failed: ID not returned');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const fetchApply = async () => {
    try {
      // 获取nftcollections的信息，显示申请表
      const response = await fetch('/api/collections');
      const data = await response.json();
      if (Array.isArray(data)) {
        console.log(data);
        setCollections(data);
      } else {
        console.error('Data is not an array:', data);
        setCollections([]); // Set an empty array if data is not an array
      }
    } catch (error) {
      console.error('error handle apply in:', error);
    }
  };

  // Fetch collections 
  useEffect(() => {
    if (isLoggedIn) {
      fetchApply();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-4 text-center">Admin Login</h1>
          <input
            className="w-full mb-4 p-2 border rounded"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full mb-4 p-2 border rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const handleDeploy = (collection: { id: number; name: string; is_approved: boolean; contractAddress: string; }) => {
    setSelectedCollection(collection);
    // 根据id ,CourseName deploy

    // 捕获链上合约deploy事件，获取contractAddress

    // 将nftCollections表的数据更新，状态改为is_approved，contractAddress改为获取值
    console.log('Deploying collection:', collection);
  };

  const handleIssue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.currentTarget;
    const courseName = target.courseName.value;
    const userAddress = target.userAddress.value;

    console.log('Course Name:', courseName);
    console.log('User Address:', userAddress);

    // 根据user_address,CourseName 

    // 捕获链上合约issueCertificate事件，获取contractAddress

    // 将nftCollections表的数据更新，把user_id信息添加进去
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Review Applications */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Review Course Applications</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Collection Name</th>
              <th className="py-2 px-4 border-b text-left">Contract Address</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-left">{collection.name}</td>
                <td className="py-2 px-4 border-b text-left">{collection.contractAddress}</td>
                <td className="py-2 px-4 border-b text-left">
                  <button 
                    className={`px-4 py-2 rounded ${collection.is_approved ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                    disabled={!collection.is_approved}
                  >
                    {collection.is_approved ? 'Approved' : 'Not Approved'}
                  </button>
                </td>
                <td className="py-2 px-4 border-b text-left">
                  <button 
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={() => handleDeploy(collection)}
                  >
                    Deploy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Collection */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">issueCertificate</h2>
        
        <form onSubmit={handleIssue} className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">Course Name</label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="userAddress" className="block text-sm font-medium text-gray-700">User Address</label>
            <input
              type="text"
              id="userAddress"
              name="userAddress"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex items-end">
            <button type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;