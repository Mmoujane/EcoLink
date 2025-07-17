// components/HashConnectClient.tsx
"use client";

import { useEffect, useState } from 'react';
import { HashConnect, HashConnectConnectionState, SessionData } from 'hashconnect';
import { LedgerId } from '@hashgraph/sdk';
import { registerClient } from '../utils/register';
import dynamic from 'next/dynamic';
const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false });

const appMetadata = {
  name: "Planet Guardians",
  description: "Earn from eco actions using blockchain.",
  icons: ["https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg"],
  url: "http://localhost:3000",
};

export default function HashConnectClient() {
  const [pairingData, setPairingData] = useState<SessionData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState(HashConnectConnectionState.Disconnected);
  const [hashconnect, setHashconnect] = useState<HashConnect | null>(null);
  const [name, setName] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [loginOpen, setLoginOpen] = useState(false);
  const [loggedInAccount, setLoggedInAccount] = useState<string | null>(null);

  const handleLoginSuccess = (accountId: string, signature: string) => {
    setLoggedInAccount(accountId);
    setLoginOpen(false);
  };

  useEffect(() => {
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

    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await registerClient({name: name, mail: mail, type: type, accountId: pairingData?.accountIds[pairingData?.accountIds.length - 1]!})
  }

  return (
    <div className="min-h-screen">
<section className="py-16">
            <div className="max-w-md mx-auto px-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    
                    <div className="bg-gradient-to-br from-eco-green to-eco-dark text-white p-8 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🌍</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Join the Movement</h2>
                        <p className="text-green-100">Create your account to start offsetting carbon emissions</p>
                    </div>

                    <div className="p-8">
                        <form id="signupForm" className="space-y-6" onSubmit={handleSubmit} method='post'>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name / Company Name
                                </label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-eco-green focus:border-eco-green transition-colors"
                                    placeholder="Enter your full name or company name"
                                />
                            </div>

                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    onChange={(e) => setMail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-eco-green focus:border-eco-green transition-colors"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Type
                                </label>
                                <select 
                                    id="accountType" 
                                    name="accountType" 
                                    onChange={(e) => {setType(e.target.value)}}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-eco-green focus:border-eco-green transition-colors"
                                >
                                    <option value="">Select your account type</option>
                                    <option value="company">🏢 Company - Purchase carbon credits to offset emissions</option>
                                    <option value="protector">🌱 Protector - Create and sell environmental projects</option>
                                </select>
                            </div>

                           
                            <div id="accountInfo" className="block">
                                <div id="companyInfo" className={`${type === "company" ? "block" : "hidden"} bg-blue-50 border border-blue-200 rounded-lg p-4`}>
                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                            <span className="text-blue-600 text-sm">🏢</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-blue-900 mb-1">Company Account</h4>
                                            <p className="text-sm text-blue-700">
                                                Perfect for businesses looking to offset their carbon footprint. Browse and purchase verified carbon credits, track your environmental impact, and showcase your sustainability achievements.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div id="protectorInfo" className={`${type === "protector" ? "block" : "hidden"} bg-green-50 border border-green-200 rounded-lg p-4`}>
                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                            <span className="text-green-600 text-sm">🌱</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-900 mb-1">Protector Account</h4>
                                            <p className="text-sm text-green-700">
                                                Ideal for environmental organizations and project developers. Create verified carbon credit projects, manage certifications, and sell credits to companies worldwide.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    

                       
                            <button 
                                type="submit" 
                                className="w-full bg-eco-green hover:bg-eco-dark text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center text-lg"
                            >
                                <span className="mr-2">🚀</span>
                                Create Account
                            </button>
                        </form>

                        
                        <div className="text-center mt-6 pt-6 border-t border-gray-100">
                            <p className="text-gray-600">
                                Already have an account? 
                                <a href="#" className="text-eco-green hover:text-eco-dark font-medium" onClick={e => {e.preventDefault(); setLoginOpen(true);}}>Sign in here</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLoginSuccess} />
    </div>
  );
}
