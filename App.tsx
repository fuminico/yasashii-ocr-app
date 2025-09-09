
import React, { useState, useCallback } from 'react';
import { processImageWithGemini } from './services/geminiService';
import { ProcessResult } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ResultCard from './components/ResultCard';
import { Loader } from './components/Icons';

const App: React.FC = () => {
  const [results, setResults] = useState<ProcessResult[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const updateResult = useCallback((id: string, updates: Partial<Omit<ProcessResult, 'id'>>) => {
    setResults(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  const handleFileProcess = useCallback(async (file: File, id: string) => {
    try {
      updateResult(id, { status: 'processing' });
      const data = await processImageWithGemini(file);
      updateResult(id, { status: 'success', data });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '不明なエラーが発生しました。';
      updateResult(id, { status: 'error', error: errorMessage });
    }
  }, [updateResult]);

  const handleFilesSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setGlobalError(null);
    setIsProcessing(true);

    const newTasks: ProcessResult[] = files.map(file => ({
      id: `${file.name}-${Date.now()}`,
      fileName: file.name,
      status: 'pending',
    }));

    setResults(prev => [...newTasks, ...prev]);

    await Promise.all(
      newTasks.map(task => handleFileProcess(files.find(f => f.name === task.fileName)!, task.id))
    );

    setIsProcessing(false);
  }, [handleFileProcess]);

  return (
    <div className="min-h-screen bg-gray-50 text-[#333333] flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-2">画像をアップロード</h2>
            <p className="text-gray-600 mb-6">日本語の文章が含まれる画像をアップロードしてください。<br/>OCRでテキストを抽出し、要約とフィードバックを生成します。</p>
            <FileUpload onFilesSelect={handleFilesSelect} isProcessing={isProcessing} />
          </div>

          {isProcessing && results.some(r => r.status === 'processing' || r.status === 'pending') && (
            <div className="flex items-center justify-center gap-4 my-8 text-[#FF8C69]">
              <Loader />
              <span className="text-lg font-medium">処理中です。しばらくお待ちください...</span>
            </div>
          )}
          
          {globalError && (
            <div className="bg-[#FFE4B5] border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md my-4" role="alert">
              <p className="font-bold">エラー</p>
              <p>{globalError}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-[#FF8C69] pb-2">処理結果</h3>
              {results.map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          )}
        </div>
      </main>
       <footer className="text-center p-4 text-gray-500 text-sm">
        <p>&copy; 2024 やさしいOCRさん. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
