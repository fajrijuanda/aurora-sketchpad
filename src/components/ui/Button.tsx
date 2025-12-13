
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    glow?: boolean;
}

export const Button = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    glow = false,
    ...props
}: ButtonProps) => {

    const variants = {
        primary: "bg-primary text-black font-semibold hover:bg-primary-light border border-transparent",
        secondary: "bg-secondary text-black font-semibold hover:bg-secondary-light border border-transparent",
        glass: "bg-glass-low backdrop-blur-md border border-glass-border text-white hover:bg-glass-medium hover:border-primary/50",
        ghost: "bg-transparent text-gray-300 hover:text-primary hover:bg-white/5",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-8 py-3 text-lg",
    };

    return (
        <button
            className={cn(
                "rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                glow && "shadow-[0_0_15px_rgba(0,240,255,0.5)] hover:shadow-[0_0_25px_rgba(0,240,255,0.7)]",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
