
import React from 'react';
import { FoodAnalysis } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface HistoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  history: FoodAnalysis[];
  onDelete: (id: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isVisible, onClose, history, onDelete }) => {
  const { t, language } = useLanguage();

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{t('mealHistory')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="overflow-y-auto p-5">
          {history.length === 0 ? (
            <p className="text-center text-gray-500 py-10">{t('noHistory')}</p>
          ) : (
            <ul className="space-y-4">
              {history.map((item) => (
                <li key={item.id} className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                  <img src={item.imageDataUrl} alt={item.dishName} className="w-20 h-20 rounded-md object-cover flex-shrink-0"/>
                  <div className="flex-grow">
                    <p className="font-bold text-lg text-gray-800">{item.dishName}</p>
                    <p className="text-sm text-gray-500">
                      {new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.timestamp))}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.round(item.totalNutrition.calories)} kcal &bull; {t('protein')}: {item.totalNutrition.protein.toFixed(1)}g &bull; {t('fat')}: {item.totalNutrition.fat.toFixed(1)}g &bull; {t('carbs')}: {item.totalNutrition.carbohydrates.toFixed(1)}g
                    </p>
                  </div>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                    aria-label={`${t('delete')} ${item.dishName}`}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
