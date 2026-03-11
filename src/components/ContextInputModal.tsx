import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import { type VisitingContext, type GroupType } from '../types/context';

interface ContextInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (context: VisitingContext) => void;
}

export const ContextInputModal: React.FC<ContextInputModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [participants, setParticipants] = useState(2);
    const [groupType, setGroupType] = useState<GroupType>('混合');
    const [recentAction, setRecentAction] = useState('');
    const [drunkenness, setDrunkenness] = useState(0);
    const [request, setRequest] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit({
            participants,
            groupType,
            recentAction,
            drunkenness,
            request
        });
    };

    const getDrunkEmoji = (level: number) => {
        if (level === 0) return '😐'; // シラフ
        if (level < 30) return '🙂'; // ほろ酔い
        if (level < 60) return '😊'; // いい気分
        if (level < 80) return '🥴'; // 結構酔ってる
        return '🤮'; // 泥酔
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end sm:justify-center sm:items-center"
            >
                {/* Click outside to close */}
                <div className="absolute inset-0" onClick={onClose} />

                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="bg-gray-900 border sm:border-gray-800 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 relative z-10 max-h-[90vh] overflow-y-auto w-full sm:max-w-md shadow-2xl scrollbar-hide"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-2xl font-bold text-white mb-8 text-center tracking-wide">
                        今の状況を教えろ
                    </h2>

                    <div className="space-y-6">
                        {/* 1. 人数 */}
                        <div className="bg-gray-800 p-5 rounded-2xl">
                            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest text-center">
                                人数
                            </label>
                            <div className="flex items-center justify-between bg-gray-900 rounded-xl p-2 border border-gray-700 w-48 mx-auto">
                                <button
                                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white active:scale-95 transition-all"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="text-3xl font-bold text-blue-400 w-16 text-center">
                                    {participants}
                                </span>
                                <button
                                    onClick={() => setParticipants(participants + 1)}
                                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white active:scale-95 transition-all"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* 2. グループ構成 */}
                        <div className="bg-gray-800 p-5 rounded-2xl">
                            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest text-center">
                                構成
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['男子のみ', '女子のみ', '混合'] as GroupType[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setGroupType(type)}
                                        className={`py-3 rounded-xl font-bold text-sm transition-colors ${groupType === type
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-900 text-gray-400 border border-gray-700 hover:bg-gray-800'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. 直前の行動 */}
                        <div className="bg-gray-800 p-5 rounded-2xl">
                            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest text-center">
                                今まで何してた？（任意）
                            </label>
                            <input
                                type="text"
                                value={recentAction}
                                onChange={(e) => setRecentAction(e.target.value)}
                                placeholder="例：仕事終わり、カフェ"
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500 text-center"
                            />
                        </div>

                        {/* 4. 酔い度 */}
                        <div className="bg-gray-800 p-5 rounded-2xl">
                            <div className="flex justify-between items-end mb-4">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    酔い度 (0-100)
                                </label>
                                <span className="text-4xl transition-all duration-300" title={getDrunkEmoji(drunkenness)} aria-label="酔い度絵文字">
                                    {getDrunkEmoji(drunkenness)}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={drunkenness}
                                onChange={(e) => setDrunkenness(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 outline-none"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-3 font-bold">
                                <span>シラフ</span>
                                <span className="text-blue-400 text-sm">{drunkenness}%</span>
                                <span>泥酔</span>
                            </div>
                        </div>

                        {/* 5. 要望 */}
                        <div className="bg-gray-800 p-5 rounded-2xl">
                            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest text-center">
                                最後の抵抗（一言）
                            </label>
                            <input
                                type="text"
                                value={request}
                                onChange={(e) => setRequest(e.target.value)}
                                placeholder="例：静かに飲みたい、ラーメン等"
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500 text-center"
                            />
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit}
                            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 mt-8 transition-colors shadow-lg shadow-blue-900/20"
                        >
                            状況を伝えて強制決定する！
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
