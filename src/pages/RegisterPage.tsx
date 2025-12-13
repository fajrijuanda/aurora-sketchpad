
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

export const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            navigate('/check-email');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="New User Registration"
            subtitle="Create your unique digital identity."
        >
            <form onSubmit={handleRegister} className="space-y-4">
                {error && <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">{error}</div>}

                <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    label="Username"
                    placeholder="Choose a username"
                    type="text"
                    icon={<User size={18} />}
                    required
                />

                <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                    icon={<Mail size={18} />}
                    required
                />

                <Input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    label="Password"
                    placeholder="Create a password"
                    type="password"
                    icon={<Lock size={18} />}
                    required
                />

                <Input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type="password"
                    icon={<Lock size={18} />}
                    required
                />

                <Button type="submit" className="w-full" size="lg" glow disabled={loading}>
                    <UserPlus size={20} />
                    {loading ? 'Creating...' : 'Create Identity'}
                </Button>

                <div className="relative flex items-center gap-4 py-2">
                    <div className="h-[1px] bg-white/10 flex-1" />
                    <span className="text-sm text-gray-500">OR CONTINUE WITH</span>
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
                    Already have an ID?{' '}
                    <button type="button" onClick={() => navigate('/login')} className="text-white hover:text-primary transition-colors font-medium">
                        Login Here
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};
