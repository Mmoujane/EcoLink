import React from 'react';

const How: React.FC = () => {
  return (
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                <p className="text-xl text-gray-600">Three simple steps to start earning rewards for your eco-actions</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-8 rounded-xl bg-eco-light hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-eco-green rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-white text-2xl font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit Your Eco-Action</h3>
                    <p className="text-gray-600">Upload photos and details of your environmental activities - tree planting, cleanup, renewable energy use, and more.</p>
                </div>
                <div className="text-center p-8 rounded-xl bg-eco-light hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-eco-green rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-white text-2xl font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Get It Verified On-Chain</h3>
                    <p className="text-gray-600">Our community validators verify your impact, creating an immutable record on the blockchain.</p>
                </div>
                <div className="text-center p-8 rounded-xl bg-eco-light hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-eco-green rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-white text-2xl font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Earn Tokens & Impact Score</h3>
                    <p className="text-gray-600">Receive EcoTokens and build your impact score. Trade tokens or sell verified carbon credits on NFT marketPlaces.</p>
                </div>
            </div>
        </div>
    </section>
  );
}

export default How;
