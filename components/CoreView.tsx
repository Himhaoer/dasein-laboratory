import React, { useEffect, useState } from 'react';
import { Signifier, Language, NarrativeEvent } from '../types';
import { translations } from '../translations';
import { generateConstellationFromHistory } from '../services/geminiService';

interface CoreViewProps {
  language: Language;
  history: NarrativeEvent[];
}

const CoreView: React.FC<CoreViewProps> = ({ language, history }) => {
  const t = translations[language].core;
  const [signifiers, setSignifiers] = useState<Signifier[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSignifier, setSelectedSignifier] = useState<Signifier | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // If history is empty, we don't generate.
  const isEmpty = history.length === 0;

  const fetchInsights = async () => {
    if (isEmpty) return;
    setLoading(true);
    const data = await generateConstellationFromHistory(history, language);
    setSignifiers(data);
    setHasGenerated(true);
    setLoading(false);
    setSelectedSignifier(null);
  };

  // Auto-fetch if we have history but no signifiers yet (first load of tab)
  useEffect(() => {
    if (!isEmpty && !hasGenerated && !loading) {
      fetchInsights();
    }
  }, [history, language]);

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(217,119,6,0.05),_transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="absolute top-8 left-8 z-10 max-w-md pointer-events-none">
        <h2 className="text-2xl font-display text-text tracking-widest mb-2">{t.title}</h2>
        <p className="text-muted text-sm font-serif italic opacity-70">
          "{t.quote}"
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex items-center justify-center">
        
        {/* Empty State: The Void */}
        {isEmpty && (
          <div className="text-center max-w-lg p-8 animate-fade-in-up z-20">
            <div className="w-16 h-16 border border-subtle rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-2xl text-muted">∅</span>
            </div>
            <h3 className="text-xl font-display text-text mb-4 tracking-widest uppercase">
              {language === 'zh' ? '虚空' : 'The Void'}
            </h3>
            <p className="text-muted font-serif leading-relaxed mb-8">
              {language === 'zh' 
                ? '叙事星图需要观测你的生命轨迹才能形成。目前这里只有静默。请前往“思绪日志”记录当下的状态，或在“张力实验室”解构困境。' 
                : 'The constellation requires narrative data to manifest. Currently, there is only silence. Go to the "Logbook" to record your state, or the "Tension Lab" to deconstruct a conflict.'}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-core/50 font-display animate-pulse tracking-widest text-xs z-20">
            {t.loading}
          </div>
        )}

        {/* The Constellation */}
        {!isEmpty && !loading && (
          <div className="relative w-full h-full max-w-4xl max-h-[800px]">
            {signifiers.map((sig) => (
              <button
                key={sig.id}
                onClick={() => setSelectedSignifier(sig)}
                style={{
                  top: `${sig.y}%`,
                  left: `${sig.x}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${Math.random() * 5}s`
                }}
                className={`absolute group flex flex-col items-center justify-center animate-float transition-all duration-500 hover:z-50 ${
                   selectedSignifier?.id === sig.id ? 'scale-110 z-40' : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                {/* Orb */}
                <div 
                  className={`rounded-full border backdrop-blur-sm transition-all duration-500
                    ${selectedSignifier?.id === sig.id 
                      ? 'bg-core/20 border-core shadow-[0_0_30px_rgba(217,119,6,0.3)]' 
                      : 'bg-surface/30 border-subtle group-hover:border-core/50'
                    }
                  `}
                  style={{
                    width: `${sig.weight * 30 + 40}px`,
                    height: `${sig.weight * 30 + 40}px`,
                  }}
                />
                
                {/* Text Label */}
                <span className={`absolute font-display tracking-widest transition-colors duration-300 pointer-events-none
                   ${selectedSignifier?.id === sig.id ? 'text-white' : 'text-muted group-hover:text-text'}
                `}>
                  {sig.text}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Insight Overlay (Bottom Panel) */}
      <div className={`absolute bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md border-t border-subtle transition-transform duration-500 ease-in-out z-50 ${selectedSignifier ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-3xl mx-auto p-8 relative">
           <button 
             onClick={() => setSelectedSignifier(null)}
             className="absolute top-4 right-4 text-muted hover:text-white"
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
           {selectedSignifier && (
             <div className="space-y-2">
               <h3 className="text-core font-display text-lg tracking-widest uppercase mb-4">
                 {selectedSignifier.text}
               </h3>
               <p className="text-text font-serif text-lg leading-relaxed">
                 "{selectedSignifier.insight}"
               </p>
             </div>
           )}
        </div>
      </div>

      {/* Refresh Button (Only if we have history) */}
      {!isEmpty && !loading && !selectedSignifier && (
        <div className="absolute bottom-8 w-full flex justify-center pointer-events-none z-30">
            <button 
                onClick={fetchInsights}
                className="pointer-events-auto px-6 py-2 border border-subtle bg-void/50 backdrop-blur rounded-full text-xs text-muted hover:text-white hover:border-core transition-all uppercase tracking-widest font-sans"
            >
                {t.insightBtn}
            </button>
        </div>
      )}

    </div>
  );
};

export default CoreView;
