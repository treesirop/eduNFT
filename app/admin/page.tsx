'use client';
import { useWriteContract } from 'wagmi';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { abi } from '../../lib/CourseCertificate.json';
import { ConnectBtn } from '../components/connectButton';
import { useWatchContractEvent } from 'wagmi';
import redisClient from '../../lib/redisClient';
interface Collection {
  id: number;
  name: string;
  is_approved: boolean;
  contractAddress: string;
  user_id: number;
  teacherId: number;
  createdAt: string;
}

interface InputValues {
  [key: number]: string;
}

const AdminDashboard: React.FC = () => {
  const { writeContract } = useWriteContract();
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [inputValues, setInputValues] = useState<InputValues>({});
  const [courseAddress, setCourseAddress] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');

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

      if (data[0]?.id) {
        setAdminId(data[0].id);
        setIsLoggedIn(true);
        localStorage.setItem('adminId', data[0].id.toString());
        localStorage.setItem('isLoggedIn', 'true');
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

  // Check login status on component mount
  useEffect(() => {
    const storedAdminId = localStorage.getItem('adminId');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

    if (storedAdminId && storedIsLoggedIn === 'true') {
      setAdminId(Number(storedAdminId));
      setIsLoggedIn(true);
    }
  }, []);

  useWatchContractEvent({
    address: courseAddress as `0x${string}`,
    abi,
    eventName: 'CertificateIssued',
    onError(error) {
      console.error('Error watching contract event:', error);
    },
  });

  // Fetch collections
  useEffect(() => {
    if (isLoggedIn) {
      fetchApply();
      const intervalId = setInterval(fetchApply, 5000); // Poll every 5 seconds
      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [isLoggedIn]);

  // Initialize inputValues state
  useEffect(() => {
    const initialInputValues = collections.reduce((acc, collection, index) => {
      acc[index] = collection.contractAddress || '';
      return acc;
    }, {} as InputValues);
    setInputValues(initialInputValues);
  }, [collections]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-4 text-center">
            Admin Login
          </h1>
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

  const handleInputChange = (index: number, value: string) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [index]: value,
    }));
  };

  const handleDeploy = async (collection: Collection, index: number) => {
    console.log('-----', collection);

    const contractAddress = inputValues[index];
    if (!contractAddress) {
      alert('Please enter a contract address');
      return;
    }

    // 设置 user_id 为 0 并将 is_approved 设置为 true
    const updatedCollection = {
      ...collection,
      user_id: 0,
      is_approved: true,
      contractAddress,
    };

    try {
      const response = await fetch('/api/collections/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: collection.id,
          name: collection.name,
          is_approved: true,
          contractAddress: contractAddress,
          user_id: 0,
          teacherId: collection.teacherId,
          createdAt: collection.createdAt,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Data saved successfully: ' + JSON.stringify(result));

        // 更新 collections 状态
        const updatedCollections = collections.map((col, idx) => {
          if (idx === index) {
            return updatedCollection;
          }
          return col;
        });
        setCollections(updatedCollections);
      } else {
        const errorMessage = await response.text();
        alert('Failed to save data: ' + errorMessage);
      }
    } catch (error: any) {
      console.error('Error saving data:', error);
      alert('Error saving data: ' + error.message);
    }
  };

  const handleIssue = async () => {
    // 获取选中的 collection 的 name
    let selectedCollectionName = 'result';
    try {
      const response = await fetch('/api/collections/name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractHash: courseAddress,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        selectedCollectionName = result;
        alert('Data saved successfully: ' + JSON.stringify(result));
      }
    } catch (error: any) {
      console.error('Error saving data:', error);
      alert('Error saving data: ' + error.message);
    }

    // 链上 issue
    writeContract(
      {
        abi,
        address: courseAddress as `0x${string}`,
        functionName: 'issueCertificate',
        args: [
          userAddress,
          selectedCollectionName, // 使用选中的 collection 的 name
        ],
      },
      {
        async onSuccess(data) {
          alert('successful');
          try {
            const response = await fetch('/api/collections/update', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contractHash: courseAddress,
                userHash: userAddress,
              }),
            });

            if (response.ok) {
              const result = await response.json();
              alert('Data saved successfully: ' + JSON.stringify(result));
            }
          } catch (error: any) {
            console.error('Error saving data:', error);
            alert('Error saving data: ' + error.message);
          }
        },
        async onError(error) {
          alert(error);
        },
      },
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <ConnectBtn />
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Review Applications */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Review Course Applications
        </h2>
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
                <td className="py-2 px-4 border-b text-left">
                  {collection.name}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  <input
                    type="text"
                    value={inputValues[index] || ''}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                    readOnly={collection.is_approved} // 根据 is_approved 状态设置只读属性
                  />
                </td>
                <td className="py-2 px-4 border-b text-left">
                  <button
                    className={`px-4 py-2 rounded ${
                      collection.is_approved
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                    disabled={!collection.is_approved}
                  >
                    {collection.is_approved ? 'Approved' : 'Not Approved'}
                  </button>
                </td>
                <td className="py-2 px-4 border-b text-left">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={() => handleDeploy(collection, index)}
                  >
                    Allow
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

        <form className="flex space-x-4">
          <div className="flex-1">
            <label
              htmlFor="courseName"
              className="block text-sm font-medium text-gray-700"
            >
              ContractHash
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={courseAddress}
              onChange={(e) => setCourseAddress(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="userAddress"
              className="block text-sm font-medium text-gray-700"
            >
              User Address
            </label>
            <input
              type="text"
              id="userAddress"
              name="userAddress"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleIssue}
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
