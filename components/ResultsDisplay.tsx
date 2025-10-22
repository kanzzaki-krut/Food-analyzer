import React, { useState, useEffect, useMemo } from 'react';
import { FoodAnalysis, Ingredient, NutritionInfo } from '../types';
import NutritionCard from './NutritionCard';
import { useLanguage } from '../hooks/useLanguage';

interface ResultsDisplayProps {
  analysis: FoodAnalysis;
  onUpdateAnalysis: (updatedAnalysis: FoodAnalysis) => void;
}

const FireIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A5 5 0 0012 11c0-2-1-4-2.121-5.121" /></svg>;
const ProteinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.62,12.2a2.5,2.5,0,0,0-3.12.63l-1.42,2.12a1,1,0,0,1-1.36.37L10,12.55a1.26,1.26,0,0,0-1.6.4L5.18,17.9a2.5,2.5,0,0,0,3,3.66l1.37-2.05a1,1,0,0,1,1.36-.37l4.75,2.77a1.26,1.26,0,0,0,1.6-.4l3.22-5a2.5,2.5,0,0,0-.66-3.76Z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12,12,8.81,9.85a1,1,0,0,0-1.36.37L4.23,15.27a2.5,2.5,0,0,1,3,3.66l1.37-2.05a1,1,0,0,0,.19-.54l-.44-3.13"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.23,3.44a2.5,2.5,0,0,0-3.46,0L3.44,9.77a2.5,2.5,0,0,0,0,3.46L9.77,19.56a2.5,2.5,0,0,0,3.46,0l6.33-6.33a2.5,2.5,0,0,0,0-3.46Z"/><line x1="16.25" y1="6.75" x2="19.25" y2="3.75" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><line x1="13.25" y1="9.75" x2="16.25" y2="6.75" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>;
const FatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const CarbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ analysis, onUpdateAnalysis }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editableAnalysis, setEditableAnalysis] = useState<FoodAnalysis>(analysis);

  useEffect(() => {
    setEditableAnalysis(analysis);
  }, [analysis]);

  const calculatedTotals = useMemo<NutritionInfo>(() => {
    return editableAnalysis.ingredients.reduce((totals, ingredient) => {
      totals.calories += ingredient.calories || 0;
      totals.protein += ingredient.protein || 0;
      totals.fat += ingredient.fat || 0;
      totals.carbohydrates += ingredient.carbohydrates || 0;
      return totals;
    }, { calories: 0, protein: 0, fat: 0, carbohydrates: 0 });
  }, [editableAnalysis.ingredients]);

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...editableAnalysis.ingredients];
    const ingredient = { ...newIngredients[index] };
    
    if (typeof value === 'string' && field === 'name') {
      ingredient[field] = value;
    } else if (typeof value === 'string') {
       const numValue = parseFloat(value) || 0;
       (ingredient[field] as number) = numValue < 0 ? 0 : numValue;
    }
    
    newIngredients[index] = ingredient;
    setEditableAnalysis({ ...editableAnalysis, ingredients: newIngredients });
  };

  const handleAddIngredient = () => {
    const newIngredient: Ingredient = { name: t('ingredientName'), weightGrams: 0, calories: 0, protein: 0, fat: 0, carbohydrates: 0 };
    setEditableAnalysis({ ...editableAnalysis, ingredients: [...editableAnalysis.ingredients, newIngredient] });
  };

  const handleDeleteIngredient = (index: number) => {
    const newIngredients = editableAnalysis.ingredients.filter((_, i) => i !== index);
    setEditableAnalysis({ ...editableAnalysis, ingredients: newIngredients });
  };

  const handleSaveChanges = () => {
    const finalAnalysis = { ...editableAnalysis, totalNutrition: calculatedTotals };
    onUpdateAnalysis(finalAnalysis);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableAnalysis(analysis);
    setIsEditing(false);
  };

  const displayTotals = isEditing ? calculatedTotals : analysis.totalNutrition;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight sm:text-4xl">{analysis.dishName}</h2>
        <p className="mt-2 text-lg text-gray-600">{t('resultsDescription')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <NutritionCard label={t('calories')} value={displayTotals.calories} unit="kcal" icon={<FireIcon />} color="bg-red-500" />
        <NutritionCard label={t('protein')} value={displayTotals.protein} unit="g" icon={<ProteinIcon />} color="bg-blue-500" />
        <NutritionCard label={t('fat')} value={displayTotals.fat} unit="g" icon={<FatIcon />} color="bg-yellow-500" />
        <NutritionCard label={t('carbs')} value={displayTotals.carbohydrates} unit="g" icon={<CarbIcon />} color="bg-green-500" />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">{t('identifiedIngredients')}</h3>
            {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-full hover:bg-emerald-200">{t('edit')}</button>
            ) : (
                <div className="flex gap-2">
                    <button onClick={handleSaveChanges} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-full hover:bg-emerald-700">{t('saveChanges')}</button>
                    <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300">{t('cancel')}</button>
                </div>
            )}
        </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('ingredient')}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('weight')} (g)</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('calories')}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('protein')} (g)</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('fat')} (g)</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('carbs')} (g)</th>
                {isEditing && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {editableAnalysis.ingredients.map((ingredient, index) => (
                isEditing ? (
                <tr key={index}>
                    <td className="px-6 py-4"><input type="text" value={ingredient.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} className="w-full p-1 border rounded capitalize" /></td>
                    <td className="px-6 py-4"><input type="number" value={ingredient.weightGrams} onChange={(e) => handleIngredientChange(index, 'weightGrams', e.target.value)} className="w-20 p-1 border rounded text-right" /></td>
                    <td className="px-6 py-4"><input type="number" value={ingredient.calories} onChange={(e) => handleIngredientChange(index, 'calories', e.target.value)} className="w-20 p-1 border rounded text-right" /></td>
                    <td className="px-6 py-4"><input type="number" value={ingredient.protein} step="0.1" onChange={(e) => handleIngredientChange(index, 'protein', e.target.value)} className="w-20 p-1 border rounded text-right" /></td>
                    <td className="px-6 py-4"><input type="number" value={ingredient.fat} step="0.1" onChange={(e) => handleIngredientChange(index, 'fat', e.target.value)} className="w-20 p-1 border rounded text-right" /></td>
                    <td className="px-6 py-4"><input type="number" value={ingredient.carbohydrates} step="0.1" onChange={(e) => handleIngredientChange(index, 'carbohydrates', e.target.value)} className="w-20 p-1 border rounded text-right" /></td>
                    <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteIngredient(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </td>
                </tr>
                ) : (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{ingredient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{Math.round(ingredient.weightGrams)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{Math.round(ingredient.calories)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{ingredient.protein.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{ingredient.fat.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{ingredient.carbohydrates.toFixed(1)}</td>
                </tr>
                )
              ))}
            </tbody>
          </table>
          {isEditing && (
            <div className="p-4 text-center border-t">
                <button onClick={handleAddIngredient} className="text-emerald-600 font-semibold text-sm hover:text-emerald-800">{t('addIngredient')}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;