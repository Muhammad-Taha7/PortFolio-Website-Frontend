import React, { useEffect, useState } from 'react';
import { Sun, Moon, Menu } from 'lucide-react'; // Menu icon import kiya

export const Navbar = ({ onMenuToggle }) => {
    // --- BY DEFAULT DARK SET ---
    // Agar localStorage mein pehle se kuch nahi hai, to default dark mode uthayega
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    return (
        <header 
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            className="h-16 border-b flex items-center justify-between px-4 sm:px-8 transition-colors duration-200"
        >
            {/* Left side: Hamburger button aur Status text */}
            <div className="flex items-center gap-3">
                {/* Hamburger Button: Yeh sirf mobile (md se niche) par dikhega */}
                <button 
                    onClick={onMenuToggle}
                    className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    aria-label="Open Menu"
                >
                    <Menu size={22} />
                </button>

                <span style={{ color: 'var(--text-muted)' }} className="text-sm font-medium uppercase tracking-wider hidden sm:inline">
                    Status Dashboard
                </span>
            </div>
            
            {/* Right side: Dark/Light Mode Toggle */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all shadow-sm cursor-pointer"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
        </header>
    );
};
