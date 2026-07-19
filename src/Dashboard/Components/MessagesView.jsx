import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Mail, Trash2, Clock, User, MessageSquare } from 'lucide-react';

export const MessagesView = () => {
    const { token } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', error: false });
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://port-folio-website-backend-ta3p.vercel.app";

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/contact`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setMessages(data);
            } else {
                setStatus({ message: data.message || 'Failed to fetch messages', error: true });
            }
        } catch (err) {
            setStatus({ message: 'Server connection failed', error: true });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/contact/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMessages(messages.filter(m => m._id !== id));
                setStatus({ message: 'Message deleted!', error: false });
                setTimeout(() => setStatus({ message: '', error: false }), 3000);
            } else {
                const data = await res.json();
                setStatus({ message: data.message || 'Failed to delete message', error: true });
            }
        } catch (err) {
            setStatus({ message: 'Server connection failed', error: true });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 style={{ color: 'var(--text-main)' }} className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
                        <Mail className="text-orange-500" size={36} />
                        Contact Messages
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }} className="mt-2 text-lg">Manage messages sent from your portfolio contact form.</p>
                </div>
            </div>

            {status.message && (
                <div className={`p-4 rounded-xl text-sm font-semibold ${status.error ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                    {status.message}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
            ) : messages.length === 0 ? (
                <div style={{ borderColor: 'var(--border-color)' }} className="py-20 border-2 border-dashed rounded-3xl flex flex-col items-center text-center">
                    <div className="h-24 w-24 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 mb-6">
                        <Mail size={40} />
                    </div>
                    <h4 style={{ color: 'var(--text-main)' }} className="text-xl font-bold mb-2">No Messages Yet</h4>
                    <p style={{ color: 'var(--text-muted)' }} className="max-w-md">When someone fills out your contact form, their message will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {messages.map((msg) => (
                        <div key={msg._id} style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="border rounded-2xl p-6 shadow-sm relative group">
                            
                            <button 
                                onClick={() => handleDelete(msg._id)}
                                className="absolute top-6 right-6 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors"
                                title="Delete Message"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-wrap gap-x-8 gap-y-2">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-orange-500" />
                                        <span style={{ color: 'var(--text-main)' }} className="font-bold text-lg">{msg.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-orange-400 font-medium">
                                        <Mail size={16} />
                                        <a href={`mailto:${msg.email}`}>{msg.email}</a>
                                    </div>
                                    <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                        <Clock size={16} />
                                        <span className="text-sm">{new Date(msg.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-2">
                                    <h4 style={{ color: 'var(--text-main)' }} className="font-bold text-xl mb-2 flex items-center gap-2">
                                        <span className="text-orange-500">Subject:</span> {msg.subject}
                                    </h4>
                                    <div className="bg-black/20 p-5 rounded-xl border border-white/5 relative">
                                        <MessageSquare size={16} className="absolute top-5 right-5 text-white/10" />
                                        <p style={{ color: 'var(--text-main)' }} className="text-base leading-relaxed whitespace-pre-wrap pr-8">
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
