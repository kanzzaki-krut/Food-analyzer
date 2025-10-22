
export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

export interface Ingredient extends NutritionInfo {
  name: string;
  weightGrams: number;
}

export interface FoodAnalysis {
  id: string;
  timestamp: number;
  imageDataUrl: string;
  dishName: string;
  totalNutrition: NutritionInfo;
  ingredients: Ingredient[];
}
