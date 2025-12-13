import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Stage, Layer, Line } from 'react-konva';
import {
    Pencil, Eraser, Move, Palette, Layers,
    Download, Save, FilePlus,
    Undo, Redo, ZoomIn, ZoomOut
} from 'lucide-react';
import clsx from 'clsx';
import mascotImage from '../assets/images/mascot_chibi.png';

// Types for drawing tool
type Tool = 'pen' | 'eraser';

interface Line {
    tool: Tool;
    points: number[];
    color: string;
    width: number;
}

export const DashboardPage = () => {
    const [tool, setTool] = useState<Tool>('pen');
    const [lines, setLines] = useState<Line[]>([]);
    const isDrawing = React.useRef(false);
    const [color, setColor] = useState('#00F0FF'); // Default Cyan
    const [width, setWidth] = useState(5);

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
        <div className="relative w-full h-screen overflow-hidden bg-[#1a1a2e]">
            {/* Background Grid - Aesthetic Only */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
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
                            stroke={line.tool === 'eraser' ? '#1a1a2e' : line.color} // Eraser masks with bg color (simple impl)
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

            {/* --- GUI PANELS (FLOATING) --- */}

            {/* Top Bar: Menu & Project Info */}
            <header className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-20">
                <GlassCard className="pointer-events-auto flex items-center gap-4 py-2 px-4 !rounded-full">
                    <div className="w-8 h-8 rounded-full border-2 border-primary animate-spin-slow" />
                    <span className="font-bold text-white tracking-wider">UNTITLED-1</span>
                    <div className="h-4 w-[1px] bg-white/20 mx-2" />
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><FilePlus size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Save size={18} /></button>
                    <button onClick={handleExport} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Export as PNG"><Download size={18} /></button>
                </GlassCard>

                <GlassCard className="pointer-events-auto flex items-center gap-2 py-2 px-4 !rounded-full">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Zoom Out"><ZoomOut size={18} /></button>
                    <span className="text-sm font-mono w-12 text-center">100%</span>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Zoom In"><ZoomIn size={18} /></button>
                </GlassCard>
            </header>

            {/* Left Sidebar: Tools */}
            <GlassCard className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 p-3 z-20 pointer-events-auto w-16 items-center">
                <ToolButton icon={<MovedIcon />} active={false} />
                <ToolButton icon={<Pencil />} active={tool === 'pen'} onClick={() => setTool('pen')} />
                <ToolButton icon={<Eraser />} active={tool === 'eraser'} onClick={() => setTool('eraser')} />

                <div className="h-[1px] w-full bg-white/10 my-1" />

                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white" title="Undo"><Undo size={20} /></button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white" title="Redo"><Redo size={20} /></button>

                <div className="mt-auto pt-4 flex flex-col items-center gap-2">
                    {/* Brush Size Slider (Vertical) */}
                    <div className="h-20 w-1 bg-white/10 rounded-full relative group cursor-pointer">
                        <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-full" style={{ height: `${width * 5}%` }} />
                        {/* Invisible thumb for easier clicking */}
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={width}
                            onChange={(e) => setWidth(parseInt(e.target.value))}
                            className="absolute -left-2 -right-2 top-0 bottom-0 opacity-0 cursor-pointer h-full w-full appearance-slider-vertical"
                            style={{ writingMode: 'vertical-lr', direction: 'rtl' } as any}
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Right Sidebar: Colors & Layers */}
            <div className="absolute right-4 top-24 bottom-24 w-64 flex flex-col gap-4 pointer-events-none z-20">
                {/* Color Palette */}
                <GlassCard className="pointer-events-auto flex-1 max-h-64 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                        <Palette size={16} className="text-secondary" /> <span>COLORS</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {['#00F0FF', '#FFD700', '#FF0055', '#A020F0', '#00FF00', '#FFFFFF', '#000000', '#333333', '#888888', '#CCCCCC'].map((c) => (
                            <button
                                key={c}
                                className={clsx("w-8 h-8 rounded-full border border-white/10 hover:scale-110 transition-transform", color === c && "ring-2 ring-white ring-offset-2 ring-offset-transparent")}
                                style={{ backgroundColor: c }}
                                onClick={() => setColor(c)}
                            />
                        ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10">
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-8 cursor-pointer rounded bg-transparent border-0" />
                    </div>
                </GlassCard>

                {/* Layers Panel */}
                <GlassCard className="pointer-events-auto flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-300 pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2"><Layers size={16} className="text-purple-400" /> <span>LAYERS</span></div>
                        <button><FilePlus size={16} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {/* Mock Layers */}
                        <LayerItem active name="Line Art" />
                        <LayerItem name="Color Fill" />
                        <LayerItem name="Sketch" visible={false} />
                        <LayerItem name="Background" locked />
                    </div>
                </GlassCard>
            </div>

            {/* Mascot Helper */}
            <div className="absolute bottom-4 right-4 z-10 animate-float pointer-events-none">
                <img
                    src={mascotImage}
                    alt="Helper"
                    className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] opacity-80"
                />
            </div>
        </div>
    );
};

// Helper Components
const ToolButton = ({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className={clsx(
            "p-3 rounded-xl transition-all duration-300",
            active
                ? "bg-primary text-black shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                : "text-gray-400 hover:text-white hover:bg-white/10"
        )}
    >
        {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
    </button>
);

const MovedIcon = () => <Move />;

const LayerItem = ({ name, active = false, visible = true, locked = false }: { name: string, active?: boolean, visible?: boolean, locked?: boolean }) => (
    <div className={clsx(
        "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors group",
        active ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5 border border-transparent",
        !visible && "opacity-50"
    )}>
        <div className={clsx("w-4 h-4 rounded border border-white/20 bg-white/5", !visible && "bg-red-500/20")} /> {/* Visibility Toggle Mock */}
        <span className={clsx("text-sm flex-1", active ? "text-white font-medium" : "text-gray-400")}>{name}</span>
        {locked && <LockIcon size={12} className="text-gray-600" />}
    </div>
);

const LockIcon = ({ size, className }: { size: number, className?: string }) => <div className={className} style={{ fontSize: size }}>🔒</div>;



