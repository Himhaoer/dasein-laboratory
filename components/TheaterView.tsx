import React, { useState, useEffect } from 'react';
import { analyzeConflict } from '../services/geminiService';
import { TheaterAnalysis, Language, NarrativeEvent } from '../types';
import { translations } from '../translations';

interface TheaterViewProps {
  language: Language;
  addToHistory: (event: NarrativeEvent) => void;
  initialInput?: string;
}

const TheaterView: React.FC<TheaterViewProps> = ({ language, addToHistory, initialInput }) => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<TheaterAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const t = translations[language].theater;

  // Load initial input if provided (from Archive)
  useEffect(() => {
    if (initialInput) {
        setInput(initialInput);
    }
  }, [initialInput]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setAnalysis(null);
    setIsSaved(false);
    
    try {
      const result = await analyzeConflict(input, language);
      setAnalysis(result);
      
      // Automatically save valid results to history
      if (result && result.symptom !== "Error") {
        addToHistory({
          id: `tension-${Date.now()}`,
          type: 'tension_analysis',
          timestamp: Date.now(),
          content: result
        });
        setIsSaved(true);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 md:p-12 overflow-y-auto w-full">
      <div className="max-w-3xl mx-auto w-full space-y-8 pb-12">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-display text-text tracking-[0.2em]">{t.title}</h2>
          <p className="text-muted font-serif italic text-sm opacity-70">
            {t.quote}
          </p>
        </div>

        {!analysis && !loading && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in-up">
             <textarea
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder={t.placeholder}
               className="w-full h-40 bg-surface/50 border border-subtle rounded-xl p-6 text-white placeholder-gray-600 focus:border-core/50 focus:ring-1 focus:ring-core/50 transition-all outline-none resize-none font-serif text-lg leading-relaxed shadow-inner"
             />
             <button
               onClick={handleAnalyze}
               disabled={!input.trim()}
               className="px-8 py-3 bg-text text-black font-display tracking-widest text-xs hover:bg-white hover:scale-105 transition-all uppercase disabled:opacity-50 disabled:hover:scale-100 rounded-sm"
             >
               {t.cta}
             </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-t-2 border-r-2 border-core rounded-full animate-spin"></div>
            <p className="text-muted font-mono text-xs animate-pulse tracking-widest">{t.loading}</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Success indicator */}
            {isSaved && (
              <div className="text-center mb-4">
                 <span className="text-[10px] text-core uppercase tracking-widest border border-core/30 px-3 py-1 rounded-full bg-core/10">
                    {language === 'zh' ? '已收录至叙事档案' : 'Archived to Narrative'}
                 </span>
              </div>
            )}

            {/* Row 1: The Internal Conflict (Id vs Superego) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Id */}
              <div className="bg-[#1a0505]/50 border border-id/20 p-6 rounded-lg relative overflow-hidden">
                <h3 className="text-id/80 font-display text-xs uppercase tracking-widest mb-3 border-b border-id/10 pb-2">{t.idTitle}</h3>
                <p className="text-gray-300 font-serif leading-relaxed italic">
                  "{analysis.idVoice}"
                </p>
              </div>

              {/* Superego */}
              <div className="bg-[#050c1a]/50 border border-superego/20 p-6 rounded-lg relative overflow-hidden">
                <h3 className="text-superego/80 font-display text-xs uppercase tracking-widest mb-3 border-b border-superego/10 pb-2">{t.superegoTitle}</h3>
                <p className="text-gray-300 font-serif leading-relaxed italic">
                  "{analysis.superegoVoice}"
                </p>
              </div>

            </div>

            {/* Row 2: The Knot (Symptom) */}
            <div className="bg-surface border border-gray-700/50 p-6 rounded-lg border-l-4 border-l-gray-500 relative">
               <div className="absolute -left-2 top-6 w-4 h-4 bg-void border border-gray-500 rotate-45"></div>
               <h3 className="text-gray-400 font-display text-xs uppercase tracking-widest mb-3">{t.symptomTitle}</h3>
               <p className="text-white font-serif text-lg">
                 {analysis.symptom}
               </p>
            </div>

            {/* Row 3: Authorship (Resolution) */}
            <div className="bg-gradient-to-br from-surface to-core/5 border border-core/30 p-8 rounded-xl shadow-2xl relative mt-8">
              <div className="flex justify-between items-start mb-4">
                 <h4 className="text-core font-display text-sm tracking-[0.2em] uppercase">{t.synthesisTitle}</h4>
                 <div className="flex items-center gap-2 text-xs font-mono text-muted">
                    <span className="w-2 h-2 rounded-full bg-core animate-pulse"></span>
                    {analysis.emotionalState}
                 </div>
              </div>
              
              <p className="text-gray-200 font-serif text-xl leading-relaxed">
                {analysis.authorship}
              </p>
            </div>

            <button
               onClick={() => { setAnalysis(null); setInput(''); setIsSaved(false); }}
               className="mx-auto block text-muted hover:text-white transition-colors text-xs uppercase tracking-widest py-8 opacity-50 hover:opacity-100"
             >
               {t.reset}
             </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default TheaterView;
