// app/components/LoginModal.tsx
"use client";

import { useEffect, useState } from 'react';
import { HashConnect, HashConnectConnectionState, SessionData } from 'hashconnect';
import { LedgerId } from '@hashgraph/sdk';
import { loginClient } from '../utils/login';

const appMetadata = {
  name: "Planet Guardians",
  description: "Login to your account using Hedera wallet.",
  icons: ["https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg"],
  url: "http://localhost:3000",
};

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (accountId: string, signature: string) => void;
}

export default function LoginModal({ open, onClose, onLogin }: LoginModalProps) {
  const [pairingData, setPairingData] = useState<SessionData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState(HashConnectConnectionState.Disconnected);
  const [hashconnect, setHashconnect] = useState<HashConnect | null>(null);
  const [challenge, setChallenge] = useState<string>("");
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;

    const init = async () => {
      const hashconnect = new HashConnect(
        LedgerId.TESTNET,
        "d2fd8c87fbcb30293350424e155f4c97",
        appMetadata,
        true
      );

      hashconnect.pairingEvent.on((newPairing) => {
        console.log("✅ Paired:", newPairing);
        setPairingData(newPairing);
      });

      hashconnect.connectionStatusChangeEvent.on((status) => {
        console.log("🔌 Status:", status);
        setConnectionStatus(status);
      });

      hashconnect.disconnectionEvent.on(() => {
        console.log("❌ Disconnected");
        setPairingData(null);
      });

      await hashconnect.init();
      setHashconnect(hashconnect);
      await hashconnect.openPairingModal();

      console.log("account Id: ", pairingData?.accountIds);
    };
    // Generate a random challenge string
    setChallenge(Math.random().toString(36).substring(2, 15));
    setError("");
    setSigning(false);
    setPairingData(null);
    setConnectionStatus(HashConnectConnectionState.Disconnected);
    setHashconnect(null);
    init();
  }, [open]);

  const handleSign = async () => {
    if (!pairingData || !hashconnect) return;
    setSigning(true);
    setError("");
    try {
      // Use the first accountId
      const accountIdStr = pairingData.accountIds[pairingData.accountIds.length - 1];
      // Dynamically import AccountId from hashconnect's SDK if needed
      const { AccountId } = await import('hashconnect/node_modules/@hashgraph/sdk');
      const accountId = AccountId.fromString(accountIdStr);
      // Sign the challenge message (returns an array of SignerSignature objects)
      const signatures = await hashconnect.signMessages(accountId, challenge);
      // Convert Uint8Array signature to base64 string
      const signature = Buffer.from(signatures[0].signature).toString('base64');
      // Call the login API
      const result = await loginClient({ accountId: accountIdStr, signature, challenge });
      if (result && result.message === 'Login successful') {
        onLogin(accountIdStr, signature);
        onClose();
      } else {
        setError(result?.message || 'Login failed.');
      }
    } catch (err: any) {
      setError("Failed to sign message. Please try again.");
    } finally {
      setSigning(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-eco-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔑</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Login to Your Account</h2>
          <p className="text-gray-600">Connect your Hedera wallet and sign the challenge to login.</p>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-700 mb-2">Challenge:</div>
          <div className="bg-gray-100 rounded px-3 py-2 text-xs break-all">{challenge}</div>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-700 mb-2">Wallet Status:</div>
          <div className="text-xs">
            {connectionStatus === HashConnectConnectionState.Connected && pairingData
              ? <span className="text-green-600">Connected: {pairingData.accountIds[0]}</span>
              : <span className="text-yellow-600">Not connected</span>
            }
          </div>
        </div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <button
          className="w-full bg-eco-green hover:bg-eco-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center text-lg disabled:opacity-50"
          onClick={handleSign}
          
        >
          {signing ? "Signing..." : "Sign & Login"}
        </button>
      </div>
    </div>
  );
} 