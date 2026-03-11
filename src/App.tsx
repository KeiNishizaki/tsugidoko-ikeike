import { useState, useCallback } from 'react';
import { TopScreen } from './components/TopScreen';
import { RouletteOverlay } from './components/RouletteOverlay';
import { ResultScreen } from './components/ResultScreen';
import { mockLocations, type Location } from './data/mockLocations';
import { useGeolocation } from './hooks/useGeolocation';
import { useAiDecision } from './hooks/useAiDecision';
import { type VisitingContext, type AiDecisionResult } from './types/context';

type ScreenState = 'top' | 'roulette' | 'result';

function App() {
  const [screen, setScreen] = useState<ScreenState>('top');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [aiDecision, setAiDecision] = useState<AiDecisionResult | null>(null);

  const { fetchLocation, loading: isLocating } = useGeolocation();
  const { decide, loading: isAiThinking } = useAiDecision();

  const handleStart = useCallback(async (context: VisitingContext) => {
    setScreen('roulette');

    // Trigger location fetch and AI promise concurrently
    const locationPromise = fetchLocation();
    const aiPromise = decide(context);

    try {
      const [_, decision] = await Promise.all([locationPromise, aiPromise]);
      setAiDecision(decision);
    } catch (error) {
      console.error("Error determining location or AI reason", error);
    }
  }, [fetchLocation, decide]);

  const handleRouletteComplete = useCallback(() => {
    // Randomize logic (currently ignores AI keyword for mock simplicity, but we have it in aiDecision)
    const randomIndex = Math.floor(Math.random() * mockLocations.length);
    setSelectedLocation(mockLocations[randomIndex]);
    setScreen('result');
  }, []);

  const handleRetry = useCallback(() => {
    setScreen('roulette');
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden">
      {screen === 'top' && (
        <TopScreen onStart={handleStart} isLocating={isLocating || isAiThinking} />
      )}

      {screen === 'roulette' && (
        <RouletteOverlay onComplete={handleRouletteComplete} />
      )}

      {screen === 'result' && (
        <ResultScreen location={selectedLocation} aiReason={aiDecision?.reason} onRetry={handleRetry} />
      )}
    </div>
  );
}

export default App;
