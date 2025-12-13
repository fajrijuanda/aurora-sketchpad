
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAlert } from '../context/AlertContext';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    // Check for token from OAuth redirect
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const errorParam = params.get('error');

        if (token) {
            localStorage.setItem('token', token);
            navigate('/dashboard');
        } else if (errorParam) {
            showAlert({
                type: 'danger',
                title: 'Authentication Error',
                message: 'Authentication failed. Please try again.'
            });
        }
    }, [navigate, showAlert]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Login failed');

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard');
        } catch (err: any) {
            if (err.message.includes('Email not verified')) {
                showAlert({
                    type: 'warning',
                    title: 'Account Not Verified',
                    message: 'Please check your email to verify your account before logging in.',
                    onConfirm: () => navigate('/check-email'),
                    confirmText: 'Check Email'
                });
            } else {
                showAlert({
                    type: 'danger',
                    title: 'Login Failed',
                    message: err.message
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Access Terminal"
            subtitle="Please verify your credentials to continue."
        >
            <form onSubmit={handleLogin} className="space-y-6">

                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                    icon={<Mail size={18} />}
                    required
                />

                <div className="space-y-1">
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        icon={<Lock size={18} />}
                        required
                    />
                    <div className="text-right">
                        <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs text-primary hover:text-primary-light transition-colors">
                            Forgot Password?
                        </button>
                    </div>
                </div>

                <Button type="submit" className="w-full" size="lg" glow disabled={loading}>
                    <LogIn size={20} />
                    {loading ? 'Initializing...' : 'Initialize Session'}
                </Button>

                <div className="relative flex items-center gap-4 py-2">
                    <div className="h-[1px] bg-white/10 flex-1" />
                    <span className="text-sm text-gray-500">OR</span>
                    <div className="h-[1px] bg-white/10 flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button type="button" variant="glass" onClick={() => window.location.href = 'http://localhost:3001/api/auth/google'}>
                        Google
                    </Button>
                    <Button type="button" variant="glass" onClick={() => window.location.href = 'http://localhost:3001/api/auth/github'}>
                        GitHub
                    </Button>
                </div>

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
