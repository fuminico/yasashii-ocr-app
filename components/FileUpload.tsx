
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragOver(true);
    } else if (e.type === 'dragleave') {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelect(Array.from(e.dataTransfer.files));
    }
  }, [onFilesSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(Array.from(e.target.files));
      // Reset input to allow re-uploading the same file
      e.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const borderColor = isDragOver ? 'border-[#FF8C69]' : 'border-gray-300';
  const bgColor = isDragOver ? 'bg-orange-50' : 'bg-gray-50';

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
        multiple
        accept="image/jpeg, image/png, image/webp"
        disabled={isProcessing}
      />
      <div
        className={`relative flex flex-col items-center justify-center w-full p-8 border-2 ${borderColor} border-dashed rounded-lg cursor-pointer ${bgColor} transition-colors duration-200 ease-in-out`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-lg font-medium text-gray-700">
            ここにファイルをドラッグ＆ドロップ
          </p>
          <p className="mt-1 text-sm text-gray-500">または</p>
          <button
            type="button"
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF8C69] hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-transform duration-150 ease-in-out hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isProcessing}
          >
            ファイルを選択
          </button>
          <p className="mt-4 text-xs text-gray-500">
            JPG, PNG, WEBP (最大10MB/ファイル, 10ファイルまで)
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
