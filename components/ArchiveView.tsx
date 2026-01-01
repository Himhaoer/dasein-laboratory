import React from 'react';
import { NarrativeEvent, Language, TheaterAnalysis } from '../types';
import { translations } from '../translations';

interface ArchiveViewProps {
  language: Language;
  history: NarrativeEvent[];
  onDeconstruct: (text: string) => void;
}

const ArchiveView: React.FC<ArchiveViewProps> = ({ language, history, onDeconstruct }) => {
  const t = translations[language].archive;
  
  // Sort reverse chronological
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="h-full flex flex-col p-6 md:p-12 overflow-y-auto w-full">
      <div className="max-w-4xl mx-auto w-full pb-12">
        <h2 className="text-2xl font-display text-text tracking-[0.2em] mb-8 sticky top-0 bg-void/90 backdrop-blur py-4 z-10">
            {t.title}
        </h2>
        
        {sortedHistory.length === 0 && (
            <div className="text-muted font-serif italic opacity-50 text-center mt-20">
                {t.empty}
            </div>
        )}

        <div className="space-y-8 relative before:content-[''] before:absolute before:left-4 md:before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-subtle">
          {sortedHistory.map((event) => (
            <div key={event.id} className="relative pl-12 md:pl-20 animate-fade-in-up">
              
              {/* Timeline Node */}
              <div className={`absolute left-2.5 md:left-[29px] w-3 h-3 rounded-full border-2 transform -translate-x-1/2 mt-1.5 z-10 ${
                  event.type === 'tension_analysis' ? 'bg-core border-core shadow-[0_0_10px_rgba(217,119,6,0.5)]' : 'bg-surface border-gray-600'
              }`}></div>

              {/* Date */}
              <div className="text-[10px] text-muted font-mono mb-1 uppercase tracking-wider">
                {t.dateFormat(event.timestamp)} • {event.type === 'log_entry' ? t.logType : t.analysisType}
              </div>

              {/* Content Card */}
              {event.type === 'log_entry' ? (
                <div className="bg-surface/50 border border-subtle p-5 rounded-lg hover:border-gray-600 transition-colors group">
                    <p className="text-gray-300 font-serif whitespace-pre-wrap leading-relaxed">
                        {event.content as string}
                    </p>
                    <button 
                        onClick={() => onDeconstruct(event.content as string)}
                        className="mt-4 text-[10px] uppercase tracking-widest text-core opacity-0 group-hover:opacity-100 transition-opacity hover:underline flex items-center gap-2"
                    >
                        <span>{t.analyzeAction}</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#1a0f05] to-surface border border-core/30 p-6 rounded-lg shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <svg className="w-16 h-16 text-core" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M9.75 6a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM5 12.75a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H5.75a.75.75 0 01-.75-.75zM9.75 16.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" />
                        </svg>
                    </div>
                    {( () => {
                        const data = event.content as TheaterAnalysis;
                        return (
                            <div className="relative z-10 space-y-3">
                                <div className="text-xs text-core/80 uppercase tracking-widest font-display mb-2">{data.symptom}</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-serif italic text-gray-400 border-t border-core/10 pt-3">
                                    <div><span className="text-id/70 not-italic text-[10px] uppercase block mb-1">Id</span> {data.idVoice}</div>
                                    <div><span className="text-superego/70 not-italic text-[10px] uppercase block mb-1">Superego</span> {data.superegoVoice}</div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-core/20">
                                    <span className="text-[10px] text-muted uppercase tracking-widest block mb-1">Authorship</span>
                                    <p className="text-white font-serif">{data.authorship}</p>
                                </div>
                            </div>
                        )
                    })()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchiveView;
