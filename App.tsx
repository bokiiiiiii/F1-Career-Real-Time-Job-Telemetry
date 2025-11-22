import React, { useState, useEffect, useMemo } from 'react';
import { JobPosting } from './types';
import { TEAMS_CONFIG, TeamConfig } from './constants';
import { fetchTeamJobs } from './services/geminiService';
import JobCard from './components/JobCard';
import SearchBar from './components/SearchBar';
import Header from './components/Header';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [scannedCount, setScannedCount] = useState<number>(0);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Persistent Keywords State
  const [savedKeywords, setSavedKeywords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('f1_job_keywords');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load keywords", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('f1_job_keywords', JSON.stringify(savedKeywords));
  }, [savedKeywords]);

  const addKeyword = (input: string) => {
    const newTerms = input.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (newTerms.length === 0) return;
    setSavedKeywords(prev => {
      const unique = new Set(prev);
      newTerms.forEach(term => unique.add(term));
      return Array.from(unique);
    });
  };

  const removeKeyword = (keywordToRemove: string) => {
    setSavedKeywords(prev => prev.filter(k => k !== keywordToRemove));
  };

  const loadJobs = async () => {
    setIsScanning(true);
    setJobs([]); // Clear previous jobs to avoid duplicates
    setScannedCount(0);

    // Fire requests in parallel
    const promises = TEAMS_CONFIG.map(async (teamConfig) => {
      try {
        const teamJobs = await fetchTeamJobs(teamConfig);
        // Incremental update: Add new jobs as they arrive
        setJobs(prev => [...prev, ...teamJobs]);
      } catch (e) {
        console.error(`Failed to load ${teamConfig.name}`, e);
      } finally {
        setScannedCount(prev => prev + 1);
      }
    });

    await Promise.allSettled(promises);
    setIsScanning(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredJobs = useMemo(() => {
    let result = jobs;

    // 1. Filter by Saved Keywords (OR logic)
    if (savedKeywords.length > 0) {
      result = result.filter(job => 
        savedKeywords.some(keyword => {
          const k = keyword.toLowerCase();
          return (
            job.title.toLowerCase().includes(k) ||
            job.team.toLowerCase().includes(k) ||
            job.location.toLowerCase().includes(k) ||
            job.department.toLowerCase().includes(k)
          );
        })
      );
    }

    // 2. Filter by current search term (AND logic)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(term) ||
        job.team.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term) ||
        job.department.toLowerCase().includes(term)
      );
    }

    return result;
  }, [jobs, searchTerm, savedKeywords]);

  const newJobsCount = jobs.filter(j => j.isNew).length;
  const progressPercentage = Math.round((scannedCount / TEAMS_CONFIG.length) * 100);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 selection:bg-cyan-500 selection:text-white flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tighter drop-shadow-2xl">
            BOKI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">F1</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
            Real-time Job Telemetry. Crawling official team portals via AI Agents.
          </p>
        </div>

        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          savedKeywords={savedKeywords}
          addKeyword={addKeyword}
          removeKeyword={removeKeyword}
        />

        {/* Status Bar & Progress */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 border-b border-slate-800/60 pb-4 gap-4">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-semibold text-white tracking-wide">
               {savedKeywords.length > 0 ? 'FILTERED FEED' : 'LIVE FEED'}
             </h2>
             <span className={`px-3 py-1 rounded text-xs font-mono border shadow-inner transition-colors ${
                 savedKeywords.length > 0 && filteredJobs.length > 0 
                   ? 'bg-cyan-900/40 text-cyan-200 border-cyan-700/50' 
                   : 'bg-slate-800/80 text-slate-300 border-slate-700'
               }`}>
                 {filteredJobs.length} POSITIONS
             </span>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {isScanning && (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-3 flex-1 md:flex-none">
                  <div className="w-full md:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 transition-all duration-300 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 min-w-[40px]">{progressPercentage}%</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 uppercase animate-pulse tracking-wider">
                    CRAWLING TARGETS...
                </span>
              </div>
            )}

            <button 
              onClick={loadJobs} 
              disabled={isScanning}
              className={`flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isScanning ? 'CRAWLING...' : 'REFRESH'}
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Render Jobs */}
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            {/* Loading Placeholders - Show fewer as jobs load */}
            {isScanning && Array.from({ length: Math.max(0, 3 - jobs.length % 3) }).map((_, i) => (
               <div key={`skeleton-${i}`} className="h-64 bg-slate-800/20 rounded-xl animate-pulse border border-slate-800/50 flex items-center justify-center">
                <div className="text-center">
                  <span className="inline-block w-2 h-2 bg-cyan-500 rounded-full animate-bounce mr-1"></span>
                  <span className="inline-block w-2 h-2 bg-cyan-500 rounded-full animate-bounce mr-1 delay-75"></span>
                  <span className="inline-block w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-150"></span>
                  <p className="text-xs text-slate-600 font-mono mt-2 uppercase">Accessing Portals...</p>
                </div>
              </div>
            ))}

            {!isScanning && filteredJobs.length === 0 && (
               <div className="col-span-full text-center py-20 bg-slate-800/20 rounded-xl border border-slate-800/50 border-dashed">
                 <p className="text-slate-500 text-lg mb-2">No positions matching your filters.</p>
                 <button 
                   onClick={() => { setSearchTerm(""); setSavedKeywords([]); }} 
                   className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-600 rounded-full transition-all text-sm font-medium"
                 >
                   Reset Filters
                 </button>
               </div>
            )}
        </div>

      </main>
      
      <footer className="border-t border-slate-800 bg-slate-900/50 py-8 mt-auto backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} BOKI F1.
            <br/>
            Scanning {TEAMS_CONFIG.length} Official Team Portals.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;