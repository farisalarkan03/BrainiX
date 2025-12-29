import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    soundEnabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', soundEnabled = true, children, onClick, ...props }, ref) => {

        const playClickSound = () => {
            if (soundEnabled) {
                // new Audio('/sounds/click.mp3').play().catch(() => {});
                console.log('Click sound');
            }
        };

        const variants = {
            primary: 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]',
            secondary: 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200 shadow-lg',
            danger: 'bg-red-600 hover:bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]',
            ghost: 'bg-transparent hover:bg-white/5 border-transparent text-slate-300',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg tracking-wider',
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                    playClickSound();
                    onClick?.(e);
                }}
                className={cn(
                    'relative inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-lg border-2 transition-all duration-200 overflow-hidden',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {/* Shine effect overlay */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
                <span className="relative z-20 flex items-center gap-2 font-display">
                    {children as React.ReactNode}
                </span>
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
