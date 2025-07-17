'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useWallet } from '../contexts/walletContext';
import { ethers, BrowserProvider } from 'ethers';
import EcoRewardSystemABI from "../blockchain/EcoRewardSystem_abi.json"

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
 
function jsonToFile(obj: any, filename = 'metadata.json') {
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
  return new File([blob], filename, { type: 'application/json' });
}

async function uploadToPinataViaBackend(formFields: any, files: File[]) {
  const formData = new FormData();
  formData.append('file', jsonToFile(formFields));
  files.forEach(file => formData.append('file', file));
  const res = await fetch('/api/pinata-upload', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload to Pinata');
  const data = await res.json();
  return {cid: data.cid, url: data.url};
}

 const ProofForm: React.FC = () => {

   const fileInputRef = useRef<HTMLInputElement>(null);
   const [uploading, setUploading] = useState(false);
   const [ipfsCid, setIpfsCid] = useState<string | null>(null);
   const [hederaStatus, setHederaStatus] = useState<string | null>(null);
   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
   const [dragActive, setDragActive] = useState(false);
   const { account, connect, disconnect, isConnecting } = useWallet();
   const [ actionType, setActionType ] = useState<string | null>("");
   const [ description, setDescription ] = useState<string | null>("");
   const [ carbonOffset, setCarbonOffset ] = useState<string | null>("");
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
      //checkUserStatus();
    }
  }, [contract, account]);

   const handleFiles = (files: FileList | File[]) => {
     // Only accept images and videos, max 10MB each
     const validFiles = Array.from(files).filter(f =>
       (f.type.startsWith('image/') || f.type.startsWith('video/')) && f.size <= 10 * 1024 * 1024
     );
     setSelectedFiles(prev => [...prev, ...validFiles]);
   };

   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files) handleFiles(e.target.files);
   };

   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
     e.preventDefault();
     e.stopPropagation();
     setDragActive(true);
   };

   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
     e.preventDefault();
     e.stopPropagation();
     setDragActive(false);
   };

   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
     e.preventDefault();
     e.stopPropagation();
     setDragActive(false);
     if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
   };

   const handleRemoveFile = (index: number) => {
     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
   };

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setUploading(true);
     setHederaStatus(null);
     setIpfsCid(null);

     // Collect form data
     const form = e.target as HTMLFormElement;
     const formFields = {
       actionType: (form.querySelector('#action-type') as HTMLSelectElement)?.value,
       location: (form.querySelector('#location-search') as HTMLInputElement)?.value,
       description: (form.querySelector('#description') as HTMLTextAreaElement)?.value,
       co2Count: (form.querySelector('#co2-count') as HTMLInputElement)?.value,
       user: account,
     };

     console.log("formFields", formFields);
     if (selectedFiles.length === 0) {
       alert('Please select at least one file.');
       setUploading(false);
       return;
     }
     try {
       const {cid, url} = await uploadToPinataViaBackend(formFields, selectedFiles);
       console.log("cid", cid);
       console.log("url", url);
       setIpfsCid(cid);
       // Submit CID to blockchain
       if (!contract || !account) return;
       await contract.submitProposal(actionType, description, url, Number(carbonOffset))

     } catch (err) {
       console.log("err", err);
       alert('Failed to upload to IPFS or submit to Hedera');
     }
     setUploading(false);
   };

   return (
<div className="max-w-4xl mx-auto">
    
                    <form id="submission-form" className="space-y-8" onSubmit={handleSubmit}>
                       
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Action Type</h2>
                            <div className="relative">
                                <select id="action-type" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-eco-green appearance-none bg-white" onChange={(e) => setActionType(e.target.value)}>
                                    <option value="">Select an action type...</option>
                                    <option value="tree-planting">🌳 Tree Planting</option>
                                    <option value="cleanup">♻️ Environmental Cleanup</option>
                                    <option value="renewable-energy">⚡ Renewable Energy Use</option>
                                    <option value="composting">🌱 Composting</option>
                                    <option value="bike-commute">🚲 Sustainable Transportation</option>
                                    <option value="water-conservation">💧 Water Conservation</option>
                                    <option value="recycling">📦 Recycling Initiative</option>
                                    <option value="education">📚 Environmental Education</option>
                                </select>
                                
                            </div>
                        </div>

                     
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Media</h2>
                            <div className="space-y-4">
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Photos/Videos *</label>
                                    <div
                                      id="media-upload"
                                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                      onDragOver={handleDragOver}
                                      onDragLeave={handleDragLeave}
                                      onDrop={handleDrop}
                                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${dragActive ? 'border-eco-green bg-eco-green/10' : 'border-gray-300 hover:border-eco-green'}`}
                                    >
                                        <div className="space-y-2">
                                            <div className="text-4xl">📸</div>
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium text-eco-green">Click to upload</span> or drag and drop
                                            </div>
                                            <div className="text-xs text-gray-500">PNG, JPG, MP4 up to 10MB</div>
                                        </div>
                                        <input
                                          ref={fileInputRef}
                                          type="file"
                                          id="media-files"
                                          multiple
                                          accept="image/*,video/*"
                                          className="hidden"
                                          onChange={handleFileInputChange}
                                        />
                                    </div>
                                    {selectedFiles.length > 0 && (
                                      <div id="media-preview" className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {selectedFiles.map((file, idx) => (
                                          <div key={idx} className="relative group border rounded-lg overflow-hidden">
                                            {file.type.startsWith('image/') ? (
                                              <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="object-cover w-full h-24"
                                              />
                                            ) : file.type.startsWith('video/') ? (
                                              <div className="flex flex-col items-center justify-center h-24">
                                                <span className="text-3xl">🎬</span>
                                                <span className="text-xs text-gray-500">{file.name}</span>
                                              </div>
                                            ) : null}
                                            <button
                                              type="button"
                                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                                              onClick={e => { e.stopPropagation(); handleRemoveFile(idx); }}
                                              title="Remove"
                                            >
                                              ×
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>

                               
                                
                            </div>
                        </div>

                     
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                            <textarea id="description" rows={6} placeholder="Describe your eco-action in detail. Include information about the impact, duration, number of people involved, and any other relevant details..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-eco-green resize-none" onChange={(e) => setDescription(e.target.value)}></textarea>
                            <div className="mt-2 text-sm text-gray-500">
                                <span id="char-count">0</span>/1000 characters
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">CO2 Count estimated (in kg) *</h2>
                            <div className="space-y-4">
                                <div className="flex space-x-4">
                                    <input type="number" id="co2-count" placeholder="Enter the CO2 count..." className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-eco-green" onChange={(e) => setCarbonOffset(e.target.value)}/>
                                </div>
                                
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Ready to submit?</h3>
                                    <p className="text-sm text-gray-600">Your submission will be reviewed by our community validators</p>
                                </div>
                                <button type="submit" id="submit-btn" className="bg-eco-green hover:bg-eco-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                    Submit for Review
                                </button>
                            </div>
                        </div>
                        {uploading && <div>Uploading to IPFS...</div>}
                        {ipfsCid && (
                          <div>
                            <strong>Uploaded to IPFS:</strong>
                            <a href={`https://ipfs.io/ipfs/${ipfsCid}`} target="_blank" rel="noopener noreferrer">
                              {`https://ipfs.io/ipfs/${ipfsCid}`}
                            </a>
                          </div>
                        )}
                        {hederaStatus && <div>{hederaStatus}</div>}
                    </form>
                </div>
   );
 }
 
 export default ProofForm;
              
              
              
              