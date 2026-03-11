import { useState, useCallback } from 'react';
import { TopScreen } from './components/TopScreen';
import { RouletteOverlay } from './components/RouletteOverlay';
import { ResultScreen } from './components/ResultScreen';
import { mockLocations, type Location } from './data/mockLocations';
import { useGeolocation } from './hooks/useGeolocation';
import { useAiDecision } from './hooks/useAiDecision';
import { usePlaceSearch } from './hooks/usePlaceSearch';
import { type VisitingContext, type AiDecisionResult } from './types/context';

type ScreenState = 'top' | 'roulette' | 'result';

function App() {
  const [screen, setScreen] = useState<ScreenState>('top');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [aiDecision, setAiDecision] = useState<AiDecisionResult | null>(null);
  const [fetchedLocations, setFetchedLocations] = useState<Location[]>([]);

  const { fetchLocation, loading: isLocating } = useGeolocation();
  const { decide, loading: isAiThinking } = useAiDecision();
  const { searchPlaces } = usePlaceSearch();

  const handleStart = useCallback(async (context: VisitingContext) => {
    setScreen('roulette');

    // Trigger location fetch and AI promise concurrently
    const locationPromise = fetchLocation();
    const aiPromise = decide(context);

    try {
      const [locationData, decision] = await Promise.all([locationPromise, aiPromise]);
      setAiDecision(decision);

      // Search places based on AI decision and coordinates
      try {
        const places = await searchPlaces(locationData.lat, locationData.lng, decision.keyword);
        setFetchedLocations(places);
      } catch (err) {
        console.error("Failed to fetch places", err);
        // Fallback to mock locations if search fails
        setFetchedLocations(mockLocations);
      }
    } catch (error) {
      console.error("Error determining location or AI reason", error);
      setFetchedLocations(mockLocations);
    }
  }, [fetchLocation, decide, searchPlaces]);

  const handleRouletteComplete = useCallback(() => {
    if (fetchedLocations.length === 0) {
      setSelectedLocation(mockLocations[0]); // Safe fallback
    } else {
      const randomIndex = Math.floor(Math.random() * fetchedLocations.length);
      setSelectedLocation(fetchedLocations[randomIndex]);
    }
    setScreen('result');
  }, [fetchedLocations]);

  const handleRetry = useCallback(() => {
    setScreen('roulette');
  }, []);

  const handleHome = useCallback(() => {
    setScreen('top');
    setSelectedLocation(null);
    setAiDecision(null);
    setFetchedLocations([]);
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
        <ResultScreen location={selectedLocation} aiReason={aiDecision?.reason} onRetry={handleRetry} onHome={handleHome} />
      )}
    </div>
  );
}

export default App;
