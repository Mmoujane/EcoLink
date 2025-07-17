import React from 'react';

interface ClientProps {
  cardType: string;
  number: number;
  emoji: string;

}

const Card: React.FC<ClientProps> = ({ cardType, number, emoji }) => {
  return (
<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{cardType}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{number}</p>
                            </div>
                            <div className="w-12 h-12 bg-eco-light rounded-lg flex items-center justify-center">
                                <span className="text-2xl">{emoji}</span>
                            </div>
                        </div>
                    </div>
  );
}

export default Card;
