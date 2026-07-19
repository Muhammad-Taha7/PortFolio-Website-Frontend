import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Plus, X, Upload, CheckCircle, Trash2, Edit2, MessageSquare, Star, User } from 'lucide-react';

export const TestimonialsView = () => {
    const { token } = useSelector((state) => state.auth);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://port-folio-website-backend-ta3p.vercel.app";
    
    const [testimonials, setTestimonials] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Form State
    const [clientName, setClientName] = useState('');
    const [clientRole, setClientRole] = useState('');
    const [testimonialText, setTestimonialText] = useState('');
    const [rating, setRating] = useState(5);
    const [clientImageUrl, setClientImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    
    const [status, setStatus] = useState({ loading: false, message: '', error: false });
    const fileInputRef = useRef(null);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/testimonials`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setTestimonials(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) fetchTestimonials();
    }, [token]);

    const handleFileChange = (files) => {
        const file = files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setClientImageUrl('');
        }
    };

    const resetForm = () => {
        setClientName('');
        setClientRole('');
        setTestimonialText('');
        setRating(5);
        setClientImageUrl('');
        setSelectedFile(null);
        setPreviewUrl('');
        setIsAdding(false);
        setEditingId(null);
        setStatus({ loading: false, message: '', error: false });
    };

    const startEdit = (testimonial) => {
        setEditingId(testimonial._id);
        setIsAdding(true);
        setClientName(testimonial.clientName);
        setClientRole(testimonial.clientRole || '');
        setTestimonialText(testimonial.testimonialText);
        setRating(testimonial.rating || 5);
        setClientImageUrl(testimonial.clientImage || '');
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!clientName.trim() || !testimonialText.trim()) {
            setStatus({ loading: false, message: 'Client name and testimonial text are required.', error: true });
            return;
        }

        setStatus({ loading: true, message: 'Saving testimonial...', error: false });

        const formData = new FormData();
        formData.append('clientName', clientName);
        formData.append('clientRole', clientRole);
        formData.append('testimonialText', testimonialText);
        formData.append('rating', rating.toString());
        
        if (selectedFile) {
            formData.append('clientImageFile', selectedFile);
        } else if (clientImageUrl) {
            formData.append('clientImage', clientImageUrl);
        }

        const url = editingId ? `${BACKEND_URL}/api/testimonials/${editingId}` : `${BACKEND_URL}/api/testimonials`;
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
                    setTestimonials(testimonials.map(t => t._id === editingId ? data.testimonial : t));
                } else {
                    setTestimonials([data.testimonial, ...testimonials]);
                }
                resetForm();
                setStatus({ loading: false, message: editingId ? 'Testimonial updated!' : 'Testimonial added!', error: false });
                setTimeout(() => setStatus({ loading: false, message: '', error: false }), 3000);
            } else {
                setStatus({ loading: false, message: data.message || 'Failed to save testimonial.', error: true });
            }
        } catch (err) {
            setStatus({ loading: false, message: 'Server connection failed.', error: true });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/testimonials/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setTestimonials(testimonials.filter(t => t._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getImageSrc = (img) => {
        if (!img) return '';
        return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
    };

    const renderStars = (count, interactive = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={interactive ? () => setRating(star) : undefined}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                        disabled={!interactive}
                    >
                        <Star
                            size={interactive ? 28 : 18}
                            className={`${star <= count ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} transition-colors`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="mt-4 px-4 pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 style={{ color: 'var(--text-main)' }} className="text-3xl font-bold flex items-center gap-3">
                        <MessageSquare className="text-amber-500" />
                        Testimonials
                    </h3>
                    <p style={{ color: 'var(--text-muted)' }} className="text-base mt-2">
                        Manage client reviews and feedback.
                    </p>
                </div>
                {!isAdding && (
                    <button 
                        onClick={() => { resetForm(); setIsAdding(true); }}
                        className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg transition-all font-semibold flex items-center gap-2 hover:-translate-y-1 cursor-pointer"
                    >
                        <Plus size={20} /> Add Testimonial
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
                            {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
                        </h4>
                        <button onClick={resetForm} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide">Client Name *</label>
                                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide">Client Role / Company</label>
                                <input type="text" value={clientRole} onChange={(e) => setClientRole(e.target.value)}
                                    placeholder="e.g. CEO at TechCorp"
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide">Testimonial Text *</label>
                            <textarea rows="4" value={testimonialText} onChange={(e) => setTestimonialText(e.target.value)}
                                placeholder="What did the client say about your work..."
                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-all resize-none" />
                        </div>

                        {/* Rating */}
                        <div className="space-y-3">
                            <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide">Rating</label>
                            <div className="flex items-center gap-4">
                                {renderStars(rating, true)}
                                <span style={{ color: 'var(--text-muted)' }} className="text-sm font-medium">{rating} / 5</span>
                            </div>
                        </div>

                        {/* Client Image */}
                        <div className="space-y-3 pt-2">
                            <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide">
                                Client Photo (Optional)
                            </label>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div onClick={() => fileInputRef.current?.click()}
                                    style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                                    className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-center flex-1">
                                    <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} accept="image/*" className="hidden" />
                                    <Upload size={24} className="text-amber-500 mb-2" />
                                    <p style={{ color: 'var(--text-main)' }} className="font-semibold text-sm">Upload Photo</p>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <input type="url" value={clientImageUrl} onChange={(e) => { setClientImageUrl(e.target.value); setSelectedFile(null); setPreviewUrl(''); }}
                                        placeholder="Or paste image URL..."
                                        style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                        className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-amber-500 transition-all" />
                                </div>
                            </div>

                            {(previewUrl || clientImageUrl) && (
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-amber-500/30 shadow-md group">
                                        <img src={previewUrl || getImageSrc(clientImageUrl)} alt="Client" className="h-full w-full object-cover" />
                                        <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(''); setClientImageUrl(''); }}
                                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <X size={12} />
                                        </button>
                                    </div>
                                    <span style={{ color: 'var(--text-muted)' }} className="text-sm">Image preview</span>
                                </div>
                            )}
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
                                className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-1">
                                {status.loading ? 'Saving...' : editingId ? 'Update Testimonial' : 'Save Testimonial'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {testimonials.length === 0 ? (
                        <div style={{ borderColor: 'var(--border-color)' }} className="col-span-full py-20 border-2 border-dashed rounded-3xl flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 mb-6">
                                <MessageSquare size={40} />
                            </div>
                            <h4 style={{ color: 'var(--text-main)' }} className="text-xl font-bold mb-2">No Testimonials Yet</h4>
                            <p style={{ color: 'var(--text-muted)' }} className="max-w-md">Add client reviews to showcase your reputation.</p>
                        </div>
                    ) : (
                        testimonials.map((testimonial) => (
                            <div key={testimonial._id} style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="flex flex-col border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 p-8">
                                {/* Quote & Stars */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-5xl text-amber-500/30 font-serif leading-none">"</div>
                                    {renderStars(testimonial.rating)}
                                </div>
                                
                                {/* Testimonial Text */}
                                <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed flex-1 mb-8 line-clamp-5 italic">
                                    "{testimonial.testimonialText}"
                                </p>
                                
                                {/* Client Info */}
                                <div className="flex items-center gap-4 mb-6">
                                    {testimonial.clientImage ? (
                                        <img src={getImageSrc(testimonial.clientImage)} alt={testimonial.clientName}
                                            className="h-14 w-14 rounded-full object-cover border-2 border-amber-500/30" />
                                    ) : (
                                        <div className="h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center border-2 border-amber-500/20">
                                            <User size={24} className="text-amber-500" />
                                        </div>
                                    )}
                                    <div>
                                        <h4 style={{ color: 'var(--text-main)' }} className="font-bold text-lg">{testimonial.clientName}</h4>
                                        {testimonial.clientRole && (
                                            <p style={{ color: 'var(--text-muted)' }} className="text-sm">{testimonial.clientRole}</p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Actions */}
                                <div className="pt-6 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border-color)' }}>
                                    <button onClick={() => startEdit(testimonial)}
                                        className="flex items-center gap-2 px-5 py-2.5 text-amber-400 hover:text-white hover:bg-amber-500 rounded-xl transition-colors text-sm font-bold cursor-pointer">
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(testimonial._id)}
                                        className="flex items-center gap-2 px-5 py-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-colors text-sm font-bold cursor-pointer">
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
