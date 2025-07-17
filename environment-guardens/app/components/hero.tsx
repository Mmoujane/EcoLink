import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-[#D1FAE5] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Protect Nature. <span className="text-[#10B981]">Get Rewarded.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Verify your impact. Earn tokens. Sell carbon credits.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-[#10B981] hover:bg-[#065F46] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Get Started
                    </button>
                    <button className="border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        How It Works
                    </button>
                </div>
            </div>
        </div>
    </section>
  );
}

export default Hero;
