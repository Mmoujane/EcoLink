  import React from 'react';
  
  interface ClientProps {
    name: string;
    emoji: string;
    color: string;
    type: string;
    location: string;
    title: string;
    discription: string;
    CO2_count: string;
    id: string;
    date: string;
    price: string;
  
  }
  
  const Credit: React.FC<ClientProps> = ({ name, emoji, color, type, location, title, discription, CO2_count, id, date, price }) => {
    return (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                            <div className={`h-48 bg-gradient-to-br from-${color}-400 to-${color}-600 flex items-center justify-center`}>
                                <div className="text-center text-white">
                                    <div className="text-6xl mb-2">{emoji}</div>
                                    <div className="text-lg font-semibold">{name}</div>
                                </div>
                            </div>
                            <div className="absolute top-4 left-4">
                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">{type}</span>
                            </div>
                            <div className="absolute top-4 right-4">
                                <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium">🌎 {location}</span>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                                <div className="flex items-center">
                                    <span className="text-green-600 text-sm">✅</span>
                                    <span className="text-xs text-gray-500 ml-1">Verified</span>
                                </div>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4">
                                {discription}
                            </p>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">CO₂ Offset Capacity</span>
                                    <span className="font-semibold text-gray-900">{CO2_count} tons CO₂</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Certificate Hash</span>
                                    <span className="font-mono text-xs text-blue-600">{id}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Verification Date</span>
                                    <span className="text-sm text-gray-900">{date}</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-2xl font-bold text-gray-900">{price}</div>
                                    <div className="text-sm text-gray-500">Total Price</div>
                                </div>
                                <button className="w-full bg-eco-green hover:bg-eco-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                                    <span className="mr-2">🛒</span>
                                    Buy Credit
                                </button>
                            </div>
                        </div>
                    </div>
    );
  }
  
export default Credit;

  
  
