import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, RefreshCw, MessageSquareWarning, Home } from 'lucide-react';
import { type Location } from '../data/mockLocations';

interface ResultScreenProps {
    location: Location | null;
    aiReason?: string;
    onRetry: () => void;
    onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ location, aiReason, onRetry, onHome }) => {
    if (!location) return null;

    const handleOpenMap = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
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
                    ここに行け！
                </h2>

                {aiReason && (
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
                                {aiReason}
                            </p>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm mb-10 shadow-lg relative overflow-hidden"
                    whileHover={{ y: -5 }}
                >
                    <div className="absolute inset-0 opacity-20">
                        {location.image ? (
                            <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-gray-900" />
                        )}
                    </div>
                    <div className="relative z-10">
                        <div className="text-sm text-blue-400 font-bold tracking-wider mb-2 uppercase">
                            {location.category}
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                            {location.name}
                        </h3>
                        <div className="flex items-center justify-center gap-4 text-gray-400 font-medium">
                            <span>距離: {location.distance}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span>徒歩: {location.walkTime}</span>
                        </div>
                    </div>
                </motion.div>

                <div className="w-full max-w-sm flex flex-col gap-4">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpenMap}
                        className="w-full bg-white text-gray-900 font-bold text-lg py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-colors hover:bg-gray-100"
                    >
                        <Map size={24} />
                        Google Mapsで経路を見る
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
