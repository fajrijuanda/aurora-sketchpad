import { GlassCard } from '../components/ui/GlassCard';
import { Mail } from 'lucide-react';

export const CheckEmailPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vh] h-[50vh] bg-primary/20 blur-[100px] rounded-full" />
            </div>

            <GlassCard className="max-w-md w-full p-8 text-center relative z-10 flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-glass-low flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                    <Mail size={40} className="text-primary" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
                    <p className="text-gray-300">
                        We've sent a verification link to your email address. Please verify your account to continue usage.
                    </p>
                </div>

                <div className="text-sm text-gray-400">
                    Didn't receive it? <a href="#" className="text-primary hover:underline">Resend</a>
                </div>
            </GlassCard>
        </div>
    );
};
