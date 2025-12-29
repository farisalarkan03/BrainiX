import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HealthBar } from '@/components/game/HealthBar';
import { storage } from '@/lib/storage';
import { Skull, Trophy, AlertCircle, Home, RotateCcw } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

function BattleArena() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const chapterCode = searchParams.get('code');

    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chapterName, setChapterName] = useState('Unknown Chapter');

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [bossHp, setBossHp] = useState(100);
    const [isHit, setIsHit] = useState(false);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                let qData: any[] = [];

                if (chapterCode) {
                    const chapter = await storage.getChapterByCode(chapterCode);
                    if (chapter) {
                        setChapterName((chapter as any).name);
                        qData = await storage.getQuestions(chapter.id);
                    } else {
                        alert('Invalid chapter code: ' + chapterCode);
                        navigate('/');
                        return;
                    }
                } else {
                    // Fallback: load all questions
                    qData = await storage.getQuestions();
                    setChapterName('All Chapters');
                }

                setQuestions(qData);
            } catch (e) {
                console.error("Error fetching questions:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [score, setScore] = useState(0); // XP Score

    // Calculations for Game Mechanics
    const totalQuestions = questions.length;
    // Damage needed to kill boss is 100.
    // We want 80% of questions to equal 100 damage.
    // Questions needed to win = ceil(total * 0.8)
    // Damage per question = 100 / (total * 0.8)
    const damagePerHit = totalQuestions > 0 ? 100 / (totalQuestions * 0.8) : 0;

    const currentQuestion = questions[currentQuestionIndex];
    const maxBossHp = 100;

    const handleAnswer = (index: number) => {
        if (!currentQuestion) return;

        setSelectedOption(index);

        const isCorrect = index === currentQuestion.correctAnswer;

        if (isCorrect) {
            // Correct Answer
            setIsHit(true);
            setCorrectAnswers(prev => prev + 1);
            setScore(prev => prev + 50); // 50 XP per correct answer

            const newHp = Math.max(0, bossHp - damagePerHit);
            setBossHp(newHp);

            setTimeout(() => setIsHit(false), 500);
        }

        // Delay for animation before next question or end game
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                // Game Over - Check Win Condition
                // We need to include the current answer in the count if it was correct
                const finalCorrectCount = isCorrect ? correctAnswers + 1 : correctAnswers;
                const accuracy = finalCorrectCount / totalQuestions;

                if (accuracy >= 0.8) {
                    setGameState('won');
                    // Add Bonus Points for accuracy > 80%
                    if (accuracy > 0.8) {
                        const bonusQuestions = finalCorrectCount - Math.ceil(totalQuestions * 0.8);
                        setScore(prev => prev + (bonusQuestions * 100)); // Mega bonus for extra kills
                    }
                } else {
                    setGameState('lost');
                }
            }
        }, 1500);
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Boss...</div>;

    // Show message if no questions exist in Storage
    if (!loading && questions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <Card glow className="text-center p-8 border-red-500/50">
                    <Skull className="w-16 h-16 mx-auto text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">NO CHALLENGES FOUND</h1>
                    <p className="text-slate-400 mb-6">The dungeon is empty. Ask the Game Master (Admin) to add questions.</p>
                    <Button onClick={() => navigate('/dashboard')} variant="secondary">
                        <Home className="w-4 h-4 mr-2" /> Return to HQ
                    </Button>
                </Card>
            </div>
        );
    }

    if (gameState !== 'playing') {
        const accuracyPercent = Math.round((correctAnswers / totalQuestions) * 100);

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <Card glow className="max-w-md w-full text-center p-8 border-2 border-indigo-500/50">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-6"
                    >
                        {gameState === 'won' ? (
                            <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto text-yellow-400">
                                <Trophy size={48} />
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                                <Skull size={48} />
                            </div>
                        )}
                    </motion.div>

                    <h1 className="text-4xl font-display font-black mb-2 text-white">
                        {gameState === 'won' ? 'VICTORY!' : 'DEFEATAED'}
                    </h1>

                    <div className="my-6 space-y-2">
                        <div className="text-slate-400 flex justify-between px-8">
                            <span>Accuracy</span>
                            <span className={cn("font-bold", accuracyPercent >= 80 ? "text-green-400" : "text-red-400")}>{accuracyPercent}%</span>
                        </div>
                        <div className="text-slate-400 flex justify-between px-8">
                            <span>Final Score</span>
                            <span className="font-bold text-yellow-400">{score} XP</span>
                        </div>
                        {accuracyPercent > 80 && (
                            <div className="text-xs text-cyan-400 mt-2 font-mono animate-pulse">
                                + OVERKILL BONUS APPLIED!
                            </div>
                        )}
                    </div>

                    <p className="text-slate-400 mb-8 text-sm">
                        {gameState === 'won'
                            ? 'You dealt sufficient damage to destroy the boss.'
                            : `You only dealt ${accuracyPercent}% damage. You need 80% to win.`}
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                            <Home className="w-4 h-4 mr-2" /> HQ
                        </Button>
                        <Button onClick={() => window.location.reload()}>
                            <RotateCcw className="w-4 h-4 mr-2" /> Retry
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col p-4 overflow-hidden relative">

            {/* Background Ambience */}
            <div className={cn("absolute inset-0 pointer-events-none transition-colors duration-300", isHit ? "bg-red-900/20" : "")} />

            {/* Boss Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative py-8">
                <HealthBar current={bossHp} max={maxBossHp} label={`FINAL BOSS - ${chapterName.toUpperCase()}`} />

                <motion.div
                    animate={isHit ? {
                        x: [-10, 10, -10, 10, 0],
                        filter: ["brightness(1)", "brightness(2) hue-rotate(90deg)", "brightness(1)"]
                    } : {
                        y: [0, -20, 0]
                    }}
                    transition={isHit ? { duration: 0.4 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-48 h-48 md:w-64 md:h-64 mb-8"
                >
                    {/* CSS Generated Boss Entity */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-full blur-[2px] shadow-[0_0_50px_rgba(79,70,229,0.5)] animate-glow" />
                    <div className="absolute inset-4 bg-slate-950 rounded-full flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/50 via-slate-950 to-slate-950">
                            {/* Eyes */}
                            <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-cyan-400 rounded-full blur-[2px] animate-pulse-fast" />
                            <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-cyan-400 rounded-full blur-[2px] animate-pulse-fast" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Question Area */}
            <div className="w-full max-w-4xl mx-auto mb-4 z-10">
                <Card glow className="border-t-4 border-t-indigo-500">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Question {currentQuestionIndex + 1} / {questions.length}</span>
                        <span className="text-xs font-bold text-yellow-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> HIGH STAKES</span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-white mb-6 leading-relaxed">
                        {currentQuestion.text}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options?.map((option: string, idx: number) => (
                            <Button
                                key={idx}
                                variant="secondary"
                                size="lg"
                                className={cn(
                                    "justify-start text-left h-auto py-6",
                                    selectedOption !== null && idx === currentQuestion.correctAnswer && "bg-emerald-600 border-emerald-500 text-white",
                                    selectedOption !== null && idx === selectedOption && idx !== currentQuestion.correctAnswer && "bg-red-600 border-red-500 text-white",
                                    selectedOption === null && "hover:border-indigo-400 hover:bg-slate-800"
                                )}
                                onClick={() => selectedOption === null && handleAnswer(idx)}
                                disabled={selectedOption !== null}
                            >
                                <span className="w-8 h-8 rounded bg-slate-950/50 flex items-center justify-center mr-4 text-sm font-mono text-slate-400">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {option}
                            </Button>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default BattleArena;
