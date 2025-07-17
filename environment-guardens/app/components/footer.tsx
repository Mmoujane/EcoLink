import React from 'react';

const Footer: React.FC = () => {
  return (
<footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
                <div className="col-span-2">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-eco-green rounded-full flex items-center justify-center mr-2">
                            <span className="text-white font-bold text-sm">🌱</span>
                        </div>
                        <span className="text-xl font-bold">Planet Guardiens</span>
                    </div>
                    <p className="text-gray-400 mb-4">Empowering individuals to make a positive environmental impact while earning rewards for their actions.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Community</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                <p className="text-gray-400">&copy; 2024 EcoRewards. All rights reserved.</p>
            </div>
        </div>
    </footer>
  );
}

export default Footer;
