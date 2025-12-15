import { useEffect, useState, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Search, Plus, Grid, List, Clock, Folder, MoreHorizontal, FileText, ChevronDown, User, Settings, LogOut, Layout } from 'lucide-react';
import clsx from 'clsx';
import { useAlert } from '../hooks/useAlert';

interface Project {
    id: string;
    name: string;
    preview?: string;
    updated_at: string;
}

interface UserData {
    name: string;
    email: string;
    avatar?: string;
}

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load user from local storage (set during login)
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        fetchProjects();

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [navigate]);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3001/api/projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        const name = prompt("Enter project name:", "Untitled Project");
        if (!name) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3001/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });

            if (res.ok) {
                const data = await res.json();
                navigate(`/editor/${data.id}`);
            }
        } catch (err) {
            console.error("Failed to create project", err);
        }
    };

    const handleLogout = () => {
        showAlert({
            type: 'danger',
            title: 'Log out?',
            message: 'Are you sure you want to log out of your account?',
            confirmText: 'Yes, Log out',
            cancelText: 'Cancel',
            onConfirm: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
            }
        });
    };

    return (
        <div className="min-h-screen flex bg-[#0f0f13] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 flex flex-col p-4 bg-black/20 relative">
                {/* User Profile Dropdown Trigger */}
                <div
                    className="flex items-center gap-2 px-2 py-4 mb-6 cursor-pointer hover:bg-white/5 rounded-lg transition-colors relative"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-black overflow-hidden">
                        {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : (user?.name?.[0] || 'U')}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{user?.name || 'User'}</div>
                        <div className="text-xs text-gray-500">Free Team</div>
                    </div>
                    <ChevronDown size={14} className="text-gray-500" />
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div ref={dropdownRef} className="absolute top-16 left-4 w-60 bg-[#1e1e24] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-white/5 flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 p-0.5">
                                <div className="w-full h-full rounded-full bg-[#1e1e24] p-0.5 overflow-hidden">
                                    {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" /> : <div className="w-full h-full bg-gray-700" />}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-sm text-white">{user?.name}</div>
                                <button className="text-xs text-gray-400 hover:text-white">Edit profile</button>
                            </div>
                        </div>
                        <div className="py-2">
                            <DropdownItem icon={<Layout size={16} />} label="Theme" />
                            <DropdownItem icon={<Settings size={16} />} label="Settings" />
                        </div>
                        <div className="py-2 border-t border-white/5">
                            <DropdownItem icon={<User size={16} />} label="Create a community profile" subtitle={user?.email} />
                        </div>
                        <div className="py-2 border-t border-white/5">
                            <DropdownItem icon={<Plus size={16} />} label="Add account" />
                        </div>
                        <div className="py-2 border-t border-white/5">
                            <DropdownItem icon={<LogOut size={16} />} label="Log out" onClick={handleLogout} />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <SidebarItem icon={<Clock size={18} />} label="Recents" active />
                    <SidebarItem icon={<Folder size={18} />} label="Drafts" />
                    <SidebarItem icon={<Grid size={18} />} label="All projects" />
                </div>

                <div className="mt-8">
                    <div className="px-3 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Community</div>
                    <SidebarItem icon={<Search size={18} />} label="Explore" />
                </div>

                <div className="mt-auto">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-center space-y-3">
                        <div className="text-xs text-gray-300">Unlock more features with Pro</div>
                        <Button size="sm" glow className="w-full">Upgrade</Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/10 backdrop-blur-sm">
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search files, projects..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 ml-6">
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/10">
                            <button onClick={() => setView('grid')} className={clsx("p-1.5 rounded transition-colors", view === 'grid' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}>
                                <Grid size={16} />
                            </button>
                            <button onClick={() => setView('list')} className={clsx("p-1.5 rounded transition-colors", view === 'list' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}>
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    {/* Welcome / Create New */}
                    <div className="mb-10 flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Your Projects</h1>
                        <Button glow onClick={handleCreateProject}>
                            <Plus size={18} /> New Project
                        </Button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-6 mb-6 border-b border-white/5 pb-2">
                        <button className="text-sm font-medium text-white border-b-2 border-primary pb-2 -mb-2.5">Recently viewed</button>
                        <button className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Shared files</button>
                        <button className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Shared projects</button>
                    </div>

                    {/* Files Grid */}
                    {loading ? (
                        <div className="text-center text-gray-500 py-10">Loading projects...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* New Design Card */}
                            <div
                                onClick={handleCreateProject}
                                className="group relative aspect-[4/3] rounded-xl border border-white/10 border-dashed bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Plus size={24} />
                                </div>
                                <span className="font-medium text-gray-400 group-hover:text-white">New Design File</span>
                            </div>

                            {projects.map(project => (
                                <FileCard key={project.id} file={project} onClick={() => navigate(`/editor/${project.id}`)} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Components

const DropdownItem = ({ icon, label, subtitle, onClick }: { icon: ReactNode, label: string, subtitle?: string, onClick?: () => void }) => (
    <div onClick={onClick} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 cursor-pointer transition-colors group">
        <div className="text-gray-400 group-hover:text-white">{icon}</div>
        <div>
            <div className="text-sm text-gray-200 group-hover:text-white">{label}</div>
            {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
    </div>
);

const SidebarItem = ({ icon, label, active }: { icon: ReactNode, label: string, active?: boolean }) => (
    <div className={clsx(
        "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
        active ? "bg-primary/10 text-primary font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"
    )}>
        {icon}
        <span className="text-sm">{label}</span>
    </div>
);

const FileCard = ({ file, onClick }: { file: Project, onClick: () => void }) => (
    <div onClick={onClick} className="group cursor-pointer">
        <div className={clsx("aspect-[4/3] rounded-t-xl overflow-hidden relative bg-[#1e1e24]")}>
            {/* Preview Mockup */}
            {file.preview ? (
                <img src={file.preview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-purple-900/40" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>
        <div className="bg-[#1e1e24] p-3 rounded-b-xl border border-t-0 border-white/5 flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-500/20 rounded text-blue-400"><FileText size={14} /></div>
                <div>
                    <div className="text-sm font-medium text-gray-200 group-hover:text-primary transition-colors truncate max-w-[120px]">{file.name}</div>
                    <div className="text-xs text-gray-500">{new Date(file.updated_at).toLocaleDateString()}</div>
                </div>
            </div>
            <button className="text-gray-600 hover:text-white"><MoreHorizontal size={16} /></button>
        </div>
    </div>
);
