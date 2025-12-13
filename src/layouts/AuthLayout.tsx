
import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import mascotImage from '../assets/images/mascot_chibi.png';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
                <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-secondary/10 blur-[100px]" />
            </div>

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center z-10">
                {/* Left Side - Mascot & Welcome */}
                <div className="hidden md:flex flex-col items-center text-center space-y-6">
                    <div className="relative w-64 h-64 animate-float">
                        <img src={mascotImage} alt="Mascot" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
                        <p className="text-gray-400">Ready to create another masterpiece?</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <GlassCard className="w-full max-w-md mx-auto">
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-white">
                            {title}
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
                    </div>
                    {children}
                </GlassCard>
            </div>
        </div>
    );
};
