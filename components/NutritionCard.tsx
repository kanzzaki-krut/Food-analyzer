import React from 'react';

interface NutritionCardProps {
  label: string;
  value: number;
  unit: string;
  // Fix: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
  color: string;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ label, value, unit, icon, color }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4 transform transition-transform hover:scale-105">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-800">
          {Math.round(value)} <span className="text-base font-normal text-gray-600">{unit}</span>
        </p>
      </div>
    </div>
  );
};

export default NutritionCard;