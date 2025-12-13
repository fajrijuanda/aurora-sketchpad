
import mascotImage from '../../assets/images/mascot_chibi.png';

export const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f0f13] overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f0f13]/80 pointer-events-none" />

            {/* Glowing orb behind mascot */}
            <div className="absolute w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full animate-pulse-glow" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Mascot with float animation */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float">
                    <img
                        src={mascotImage}
                        alt="Loading Mascot"
                        className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] scale-x-[-1]"
                    />

                    {/* Ring orbit effect (CSS only for now) */}
                    <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-spin-slow scale-150 rotate-x-60"
                        style={{ transform: 'rotateX(70deg) scale(1.5)' }} />
                    <div className="absolute inset-0 border border-secondary/30 rounded-full animate-spin-slow scale-125 rotate-x-60 animation-delay-1000"
                        style={{ transform: 'rotateX(70deg) scale(1.2) rotate(45deg)' }} />
                </div>

                <div className="mt-12 space-y-4 text-center">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary animate-pulse">
                        Initializing System...
                    </h2>
                    <div className="w-64 h-2 bg-glass-border rounded-full overflow-hidden relative">
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary w-full origin-left animate-[shimmer_2s_infinite]" />
                    </div>
                </div>
            </div>
        </div>
    );
};
