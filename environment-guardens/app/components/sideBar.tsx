import Link from 'next/link';
import React from 'react';

const SideBar: React.FC<{role: string, accountId: string}> = ({role, accountId}) => {
  return (
        <div className="w-64 bg-white shadow-lg">
            <div className="p-6 border-b">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-eco-green rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">🌱</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">EcoLink</span>
                </div>
            </div>
            <nav className="mt-6">
                <div className="px-4 space-y-2">
                    {role === "protector" && (
                      <>
                        <Link href={`/profile/${accountId}`} className="nav-item active flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors">
                          <span className="mr-3">📊</span>
                          Dashboard
                        </Link>
                        <Link href={`/profile/${accountId}/becomeVerifier`} className="nav-item active flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors">
                          <span className="mr-3">📊</span>
                          Become Verifier
                        </Link>
                      </>
                    )}
                    {role === "verifier" && (
                      <>
                        <Link href={`/profile/${accountId}`} className="nav-item active flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors">
                          <span className="mr-3">📊</span>
                          Dashboard
                        </Link>
                        <Link href={`/profile/${accountId}/becomeVerifier`} className="nav-item active flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors">
                          <span className="mr-3">📊</span>
                          Unstake
                        </Link>
                        <Link href={`/profile/${accountId}/vote`} className="nav-item active flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors">
                          <span className="mr-3">🗳️</span>
                          Voting Center
                        </Link>
                      </>
                    )}
                    {(role === "governor" || role === "owner") && (
                      <Link href={`/profile/${accountId}/vote`} className="nav-item flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors">
                        <span className="mr-3">🗳️</span>
                        Voting Center
                      </Link>
                    )}
                </div>
            </nav>
        </div>
  );
}

export default SideBar;
