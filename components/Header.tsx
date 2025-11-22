import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-slate-800/60 supports-[backdrop-filter]:bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 group cursor-pointer">
            {/* Logo Icon Removed */}
            <div className="flex flex-col justify-center -space-y-1">
              <span className="font-heading text-xl text-white tracking-widest group-hover:text-cyan-50 transition-colors">
                BOKI <span className="text-cyan-500">F1</span>
              </span>
              <span className="text-[0.6rem] text-slate-400 font-mono tracking-[0.2em] uppercase">Career Grid</span>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#" className="text-slate-400 hover:text-cyan-300 text-xs font-bold uppercase tracking-widest transition-colors">Teams</a>
            <a href="#" className="text-slate-400 hover:text-cyan-300 text-xs font-bold uppercase tracking-widest transition-colors">Locations</a>
            <a href="#" className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-bold text-white transition-all duration-300 bg-cyan-600 rounded hover:bg-cyan-500 group focus:outline-none focus:ring focus:ring-cyan-300 focus:ring-opacity-40">
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative text-sm tracking-wider">GET ALERTS</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;