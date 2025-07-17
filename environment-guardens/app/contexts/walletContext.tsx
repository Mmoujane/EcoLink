"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, getAddress } from 'ethers';

interface WalletContextType {
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: BrowserProvider | null;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum && account === null) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts.length > 0 ? getAddress(accounts[0]) : null);
      });
      (window as any).ethereum.on('disconnect', () => {
        setAccount(null);
        setProvider(null);
      });
    }
    // Cleanup listeners on unmount
    return () => {
      if (typeof window !== 'undefined' && (window as any).ethereum && (window as any).ethereum.removeListener) {
        (window as any).ethereum.removeListener('accountsChanged', () => {});
        (window as any).ethereum.removeListener('disconnect', () => {});
      }
    };
  }, [account]);

  const connect = async () => {
    setIsConnecting(true);
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) throw new Error('MetaMask not found');
      const web3Provider = new BrowserProvider((window as any).ethereum);
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      setProvider(web3Provider);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
  };

  return (
    <WalletContext.Provider value={{ account, connect, disconnect, provider, isConnecting }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
};

/**
 * Usage Example:
 *
 * // In _app.tsx or layout.tsx:
 * <WalletProvider>
 *   <App />
 * </WalletProvider>
 *
 * // In any component:
 * const { account, connect, disconnect, isConnecting } = useWallet();
 */ 