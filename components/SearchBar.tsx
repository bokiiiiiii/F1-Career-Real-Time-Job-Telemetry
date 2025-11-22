import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  savedKeywords: string[];
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  savedKeywords, 
  addKeyword, 
  removeKeyword 
}) => {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // App.tsx handles splitting by comma
      addKeyword(searchTerm);
      setSearchTerm(''); 
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10 group">
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-cyan-600/70 group-focus-within:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-20 py-4 bg-slate-900/80 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] hover:border-slate-600 hover:bg-slate-900"
          placeholder="Add keywords (e.g. Red Bull, Engineer, Aero)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <kbd className="hidden sm:inline-block px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-400 mr-2">
            ENTER
          </kbd>
        </div>
      </div>

      {/* Saved Keywords Chips */}
      <div className="min-h-[2rem]">
        {savedKeywords.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center animate-fade-in">
            <span className="text-xs text-slate-500 flex items-center mr-1">Watching:</span>
            {savedKeywords.map((keyword, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1 pl-3 pr-2 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium backdrop-blur-md transition-all hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] group/chip"
              >
                <span>{keyword}</span>
                <button 
                  onClick={() => removeKeyword(keyword)}
                  className="ml-1 p-0.5 rounded-md text-cyan-600 hover:bg-cyan-900 hover:text-cyan-200 transition-colors"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button 
              onClick={() => savedKeywords.forEach(k => removeKeyword(k))}
              className="ml-2 text-xs text-slate-500 hover:text-cyan-400 underline transition-colors py-1 px-2"
            >
              Clear All
            </button>
          </div>
        ) : (
          <p className="text-center text-slate-600 text-xs italic">
            Type keywords to track specific roles or teams. Press Enter to save.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;