import React from 'react';
import Card from './Card';
import SubmissionCard from './submissionCard';
import Credit from './credit';



const CreditContainer: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="credit-listings">
        <Credit name='Amazon Reforestation' emoji='🌳' color='green' type='Reforestation' location='brazil' title='Amazon Forest Recovery' discription='Restoring 500 hectares of Amazon rainforest through native species planting and community engagement programs.' CO2_count='25 tons' id='0x7a8f...9c2d' date='Dec 15, 2024' price='$1,125'/>
        <Credit name='Amazon Reforestation' emoji='🌳' color='blue' type='Reforestation' location='brazil' title='Amazon Forest Recovery' discription='Restoring 500 hectares of Amazon rainforest through native species planting and community engagement programs.' CO2_count='25 tons' id='0x7a8f...9c2d' date='Dec 15, 2024' price='$1,125'/>
        <Credit name='Amazon Reforestation' emoji='🌳' color='green' type='Reforestation' location='brazil' title='Amazon Forest Recovery' discription='Restoring 500 hectares of Amazon rainforest through native species planting and community engagement programs.' CO2_count='25 tons' id='0x7a8f...9c2d' date='Dec 15, 2024' price='$1,125'/>
        
    </div>
  );
}

export default CreditContainer;
