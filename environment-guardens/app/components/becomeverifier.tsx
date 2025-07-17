import React, { useEffect, useState } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import { useWallet } from '../contexts/walletContext';
import EcoRewardSystemABI from "../blockchain/EcoRewardSystem_abi.json";
import EcoTokenABI from "../blockchain/EcoToken_abi.json";

const ECO_REWARD_SYSTEM_ADDRESS = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
const ECO_TOKEN_ADDRESS = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
const MIN_STAKE_AMOUNT = 50; // 50 ECO 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0

const BecomeVerifier: React.FC = () => {
  const { account, provider, connect } = useWallet();
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [isStaking, setIsStaking] = useState(false);
  const [error, setError] = useState<string>("");
  const [isUnstaking, setIsUnstaking] = useState(false);

  // Fetch token balance
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account && provider) {
        const token = new ethers.Contract(ECO_TOKEN_ADDRESS!, EcoTokenABI.abi, provider);
        const balance = await token.balanceOf(account);
        console.log("balance", balance);
        setTokenBalance(Number(ethers.formatUnits(balance, 18)));
      }
    };
    fetchBalance();
  }, [account, provider]);

  const handleStake = async () => {
    if (!account || !provider) {
      setError("Please connect your wallet.");
      await connect();
      return;
    }
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount < MIN_STAKE_AMOUNT) {
      setError(`Minimum stake amount is ${MIN_STAKE_AMOUNT} ECO`);
      return;
    }
    setIsStaking(true);
    setError("");
    try {
      const signer = await provider.getSigner();
      const token = new ethers.Contract(ECO_TOKEN_ADDRESS!, EcoTokenABI.abi, signer);
      const contract = new ethers.Contract(ECO_REWARD_SYSTEM_ADDRESS!, EcoRewardSystemABI.abi, signer);

      // Approve the staking contract to spend tokens
      const amountInWei = ethers.parseUnits(stakeAmount, 18);
      const approveTx = await token.approve(ECO_REWARD_SYSTEM_ADDRESS, amountInWei);
      

      // Call stakeToVerify on the contract
      const stakeTx = await contract.stakeToVerify();

      alert("Staked successfully! You are now a verifier.");
      setStakeAmount("");
    } catch (err: any) {
      setError(err.message || "Staking failed");
    } finally {
      setIsStaking(false);
    }
  };

  // Unstake logic: unstake all staked tokens
  const handleUnstake = async () => {
    if (!account || !provider) {
      setError("Please connect your wallet.");
      await connect();
      return;
    }
    setIsUnstaking(true);
    setError("");
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ECO_REWARD_SYSTEM_ADDRESS!, EcoRewardSystemABI.abi, signer);
      const tx = await contract.unstakeVerifier();
      await tx.wait();
      alert("Unstaked all tokens successfully!");
    } catch (err: any) {
      setError(err.message || "Unstaking failed");
    } finally {
      setIsUnstaking(false);
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Stake Tokens to Become a Verifier</h2>
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-800">{error}</div>}
        <div className="mb-4">
          <div className="text-sm text-gray-600">Wallet Balance: {tokenBalance.toFixed(2)} ECO</div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Stake</label>
          <input
            type="number"
            value={stakeAmount}
            onChange={e => setStakeAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            disabled={isStaking}
          />
        </div>
        <button
          onClick={handleStake}
          disabled={isStaking || !stakeAmount || parseFloat(stakeAmount) < MIN_STAKE_AMOUNT}
          className="w-full bg-eco-green hover:bg-eco-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isStaking ? "Staking..." : "Stake & Become Verifier"}
        </button>
        {/* Unstake Section */}
        <button
          onClick={handleUnstake}
          disabled={isUnstaking}
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isUnstaking ? "Unstaking..." : "Unstake All Tokens"}
        </button>
      </div>
    </div>
  );
};

export default BecomeVerifier;