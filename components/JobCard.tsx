import React from 'react';
import { JobPosting } from '../types';
import { TEAM_COLORS, TEAM_BORDER_COLORS } from '../constants';

interface JobCardProps {
  job: JobPosting;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const accentColor = TEAM_COLORS[job.team] || '#cbd5e1';
  const borderColorClass = TEAM_BORDER_COLORS[job.team] || 'border-slate-700';

  return (
    <div className={`relative group bg-slate-800/40 backdrop-blur-md border ${borderColorClass} border-opacity-30 hover:border-opacity-100 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:-translate-y-1 flex flex-col justify-between h-full overflow-hidden`}>
      
      {/* Glow effect based on team color */}
      <div 
        className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-1.5" 
        style={{ backgroundColor: accentColor }}
      />

      <div>
        <div className="flex justify-between items-start mb-4 pl-3">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-1 block">{job.team}</span>
            <h3 className="text-xl font-bold text-slate-100 leading-tight group-hover:text-cyan-400 transition-colors">{job.title}</h3>
          </div>
          {job.isNew && (
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              New
            </span>
          )}
        </div>

        <div className="pl-3 mb-4">
           <p className="text-slate-400 text-sm line-clamp-2 mb-3">{job.descriptionShort}</p>
           
           <div className="flex flex-wrap gap-2">
             <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-900/50 text-slate-300 border border-slate-700 group-hover:border-slate-600 transition-colors">
               <svg className="mr-1.5 h-3 w-3 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               {job.location}
             </span>
             <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-900/50 text-slate-300 border border-slate-700 group-hover:border-slate-600 transition-colors">
               <svg className="mr-1.5 h-3 w-3 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
               {job.department}
             </span>
           </div>
        </div>
      </div>

      <div className="pl-3 mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-end">
        <div className="text-xs text-slate-500 font-mono space-y-1">
          <div>Posted: <span className="text-slate-300">{job.datePosted}</span></div>
          {job.dateClosing && <div>Closes: <span className="text-cyan-400">{job.dateClosing}</span></div>}
        </div>
        <a 
          href={job.applyUrl || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-bold text-white bg-slate-800 hover:bg-cyan-600 px-4 py-2 rounded transition-all border border-slate-600 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2"
        >
          APPLY
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default JobCard;