
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Lock, RefreshCw } from 'lucide-react';

export const ResetPasswordPage = () => {
    const navigate = useNavigate();

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <AuthLayout
            title="Reset Credentials"
            subtitle="Establish a new secure access key."
        >
            <form onSubmit={handleReset} className="space-y-6">
                <Input
                    label="New Password"
                    placeholder="Enter new password"
                    type="password"
                    icon={<Lock size={18} />}
                />

                <Input
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    type="password"
                    icon={<Lock size={18} />}
                />

                <Button type="submit" className="w-full" size="lg" glow>
                    <RefreshCw size={20} />
                    Update Credentials
                </Button>
            </form>
        </AuthLayout>
    );
};
