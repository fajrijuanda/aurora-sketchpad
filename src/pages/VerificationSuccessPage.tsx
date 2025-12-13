import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { CheckCircle, Loader2 } from 'lucide-react';

export const VerificationSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [status, setStatus] = React.useState<'verifying' | 'success' | 'error'>('verifying');
    const [count, setCount] = React.useState(5);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/auth/verify?token=${token}`);
                const data = await res.json();
                if (data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (err) {
                setStatus('error');
            }
        };

        verify();
    }, [token]);

    useEffect(() => {
        if (status === 'success') {
            const timer = setInterval(() => {
                setCount((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate('/dashboard');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [status, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <GlassCard className="max-w-md w-full p-8 text-center relative z-10 flex flex-col items-center gap-6">
                {status === 'verifying' && (
                    <>
                        <Loader2 size={40} className="text-secondary animate-spin" />
                        <h2 className="text-xl font-bold text-white">Verifying...</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500 shadow-[0_0_30px_rgba(0,255,0,0.3)]">
                            <CheckCircle size={40} className="text-green-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
                            <p className="text-gray-300">
                                Your account has been successfully verified.
                            </p>
                            <p className="text-sm text-cyan-300 animate-pulse">
                                Redirecting to Dashboard in {count}s...
                            </p>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500">
                            <span className="text-3xl">❌</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">Verification Failed</h2>
                        <p className="text-gray-400">Invalid or expired token. Please try registering again.</p>
                        <button onClick={() => navigate('/register')} className="text-primary underline">Back to Register</button>
                    </>
                )}
            </GlassCard>
        </div>
    );
};
