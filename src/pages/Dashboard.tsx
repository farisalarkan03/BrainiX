import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Crown, Flame,
    Swords, Target, Sparkles, LogOut,
    Shield, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useAuthStore } from '@/store/authStore';

export default function PlayerDashboard() {
    const navigate = useNavigate();
    const { user, loading } = useAuthStore();

    // Mock Gamification State
    const [stats] = useState({
        level: 5,
        xp: 2450,
        maxXp: 3000,
        streak: 12,
        rank: 'Scholar III',
        schoolRank: 4,
        globalRank: 142
    });

    const [dailyQuests] = useState([
        { id: 1, title: 'Defeat 1 Boss', progress: 0, total: 1, reward: '50 XP', completed: false },
        { id: 2, title: 'Read "Calculus" Cheat Sheet', progress: 1, total: 1, reward: 'Badge', completed: true },
        { id: 3, title: 'Maintain Streak', progress: 1, total: 1, reward: '20 XP', completed: true },
    ]);

    if (loading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-950 pb-20 overflow-x-hidden">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
                            {stats.level}
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-sm leading-none">{user.fullName || 'Player'}</h1>
                            <div className="text-xs text-cyan-400 font-mono">{stats.rank}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Streak Counter */}
                        <div className="flex items-center gap-1 bg-orange-950/30 px-3 py-1 rounded-full border border-orange-500/20">
                            <Flame className="w-4 h-4 text-orange-500 animate-pulse" fill="currentColor" />
                            <span className="text-orange-400 font-bold text-sm">{stats.streak} Days</span>
                        </div>

                        <Button variant="ghost" size="sm" onClick={() => {
                            storage.logout();
                            navigate('/');
                        }}>
                            <LogOut className="w-4 h-4 text-slate-400" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-4 space-y-6">

                {/* Hero: BOSS ARENA */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card glow className="relative overflow-hidden border-2 border-indigo-500/50 group cursor-pointer" onClick={() => navigate('/scan')}>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px]" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-2">
                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                        <Badge>CURRENT MISSION</Badge>
                                        <span className="text-xs text-indigo-300 font-mono tracking-widest">CHAPTER 5</span>
                                    </div>
                                    <h2 className="text-4xl font-black font-display text-white mb-2 drop-shadow-lg">
                                        FINAL BOSS: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">CALCULUS</span>
                                    </h2>
                                    <p className="text-slate-400 max-w-lg mb-6">
                                        The boss is vulnerable. Scan your LKS code or enter the key to initiate the battle sequence.
                                    </p>
                                    <Button className="w-full md:w-auto neon-shadow" size="lg">
                                        <Swords className="w-5 h-5 mr-2" /> ENTER ARENA
                                    </Button>
                                </div>

                                {/* Visual boss avatar placeholder */}
                                <div className="w-32 h-32 md:w-48 md:h-48 relative">
                                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse" />
                                    <div className="w-full h-full bg-slate-900 rounded-full border-4 border-indigo-500/30 flex items-center justify-center overflow-hidden">
                                        <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.5)]" />
                                    </div>
                                    {/* Health Bar Mini */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                        <div className="h-full w-[70%] bg-red-500" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* LEFT COL: Stats & Missions */}
                    <div className="space-y-6">
                        {/* XP Progress */}
                        <Card className="p-4 border-cyan-900/50 bg-slate-900/50">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Level Progress</span>
                                <span className="text-cyan-400 font-bold">{stats.xp} / {stats.maxXp} XP</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(stats.xp / stats.maxXp) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                />
                            </div>
                        </Card>

                        {/* Daily Quests */}
                        <Card className="p-0 overflow-hidden border-orange-900/30">
                            <div className="p-4 border-b border-slate-800 bg-orange-950/10 flex justify-between items-center">
                                <h3 className="font-bold text-orange-400 flex items-center gap-2">
                                    <Target className="w-4 h-4" /> DAILY MISSIONS
                                </h3>
                                <span className="text-xs text-orange-500 bg-orange-950/30 px-2 py-0.5 rounded">22h left</span>
                            </div>
                            <div className="divide-y divide-slate-800">
                                {dailyQuests.map(quest => (
                                    <div key={quest.id} className="p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
                                        <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center",
                                            quest.completed ? "bg-green-500 border-green-500" : "border-slate-600"
                                        )}>
                                            {quest.completed && <Sparkles className="w-3 h-3 text-slate-950" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className={cn("text-sm font-medium", quest.completed ? "text-slate-500 line-through" : "text-slate-200")}>
                                                {quest.title}
                                            </div>
                                            <div className="text-xs text-yellow-500 mt-0.5">Reward: {quest.reward}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* CENTER COL: Main Menu Grid */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">

                        {/* Cheat Sheet Library */}
                        <Card className="col-span-2 md:col-span-1 p-6 hover:bg-slate-800/50 transition-colors cursor-pointer group border-l-4 border-l-emerald-500">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-xs font-bold bg-emerald-950 text-emerald-400 px-2 py-1 rounded">LIBRARY</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Cheat Sheets</h3>
                            <p className="text-sm text-slate-400 mb-4">Review infographics & mind-maps before the battle.</p>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="w-[45%] bg-emerald-500 h-full" />
                            </div>
                            <div className="text-xs text-right text-emerald-400 mt-1">45% Mastery</div>
                        </Card>

                        {/* Leaderboard */}
                        <Card className="col-span-2 md:col-span-1 p-6 hover:bg-slate-800/50 transition-colors cursor-pointer group border-l-4 border-l-yellow-500" onClick={() => navigate('/leaderboard')}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400 group-hover:scale-110 transition-transform">
                                    <Crown size={24} />
                                </div>
                                <span className="text-xs font-bold bg-yellow-950 text-yellow-400 px-2 py-1 rounded">RANK #4</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">School Glory</h3>
                            <p className="text-sm text-slate-400">Your school is battling for 1st place in the district.</p>
                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                                <Shield className="w-4 h-4 text-purple-400" />
                                <span>Rival: <span className="text-white font-bold">SMAN 1 Bandung</span></span>
                            </div>
                        </Card>

                        {/* Inventory / Badges */}
                        <Card className="col-span-2 p-6 hover:bg-slate-800/50 transition-colors cursor-pointer group border-t-4 border-t-purple-500">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Digital Rewards</h3>
                                    <p className="text-sm text-slate-400">Collection of Badges & Unlockables</p>
                                </div>
                                <div className="ml-auto flex gap-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center grayscale opacity-50">
                                            <Sparkles size={16} className="text-slate-500" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 border-2 border-yellow-200 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                        <Award size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                    </div>
                </div>
            </main>
        </div>
    );
}

function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500 text-white uppercase tracking-wider">
            {children}
        </span>
    );
}
