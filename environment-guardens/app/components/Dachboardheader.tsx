import React from 'react';

interface ClientProps {
  name: string

}

const Header: React.FC<ClientProps> = ({ name }) => {
  return (
<header className="bg-white shadow-sm border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {name}  👋</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-eco-green rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{name}</span>
                        </div>
                    </div>
                </div>
            </header>
  );
}

export default Header;
