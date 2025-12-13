
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Send } from 'lucide-react';

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Redirect to Reset Password typically via email link, but here we just show flow
        navigate('/login'); // Or a confirmation screen
    };

    return (
        <AuthLayout
            title="Account Recovery"
            subtitle="We will send a recovery signal to your email."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Registered Email"
                    placeholder="Enter your email"
                    type="email"
                    icon={<Mail size={18} />}
                />

                <Button type="submit" className="w-full" size="lg" glow>
                    <Send size={20} />
                    Send Recovery Link
                </Button>

                <div className="text-center text-sm text-gray-500 mt-4">
                    <button type="button" onClick={() => navigate('/login')} className="text-white hover:text-primary transition-colors">
                        Return to Login
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};
