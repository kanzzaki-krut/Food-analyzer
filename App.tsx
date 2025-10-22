import React, { useState, useCallback, useEffect } from 'react';
import { FoodAnalysis } from './types';
import { analyzeImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ResultsDisplay from './components/ResultsDisplay';
import Spinner from './components/Spinner';
import LanguageSwitcher from './components/LanguageSwitcher';
import PortionSelector from './components/PortionSelector';
import HistoryModal from './components/HistoryModal';
import { useLanguage } from './hooks/useLanguage';

type PortionSize = 'small' | 'medium' | 'large';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<{file: File, dataUrl: string} | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portion, setPortion] = useState<PortionSize>('medium');
  const [history, setHistory] = useState<FoodAnalysis[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  
  const { t, language } = useLanguage();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('mealHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mealHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  const handleImageSelect = (file: File, dataUrl: string) => {
    setImageFile({ file, dataUrl });
    setAnalysisResult(null);
    setError(null);
  };
  
  const addAnalysisToHistory = (result: FoodAnalysis) => {
    setHistory(prevHistory => [result, ...prevHistory].slice(0, 50)); // Keep last 50 entries
  };
  
  const deleteFromHistory = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  };

  const handleUpdateAnalysis = (updatedAnalysis: FoodAnalysis) => {
    setAnalysisResult(updatedAnalysis);
    setHistory(prevHistory => 
        prevHistory.map(item => 
            item.id === updatedAnalysis.id ? updatedAnalysis : item
        )
    );
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError(t('errorSelectImage'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const resultData = await analyzeImage(imageFile.file, portion, language);
      const newAnalysis: FoodAnalysis = {
        ...resultData,
        id: new Date().toISOString(),
        timestamp: Date.now(),
        imageDataUrl: imageFile.dataUrl,
      };
      setAnalysisResult(newAnalysis);
      addAnalysisToHistory(newAnalysis);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('errorUnknown'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, portion, language, t]);
  
  const handleReset = () => {
    setImageFile(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    setPortion('medium');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <header className="text-center mb-10">
          <div className="absolute top-4 right-4 flex items-center gap-4">
              <button 
                onClick={() => setIsHistoryVisible(true)}
                className="text-gray-500 hover:text-emerald-600 transition-colors"
                aria-label={t('mealHistory')}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </button>
              <LanguageSwitcher />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </header>

        {!analysisResult && (
          <div className="flex flex-col items-center space-y-6">
            <ImageUploader onImageSelect={handleImageSelect} isProcessing={isLoading} />
            
            {imageFile && (
                <>
                <PortionSelector selectedPortion={portion} onPortionChange={setPortion} />
                <button
                    onClick={handleAnalyzeClick}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                    {isLoading ? (
                    <>
                        <Spinner className="mr-3" />
                        {t('analyzing')}
                    </>
                    ) : (
                    t('analyzeMeal')
                    )}
                </button>
                </>
            )}
          </div>
        )}

        {error && (
            <div className="mt-8 max-w-xl mx-auto p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center" role="alert">
                <strong className="font-bold">{t('errorOops')} </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {analysisResult && (
          <div className="space-y-8">
            <ResultsDisplay analysis={analysisResult} onUpdateAnalysis={handleUpdateAnalysis} />
            <div className="text-center">
                 <button
                    onClick={handleReset}
                    className="px-6 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 border border-transparent rounded-full hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                    {t('analyzeAnother')}
                </button>
            </div>
          </div>
        )}

        <HistoryModal 
            isVisible={isHistoryVisible}
            onClose={() => setIsHistoryVisible(false)}
            history={history}
            onDelete={deleteFromHistory}
        />

        <footer className="text-center mt-16 text-sm text-gray-500">
            <p></p>
        </footer>
      </main>
    </div>
  );
};

export default App;