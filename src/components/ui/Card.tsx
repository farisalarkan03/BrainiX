import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
    glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, glow = false, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    'relative bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/50 p-6',
                    glow && 'shadow-[0_0_20px_rgba(139,92,246,0.15)] border-indigo-500/30',
                    className
                )}
                {...props}
            >
                {glow && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
                )}
                {children as React.ReactNode}
            </motion.div>
        );
    }
);

Card.displayName = 'Card';

export { Card };
