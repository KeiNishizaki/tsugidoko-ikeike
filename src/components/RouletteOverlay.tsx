import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { mockLocations } from '../data/mockLocations';

interface RouletteOverlayProps {
    onComplete: () => void;
}

export const RouletteOverlay: React.FC<RouletteOverlayProps> = ({ onComplete }) => {
    const [text, setText] = useState('探しています...');
    const [flashColor, setFlashColor] = useState('text-blue-400');

    useEffect(() => {
        // Vibrate when starting roulette
        if (navigator.vibrate) {
            navigator.vibrate([30, 100, 30, 200, 50]);
        }

        const words = mockLocations.map(loc => loc.name);
        let index = 0;

        const interval = setInterval(() => {
            setText(words[index % words.length]);
            setFlashColor(index % 2 === 0 ? 'text-blue-400' : 'text-indigo-400');
            index++;
            // Subtle fast vibration during shuffle
            if (navigator.vibrate) navigator.vibrate(10);
        }, 100);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            setText('決定中...');
            setFlashColor('text-white');
            setTimeout(() => {
                onComplete();
            }, 800);
        }, 2500); // 2.5 seconds of fast shuffling

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/95 backdrop-blur-sm">
            <div className="text-center px-4 w-full">
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 0.3 }}
                    className={`text-4xl md:text-5xl font-bold truncate px-4 ${flashColor}`}
                >
                    {text}
                </motion.div>
                <motion.p
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="mt-8 text-gray-400 font-medium"
                >
                    AIが運命の場所を選んでいます...
                </motion.p>
            </div>
        </div>
    );
};
