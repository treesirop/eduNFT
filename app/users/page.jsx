"use client";
import LoginButton from '../components/LoginButton';
import { useOCAuth } from '@opencampus/ocid-connect-js';
import { ConnectBtn } from "../components/connectButton";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const { authState, ocAuth } = useOCAuth();
  const [collections, setCollections] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    console.log(authState);
    // Fetch courses data from the API
    fetchCourse();
  }, [authState]); // Now it will log whenever authState changes

  if (authState.error) {
    return <div>Error: {authState.error.message}</div>;
  }

  const fetchCourse = async () => {
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

  const handleMintClick = (course) => {
    if (course.canMint) {
      setSelectedCourse(course);
      console.log('Selected Course:', course);
      console.log('OCID edu_username:', ocAuth.getAuthInfo().edu_username);
    }
  };

  // Add a loading state
  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="border-b z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex space-x-20">
          <ConnectBtn />
          <div className='flex justify-end'>
            {authState.isAuthenticated ? (
              <div className="flex items-center justify-center">
                OCID: {JSON.stringify(ocAuth.getAuthInfo().edu_username)}
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>

      <div className="border-b w-full max-w-5xl flex-grow my-20">
        <h2 className="text-2xl font-bold mb-4">Courses</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center">Course Name</th>
              <th className="py-2 px-4 border-b text-center">Course Address</th>
              <th className="py-2 px-4 border-b text-center">Mint</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((course, index) => (
              !course.is_approved && (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-center">{course.name}</td>
                  <td className="py-2 px-4 border-b text-center">{course.contractAddress}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button 
                      className={`px-4 py-2 rounded ${course.user_id ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                      disabled={!course.user_id}
                      onClick={() => handleMintClick(course)}
                    >
                      Mint
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}