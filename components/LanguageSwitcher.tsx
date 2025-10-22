
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-12 h-8 rounded-full bg-gray-200 focus:outline-none transition-colors"
      aria-label="Switch language"
    >
      <span className={`text-sm font-bold ${language === 'en' ? 'text-emerald-600' : 'text-gray-500'}`}>EN</span>
      <div className="w-px h-4 bg-gray-400 mx-1"></div>
      <span className={`text-sm font-bold ${language === 'ru' ? 'text-emerald-600' : 'text-gray-500'}`}>RU</span>
    </button>
  );
};

export default LanguageSwitcher;
