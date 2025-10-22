
import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysis } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeImage = async (
  image: File,
  portion: 'small' | 'medium' | 'large',
  language: 'en' | 'ru'
): Promise<Omit<FoodAnalysis, 'id' | 'timestamp' | 'imageDataUrl'>> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = await fileToGenerativePart(image);

  const languageInstruction = language === 'ru' ? 'Ответь на русском языке.' : 'Respond in English.';
  const prompt = `Analyze the image of the food. Identify the dish, its ingredients, and estimate their weight in grams. Assume the portion size is '${portion}'. Calculate the total calories, protein, fat, and carbohydrates for the entire meal. Provide the response in the specified JSON format. If you cannot identify the food, provide a best-effort estimation but indicate the uncertainty in the dishName. ${languageInstruction}`;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
        parts: [
            imagePart,
            { text: prompt },
        ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dishName: { 
            type: Type.STRING,
            description: "The name of the identified dish."
          },
          totalNutrition: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.NUMBER, description: "Total calories in kcal." },
              protein: { type: Type.NUMBER, description: "Total protein in grams." },
              fat: { type: Type.NUMBER, description: "Total fat in grams." },
              carbohydrates: { type: Type.NUMBER, description: "Total carbohydrates in grams." }
            },
            required: ["calories", "protein", "fat", "carbohydrates"]
          },
          ingredients: {
            type: Type.ARRAY,
            description: "List of identified ingredients with their nutritional information.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of the ingredient." },
                weightGrams: { type: Type.NUMBER, description: "Estimated weight of the ingredient in grams." },
                calories: { type: Type.NUMBER, description: "Calories for this ingredient." },
                protein: { type: Type.NUMBER, description: "Protein for this ingredient in grams." },
                fat: { type: Type.NUMBER, description: "Fat for this ingredient in grams." },
                carbohydrates: { type: Type.NUMBER, description: "Carbohydrates for this ingredient in grams." }
              },
              required: ["name", "weightGrams", "calories", "protein", "fat", "carbohydrates"]
            }
          }
        },
        required: ["dishName", "totalNutrition", "ingredients"]
      },
    },
  });

  try {
    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);
    return parsedJson as Omit<FoodAnalysis, 'id' | 'timestamp' | 'imageDataUrl'>;
  } catch (error) {
    console.error("Failed to parse Gemini response:", response.text);
    throw new Error("Could not understand the response from the AI. Please try a different image.");
  }
};
