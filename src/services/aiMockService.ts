import { type VisitingContext, type AiDecisionResult } from '../types/context';

export class AiMockService {
    static async getDecision(context: VisitingContext): Promise<AiDecisionResult> {
        // デプロイしたAzure FunctionsのURL
        // ※ローカルでテストする場合は 'http://localhost:7071/api/decide' に変更してください
        const apiUrl = 'https://func-tugidokoikeike-hkdac8c8augvbng6.japanwest-01.azurewebsites.net/api/decide?code=RjOdu2OCLJmhYTrTjEVjpLKX3s4hgnkiedet-wfgPgJ-AzFutUUG9Q==';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(context), // C#側で受け取れるようにJSON化して送信
            });

            if (!response.ok) {
                throw new Error(`AI API Error: ${response.status}`);
            }

            // Azure Functions（C#）経由で生成されたAIの回答を受け取る
            const data: AiDecisionResult = await response.json();
            return data;

        } catch (error) {
            console.error("AI呼び出しエラー:", error);
            
            // 通信エラーでアプリが止まって「ぐだる」のを防ぐためのフォールバック
            return {
                keyword: '居酒屋',
                reason: '電波が悪いのかAIがサボっている！細かいことは気にするな、目の前にある一番近い居酒屋に飛び込め！'
            };
        }
    }
}