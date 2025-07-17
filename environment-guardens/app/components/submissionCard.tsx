import { truncate } from 'fs';
import React, { useState } from 'react';

interface ClientProps {
  cardType: string;
  number: number;
  emoji: string;
  time: string;
  name: string;
  walletAdress: string;
  location: string;
  discription: string;
  reward: string;
  cid?: string;
  url?: string;
  files?: any[];
}

interface SubmissionCardProps {
  cardType: string;
  emoji: string;
  time: string;
  name: string;
  walletAdress: string;
  location: string;
  discription: string;
  reward: string;
  cid: string;
  url: string;
  files: any[];
  votingDeadline?: string;
  yesVotes?: number;
  noVotes?: number;
  governorYesVotes?: number;
  governorNoVotes?: number;
  executed?: boolean;
  approved?: boolean;
  id: number;
  voteYes: () => void;
  voteNo: () => void;
  canExecute?: boolean;
  onExecute?: () => void;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  cardType,
  emoji,
  time,
  name,
  walletAdress,
  location,
  discription,
  reward,
  cid,
  url,
  files,
  votingDeadline,
  yesVotes,
  noVotes,
  governorYesVotes,
  governorNoVotes,
  executed,
  approved,
  id,
  voteYes,
  voteNo,
  canExecute,
  onExecute,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-4xl mb-2">{emoji}</div>
            <div className="text-sm">proof</div>
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            {cardType}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
            {time}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">{name[0]}</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{name}</div>
              <div className="text-xs text-gray-500">ID: {walletAdress}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{location}</div>
            <div className="text-xs text-gray-500">{location}</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {discription}
        </p>
        {/* Proposal Info */}
        {votingDeadline && <div className="text-xs text-gray-700 mb-1"><b>Voting Deadline:</b> {votingDeadline}</div>}
        {typeof yesVotes !== 'undefined' && <div className="text-xs text-gray-700 mb-1"><b>Verifier Yes Votes:</b> {yesVotes}</div>}
        {typeof noVotes !== 'undefined' && <div className="text-xs text-gray-700 mb-1"><b>Verifier No Votes:</b> {noVotes}</div>}
        {typeof governorYesVotes !== 'undefined' && <div className="text-xs text-gray-700 mb-1"><b>Governor Yes Votes:</b> {governorYesVotes}</div>}
        {typeof governorNoVotes !== 'undefined' && <div className="text-xs text-gray-700 mb-1"><b>Governor No Votes:</b> {governorNoVotes}</div>}
        {typeof executed !== 'undefined' && <div className="text-xs text-gray-700 mb-1"><b>Executed:</b> {executed ? 'Yes' : 'No'}</div>}
        {typeof approved !== 'undefined' && <div className="text-xs text-gray-700 mb-1"><b>Approved:</b> {approved ? 'Yes' : 'No'}</div>}
        <div className="flex items-center justify-between mb-4">
          <button
            className="text-eco-green hover:text-eco-dark text-sm font-medium view-full-btn"
            onClick={() => setShowModal(true)}
          >
            View Full Submission →
          </button>
          <div className="text-xs text-gray-500">
            Carbon reduced: {reward} Kg
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="approve-btn flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center" onClick={voteYes}>
            ✅ Approve
          </button>
          <button className="reject-btn flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center" onClick={voteNo}>
            ❌ Reject
          </button>
        </div>
        {canExecute && onExecute && (
          <button className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors" onClick={onExecute}>
            Execute Proposal
          </button>
        )}
      </div>
      {/* Modal for full submission */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setShowModal(false)}
              title="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Full Submission</h2>
            <div className="mb-2"><b>Type:</b> {cardType}</div>
            <div className="mb-2"><b>Name:</b> {name}</div>
            <div className="mb-2"><b>Wallet:</b> {walletAdress}</div>
            <div className="mb-2"><b>Location:</b> {location}</div>
            <div className="mb-2"><b>Description:</b> {discription}</div>
            <div className="mb-2"><b>Reward:</b> {reward}</div>
            <div className="mb-2"><b>IPFS CID:</b> {cid}</div>
            <div className="mb-2"><b>IPFS URL:</b> <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{url}</a></div>
            <div className="mb-2"><b>Voting Deadline:</b> {votingDeadline}</div>
            <div className="mb-2"><b>Verifier Yes Votes:</b> {yesVotes}</div>
            <div className="mb-2"><b>Verifier No Votes:</b> {noVotes}</div>
            <div className="mb-2"><b>Governor Yes Votes:</b> {governorYesVotes}</div>
            <div className="mb-2"><b>Governor No Votes:</b> {governorNoVotes}</div>
            <div className="mb-2"><b>Executed:</b> {executed ? 'Yes' : 'No'}</div>
            <div className="mb-2"><b>Approved:</b> {approved ? 'Yes' : 'No'}</div>
            <div className="mb-2"><b>Files:</b></div>
            <div className="grid grid-cols-2 gap-4">
              {files && files.length > 0 ? files.map((file: any, idx: number) => {
                // If file is a string (filename), construct IPFS URL
                const fileUrl = url && file ? `${url}/${file.name || file}` : undefined;
                if (file && typeof file === 'object' && file.type && file.type.startsWith('image/')) {
                  return (
                    <img key={idx} src={fileUrl} alt={file.name || `file-${idx}`} className="object-cover w-full h-32 rounded" />
                  );
                } else if (file && typeof file === 'object' && file.type && file.type.startsWith('video/')) {
                  return (
                    <video key={idx} controls className="w-full h-32 rounded">
                      <source src={fileUrl} type={file.type} />
                      Your browser does not support the video tag.
                    </video>
                  );
                } else if (fileUrl) {
                  // fallback: just show a link
                  return (
                    <a key={idx} href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{file.name || fileUrl}</a>
                  );
                }
                return null;
              }) : <div className="col-span-2 text-gray-500">No files found.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmissionCard;
