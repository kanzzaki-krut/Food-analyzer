
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

type PortionSize = 'small' | 'medium' | 'large';

interface PortionSelectorProps {
  selectedPortion: PortionSize;
  onPortionChange: (portion: PortionSize) => void;
}

const PortionSelector: React.FC<PortionSelectorProps> = ({ selectedPortion, onPortionChange }) => {
  const { t } = useLanguage();
  const portions: PortionSize[] = ['small', 'medium', 'large'];

  return (
    <div className="w-full max-w-sm mx-auto">
        <h3 className="text-lg font-medium text-gray-700 text-center mb-3">{t('portionSize')}</h3>
        <fieldset className="flex justify-center gap-2 sm:gap-4">
            <legend className="sr-only">{t('portionSize')}</legend>
            {portions.map((portion) => (
            <div key={portion}>
                <input
                    type="radio"
                    id={portion}
                    name="portion"
                    value={portion}
                    checked={selectedPortion === portion}
                    onChange={() => onPortionChange(portion)}
                    className="sr-only"
                />
                <label
                    htmlFor={portion}
                    className={`block w-24 sm:w-28 text-center px-4 py-2 border rounded-full cursor-pointer transition-all duration-200 ${
                        selectedPortion === portion
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                    }`}
                >
                    {t(portion)}
                </label>
            </div>
            ))}
        </fieldset>
    </div>
  );
};

export default PortionSelector;
