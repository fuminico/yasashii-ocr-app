
import React, { useState } from 'react';
import { ProcessResult } from '../types';
import { PraiseIcon, ImproveIcon, ErrorIcon, ChevronDownIcon, Loader, DocumentIcon } from './Icons';

interface ResultCardProps {
  result: ProcessResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const toggleTextVisibility = () => setIsTextVisible(!isTextVisible);

  const renderContent = () => {
    switch (result.status) {
      case 'processing':
      case 'pending':
        return (
          <div className="flex items-center gap-3 text-gray-500">
            <Loader />
            <span>処理中...</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col gap-2 text-red-600">
            <div className="flex items-center gap-2 font-semibold">
              <ErrorIcon />
              <span>エラーが発生しました</span>
            </div>
            <p className="pl-6 text-sm bg-red-50 p-3 rounded-md">{result.error}</p>
          </div>
        );
      case 'success':
        if (!result.data) return null;
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">要約</h4>
              <p className="text-gray-700 bg-gray-100 p-4 rounded-lg leading-relaxed">{result.data.summary}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-green-700">
                  <PraiseIcon />
                  <span>褒めポイント</span>
                </h4>
                <ul className="list-none space-y-2 pl-0">
                  {result.data.praisePoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-green-500 font-bold mt-1">&#10003;</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                  <ImproveIcon />
                  <span>改善ポイント</span>
                </h4>
                <ul className="list-none space-y-2 pl-0">
                  {result.data.improvementPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-500 font-bold mt-1">&#8594;</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <button
                onClick={toggleTextVisibility}
                className="flex items-center justify-between w-full text-left text-lg font-semibold text-gray-800 py-2"
              >
                <span>抽出された元のテキスト</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isTextVisible ? 'rotate-180' : ''}`} />
              </button>
              {isTextVisible && (
                <div className="mt-2 p-4 bg-gray-100 border border-gray-200 rounded-lg">
                  <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed font-sans">{result.data.extractedText}</pre>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300">
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 truncate">
          <DocumentIcon />
          <span>{result.fileName}</span>
        </h3>
      </div>
      <div className="p-4 sm:p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResultCard;
