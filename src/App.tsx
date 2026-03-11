import { useState, useCallback } from 'react';
import { TopScreen } from './components/TopScreen';
import { RouletteOverlay } from './components/RouletteOverlay';
import { ResultScreen } from './components/ResultScreen';
import { useAiDecision } from './hooks/useAiDecision';
import { type VisitingContext, type AiDecisionResult } from './types/context';

type ScreenState = 'top' | 'roulette' | 'result';

function App() {
  const [screen, setScreen] = useState<ScreenState>('top');
  const [aiDecision, setAiDecision] = useState<AiDecisionResult | null>(null);

  const { decide, loading: isAiThinking } = useAiDecision();

  const handleStart = useCallback(async (context: VisitingContext) => {
    setScreen('roulette');

    try {
      const decision = await decide(context);
      setAiDecision(decision);
    } catch (error) {
      console.error("Error determining AI reason", error);
    }
  }, [decide]);

  const handleRouletteComplete = useCallback(() => {
    setScreen('result');
  }, []);

  const handleRetry = useCallback(() => {
    setScreen('roulette');
  }, []);

  const handleHome = useCallback(() => {
    setScreen('top');
    setAiDecision(null);
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden">
      {screen === 'top' && (
        <TopScreen onStart={handleStart} isLocating={isAiThinking} />
      )}

      {screen === 'roulette' && (
        <RouletteOverlay onComplete={handleRouletteComplete} />
      )}

      {screen === 'result' && (
        <ResultScreen aiDecision={aiDecision} onRetry={handleRetry} onHome={handleHome} />
      )}
    </div>
  );
}

export default App;
