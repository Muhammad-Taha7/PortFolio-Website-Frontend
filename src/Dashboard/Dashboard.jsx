import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './Store/Slices/authSlice.js';
import { Signinform } from './Components/Signinform';

import { Sidebar } from './Components/Sidebar';
import { Navbar } from './Components/Navbar';
import { SecurityView } from './Components/Securityview';

// --- Naye Components ke Imports ---
// OverviewView ka import yahan se remove kar diya gaya hai
import { ProfileImageView } from './Components/ProfileImageView';
import { TopProjectsView } from './Components/TopProjectsView';
import { ProjectsView } from './Components/ProjectsView';
import { TestimonialsView } from './Components/TestimonialsView';
import { BlogsView } from './Components/BlogsView';
import { MessagesView } from './Components/MessagesView';

export const Dashboard = () => {
    const dispatch = useDispatch();
    const { token, isAuthenticated } = useSelector((state) => state.auth);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    
    // Default state ko 'overview' se badal kar 'profile-image' kar diya taake pehla page sahi render ho
    const [activeTab, setActiveTab] = useState('profile-image');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Profile update karne ka function jo form handle karega
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newUsername, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || 'Profile successfully updated!');
                setNewPassword('');
                setNewUsername('');
            } else {
                setIsError(true);
                setMessage(data.message || 'Failed to update profile.');
            }
        } catch (err) {
            setIsError(true);
            setMessage('Server error. Please try again.');
        }
    };

    if (!isAuthenticated) {
        return <Signinform />;
    }

    return (
        <div 
            style={{ backgroundColor: 'var(--bg-main)' }} 
            className="flex h-screen font-sans transition-colors duration-200"
        >
            {/* Left Sidebar */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={() => dispatch(logout())} 
            />

            {/* Right Side Main Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <Navbar />

                {/* Dynamic Content Body */}
                <main className="flex-1 overflow-y-auto p-8 md:p-12">
                    {/* Saare Active Tabs ki Conditional Rendering */}
                    {activeTab === 'profile-image' && <ProfileImageView />}
                    {activeTab === 'top-projects' && <TopProjectsView />}
                    {activeTab === 'projects' && <ProjectsView />}
                    {activeTab === 'testimonials' && <TestimonialsView />}
                    {activeTab === 'blogs' && <BlogsView />}
                    {activeTab === 'messages' && <MessagesView />}
                    
                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <SecurityView 
                            handleUpdateProfile={handleUpdateProfile}
                            newUsername={newUsername}
                            setNewUsername={setNewUsername}
                            newPassword={newPassword}
                            setNewPassword={setNewPassword}
                            message={message}
                            isError={isError}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};
