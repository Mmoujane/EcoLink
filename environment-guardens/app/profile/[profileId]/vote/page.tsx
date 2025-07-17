"use client";

import SideBar from "@/app/components/sideBar";
import Header from "@/app/components/Dachboardheader";
import Image from "next/image";
import React, {use, useEffect, useState} from 'react';
import ImpactContainer from "@/app/components/impactContainer";
import ProofForm from "@/app/components/ProofForm";
import SubmissionCardContainer from "@/app/components/submissionCardContainer";
import { useWallet } from '../../../contexts/walletContext';
import { ethers, BrowserProvider } from 'ethers';
import EcoRewardSystemABI from "../../../blockchain/EcoRewardSystem_abi.json"

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


export default function Home({ params }: { params: Promise<{ profileId: string }> }) {

  const { account, connect, disconnect, isConnecting } = useWallet();
  const [isGovernor, setIsGovernor] = useState(false);
  const [isProtector, setIsProtector] = useState(false);
  const [isVerifier, setIsVerifier] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
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
      console.log('Governor:', governorStatus);
      setIsGovernor(governorStatus);

      // Check if user is a protector
      const protectorStatus = await contract.protectors(account);
      console.log('Protector:', protectorStatus);
      setIsProtector(protectorStatus);

      const verifierStatus = await contract.verifiers(account);
      console.log('Verifier:', verifierStatus);
      setIsVerifier(verifierStatus);

    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  let role = "owner";
if (isGovernor) role = "governor";
else if (isVerifier) role = "verifier";
else if (isProtector) role = "protector";
else if (isVerifier && isProtector) role = "verifier";
else role = "owner"; // fallback

  return (
    <div className="flex h-screen">
      <SideBar role={role} accountId={account!} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header name={isProtector ? "protector" : "governor"}/>
        <main className="flex-1 overflow-y-auto p-6">
            <SubmissionCardContainer />
        </main>
      </div>
    </div>
  );
}
