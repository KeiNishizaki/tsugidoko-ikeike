import { type VisitingContext, type AiDecisionResult } from '../types/context';

export class AiMockService {
    static async getDecision(context: VisitingContext): Promise<AiDecisionResult> {
        // Simulate Azure OpenAI latency (1.5 - 2.5 seconds)
        const delay = Math.random() * 1000 + 1500;
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Basic mock logic based on inputs to simulate AI "reasoning"
        let reason = '';
        let keyword = '';

        if (context.drunkenness > 80) {
            reason = `酔い度${context.drunkenness}だと！？もうベロベロじゃないか！これ以上飲ませるわけにはいかない。大人しくラーメン食って帰れ！`;
            keyword = 'ラーメン 深夜';
        } else if (context.recentAction.includes('麻雀') || context.recentAction.includes('ゲーム')) {
            reason = `${context.groupType} ${context.participants}人で${context.recentAction}終わり、かつシラフなら、頭を使った後はここに行くしかない。〇〇ラーメンに行け！いや、肉でもいいぞ！`;
            keyword = '焼肉 または ラーメン';
        } else if (context.request.includes('静か')) {
            reason = `「${context.request}」という弱気な要望を受信した。仕方がない、${context.participants}人でしっぽり語れる静かな場所を探してやる。感謝しろ！`;
            keyword = '静か カフェ または バー';
        } else if (context.participants >= 5) {
            reason = `${context.participants}人の大所帯か…！全員が座れる広い居酒屋に叩き込んでやる！騒いでも怒られない場所だ！`;
            keyword = '大人数 居酒屋 ワイワイ';
        } else {
            reason = `お前らの状況（${context.groupType} ${context.participants}人, 酔い度${context.drunkenness}）なら、次はここ一択だ！思考停止して向かえ！`;
            keyword = '居酒屋 または バー';
        }

        return { keyword, reason };
    }
}
