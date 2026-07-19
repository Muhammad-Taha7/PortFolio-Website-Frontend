import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../Store/Slices/authSlice.js';
import { Lock, User, ArrowRight, Sparkles, Sun, Moon } from 'lucide-react';

// ThreeJS aur Vanta files ko sahi tareeqe se import kiya
import * as THREE from 'three';
import 'vanta/dist/vanta.globe.min'; 

export const Signinform = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://port-folio-website-backend-ta3p.vercel.app";
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // Vanta ke liye ref aur effect state
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);

    /* 
      --- BY DEFAULT DARK MODE SET ---
      Pehle yeh check karega ke localStorage mein koi preference save hai ya nahi.
      Agar pehle se kuch save nahi hai (jaise new user), to yeh 'true' (Dark Mode) par set hoga.
    */
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return true; // Default to dark mode
    });

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    // Vanta Globe Initialization Effect
    useEffect(() => {
        if (!vantaEffect && vantaRef.current && window.VANTA && window.VANTA.GLOBE) {
            setVantaEffect(
                window.VANTA.GLOBE({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0x3f99ff,
                    backgroundColor: isDarkMode ? 0x0f172a : 0xffffff 
                })
            );
        }
        return () => {
            if (vantaEffect) {
                vantaEffect.destroy();
                setVantaEffect(null);
            }
        };
    }, [vantaEffect, isDarkMode]);

    // Dark/Light Theme aur Vanta Background Sync Effect
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        
        if (vantaEffect) {
            vantaEffect.setOptions({
                backgroundColor: isDarkMode ? 0x0f172a : 0xffffff
            });
        }
    }, [isDarkMode, vantaEffect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        const endpoint = isLoginMode
            ? '/api/auth/login'
            : '/api/auth/register';

        try {
            const res = await fetch(`${BACKEND_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                dispatch(loginSuccess(data.token));
            } else {
                dispatch(loginFailure(data.message || 'Authentication failed.'));
            }
        } catch (err) {
            dispatch(loginFailure('Server connection failed. Please check your backend connection.'));
        }
    };

    return (
        <div 
            ref={vantaRef}
            className="min-h-screen w-full flex items-center justify-start px-6 md:pl-28 relative overflow-hidden transition-colors duration-200"
        >
            {/* --- Floating Dark Mode Toggle --- */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    type="button"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-main)'
                    }}
                    className="p-3 border rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                    aria-label="Toggle Theme"
                >
                    {isDarkMode ? <Sun size={20} className="text-orange-400" /> : <Moon size={20} className="text-black" />}
                </button>
            </div>

            {/* --- Login/Signup Form Card --- */}
            <div 
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                className="w-full max-w-md border rounded-2xl shadow-2xl p-8 sm:p-10 backdrop-blur-md relative z-10 transition-all duration-200"
            >
                <div className="flex flex-col items-center text-center mb-8">
                 
                    
                    <h2 style={{ color: 'var(--text-main)' }} className="text-2xl font-semibold tracking-tight">
                        {isLoginMode ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }} className="text-sm mt-1.5">
                        {isLoginMode ? 'Enter details to access your secure portal' : 'Fill in the details to start your journey'}
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-xl border border-red-900/50 bg-red-950/40 text-red-400 text-sm px-4 py-3 text-center border-dashed">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label style={{ color: 'var(--text-muted)' }} className="block text-xs font-semibold mb-2 tracking-wide uppercase">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="e.g. johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                className="w-full border rounded-xl py-3 pl-11 pr-4 placeholder-slate-600 text-sm outline-none transition-all duration-200 focus:border-orange-500 shadow-inner"
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ color: 'var(--text-muted)' }} className="block text-xs font-semibold mb-2 tracking-wide uppercase">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                className="w-full border rounded-xl py-3 pl-11 pr-4 placeholder-slate-600 text-sm outline-none transition-all duration-200 focus:border-orange-500 shadow-inner"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 mt-4 py-3.5 rounded-xl font-medium text-sm text-white bg-orange-600 transition-all duration-200 hover:bg-orange-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/20 cursor-pointer"
                    >
                        <span>{loading ? 'Authenticating...' : (isLoginMode ? 'Sign In' : 'Get Started')}</span>
                        {!loading && <ArrowRight size={16} />}
                    </button>
                </form>

            
            </div>
        </div>
    );
};
