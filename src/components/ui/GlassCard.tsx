
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'base' | 'hover';
}

export const GlassCard = ({ children, className, variant = 'base', ...props }: GlassCardProps) => {
    return (
        <div
            className={cn(
                "bg-glass-low backdrop-blur-xl border border-glass-border rounded-2xl p-6 shadow-lg transition-all duration-300 relative overflow-hidden",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none",
                variant === 'hover' && "hover:bg-glass-medium hover:scale-[1.02] hover:shadow-cyan-500/20 hover:border-primary-light/50",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
