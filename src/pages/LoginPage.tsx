
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, LogIn } from 'lucide-react';

export const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login
        navigate('/dashboard');
    };

    return (
        <AuthLayout
            title="Access Terminal"
            subtitle="Please verify your credentials to continue."
        >
            <form onSubmit={handleLogin} className="space-y-6">
                <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                    icon={<Mail size={18} />}
                />

                <div className="space-y-1">
                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        icon={<Lock size={18} />}
                    />
                    <div className="text-right">
                        <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs text-primary hover:text-primary-light transition-colors">
                            Forgot Password?
                        </button>
                    </div>
                </div>

                <Button type="submit" className="w-full" size="lg" glow>
                    <LogIn size={20} />
                    Initialize Session
                </Button>

                <div className="text-center text-sm text-gray-500 mt-4">
                    Don't have an ID?{' '}
                    <button type="button" onClick={() => navigate('/register')} className="text-white hover:text-primary transition-colors font-medium">
                        Register New Account
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};
