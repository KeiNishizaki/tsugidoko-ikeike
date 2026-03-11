import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, RefreshCw, MessageSquareWarning, Home, Navigation } from 'lucide-react';
import { type AiDecisionResult } from '../types/context';

interface ResultScreenProps {
    aiDecision: AiDecisionResult | null;
    onRetry: () => void;
    onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ aiDecision, onRetry, onHome }) => {
    if (!aiDecision) return null;

    const handleOpenMap = () => {
        // 現在地周辺を指定のキーワードで検索するGoogle Maps URL
        // coordinatesがあればそれをベースにする（Google Mapsアプリが現在地を考慮して開いてくれます）
        const keyword = encodeURIComponent(aiDecision.keyword);
        const url = `https://www.google.com/maps/search/?api=1&query=${keyword}`;
        window.open(url, '_blank');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                className="flex flex-col items-center justify-center h-screen px-6 text-center"
            >
                <h2 className="text-4xl font-bold mb-6 text-gray-100 italic transform -rotate-2">
                    お前らはここに行け！
                </h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full max-w-sm mb-8 relative shadow-lg"
                >
                    <div className="absolute top-0 left-4 w-12 h-1 bg-blue-500 rounded-b"></div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-gray-700"></div>
                    <div className="absolute -bottom-[10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-gray-900 z-10"></div>

                    <div className="flex items-start gap-4 text-left">
                        <div className="bg-blue-500/20 p-2 rounded-full flex-shrink-0 animate-pulse">
                            <MessageSquareWarning className="text-blue-400" size={24} />
                        </div>
                        <p className="text-white font-bold leading-relaxed text-sm tracking-wide">
                            {aiDecision.reason}
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-blue-900 to-gray-900 border border-blue-800 rounded-2xl p-6 w-full max-w-sm mb-10 shadow-lg relative overflow-hidden"
                    whileHover={{ y: -5 }}
                >
                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                        
                        {/* 補足枠を上に配置 */}
                        <div className="text-sm text-gray-300 font-medium bg-gray-800/80 p-3 rounded-xl border border-gray-700 w-full shadow-inner mb-6">
                            <span className="text-gray-400 text-xs">検索キーワード</span><br/>
                            <span className="text-blue-400 font-bold text-lg inline-block my-1">「{aiDecision.keyword}」</span><br/>
                            <span className="text-gray-400 text-xs">で調べます</span>
                        </div>

                        {/* メイン結果表示 */}
                        <div className="text-sm text-blue-300 font-bold tracking-wider mb-2 flex items-center justify-center gap-2">
                            <Navigation size={16} />
                            次に行く場所は
                        </div>
                        <h3 className="text-4xl font-black text-white leading-tight mb-2 drop-shadow-md break-words w-full">
                            「{aiDecision.category || aiDecision.keyword}」
                        </h3>
                        <div className="text-lg font-bold text-gray-200">
                            です
                        </div>
                    </div>
                </motion.div>

                <div className="w-full max-w-sm flex flex-col gap-4">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpenMap}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl py-5 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-colors"
                    >
                        <Map size={24} />
                        周辺のお店を探す
                    </motion.button>

                    <div className="flex gap-4 mt-2">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onHome}
                            className="flex-1 bg-gray-800 text-gray-300 font-medium py-3 rounded-xl shadow-lg flex flex-col items-center justify-center gap-1 transition-colors hover:bg-gray-700"
                        >
                            <Home size={20} />
                            <span className="text-sm">ホームへ</span>
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onRetry}
                            className="flex-1 text-gray-400 font-medium py-3 rounded-xl border border-gray-800 hover:text-white hover:border-gray-600 flex flex-col items-center justify-center gap-1 transition-colors"
                        >
                            <RefreshCw size={18} />
                            <span className="text-sm">どうしても嫌だ</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
