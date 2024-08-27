"use client";

import LoginButton from '../components/LoginButton';
import { useWatchContractEvent} from 'wagmi'
import { useOCAuth } from '@opencampus/ocid-connect-js';
import { ConnectBtn } from "../components/connectButton";
import { useEffect, useState } from 'react';
import { useWriteContract} from 'wagmi'
import { parseEther } from 'viem'
import { abi, bytecode } from "../../lib/CourseCertificate.json"
import { useAccount } from 'wagmi';
import { useWalletClient } from 'wagmi'
export default function Home() {
  const { authState, ocAuth } = useOCAuth();
  const [collections, setCollections] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { writeContract } = useWriteContract()
  const [contractAddress,setContractAddress] = useState();
  const { address, chain } = useAccount();
  const [logEnv,setLogEnv] = useState([]);
  
  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'CertificateMinted',
    onLogs(logs) {
      if(logs){
        setLogEnv(logs);
      }
    },
    onError(error) {
      console.error('Error watching contract event:', error);
    }
});

useEffect(() => {
  console.log(logEnv);
  // 将NFT信息存进NFT表中
  (async () => {
    try {
      const tokenId = Number(logEnv[0].args.tokenId);
      const tokenURI = logEnv[0].args.tokenURI;
      const response = await fetch('/api/nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenURI: tokenURI, tokenId: tokenId, userAddress: address }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Nft posted successfully:',data);
        // 把mint信息转换
      } else {
        console.log('Failed to post nft:', response.statusText);
      }
    } catch (error) {
      console.log('Error posting nft:', error);
    }

    try {
      const response = await fetch(`/api/nft?address=${address}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Nft retrieved successfully:', data);
        // 处理返回的 NFT 信息
      } else {
        console.log('Failed to retrieve nft:', response.statusText);
      }
    } catch (error) {
      console.log('Error retrieving nft:', error);
    }
    
  })();
}, [logEnv]);
  
  useEffect(() => {
   
    console.log(authState);
    // Fetch courses data from the API
    fetchCourse();
    const intervalId = setInterval(fetchCourse, 15000000); // Poll every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [authState]); // Now it will log whenever authState changes

  useEffect(() => {
    if (address) {
      postUserAddress(address);
    }
  }, [address]);

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
    setSelectedCourse(course);
    console.log('Selected Course:', course);
    const ocid = ocAuth.getAuthInfo().edu_username;
    setContractAddress(course.contractAddress);
    writeContract({
      abi,
      address: course.contractAddress,
      functionName: 'mintCertificate',
      args: [
        ocid
      ],
    },
    {
      async onSuccess(data) {
        alert("successful");
        console.log(data);
        // 将hash存在NFTs表中

      },
      async onError(error) {
        alert(error);
      }
    });
  };
  // Add a loading state
  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  const postUserAddress = async (address) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userhash: address }),
      });

      if (response.ok) {
        const data = await response.json();
        ('User address posted successfully:', data);
      } else {
        console.log('Failed to post user address:', response.statusText);
      }
    } catch (error) {
      console.log('Error posting user address:', error);
    }
  };

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
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}