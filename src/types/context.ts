export type GroupType = '男子のみ' | '女子のみ' | '混合';

export interface VisitingContext {
    participants: number;
    groupType: GroupType;
    recentAction: string;
    drunkenness: number; // 0-100
    request: string;
}

export interface AiDecisionResult {
    keyword: string;
    reason: string;
}
