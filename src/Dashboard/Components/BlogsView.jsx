import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Plus, X, Upload, CheckCircle, Trash2, Edit2, FileText, Tag, Calendar } from 'lucide-react';

export const BlogsView = () => {
    const { token } = useSelector((state) => state.auth);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://port-folio-website-backend-xjvf.vercel.app";
    
    const [blogs, setBlogs] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    
    const [status, setStatus] = useState({ loading: false, message: '', error: false });
    const fileInputRef = useRef(null);

    const fetchBlogs = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/blogs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setBlogs(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) fetchBlogs();
    }, [token]);

    const handleFileChange = (files) => {
        const file = files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setCoverImageUrl('');
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setTags('');
        setCoverImageUrl('');
        setSelectedFile(null);
        setPreviewUrl('');
        setIsAdding(false);
        setEditingId(null);
        setStatus({ loading: false, message: '', error: false });
    };

    const startEdit = (blog) => {
        setEditingId(blog._id);
        setIsAdding(true);
        setTitle(blog.title);
        setContent(blog.content);
        setTags(blog.tags ? blog.tags.join(', ') : '');
        setCoverImageUrl(blog.coverImage || '');
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            setStatus({ loading: false, message: 'Title and Content are required.', error: true });
            return;
        }

        setStatus({ loading: true, message: 'Saving blog...', error: false });

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('tags', tags);
        
        if (selectedFile) {
            formData.append('coverImageFile', selectedFile);
        } else if (coverImageUrl) {
            formData.append('coverImage', coverImageUrl);
        }

        const url = editingId ? `${BACKEND_URL}/api/blogs/${editingId}` : `${BACKEND_URL}/api/blogs`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                throw new Error("Invalid server response");
            }

            if (res.ok) {
                if (editingId) {
                    setBlogs(blogs.map(b => b._id === editingId ? data.blog : b));
                } else {
                    setBlogs([data.blog, ...blogs]);
                }
                resetForm();
                setStatus({ loading: false, message: editingId ? 'Blog updated!' : 'Blog published!', error: false });
                setTimeout(() => setStatus({ loading: false, message: '', error: false }), 3000);
            } else {
                setStatus({ loading: false, message: data.message || 'Failed to save blog.', error: true });
            }
        } catch (err) {
            setStatus({ loading: false, message: 'Server connection failed.', error: true });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/blogs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setBlogs(blogs.filter(b => b._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getImageSrc = (img) => {
        if (!img) return '';
        return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="mt-4 px-4 pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 style={{ color: 'var(--text-main)' }} className="text-3xl font-bold flex items-center gap-3">
                        <FileText className="text-violet-500" />
                        Blogs
                    </h3>
                    <p style={{ color: 'var(--text-muted)' }} className="text-base mt-2">
                        Write and manage your blog articles.
                    </p>
                </div>
                {!isAdding && (
                    <button 
                        onClick={() => { resetForm(); setIsAdding(true); }}
                        className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-lg transition-all font-semibold flex items-center gap-2 hover:-translate-y-1 cursor-pointer"
                    >
                        <Plus size={20} /> Add Blog
                    </button>
                )}
            </div>

            {status.message && !isAdding && (
                <div className={`mb-6 p-5 rounded-2xl border border-dashed text-base flex items-center gap-4 ${
                    status.error ? 'border-red-950 bg-red-950/20 text-red-400' : 'border-emerald-950 bg-emerald-950/20 text-emerald-400'
                }`}>
                    <CheckCircle size={22} />
                    <span>{status.message}</span>
                </div>
            )}

            {isAdding ? (
                <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="p-8 md:p-10 border rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h4 style={{ color: 'var(--text-main)' }} className="text-2xl font-bold">
                            {editingId ? 'Edit Blog' : 'Write New Blog'}
                        </h4>
                        <button onClick={resetForm} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide">Blog Title *</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. How I Built a Full Stack App"
                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-violet-500 transition-all text-lg" />
                        </div>

                        <div className="space-y-2">
                            <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide">Content *</label>
                            <textarea rows="10" value={content} onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your blog content here..."
                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-violet-500 transition-all resize-none leading-relaxed" />
                        </div>

                        <div className="space-y-2">
                            <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                                <Tag size={16} /> Tags
                            </label>
                            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g. React, Tutorial, Web Dev (comma-separated)"
                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-violet-500 transition-all" />
                        </div>

                        {/* Cover Image */}
                        <div className="space-y-3 pt-2">
                            <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide">
                                Cover Image (Optional)
                            </label>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div onClick={() => fileInputRef.current?.click()}
                                    style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                                    className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-center">
                                    <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} accept="image/*" className="hidden" />
                                    <Upload size={28} className="text-violet-500 mb-3" />
                                    <p style={{ color: 'var(--text-main)' }} className="font-semibold">Upload Cover Image</p>
                                    <p style={{ color: 'var(--text-muted)' }} className="text-sm mt-1">PNG, JPG up to 5MB</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <input type="url" value={coverImageUrl} onChange={(e) => { setCoverImageUrl(e.target.value); setSelectedFile(null); setPreviewUrl(''); }}
                                        placeholder="Or paste image URL..."
                                        style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                        className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-violet-500 transition-all" />
                                    
                                    {(previewUrl || coverImageUrl) && (
                                        <div className="relative h-36 rounded-xl overflow-hidden border-2 border-violet-500/30 shadow-md group">
                                            <img src={previewUrl || getImageSrc(coverImageUrl)} alt="Cover" className="h-full w-full object-cover" />
                                            <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(''); setCoverImageUrl(''); }}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {status.message && (
                            <div className={`p-4 rounded-xl text-sm ${status.error ? 'bg-red-950/30 text-red-400' : 'bg-emerald-950/30 text-emerald-400'}`}>
                                {status.message}
                            </div>
                        )}

                        <div className="flex justify-end gap-4 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                            <button type="button" onClick={resetForm}
                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                                className="px-6 py-3 border-2 rounded-xl font-semibold hover:bg-slate-800 transition-colors cursor-pointer">
                                Cancel
                            </button>
                            <button type="submit" disabled={status.loading}
                                className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-1">
                                {status.loading ? 'Saving...' : editingId ? 'Update Blog' : 'Publish Blog'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {blogs.length === 0 ? (
                        <div style={{ borderColor: 'var(--border-color)' }} className="col-span-full py-20 border-2 border-dashed rounded-3xl flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 mb-6">
                                <FileText size={40} />
                            </div>
                            <h4 style={{ color: 'var(--text-main)' }} className="text-xl font-bold mb-2">No Blogs Yet</h4>
                            <p style={{ color: 'var(--text-muted)' }} className="max-w-md">Start writing blog articles to share your knowledge.</p>
                        </div>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog._id} style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="flex flex-col border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                                {/* Cover Image */}
                                {blog.coverImage ? (
                                    <div className="h-52 w-full overflow-hidden">
                                        <img src={getImageSrc(blog.coverImage)} alt={blog.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                ) : (
                                    <div className="h-40 w-full bg-gradient-to-br from-violet-600/20 to-orange-600/20 flex items-center justify-center">
                                        <FileText size={48} className="text-violet-500/50" />
                                    </div>
                                )}
                                
                                <div className="p-8 flex-1 flex flex-col">
                                    {/* Date */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <Calendar size={14} className="text-violet-500" />
                                        <span style={{ color: 'var(--text-muted)' }} className="text-xs font-medium">{formatDate(blog.createdAt)}</span>
                                    </div>

                                    {/* Title */}
                                    <h4 style={{ color: 'var(--text-main)' }} className="text-xl font-bold line-clamp-2 mb-3">{blog.title}</h4>
                                    
                                    {/* Content Preview */}
                                    <p style={{ color: 'var(--text-muted)' }} className="text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">{blog.content}</p>
                                    
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {blog.tags && blog.tags.map((tag, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-lg text-xs font-bold uppercase tracking-wider">{tag}</span>
                                        ))}
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="pt-6 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border-color)' }}>
                                        <button onClick={() => startEdit(blog)}
                                            className="flex items-center gap-2 px-5 py-2.5 text-violet-400 hover:text-white hover:bg-violet-500 rounded-xl transition-colors text-sm font-bold cursor-pointer">
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(blog._id)}
                                            className="flex items-center gap-2 px-5 py-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-colors text-sm font-bold cursor-pointer">
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
