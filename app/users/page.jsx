"use client";
import LoginButton from '../components/LoginButton';
import { useOCAuth } from '@opencampus/ocid-connect-js';
import { ConnectBtn } from "../components/connectButton"
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const { authState, ocAuth } = useOCAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    console.log(authState);
    // Fetch courses data from the API
    axios.get('/api/courses')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, [authState]); // Now it will log whenever authState changes

  if (authState.error) {
    return <div>Error: {authState.error.message}</div>;
  }

  // Add a loading state
  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
  <div className="border-b z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
    <div className="flex space-x-20">
      <ConnectBtn/>
      <div className='flex justify-end'>
        {authState.isAuthenticated ? (
          <div>OCID:{JSON.stringify(ocAuth.getAuthInfo())}</div>
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
          <th className="py-2 px-4 border-b">Course Name</th>
          <th className="py-2 px-4 border-b">Course Address</th>
          <th className="py-2 px-4 border-b">Mint</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course, index) => (
          <tr key={index}>
            <td className="py-2 px-4 border-b">{course.name}</td>
            <td className="py-2 px-4 border-b">{course.address}</td>
            <td className="py-2 px-4 border-b">
              <button 
                className={`px-4 py-2 rounded ${course.canMint ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                disabled={!course.canMint}
              >
                Mint
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</main>
  );
}