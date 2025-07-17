 import React from 'react';
import Card from './Card';



const MarketFilter: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Carbon Credit Marketplace</h2>
                            <p className="text-gray-600">Browse and purchase verified environmental impact credits</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                            <div className="flex-1 lg:flex-none">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                                <select id="action-filter" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-eco-green focus:border-eco-green">
                                    <option value="">All Types</option>
                                    <option value="reforestation">🌳 Reforestation</option>
                                    <option value="recycling">♻️ Recycling</option>
                                    <option value="clean-energy">⚡ Clean Energy</option>
                                    <option value="ocean-cleanup">🌊 Ocean Cleanup</option>
                                    <option value="soil-carbon">🌱 Soil Carbon</option>
                                </select>
                            </div>
                            
                            <div className="flex-1 lg:flex-none">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                                <select id="region-filter" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-eco-green focus:border-eco-green">
                                    <option value="">All Regions</option>
                                    <option value="north-america">🇺🇸 North America</option>
                                    <option value="europe">🇪🇺 Europe</option>
                                    <option value="asia">🌏 Asia</option>
                                    <option value="south-america">🌎 South America</option>
                                    <option value="africa">🌍 Africa</option>
                                    <option value="oceania">🇦🇺 Oceania</option>
                                </select>
                            </div>
                            
                            <div className="flex-1 lg:flex-none">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Impact Amount</label>
                                <select id="impact-filter" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-eco-green focus:border-eco-green">
                                    <option value="">Any Amount</option>
                                    <option value="small">1-10 tons CO₂</option>
                                    <option value="medium">10-50 tons CO₂</option>
                                    <option value="large">50-100 tons CO₂</option>
                                    <option value="enterprise">100+ tons CO₂</option>
                                </select>
                            </div>
                            
                            <div className="flex-1 lg:flex-none">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                <select id="sort-filter" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-eco-green focus:border-eco-green">
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="impact">Highest Impact</option>
                                    <option value="verified">Most Verified</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
  );
}

export default MarketFilter;

 
 
 