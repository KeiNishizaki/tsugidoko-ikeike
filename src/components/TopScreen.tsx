import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { ContextInputModal } from './ContextInputModal';
import { type VisitingContext } from '../types/context';

interface TopScreenProps {
    onStart: (context: VisitingContext) => void;
    isLocating: boolean;
}

export const TopScreen: React.FC<TopScreenProps> = ({ onStart, isLocating }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirmContext = (context: VisitingContext) => {
        setIsModalOpen(false);
        onStart(context);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen px-6 text-center">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center"
            >
                <img 
                    src="/Icon_DokoIke.png" 
                    alt="Tsugi-Doko IkeIke Icon" 
                    className="w-48 h-48 md:w-56 md:h-56 object-contain mb-6 drop-shadow-2xl rounded-[2rem]"
                />
                <h1 className="text-3xl md:text-4xl font-black mb-4 text-white leading-tight">
                    Tsugi-Doko<br />
                    <span className="text-blue-400">IkeIke</span>
                </h1>
                <p className="text-gray-300 text-lg font-medium mb-12">
                    「次、どこ行く？」<br />
                    のぐだぐだはここで終了。
                </p>
            </motion.div>

            <motion.button
                className="relative group w-full max-w-sm rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-2xl py-6 shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(50);
                    setIsModalOpen(true);
                }}
                disabled={isLocating}
            >
                <span className="flex items-center justify-center gap-2">
                    <MapPin size={28} />
                    {isLocating ? '現在地を取得中...' : '次のお店を強制決定する！'}
                </span>
                <div className="absolute inset-0 rounded-3xl border border-white opacity-20 pointer-events-none"></div>
            </motion.button>

            <ContextInputModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleConfirmContext}
            />
        </div>
    );
};
