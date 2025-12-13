
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import mascotImage from '../assets/images/mascot_chibi.png';
import uiMockupImage from '../assets/ui_mockup.png';
import { Sparkles, Palette, Layers, Zap } from 'lucide-react';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen relative overflow-y-auto overflow-x-hidden flex flex-col">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center bg-transparent backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                    <span className="text-xl font-bold tracking-wider text-white">Aurora</span>
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                    <Button variant="primary" glow onClick={() => navigate('/register')}>Get Started</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 pt-32 lg:pt-32 gap-12 max-w-7xl mx-auto z-10">
                <div className="flex-1 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass-low border border-glass-border text-cyan-300 text-sm">
                        <Sparkles size={16} />
                        <span>Next Gen Web-based Drawing App</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                        Unleash Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">
                            Creative Soul
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                        Experience a drawing tool that feels like magic. Fluid animations, infinite canvas, and a UI that inspires your inner artist.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <Button size="lg" glow onClick={() => navigate('/register')}>Start Creating</Button>
                        <Button size="lg" variant="glass" onClick={() => navigate('/login')}>Resume Project</Button>
                    </div>

                    <div className="flex items-center gap-8 pt-8 opacity-70">
                        <div className="flex items-center gap-2">
                            <Zap className="text-primary" />
                            <span className="text-sm">Zero Latency</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Palette className="text-secondary" />
                            <span className="text-sm">Vibrant Colors</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Layers className="text-purple-400" />
                            <span className="text-sm">Smart Layers</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative flex justify-center">
                    {/* Floating Glass Panels behind mascot */}
                    <GlassCard className="absolute top-10 -right-10 w-64 h-40 animate-float " style={{ animationDelay: '1s' }}>
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded opacity-50" />
                    </GlassCard>

                    <GlassCard className="absolute -bottom-10 -left-10 w-56 h-56 animate-float" style={{ animationDelay: '2s' }}>
                        <div className="text-white/80 font-mono text-xs space-y-2">
                            <div className="h-2 w-2/3 bg-white/20 rounded" />
                            <div className="h-2 w-1/2 bg-white/20 rounded" />
                            <div className="h-2 w-3/4 bg-white/20 rounded" />
                        </div>
                    </GlassCard>

                    <div className="relative z-10 w-[80%] max-w-[500px] animate-float">
                        <img
                            src={mascotImage}
                            alt="Mascot"
                            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,240,255,0.4)] scale-x-[-1]"
                        />
                    </div>
                </div>
            </main>

            {/* Feature Showcase: The Workspace Experience */}
            <section className="relative z-20 py-24 px-6">
                <div className="max-w-7xl mx-auto text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold">
                            Designed for <span className="text-primary">Flow State</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Immerse yourself in a canvas that breathes. Our outdated-free interface floats above your work,
                            giving you maximum space to create.
                        </p>
                    </div>

                    <div className="relative group">
                        {/* Glow effect behind the image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-700" />

                        {/* The UI Mockup Image */}
                        <GlassCard className="relative inline-block p-4 !rounded-3xl border-white/10 hover:border-primary/50 transition-all duration-500 overflow-hidden transform hover:scale-[1.02]">
                            <img
                                src={uiMockupImage}
                                alt="Aurora Workspace Interface"
                                className="w-full max-w-5xl rounded-2xl shadow-2xl"
                            />

                            {/* Overlay info badges */}
                            <div className="absolute bottom-8 left-8 flex gap-3">
                                <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs font-mono text-cyan-300">
                                    Floating Panels
                                </div>
                                <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs font-mono text-cyan-300">
                                    Infinite Canvas
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </section>

            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
            </div>
        </div>
    );
};
