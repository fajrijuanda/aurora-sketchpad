import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Stage, Layer, Line } from 'react-konva';
import {
    Pencil, Eraser, Move, FilePlus,
    Type, Menu, Download
} from 'lucide-react';
import clsx from 'clsx';

// Types for drawing tool
type Tool = 'pen' | 'eraser';

interface Line {
    tool: Tool;
    points: number[];
    color: string;
    width: number;
}

export const EditorPage = () => {
    const [tool, setTool] = useState<Tool>('pen');
    const [lines, setLines] = useState<Line[]>([]);
    const isDrawing = React.useRef(false);
    const [color] = useState('#00F0FF'); // Default Cyan
    const [width] = useState(5);

    // Canvas dimensions (would typically be dynamic or resize observer)
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    React.useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMouseDown = (e: any) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y], color, width }]);
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing.current) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const stageRef = React.useRef<any>(null);

    const handleExport = () => {
        if (!stageRef.current) return;
        const uri = stageRef.current.toDataURL();
        const link = document.createElement('a');
        link.download = 'aurora-drawing.png';
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#0f0f13]">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            {/* Canvas Layer */}
            <Stage
                ref={stageRef}
                width={dimensions.width}
                height={dimensions.height}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                className="cursor-crosshair z-0"
            >
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.tool === 'eraser' ? '#0f0f13' : line.color}
                            strokeWidth={line.width}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                line.tool === 'eraser' ? 'destination-out' : 'source-over'
                            }
                        />
                    ))}
                </Layer>
            </Stage>

            {/* --- GUI PANELS (FLOATING) MATCHING MOCKUP --- */}

            {/* Header / Top Bar */}
            <header className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-20 bg-[#000000]/40 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="Aurora" className="w-6 h-6 object-contain" />
                    <span className="text-white font-semibold tracking-wide">Aurora</span>
                </div>

                {/* Center Toolbar (Tools) moved to top center or bottom center? Mockup shows bottom center tool dock. Top center is specific tool options. */}
                <GlassCard className="flex items-center gap-1 p-1 !rounded-lg border border-white/10 !bg-white/5">
                    <button className={clsx("p-1.5 rounded hover:bg-white/10 transition-colors", tool === 'pen' && "bg-primary/20 text-primary")} onClick={() => setTool('pen')}><Pencil size={18} /></button>
                    <button className={clsx("p-1.5 rounded hover:bg-white/10 transition-colors", tool === 'eraser' && "bg-primary/20 text-primary")} onClick={() => setTool('eraser')}><Eraser size={18} /></button>
                    <button className="p-1.5 rounded hover:bg-white/10 transition-colors"><Type size={18} /></button>
                    <button className="p-1.5 rounded hover:bg-white/10 transition-colors"><Move size={18} /></button>
                </GlassCard>

                <div className="flex items-center gap-2">
                    <button onClick={handleExport} className="p-2 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors" title="Export Image">
                        <Download size={18} />
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-md transition-colors">Sign up</button>
                    <button className="p-2 hover:bg-white/10 rounded-full"><Menu size={18} /></button>
                </div>
            </header>

            {/* Left Sidebar: Layers Panel (Floating) */}
            <GlassCard className="absolute top-24 left-6 w-64 flex flex-col gap-0 !rounded-xl !p-0 overflow-hidden border border-white/10 shadow-2xl animate-float" style={{ animationDuration: '6s' }}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <span className="font-semibold text-gray-200">Layers</span>
                    <button className="text-gray-400 hover:text-white"><FilePlus size={16} /></button>
                </div>
                <div className="p-2 space-y-1">
                    <div className="p-3 bg-white/5 rounded-lg border border-primary/30 flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-purple-600" />
                        <div className="flex-1">
                            <div className="text-xs font-medium text-white">Nebula</div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    {[2, 1].map(i => (
                        <div key={i} className="p-3 hover:bg-white/5 rounded-lg border border-transparent flex items-center gap-3 opacity-60">
                            <div className="w-8 h-8 rounded bg-white/10" />
                            <div className="text-xs font-medium text-gray-300">Layer {i}</div>
                        </div>
                    ))}
                </div>
                <div className="p-3 border-t border-white/5 text-center text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
                    + Add layer
                </div>
            </GlassCard>


            {/* Right Sidebar: Properties Panel (Floating) */}
            <GlassCard className="absolute top-24 right-6 w-72 flex flex-col gap-4 !rounded-xl p-5 border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-200">Properties</span>
                </div>

                {/* Property Sliders Mock */}
                {[
                    { label: 'Point', val: 80 },
                    { label: 'Smoothing', val: 40 },
                    { label: 'Color', val: 60, col: true },
                    { label: 'Thickness', val: 20 },
                    { label: 'Light Speed', val: 90 },
                    { label: 'Background', val: 30 },
                    { label: 'Lighting', val: 50 },
                ].map((prop, i) => (
                    <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>{prop.label}</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full relative group cursor-pointer">
                            <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${prop.val}%` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-secondary rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)] transform scale-0 group-hover:scale-100 transition-transform" />
                            </div>
                        </div>
                    </div>
                ))}
            </GlassCard>

            {/* Bottom Center: Tool Dock (The colorful one) */}
            <GlassCard className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 p-4 !rounded-2xl border border-white/10 bg-black/60 shadow-2xl">
                <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                    <div className="flex flex-col gap-2">
                        <button className={clsx("p-2 rounded-lg transition-colors", tool === 'pen' ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,240,255,0.6)]" : "bg-white/5 text-gray-400")}>
                            <Pencil size={20} />
                        </button>
                        <button className={clsx("p-2 rounded-lg transition-colors", tool === 'eraser' ? "bg-cyan-500 text-black" : "bg-white/5 text-gray-400")}>
                            <Eraser size={20} />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {/* Brushes */}
                        <div className="w-8 h-20 bg-gradient-to-b from-cyan-400 to-transparent opacity-50 rounded-full" />
                        <div className="w-8 h-20 bg-gradient-to-b from-yellow-400 to-transparent opacity-50 rounded-full" />
                        <div className="w-8 h-20 bg-gradient-to-b from-white to-transparent opacity-20 rounded-full" />
                    </div>
                </div>

                {/* Color Wheel Mock */}
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-orange-500 border-4 border-white/5 shadow-inner">
                    <div className="absolute inset-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10" />
                </div>
            </GlassCard>

        </div>
    );
};
