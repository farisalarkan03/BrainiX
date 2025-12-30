import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { storage } from '@/lib/storage';
import { Clock, Zap, BookOpen, AlertCircle } from 'lucide-react';

function Briefing() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const chapterCode = searchParams.get('code');

    const [chapter, setChapter] = useState<any>(null);
    const [cheatSheet, setCheatSheet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        const loadData = async () => {
            if (!chapterCode) return navigate('/');

            const chapterData = await storage.getChapterByCode(chapterCode);
            if (!chapterData) return navigate('/');

            setChapter(chapterData);
            const csData = await storage.getCheatSheetByChapter(chapterData.id);

            if (!csData) {
                console.log("No cheat sheet found, skipping briefing...");
                return navigate(`/battle?code=${chapterCode}`);
            }

            setCheatSheet(csData);
            setLoading(false);
        };
        loadData();
    }, [chapterCode, navigate]);

    useEffect(() => {
        if (loading || !chapter) return;

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    startBattle();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [loading, chapter]);

    const startBattle = () => {
        navigate(`/battle?code=${chapterCode}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-cyan-400 animate-pulse font-black tracking-widest">LOADING BRIEFING...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 max-w-4xl w-full"
            >
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* INFO SIDE */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <span className="text-cyan-400 font-mono text-xs tracking-[0.3em] font-bold uppercase mb-2 block">Mission Briefing</span>
                            <h1 className="text-4xl md:text-5xl font-black font-display mb-4">{chapter?.name}</h1>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                {chapter?.description || 'Pelajari cheat sheet di samping sebelum menghadapi boss. Strategi adalah kunci kemenangan.'}
                            </p>
                        </div>

                        <Card className="p-6 border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-4 text-yellow-400 mb-2">
                                <Clock className="w-6 h-6 animate-pulse" />
                                <span className="text-2xl font-black font-mono">{timer}s</span>
                                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Auto-deploying...</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-yellow-500"
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 30, ease: "linear" }}
                                />
                            </div>
                        </Card>

                        <div className="pt-4">
                            <Button size="lg" className="w-full md:w-auto px-12 py-8 text-xl neon-shadow" onClick={startBattle}>
                                <Zap className="w-6 h-6 mr-2" /> I'M READY
                            </Button>
                        </div>
                    </div>

                    {/* CHEATSHEET SIDE */}
                    <div className="flex-1 w-full flex justify-center">
                        {cheatSheet ? (
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-full"
                            >
                                <Card glow className="p-2 border-cyan-500/30 overflow-hidden bg-slate-900">
                                    <div className="bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
                                        <img
                                            src={cheatSheet.imageUrl}
                                            alt="Cheat Sheet"
                                            className="w-full h-auto object-contain max-h-[70vh]"
                                        />
                                    </div>
                                    <div className="p-4 flex gap-2 items-center text-xs text-slate-500">
                                        <BookOpen size={14} />
                                        <span>Official BRAINIX Intel - Subject: {chapter?.name}</span>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <Card className="w-full h-[400px] flex flex-col items-center justify-center border-dashed border-slate-800 text-slate-600 bg-slate-900/20">
                                <AlertCircle size={48} className="mb-4 opacity-20" />
                                <p className="font-bold">No visual intel available.</p>
                                <p className="text-sm">Proceed with standard combat protocols.</p>
                            </Card>
                        )}
                    </div>

                </div>
            </motion.div>
        </div>
    );
}

export default Briefing;
