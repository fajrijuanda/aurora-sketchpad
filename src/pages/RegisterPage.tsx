
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

export const RegisterPage = () => {
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/verify-otp');
    };

    return (
        <AuthLayout
            title="New User Registration"
            subtitle="Create your unique digital identity."
        >
            <form onSubmit={handleRegister} className="space-y-6">
                <Input
                    label="Username"
                    placeholder="Choose a username"
                    type="text"
                    icon={<User size={18} />}
                />

                <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                    icon={<Mail size={18} />}
                />

                <Input
                    label="Password"
                    placeholder="Create a password"
                    type="password"
                    icon={<Lock size={18} />}
                />

                <Input
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type="password"
                    icon={<Lock size={18} />}
                />

                <Button type="submit" className="w-full" size="lg" glow>
                    <UserPlus size={20} />
                    Create Identity
                </Button>

                <div className="text-center text-sm text-gray-500 mt-4">
                    Already have an ID?{' '}
                    <button type="button" onClick={() => navigate('/login')} className="text-white hover:text-primary transition-colors font-medium">
                        Login Here
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};
