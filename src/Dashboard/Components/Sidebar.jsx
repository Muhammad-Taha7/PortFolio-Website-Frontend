import React from 'react';
import { 
    Shield, 
    Home, 
    LogOut, 
    User, 
    Image, 
    Star, 
    Briefcase, 
    MessageSquare, 
    FileText,
    Mail
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    // Nav items ka array banaya taake code clean rahe aur maintain karna aasan ho
    const navItems = [
        { id: 'profile-image', label: 'Add Profile Image', icon: <Image size={20} /> },
        { id: 'top-projects', label: 'Add Top Projects', icon: <Star size={20} /> },
        { id: 'projects', label: 'Add Projects', icon: <Briefcase size={20} /> },
        { id: 'testimonials', label: 'Add Testimonials', icon: <MessageSquare size={20} /> },
        { id: 'blogs', label: 'Add Blogs', icon: <FileText size={20} /> },
        { id: 'messages', label: 'Messages', icon: <Mail size={20} /> },
        { id: 'security', label: 'Security', icon: <Shield size={20} /> },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 dark:bg-slate-950 dark:text-slate-400 flex flex-col shadow-2xl z-10 border-r border-slate-800 transition-colors duration-200">
            {/* Sidebar Header */}
            <div className="p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <User className="text-orange-400" /> 
                    Admin Portal
                </h2>
            </div>
            
            {/* Dynamic Navigation Tabs */}
            <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                            activeTab === item.id 
                                ? 'bg-orange-600 text-white shadow-lg' 
                                : 'hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900'
                        }`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Logout Button Footer */}
            <div className="p-4 border-t border-slate-800">
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-lg transition-all font-medium cursor-pointer"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};
