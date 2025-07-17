import React from 'react';

interface ClientProps {
  cardType: string;
  number: number;
  emoji: string;

}

const SlashingInfo: React.FC = () => {
  return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-red-600 text-xl">⚠️</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Slashing Penalties</h2>
                                <p className="text-sm text-gray-600">Understand the risks and penalties</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-6">
                            <div className="border-l-4 border-red-500 pl-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">False Verification (25% slash)</h3>
                                <p className="text-sm text-gray-600 mb-2">Approving fake or invalid submissions results in 25% of staked tokens being slashed.</p>
                                <div className="text-xs text-red-600">Example: 1,500 ECO staked → 375 ECO slashed</div>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Vote Manipulation (50% slash)</h3>
                                <p className="text-sm text-gray-600 mb-2">Coordinating with others to manipulate voting outcomes.</p>
                                <div className="text-xs text-orange-600">Example: 1,500 ECO staked → 750 ECO slashed</div>
                            </div>

                            <div className="border-l-4 border-yellow-500 pl-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Inactivity Penalty (5% slash)</h3>
                                <p className="text-sm text-gray-600 mb-2">Failing to participate in verification for extended periods.</p>
                                <div className="text-xs text-yellow-600">Example: 1,500 ECO staked → 75 ECO slashed</div>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Spam Reporting (10% slash)</h3>
                                <p className="text-sm text-gray-600 mb-2">Submitting false or malicious reports repeatedly.</p>
                                <div className="text-xs text-purple-600">Example: 1,500 ECO staked → 150 ECO slashed</div>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <span className="text-red-600 text-lg">🚨</span>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Important Notice</h3>
                                    <p className="text-sm text-red-700 mt-1">
                                        Slashed tokens are permanently removed from your stake and distributed to honest participants. Multiple violations may result in permanent ban from verification.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <span className="text-blue-600 text-lg">💡</span>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">Protection Tips</h3>
                                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                                        <li>• Always verify submissions thoroughly</li>
                                        <li>• Report suspicious activity promptly</li>
                                        <li>• Stay active and participate regularly</li>
                                        <li>• Keep your stake above minimum requirements</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
  );
}

export default SlashingInfo;

   
 