import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button'; // Assuming Button component exists
import { MOCK_SCHOOLS, MOCK_STUDENTS } from '@/lib/mockData';
import { Trophy, Medal, ArrowLeft, School, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Leaderboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'global' | 'school'>('global');

    return (
        <div className="min-h-screen bg-slate-950 p-4 pb-20 relative overflow-hidden flex flex-col items-center">

            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <div className="w-full max-w-2xl flex items-center justify-between mb-8 z-10">
                <Button variant="ghost" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="mr-2 w-5 h-5" /> Back
                </Button>
                <h1 className="text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-sm">
                    LEADERBOARD
                </h1>
                <div className="w-24" /> {/* Spacer for centering */}
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 mb-8 z-10">
                <button
                    onClick={() => setActiveTab('global')}
                    className={cn(
                        "px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                        activeTab === 'global'
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "text-slate-500 hover:text-slate-300"
                    )}
                >
                    <School size={16} /> Global Schools
                </button>
                <button
                    onClick={() => setActiveTab('school')}
                    className={cn(
                        "px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                        activeTab === 'school'
                            ? "bg-purple-600 text-white shadow-lg"
                            : "text-slate-500 hover:text-slate-300"
                    )}
                >
                    <User size={16} /> My School
                </button>
            </div>

            {/* List */}
            <div className="w-full max-w-2xl z-10 space-y-3">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: activeTab === 'global' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: activeTab === 'global' ? 20 : -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                    >
                        {activeTab === 'global' ? (
                            // Global Schools List
                            MOCK_SCHOOLS.map((school, index) => (
                                <LeaderboardItem
                                    key={school.id}
                                    rank={index + 1}
                                    name={school.name}
                                    score={school.totalScore}
                                    avatar={school.logo}
                                    type="school"
                                />
                            ))
                        ) : (
                            // Student List
                            MOCK_STUDENTS.map((student, index) => (
                                <LeaderboardItem
                                    key={student.id}
                                    rank={index + 1}
                                    name={student.name}
                                    score={student.score}
                                    avatar={student.avatar}
                                    type="student"
                                />
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function LeaderboardItem({ rank, name, score, avatar, type }: { rank: number, name: string, score: number, avatar: string, type: 'school' | 'student' }) {
    const isTop3 = rank <= 3;

    return (
        <Card
            className={cn(
                "flex items-center p-4 border-0 transition-transform hover:scale-[1.02]",
                rank === 1 ? "bg-gradient-to-r from-yellow-500/20 to-slate-900 border-l-4 border-l-yellow-500" :
                    rank === 2 ? "bg-gradient-to-r from-slate-400/20 to-slate-900 border-l-4 border-l-slate-400" :
                        rank === 3 ? "bg-gradient-to-r from-orange-700/20 to-slate-900 border-l-4 border-l-orange-700" :
                            "bg-slate-900/40 hover:bg-slate-800/60"
            )}
        >
            {/* Rank */}
            <div className="w-12 flex-shrink-0 flex items-center justify-center font-black text-xl italic text-slate-500">
                {rank === 1 ? <Trophy className="text-yellow-500 w-8 h-8" /> :
                    rank === 2 ? <Medal className="text-slate-400 w-7 h-7" /> :
                        rank === 3 ? <Medal className="text-orange-700 w-6 h-6" /> :
                            `#${rank}`}
            </div>

            {/* Avatar */}
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4 shadow-lg",
                type === 'school' ? "bg-indigo-600 text-white" : "bg-purple-600 text-white"
            )}>
                {avatar}
            </div>

            {/* Info */}
            <div className="flex-1">
                <h3 className={cn("font-bold truncate", isTop3 ? "text-white" : "text-slate-300")}>{name}</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest">{type === 'school' ? 'Total XP' : 'Student XP'}</p>
            </div>

            {/* Score */}
            <div className="text-right">
                <div className="font-mono font-bold text-cyan-400 text-lg">{score.toLocaleString()}</div>
                <div className="text-[10px] text-slate-600 uppercase">Points</div>
            </div>
        </Card>
    );
}
