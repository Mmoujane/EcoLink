import React, { useEffect, useState } from 'react';
import SubmissionCard from './submissionCard';
import { useWallet } from '../contexts/walletContext';
import { ethers, BrowserProvider } from 'ethers';
import EcoRewardSystemABI from "../blockchain/EcoRewardSystem_abi.json"
import { error } from 'console';

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

const SubmissionCardContainer: React.FC = () => {
  const [proofs, setProofs] = useState<any[]>([]);
  const { account } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [contractOwner, setContractOwner] = useState<string | null>(null);

  // Initialize contract when wallet connects
  useEffect(() => {
    const init = async () => {
      if (account && window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          ECO_REWARD_SYSTEM_ADDRESS!,
          ECO_REWARD_SYSTEM_ABI,
          signer
        );
        setContract(contractInstance);
        // Fetch contract owner
        try {
          const owner = await contractInstance.contractOwner();
          setContractOwner(owner.toLowerCase());
        } catch (err) {
          setContractOwner(null);
        }
      }
    }
    init();
  }, [account]);

  // Fetch proposals when contract is available
  useEffect(() => {
    if (contract && account) {
      fetchProposals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account]);

  const fetchProposals = async () => {
    if (!contract) return;
    try {
      const proposalIds: bigint[] = await contract.getActiveProposals();
      const proposalArray = [];
      for (let i = 0; i < proposalIds.length; i++) {
        const proposalId = proposalIds[i];
        const proposal = await contract.getProposal(proposalId);
        // proposal is an array-like object, map to named fields
        proposalArray.push({
          id: Number(proposal[0]),
          protector: proposal[1],
          actionType: proposal[2],
          description: proposal[3],
          proofHash: proposal[4],
          carbonOffset: Number(proposal[5]),
          createdAt: Number(proposal[6]),
          votingDeadline: Number(proposal[7]),
          yesVotes: Number(proposal[8]),
          noVotes: Number(proposal[9]),
          governorYesVotes: Number(proposal[10]),
          governorNoVotes: Number(proposal[11]),
          executed: proposal[12],
          approved: proposal[13],
        });
      }
      setProofs(proposalArray);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const handleVote = async (proposalId: number, approve: boolean) => {
    if (!contract) return;
    try{
      const isGovernor = await contract.isGovernor(account);
      const isVerifier = await contract.verifiers(account);
      if(isGovernor){
        await contract.governorVote(proposalId, approve);
      }else if(isVerifier){
        await contract.vote(proposalId, approve);
      }else{
        alert("you cannot vote");
        throw new Error("you cannot vote");
      }
      
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
    

  }

  const handleExecute = async (proposalId: number) => {
    if (!contract) return;
    try {
      const tx = await contract.executeProposal(proposalId);
      const receipt = tx.wait();
      console.log("receipt", receipt);
      console.log("transaction", tx);
      console.log("recepit events", receipt.events);
      alert("Proposal executed!");
      fetchProposals();
    } catch (err) {
      alert("Failed to execute proposal: " + (err as Error).message);
    }
  };

  if (!proofs.length) return <div>No submissions found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {proofs.map((proof, idx) => {
        const canExecute = !!(
          contractOwner &&
          account &&
          contractOwner === account.toLowerCase() &&
          !proof.executed &&
          Date.now() / 1000 > proof.votingDeadline
        );
        return (
          <SubmissionCard
            key={proof.id || idx}
            cardType={proof.actionType || 'Unknown'}
            emoji={proof.actionType === 'tree-planting' ? '🌳' : '♻️'}
            time={proof.createdAt ? new Date(proof.createdAt * 1000).toLocaleString() : ''}
            name={proof.protector || 'Unknown'}
            walletAdress={proof.protector || 'N/A'}
            location={''}
            discription={proof.description || ''}
            reward={proof.carbonOffset}
            cid={proof.proofHash}
            url={proof.proofHash}
            files={[]}
            votingDeadline={proof.votingDeadline ? new Date(proof.votingDeadline * 1000).toLocaleString() : ''}
            yesVotes={proof.yesVotes}
            noVotes={proof.noVotes}
            governorYesVotes={proof.governorYesVotes}
            governorNoVotes={proof.governorNoVotes}
            executed={proof.executed}
            approved={proof.approved}
            id={proof.id}
            voteYes={() => handleVote(proof.id, true)}
            voteNo={() => handleVote(proof.id, false)}
            canExecute={canExecute}
            onExecute={() => handleExecute(proof.id)}
          />
        );
      })}
    </div>
  );
}

export default SubmissionCardContainer;
