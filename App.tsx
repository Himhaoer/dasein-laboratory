import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import CoreView from './components/CoreView';
import MirrorView from './components/MirrorView';
import TheaterView from './components/TheaterView';
import ArchiveView from './components/ArchiveView';
import { ViewMode, Language, NarrativeEvent } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [language, setLanguage] = useState<Language>('zh');
  
  // The Single Source of Truth for the User's Narrative
  const [narrativeHistory, setNarrativeHistory] = useState<NarrativeEvent[]>([]);
  
  // State to hold text promoted from Archive to Theater
  const [theaterInput, setTheaterInput] = useState<string>('');

  // Helper to append history
  const addToHistory = (event: NarrativeEvent) => {
    setNarrativeHistory(prev => [...prev, event]);
  };
  
  // Action: Promote log from Archive to Theater
  const handleDeconstruct = (text: string) => {
    setTheaterInput(text);
    setCurrentView(ViewMode.THEATER);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewMode.DASHBOARD:
        return (
          <CoreView 
            language={language} 
            history={narrativeHistory} 
          />
        );
      case ViewMode.MIRROR:
        return (
          <MirrorView 
            language={language} 
            addToHistory={addToHistory}
          />
        );
      case ViewMode.THEATER:
        return (
          <TheaterView 
            language={language} 
            addToHistory={addToHistory}
            initialInput={theaterInput}
          />
        );
      case ViewMode.ARCHIVE:
        return (
            <ArchiveView 
                language={language}
                history={narrativeHistory}
                onDeconstruct={handleDeconstruct}
            />
        );
      default:
        return <CoreView language={language} history={narrativeHistory} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-void text-text overflow-hidden">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        language={language}
        onLanguageChange={setLanguage}
      />
      
      <main className="flex-1 h-[calc(100vh-80px)] md:h-screen overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface via-void to-void opacity-50"></div>
        {renderView()}
      </main>
    </div>
  );
};

export default App;
