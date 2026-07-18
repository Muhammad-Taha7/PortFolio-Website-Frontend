import React from 'react';

export const SecurityView = ({ 
    handleUpdateProfile, 
    newUsername, 
    setNewUsername, 
    newPassword, 
    setNewPassword, 
    message, 
    isError 
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
            {/* Using theme variables for titles */}
            <h1 style={{ color: 'var(--text-main)' }} className="text-3xl font-bold mb-2">
                Security Settings
            </h1>
            <p style={{ color: 'var(--text-muted)' }} className="text-lg mb-8">
                Update your login credentials securely.
            </p>
            
            {/* Card Background and Border connected to variables */}
            <div 
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                className="p-8 rounded-2xl shadow-sm border transition-colors duration-200"
            >
                {message && (
                    <div className={`p-4 rounded-lg mb-6 text-sm font-medium border ${
                        isError 
                            ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50'
                    }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                        <label 
                            style={{ color: 'var(--text-main)' }} 
                            className="block text-sm font-semibold mb-2"
                        >
                            New Username
                        </label>
                        <input 
                            type="text" 
                            placeholder="Optional: New Username"
                            value={newUsername} 
                            onChange={(e) => setNewUsername(e.target.value)} 
                            style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label 
                            style={{ color: 'var(--text-main)' }} 
                            className="block text-sm font-semibold mb-2"
                        >
                            New Password
                        </label>
                        <input 
                            type="password" 
                            placeholder="Optional: Min 6 characters"
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full py-3 bg-orange-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};
