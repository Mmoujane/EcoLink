"use client"

import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/walletContext';
import { ethers, BrowserProvider } from 'ethers';
import EcoRewardSystemABI from "../blockchain/EcoRewardSystem_abi.json"
import Link from 'next/link';

// Smart contract ABI (you'll need to add the full ABI)
const ECO_REWARD_SYSTEM_ABI = EcoRewardSystemABI.abi;

// Replace with your deployed contract address
const ECO_REWARD_SYSTEM_ADDRESS = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"; // Your contract address here

// Fix: Declare window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

const Navigator: React.FC = () => {
  const { account, connect, disconnect, isConnecting } = useWallet();
  const [isGovernor, setIsGovernor] = useState(false);
  const [isProtector, setIsProtector] = useState(false);
  const [isVerifier, setIsVerifier] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isOwner, setIsowner] = useState(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Initialize contract when wallet connects
  useEffect(() => {

    const init = async () => {
      if (account && window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          ECO_REWARD_SYSTEM_ADDRESS!,
          ECO_REWARD_SYSTEM_ABI,
          signer
        );
        setContract(contractInstance);
      }
    }

    init();
  }, [account]);

  // Check user status when contract is available
  useEffect(() => {
    if (contract && account) {
      console.log("founded");
      checkUserStatus();
    }
  }, [contract, account]);

  const checkUserStatus = async () => {
    if (!contract || !account) return;

    try {
      // Check if user is a governor
      const governorStatus = await contract.isGovernor(account);
      console.log(governorStatus);
      setIsGovernor(governorStatus);

      // Check if user is a protector
      const protectorStatus = await contract.protectors(account);
      console.log(protectorStatus);
      setIsProtector(protectorStatus);

      const verifierStatus = await contract.verifiers(account);
      setIsVerifier(verifierStatus);
      console.log("verifier: ", verifierStatus);

      const contractOwner = await contract.contractOwner();
      const isOwner = contractOwner.toLowerCase() === account.toLowerCase();
      setIsowner(isOwner);
      // If not a governor and not a protector, register as protector
      if (!governorStatus && !protectorStatus && !isOwner) {
        await registerAsProtector();
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  const registerAsProtector = async () => {
    if (!contract) return;

    try {
      setIsRegistering(true);
      const tx = await contract.registerProtector();
      await tx.wait(); // Wait for transaction confirmation
      setIsProtector(true);
      console.log('Successfully registered as protector');
    } catch (error) {
      console.error('Error registering as protector:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleWalletConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getUserRole = () => {
    if (isOwner) return 'Owner';
    if (isGovernor) return 'Governor';
    if (isVerifier) return 'Verifier';
    if (isProtector) return 'Protector';
    return 'Connecting...';
  };

  const getRoleColor = () => {
    if (isGovernor) return 'text-purple-600';
    if (isProtector) return 'text-[#10B981]';
    return 'text-gray-500';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-eco-green rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">🌱</span>
              </div>
              <span className="text-xl font-bold text-gray-900">EcoLink</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
            {(isProtector || isVerifier) && <Link href={`/profile/${account}`} className="text-gray-600 hover:text-[#10B981] px-3 py-2 text-sm font-medium transition-colors">DashBoard</Link>}
            {(isGovernor) && <Link href={`/profile/${account}/vote`} className="text-gray-600 hover:text-[#10B981] px-3 py-2 text-sm font-medium transition-colors">DashBoard</Link>}
              
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Wallet connect button or address */}
            {account ? (
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatAddress(account)}
                  </div>
                  <div className={`text-xs ${getRoleColor()}`}>
                    {isRegistering ? 'Registering...' : getUserRole()}
                  </div>
                </div>
                <button
                  onClick={disconnect}
                  className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                className="text-gray-600 hover:text-[#10B981] px-3 py-2 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                onClick={handleWalletConnect}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigator;