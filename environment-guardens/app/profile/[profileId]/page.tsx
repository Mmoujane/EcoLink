"use client";

import SideBar from "@/app/components/sideBar";
import Header from "@/app/components/Dachboardheader";
import Image from "next/image";
import React, {use, useEffect, useState} from 'react';
import ImpactContainer from "@/app/components/impactContainer";
import ProofForm from "@/app/components/ProofForm";
import { useWallet } from '../../contexts/walletContext';
import { ethers, BrowserProvider } from 'ethers';
import EcoRewardSystemABI from "../../blockchain/EcoRewardSystem_abi.json"
import EcoActionNFTABI from "../../blockchain/EcoActionNFT_abi.json";
import EcoTokenABI from "../../blockchain/EcoToken_abi.json";

// Smart contract ABI (you'll need to add the full ABI)
const ECO_REWARD_SYSTEM_ABI = EcoRewardSystemABI.abi;
const ECO_ACTION_NFT_ABI = EcoActionNFTABI.abi;
const ECO_TOKEN_ABI = EcoTokenABI.abi;

// Replace with your deployed contract address
const ECO_REWARD_SYSTEM_ADDRESS = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"; // Your contract address here
const ECO_ACTION_NFT_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"; // Replace with your NFT contract address
const ECO_TOKEN_ADDRESS = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"; // Replace with your token contract address

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
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [nftIds, setNftIds] = useState<number[]>([]);
  const [nftUris, setNftUris] = useState<{[id: number]: string}>({});

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

  // Fetch token balance, NFT IDs, and their URIs
  useEffect(() => {
    const fetchAssets = async () => {
      if (account && window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const tokenContract = new ethers.Contract(ECO_TOKEN_ADDRESS, ECO_TOKEN_ABI, provider);
        const nftContract = new ethers.Contract(ECO_ACTION_NFT_ADDRESS, ECO_ACTION_NFT_ABI, provider);
        try {
          const balance = await tokenContract.balanceOf(account);
          setTokenBalance(Number(ethers.formatUnits(balance, 18)));
          const ids: bigint[] = await nftContract.getTokensByOwner(account);
          const idNums = ids.map(id => Number(id));
          setNftIds(idNums);
          // Fetch tokenURIs for each NFT
          const uris: {[id: number]: string} = {};
          for (const id of idNums) {
            try {
              const uri = await nftContract.tokenURI(id);
              uris[id] = uri;
            } catch (e) {
              uris[id] = "";
            }
          }
          setNftUris(uris);
        } catch (err) {
          setTokenBalance(0);
          setNftIds([]);
          setNftUris({});
        }
      }
    };
    fetchAssets();
  }, [account]);

  const checkUserStatus = async () => {
    if (!contract || !account) return;

    try {
      // Check if user is a governor
      const governorStatus = await contract.isGovernor(account);
      console.log(governorStatus);
      setIsGovernor(governorStatus);

      const verifierStatus = await contract.verifiers(account);
      console.log('Verifier:', verifierStatus);
      setIsVerifier(verifierStatus);

      // Check if user is a protector
      const protectorStatus = await contract.protectors(account);
      console.log(protectorStatus);
      setIsProtector(protectorStatus);

    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };





  const resolvedParams = use(params);

  let role = "owner";
if (isGovernor) role = "governor";
else if (isVerifier) role = "verifier";
else if (isProtector) role = "protector";
else if (isVerifier && isProtector) role = "verifier";
else role = "owner"; // fallback
  return (
    <div className="flex h-screen">
      
      <SideBar role={role} accountId={account!}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header name={isProtector ? "protector" : "governor"}/>
        <main className="flex-1 overflow-y-auto p-6">
            {/* Token and NFT info section */}
            <div className="mb-6 p-4 bg-white rounded shadow">
              <div className="mb-2 font-bold">Your Token Balance: {tokenBalance} PGT</div>
              <div className="mb-2 font-bold">NFTs Earned: {nftIds.length}</div>
              <div className="mb-2 font-bold">Your NFT IDs:</div>
              <div className="flex flex-wrap gap-2">
                {nftIds.length === 0 ? (
                  <span className="text-gray-500">No NFTs earned yet.</span>
                ) : (
                  nftIds.map(id => (
                    <span key={id} className="bg-eco-light text-eco-dark px-3 py-1 rounded-full text-sm font-mono flex items-center gap-2">
                      #{id}
                      {nftUris[id] && (
                        <a href={nftUris[id]} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline break-all max-w-xs truncate">URI</a>
                      )}
                    </span>
                  ))
                )}
              </div>
            </div>
            <ProofForm />
        </main>
      </div>
    </div>
  );
}
