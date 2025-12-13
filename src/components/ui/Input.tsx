
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, icon, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-gray-400 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <input
                        ref={ref}
                        className={cn(
                            "w-full bg-glass-low/50 border border-glass-border rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-600 focus:border-primary focus:bg-glass-medium transition-all duration-300",
                            "group-hover:border-white/20",
                            icon && "pl-11",
                            className
                        )}
                        {...props}
                    />
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors duration-300">
                            {icon}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);
Input.displayName = 'Input';
