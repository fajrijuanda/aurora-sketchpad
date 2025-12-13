
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Button } from '../components/ui/Button';
import { ShieldCheck } from 'lucide-react';

export const VerifyOtpPage = () => {
    const navigate = useNavigate();

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <AuthLayout
            title="Security Verification"
            subtitle="Enter the code sent to your communication device."
        >
            <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex gap-2 justify-center my-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <input
                            key={i}
                            type="text"
                            maxLength={1}
                            className="w-12 h-14 bg-glass-low border border-glass-border rounded-lg text-center text-2xl font-bold focus:border-primary outline-none transition-colors"
                        />
                    ))}
                </div>

                <Button type="submit" className="w-full" size="lg" glow>
                    <ShieldCheck size={20} />
                    Verify Code
                </Button>
                <div className="text-center text-sm text-gray-500 mt-4">
                    Didn't receive code?{' '}
                    <button type="button" className="text-primary hover:text-primary-light transition-colors">
                        Resend
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};
