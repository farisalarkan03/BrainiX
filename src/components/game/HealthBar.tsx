import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HealthBarProps {
    current: number;
    max: number;
    label?: string;
    color?: string;
}

export function HealthBar({ current, max, label = "BOSS HP" }: HealthBarProps) {
    const percentage = Math.max(0, Math.min(100, (current / max) * 100));

    // Calculate color based on percentage
    const getBarColor = (pct: number) => {
        if (pct < 25) return "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]";
        if (pct < 50) return "bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.5)]";
        if (pct < 75) return "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]";
        return "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]";
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="flex justify-between text-xs font-bold tracking-widest mb-1 text-slate-400">
                <span>{label}</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-6 w-full bg-slate-800 rounded-full border-2 border-slate-700 overflow-hidden relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                {/* Background Stripes */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,#000_25%,#000_50%,transparent_50%,transparent_75%,#000_75%,#000_100%)] bg-[length:20px_20px]" />

                {/* Health Fill */}
                <motion.div
                    className={cn("h-full relative", getBarColor(percentage))}
                    initial={{ width: "0%" }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                </motion.div>
            </div>
        </div>
    );
}
