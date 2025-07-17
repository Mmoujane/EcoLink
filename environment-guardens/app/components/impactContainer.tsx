import React from 'react';
import Card from './Card';



const ImpactContainer: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card cardType='Total Actions' number={43} emoji='🌿'/>
        <Card cardType='Tokens Earned' number={2.847} emoji='💰'/>
    </div>
  );
}

export default ImpactContainer;
