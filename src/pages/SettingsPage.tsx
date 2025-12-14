import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Moon, Sun, Camera, ArrowLeft, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAlert } from '../context/AlertContext';
import clsx from 'clsx';

export const SettingsPage = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { showAlert } = useAlert();
    const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');

    // Profile State
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setName(parsedUser.name || '');
            setAvatar(parsedUser.avatar || '');
        }
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3001/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, avatar })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                if (data.token) localStorage.setItem('token', data.token);

                setUser(data.user);
                showAlert({
                    type: 'success',
                    title: 'Profile Updated',
                    message: 'Your profile details have been saved successfully.'
                });
            } else {
                throw new Error(data.error || 'Failed to update profile');
            }
        } catch (err: any) {
            showAlert({
                type: 'danger',
                title: 'Error',
                message: err.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={clsx("min-h-screen flex font-sans transition-colors duration-300", theme === 'dark' ? "bg-[#0f0f13] text-white" : "bg-gray-50 text-gray-900")}>
            {/* Sidebar */}
            <aside className={clsx("w-64 border-r flex flex-col p-4", theme === 'dark' ? "border-white/5 bg-black/20" : "border-gray-200 bg-white")}>
                <div className="flex items-center gap-2 mb-8 cursor-pointer text-gray-500 hover:text-primary transition-colors" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Back to Projects</span>
                </div>

                <div className="space-y-1">
                    <div
                        onClick={() => setActiveTab('profile')}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                            activeTab === 'profile'
                                ? (theme === 'dark' ? "bg-primary/10 text-primary font-medium" : "bg-primary/10 text-primary font-medium")
                                : "text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                    >
                        <User size={18} />
                        <span className="text-sm">My Profile</span>
                    </div>
                    <div
                        onClick={() => setActiveTab('preferences')}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                            activeTab === 'preferences'
                                ? (theme === 'dark' ? "bg-primary/10 text-primary font-medium" : "bg-primary/10 text-primary font-medium")
                                : "text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                    >
                        <Settings size={18} />
                        <span className="text-sm">Preferences</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">{activeTab === 'profile' ? 'Profile Settings' : 'Preferences'}</h1>

                    {activeTab === 'profile' && (
                        <form onSubmit={handleSaveProfile} className="space-y-8">
                            {/* Avatar Section */}
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 overflow-hidden">
                                        <div className={clsx("w-full h-full rounded-full overflow-hidden flex items-center justify-center", theme === 'dark' ? "bg-[#1e1e24]" : "bg-white")}>
                                            {avatar
                                                ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                : <span className="text-2xl font-bold">{name?.[0] || 'U'}</span>
                                            }
                                        </div>
                                    </div>
                                    {/* Placeholder for actual image upload later if needed */}
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera size={20} className="text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg">Profile Photo</h3>
                                    <p className="text-sm text-gray-500">Enter a URL for your profile picture.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Full Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className={theme === 'light' ? "!bg-white !border-gray-200 !text-gray-900 focus:!border-primary" : ""}
                                />
                                <Input
                                    label="Avatar URL"
                                    value={avatar}
                                    onChange={e => setAvatar(e.target.value)}
                                    placeholder="https://example.com/avatar.jpg"
                                    className={theme === 'light' ? "!bg-white !border-gray-200 !text-gray-900 focus:!border-primary" : ""}
                                />
                                <div className="text-sm text-gray-500">
                                    Signed in as <span className="font-medium opacity-80">{user?.email}</span>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-white/10">
                                <Button type="submit" glow disabled={loading}>
                                    <Save size={18} />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-medium mb-4">Appearance</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        className={clsx(
                                            "p-4 rounded-xl border cursor-pointer transition-all",
                                            theme === 'light'
                                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                : "border-gray-700 hover:border-gray-500"
                                        )}
                                        onClick={() => setTheme('light')}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <Sun size={20} className={theme === 'light' ? "text-primary" : "text-gray-400"} />
                                            <span className="font-medium">Light Mode</span>
                                        </div>
                                        <div className="h-20 bg-gray-100 rounded-lg border border-gray-200 relative overflow-hidden">
                                            <div className="absolute top-2 left-2 w-12 h-2 bg-white rounded-full shadow-sm"></div>
                                        </div>
                                    </div>

                                    <div
                                        className={clsx(
                                            "p-4 rounded-xl border cursor-pointer transition-all",
                                            theme === 'dark'
                                                ? "border-primary bg-primary/10 ring-1 ring-primary"
                                                : "border-gray-200 hover:border-gray-400 dark:border-white/10"
                                        )}
                                        onClick={() => setTheme('dark')}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <Moon size={20} className={theme === 'dark' ? "text-primary" : "text-gray-400"} />
                                            <span className="font-medium">Dark Mode</span>
                                        </div>
                                        <div className="h-20 bg-[#1e1e24] rounded-lg border border-white/5 relative overflow-hidden">
                                            <div className="absolute top-2 left-2 w-12 h-2 bg-white/10 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
