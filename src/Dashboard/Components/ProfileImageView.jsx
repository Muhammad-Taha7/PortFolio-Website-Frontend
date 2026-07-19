import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle, Trash2, Edit2, Link as LinkIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

export const ProfileImageView = () => {
    const { token } = useSelector((state) => state.auth);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://port-folio-website-backend-ta3p.vercel.app";

    const [existingImage, setExistingImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState({ loading: false, message: '', error: false });
    
    const fileInputRef = useRef(null);

    // Fetch existing profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok && data.profileImage) {
                    // Check if it's already an online URL or base64 data
                    if (data.profileImage.startsWith('http') || data.profileImage.startsWith('data:')) {
                        setExistingImage(data.profileImage);
                    } else {
                        // Otherwise, it's a local upload
                        setExistingImage(`${BACKEND_URL}${data.profileImage.startsWith('/') ? '' : '/'}${data.profileImage}`);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch profile data:", err);
            }
        };
        if (token) fetchProfile();
    }, [token]);

    const handleFileChange = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setStatus({ loading: false, message: 'Please select a valid image file (PNG, JPG).', error: true });
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file)); 
        setStatus({ loading: false, message: '', error: false }); 
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDeleteExistingImage = async () => {
        setStatus({ loading: true, message: 'Deleting image...', error: false });
        try {
            const res = await fetch(`${BACKEND_URL}/api/user/delete-profile-image`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setExistingImage(null);
                setPreviewUrl(null);
                setSelectedFile(null);
                setIsEditing(false);
                setStatus({ loading: false, message: 'Profile image deleted successfully!', error: false });
            } else {
                setStatus({ loading: false, message: 'Failed to delete image.', error: true });
            }
        } catch (err) {
            console.error(err);
            setStatus({ loading: false, message: 'Server error.', error: true });
        }
    };

    // Handle Image URL Submit
    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        if (!imageUrlInput.trim()) return;

        setStatus({ loading: true, message: 'Saving online link...', error: false });

        try {
            const res = await fetch(`${BACKEND_URL}/api/user/update-profile-image-link`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ imageUrl: imageUrlInput.trim() }),
            });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(`Unexpected backend response (${res.status}): Please restart your backend server so it can register the new route.`);
            }

            if (res.ok) {
                setStatus({ loading: false, message: 'Profile image link saved successfully!', error: false });
                setExistingImage(data.profileImage);
                setIsEditing(false);
                setPreviewUrl(null);
                setSelectedFile(null);
                setImageUrlInput('');
            } else {
                setStatus({ loading: false, message: data.message || 'Failed to save link.', error: true });
            }
        } catch (err) {
            console.error(err);
            setStatus({ loading: false, message: 'Server connection failed. Please try again.', error: true });
        }
    };

    // Handle File Upload Submit
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setStatus({ loading: true, message: 'Uploading image...', error: false });

        const formData = new FormData();
        formData.append('profileImage', selectedFile);

        try {
            const res = await fetch(`${BACKEND_URL}/api/user/upload-profile-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(`Unexpected backend response (${res.status}): Please restart your backend server so it can register the new route.`);
            }

            if (res.ok) {
                setStatus({ loading: false, message: 'Profile image updated successfully!', error: false });
                setExistingImage(`${BACKEND_URL}${data.profileImage.startsWith('/') ? '' : '/'}${data.profileImage}`);
                setIsEditing(false);
                setPreviewUrl(null);
                setSelectedFile(null);
            } else {
                setStatus({ loading: false, message: data.message || 'Failed to upload image.', error: true });
            }
        } catch (err) {
            console.error(err);
            setStatus({ loading: false, message: 'Server connection failed. Please try again.', error: true });
        }
    };

    return (
        <div className="mt-8 max-w-4xl mx-auto px-4">
            <div className="mb-8">
                <h3 style={{ color: 'var(--text-main)' }} className="text-3xl font-bold">
                    Profile Image
                </h3>
                <p style={{ color: 'var(--text-muted)' }} className="text-base mt-2">
                    Manage your avatar by uploading a file or providing an online link.
                </p>
            </div>

            {status.message && (
                <div className={`mb-6 p-5 rounded-2xl border border-dashed text-base flex items-center gap-4 ${
                    status.error 
                        ? 'border-red-950 bg-red-950/20 text-red-400' 
                        : 'border-emerald-950 bg-emerald-950/20 text-emerald-400'
                }`}>
                    {!status.error && <CheckCircle size={22} />}
                    <span>{status.message}</span>
                </div>
            )}

            {!isEditing && existingImage ? (
                <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="flex flex-col items-center p-12 border-2 border-dashed rounded-3xl relative shadow-sm transition-all duration-300">
                    <div className="relative h-64 w-64 sm:h-80 sm:w-80 rounded-full overflow-hidden border-8 border-orange-600/20 shadow-2xl mb-8 transition-transform hover:scale-105 duration-300">
                        <img src={existingImage} alt="Current Profile" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="flex items-center gap-2 px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all shadow-lg font-semibold text-base cursor-pointer hover:-translate-y-1"
                        >
                            <Edit2 size={18} /> Update Image
                        </button>
                        <button 
                            onClick={handleDeleteExistingImage} 
                            disabled={status.loading} 
                            className="flex items-center gap-2 px-6 py-3.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-md font-semibold text-base cursor-pointer hover:-translate-y-1"
                        >
                            <Trash2 size={18} /> Remove
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    {/* File Upload Form */}
                    <form onSubmit={handleUploadSubmit}>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => !previewUrl && fileInputRef.current?.click()}
                            style={{ 
                                backgroundColor: 'var(--bg-card)', 
                                borderColor: isDragging ? '#4f46e5' : 'var(--border-color)' 
                            }}
                            className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center min-h-[350px] transition-all duration-300 text-center relative shadow-sm ${
                                !previewUrl ? 'cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5' : ''
                            }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => handleFileChange(e.target.files[0])}
                                accept="image/*"
                                className="hidden"
                            />

                            {!previewUrl ? (
                                <div className="flex flex-col items-center">
                                    <div style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }} className="h-20 w-20 rounded-2xl border-2 flex items-center justify-center text-slate-400 mb-6 shadow-sm">
                                        <Upload size={32} className={isDragging ? 'animate-bounce text-orange-500' : ''} />
                                    </div>
                                    <p style={{ color: 'var(--text-main)' }} className="font-semibold text-lg sm:text-xl">
                                        Drag & drop your image here, or <span className="text-orange-500">browse</span>
                                    </p>
                                    <p style={{ color: 'var(--text-muted)' }} className="text-sm mt-2">
                                        Supports: JPG, JPEG, PNG (Max 5MB)
                                    </p>
                                </div>
                            ) : (
                                <div className="relative flex flex-col items-center">
                                    <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-orange-600/30 shadow-2xl">
                                        <img 
                                            src={previewUrl} 
                                            alt="Preview" 
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="mt-6 flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/50 text-sm text-slate-300 max-w-xs shadow-inner">
                                        <ImageIcon size={18} className="text-orange-400 flex-shrink-0" />
                                        <span className="truncate font-medium">{selectedFile?.name}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-4 -right-8 p-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all shadow-md cursor-pointer hover:scale-110"
                                        title="Remove image"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {previewUrl && (
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                                    className="px-6 py-3.5 border rounded-xl font-semibold text-base hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={status.loading}
                                    className="px-8 py-3.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl font-semibold text-base shadow-lg shadow-orange-600/20 transition-all cursor-pointer flex items-center gap-2 hover:-translate-y-1"
                                >
                                    {status.loading ? 'Uploading...' : 'Upload Image'}
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Or Separator */}
                    <div className="flex items-center justify-center space-x-6 py-2">
                        <div className="h-px bg-slate-700/50 flex-1"></div>
                        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Or use an online link</span>
                        <div className="h-px bg-slate-700/50 flex-1"></div>
                    </div>

                    {/* Online Link URL Form */}
                    <form onSubmit={handleUrlSubmit} style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="p-8 sm:p-10 border-2 rounded-3xl shadow-sm space-y-5">
                        <label className="block text-sm font-bold tracking-wide uppercase" style={{ color: 'var(--text-muted)' }}>
                            Online Image URL
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-500 pointer-events-none">
                                    <LinkIcon size={22} />
                                </div>
                                <input 
                                    type="url" 
                                    placeholder="https://example.com/my-avatar.jpg"
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="w-full border-2 rounded-2xl py-4 pl-14 pr-5 text-base outline-none transition-all duration-300 focus:border-orange-500 shadow-inner"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={!imageUrlInput || status.loading}
                                className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-600/20 disabled:opacity-50 transition-all font-bold whitespace-nowrap hover:-translate-y-1 cursor-pointer"
                            >
                                Save Link
                            </button>
                        </div>
                    </form>

                    {/* Cancel button if editing an existing image */}
                    {existingImage && isEditing && (
                        <div className="flex justify-center mt-10">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-8 py-3.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all font-semibold cursor-pointer"
                            >
                                Cancel Update
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
