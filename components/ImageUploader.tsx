
import React, { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface ImageUploaderProps {
  onImageSelect: (file: File, dataUrl: string) => void;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isProcessing }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const processFile = (file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        onImageSelect(file, dataUrl);
      };
      reader.readAsDataURL(file);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isProcessing) return;
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
  }, [isProcessing, onImageSelect]);


  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        onClick={handleContainerClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative group border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${
          isProcessing ? 'border-gray-300 bg-gray-100' : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50'
        } ${imagePreview ? 'border-solid' : ''}`}
      >
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />
        {imagePreview ? (
          <div className="relative">
            <img src={imagePreview} alt={t('selectedMealAlt')} className="w-full h-auto rounded-lg object-cover" />
             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-300 rounded-lg">
                <p className="text-white opacity-0 group-hover:opacity-100 text-lg font-semibold">{t('changeImage')}</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8l4 4m0 0l4 4m-4-4v12m-12 4h.01M12 28h.01" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold text-emerald-600">{t('uploadFile')}</span> {t('dragAndDrop')}
            </p>
            <p className="text-xs text-gray-500">{t('imageFormats')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
