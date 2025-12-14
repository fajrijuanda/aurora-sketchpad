import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { clsx } from 'clsx';

interface ThemeToggleProps {
    className?: string;
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={clsx(
                "p-2 rounded-lg transition-all duration-300 relative overflow-hidden group border",
                theme === 'dark'
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-yellow-300"
                    : "bg-white border-gray-200 hover:bg-gray-50 text-orange-500 shadow-sm",
                className
            )}
            aria-label="Toggle theme"
        >
            <div className="relative z-10">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div className={clsx(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                theme === 'dark' ? "bg-white/5" : "bg-black/5"
            )} />
        </button>
    );
};
