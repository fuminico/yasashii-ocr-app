
import React from 'react';
import { LogoIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="text-[#FF8C69]">
            <LogoIcon />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            やさしいOCRさん
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
