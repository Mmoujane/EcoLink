import React from 'react';

const MarketHero: React.FC = () => {
  return (
<section className="bg-gradient-to-br from-eco-green to-eco-dark text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Offset Your Carbon Footprint
                        </h1>
                        <p className="text-xl mb-8 text-green-100">
                            Purchase verified carbon credits from real environmental projects. Every credit represents measurable CO₂ reduction with blockchain-verified certificates.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button  className="bg-white text-eco-green hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center">
                                <span className="mr-2">🛒</span>
                                Browse Impact Credits
                            </button>
                            <button  className="border-2 border-white text-white hover:bg-white hover:text-eco-green font-semibold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center">
                                <span className="mr-2">📊</span>
                                Calculate Footprint
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-3xl font-bold">2.5M+</div>
                                <div className="text-green-100">Tons CO₂ Offset</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">450+</div>
                                <div className="text-green-100">Verified Projects</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">1,200+</div>
                                <div className="text-green-100">Companies</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">🌍</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Impact Dashboard</h3>
                                <p className="text-green-100">Real-time environmental impact</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                                    <span>Your Credits Purchased</span>
                                    <span className="font-bold">125 tons CO₂</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                                    <span>Certificates Owned</span>
                                    <span className="font-bold">8 Projects</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                                    <span>Carbon Neutral Status</span>
                                    <span className="font-bold text-green-200">✅ Achieved</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

  );
}

export default MarketHero;
