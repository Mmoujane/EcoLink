import React from 'react';

interface ClientProps {
  cardType: string;
  number: number;
  emoji: string;

}

const VerifierRequirement: React.FC = () => {
  return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-green-600 text-xl">🏆</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Verifier Requirements</h2>
                                <p className="text-sm text-gray-600">How to become a verifier</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-green-600 font-bold text-sm">1</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Minimum Stake Requirement</h3>
                                    <p className="text-sm text-gray-600">Stake at least <strong>1,000 ECO tokens</strong> to become eligible for verifier role.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-green-600 font-bold text-sm">2</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Account Standing</h3>
                                    <p className="text-sm text-gray-600">Maintain good standing with no recent slashing penalties or violations.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-green-600 font-bold text-sm">3</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Verification Training</h3>
                                    <p className="text-sm text-gray-600">Complete the verifier training module and pass the assessment quiz.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-green-600 font-bold text-sm">4</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Active Participation</h3>
                                    <p className="text-sm text-gray-600">Demonstrate active participation in the ecosystem for at least 30 days.</p>
                                </div>
                            </div>

                           

                            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                                Apply to Become Verifier
                            </button>
                        </div>
                    </div>
                </div>
  );
}

export default VerifierRequirement;
