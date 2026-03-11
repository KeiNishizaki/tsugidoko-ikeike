import { useState, useCallback } from 'react';
import { type VisitingContext, type AiDecisionResult } from '../types/context';
import { AiMockService } from '../services/aiMockService';

export const useAiDecision = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AiDecisionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const decide = useCallback(async (context: VisitingContext) => {
        setLoading(true);
        setError(null);
        try {
            const decision = await AiMockService.getDecision(context);
            setResult(decision);
            return decision;
        } catch (e) {
            const errorMessage = 'AIの思考が停止しました。';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, result, error, decide };
};
