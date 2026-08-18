import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  Plus, X, Upload, CheckCircle, Trash2, Image as ImageIcon, 
  ExternalLink, GitBranch, Code, Edit2, FolderOpen, AlertCircle, Loader2, Star,
  ChevronLeft, ChevronRight 
} from 'lucide-react';

// Sub-component to handle carousel state per project card
const ProjectCarousel = ({ images, name, getImageSrc }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="h-56 w-full overflow-hidden relative bg-slate-900 group/carousel">
            {/* Carousel Image */}
            <img 
                src={getImageSrc(images[currentIndex])} 
                alt={`${name} screenshot ${currentIndex + 1}`} 
                className="h-full w-full object-cover transition-all duration-300" 
            />

            {/* Slide Navigation Controls */}
            {images.length > 1 && (
                <>
                    <button 
                        type="button"
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover/carousel:opacity-100 transition-all cursor-pointer shadow-md"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button 
                        type="button"
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover/carousel:opacity-100 transition-all cursor-pointer shadow-md"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={18} />
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                    idx === currentIndex ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/50 hover:bg-white'
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Image Counter Badge */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
                        <ImageIcon size={12} /> {currentIndex + 1} / {images.length}
                    </div>
                </>
            )}
        </div>
    );
};

export const ProjectsView = () => {
    const { token } = useSelector((state) => state.auth);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    
    const [projects, setProjects] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [technologies, setTechnologies] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    
    // Online Images State
    const [onlineUrlInput, setOnlineUrlInput] = useState('');
    const [onlineUrls, setOnlineUrls] = useState([]);
    
    const [status, setStatus] = useState({ loading: false, message: '', error: false });
    const fileInputRef = useRef(null);

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/projects`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setProjects(Array.isArray(data) ? data : data.projects || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    useEffect(() => {
        if (token) fetchProjects();
    }, [token]);

    // Cleanup Blob URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const handleFileChange = (files) => {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => file.type.startsWith('image/'));
        const totalImages = validFiles.length + selectedFiles.length + existingImages.length + onlineUrls.length;
        
        if (totalImages > 5) {
            setStatus({ loading: false, message: 'Maximum 5 images allowed per project.', error: true });
            return;
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);
        const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
        }
    };

    const removeFile = (index) => {
        URL.revokeObjectURL(previewUrls[index]);
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeOnlineUrl = (index) => {
        setOnlineUrls(prev => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setName('');
        setDescription('');
        setTechnologies('');
        setGithubLink('');
        setLiveLink('');
        setIsFeatured(false);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setExistingImages([]);
        setOnlineUrlInput('');
        setOnlineUrls([]);
        setIsAdding(false);
        setEditingId(null);
        setStatus({ loading: false, message: '', error: false });
    };

    const handleAddOnlineUrl = () => {
        if (!onlineUrlInput.trim()) return;
        const totalImages = selectedFiles.length + existingImages.length + onlineUrls.length;
        if (totalImages >= 5) {
            setStatus({ loading: false, message: 'Maximum 5 images allowed per project.', error: true });
            return;
        }
        setOnlineUrls(prev => [...prev, onlineUrlInput.trim()]);
        setOnlineUrlInput('');
    };

    const startEdit = (project) => {
        resetForm();
        setEditingId(project._id);
        setIsAdding(true);
        setName(project.name || '');
        setDescription(project.description || '');
        setTechnologies(Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || '');
        setGithubLink(project.githubLink || '');
        setLiveLink(project.liveLink || '');
        setIsFeatured(project.featured || false);
        setExistingImages(project.images || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name.trim() || !description.trim()) {
            setStatus({ loading: false, message: 'Name and Description are required fields.', error: true });
            return;
        }

        setStatus({ loading: true, message: 'Saving project...', error: false });

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('technologies', technologies);
        formData.append('githubLink', githubLink);
        formData.append('liveLink', liveLink);
        formData.append('featured', String(isFeatured));
        
        selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        if (onlineUrls.length > 0) {
            formData.append('onlineImages', JSON.stringify(onlineUrls));
        }

        if (editingId) {
            formData.append('existingImages', JSON.stringify(existingImages));
        }

        const url = editingId ? `${BACKEND_URL}/api/projects/${editingId}` : `${BACKEND_URL}/api/projects`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                const updatedProject = data.project || data;
                if (editingId) {
                    setProjects(projects.map(p => p._id === editingId ? updatedProject : p));
                } else {
                    setProjects([updatedProject, ...projects]);
                }
                resetForm();
                setStatus({ loading: false, message: editingId ? 'Project updated successfully!' : 'Project created successfully!', error: false });
                setTimeout(() => setStatus({ loading: false, message: '', error: false }), 3000);
            } else {
                setStatus({ loading: false, message: data.message || 'Failed to save project.', error: true });
            }
        } catch (err) {
            setStatus({ loading: false, message: 'Server connection error.', error: true });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setProjects(projects.filter(p => p._id !== id));
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const getImageSrc = (img) => {
        if (!img) return '';
        return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
    };

    return (
        <div className="mt-4 px-4 pb-20 max-w-7xl mx-auto ">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h3 style={{ color: 'var(--text-main)' }} className="text-3xl font-bold flex items-center gap-3">
                        <FolderOpen className="text-emerald-500" size={32} />
                        All Projects
                    </h3>
                    <p style={{ color: 'var(--text-muted)' }} className="text-base mt-1">
                        Manage and customize your complete project portfolio showcase.
                    </p>
                </div>
                {!isAdding && (
                    <button 
                        onClick={() => { resetForm(); setIsAdding(true); }}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg transition-all font-semibold flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
                    >
                        <Plus size={20} /> Add New Project
                    </button>
                )}
            </div>

            {/* Global Status Message */}
            {status.message && !isAdding && (
                <div className={`mb-8 p-4 rounded-2xl border text-base flex items-center gap-3 transition-all ${
                    status.error 
                      ? 'border-red-500/30 bg-red-500/10 text-red-400' 
                      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                }`}>
                    {status.error ? <AlertCircle size={22} /> : <CheckCircle size={22} />}
                    <span>{status.message}</span>
                </div>
            )}

            {/* Form View */}
            {isAdding ? (
                <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="p-6 md:p-10 border rounded-3xl shadow-lg">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        <h4 style={{ color: 'var(--text-main)' }} className="text-2xl font-bold flex items-center gap-2">
                            {editingId ? <Edit2 className="text-emerald-500" size={24} /> : <Plus className="text-emerald-500" size={24} />}
                            {editingId ? 'Edit Project' : 'Create New Project'}
                        </h4>
                        <button onClick={resetForm} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label style={{ color: 'var(--text-main)' }} className="font-semibold text-xs uppercase tracking-wider">
                                    Project Name <span className="text-emerald-500">*</span>
                                </label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                    placeholder="e.g. TalkSphere Chat App"
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="w-full border rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label style={{ color: 'var(--text-main)' }} className="font-semibold text-xs uppercase tracking-wider">
                                    Technologies (Comma Separated)
                                </label>
                                <input type="text" value={technologies} onChange={(e) => setTechnologies(e.target.value)}
                                    placeholder="e.g. React, Node.js, MongoDB, Tailwind"
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="w-full border rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all text-sm" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label style={{ color: 'var(--text-main)' }} className="font-semibold text-xs uppercase tracking-wider">
                                Description <span className="text-emerald-500">*</span>
                            </label>
                            <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required
                                placeholder="Detail key features, architecture, and purpose..."
                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                className="w-full border rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all resize-none text-sm" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label style={{ color: 'var(--text-main)' }} className="font-semibold text-xs uppercase tracking-wider flex items-center gap-2">
                                    <GitBranch size={16} className="text-emerald-500" /> GitHub Repository URL
                                </label>
                                <input type="url" value={githubLink} onChange={(e) => setGithubLink(e.target.value)}
                                    placeholder="https://github.com/username/repo"
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="w-full border rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label style={{ color: 'var(--text-main)' }} className="font-semibold text-xs uppercase tracking-wider flex items-center gap-2">
                                    <ExternalLink size={16} className="text-emerald-500" /> Live Demo URL
                                </label>
                                <input type="url" value={liveLink} onChange={(e) => setLiveLink(e.target.value)}
                                    placeholder="https://myproject.vercel.app"
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="w-full border rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all text-sm" />
                            </div>
                        </div>

                        {/* Featured Checkbox */}
                        <div className="flex items-center gap-3 pt-2">
                            <input type="checkbox" id="featured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
                                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer" />
                            <label htmlFor="featured" style={{ color: 'var(--text-main)' }} className="font-semibold text-sm cursor-pointer flex items-center gap-2">
                                <Star size={16} className={isFeatured ? "text-amber-400 fill-amber-400" : "text-slate-400"} />
                                Mark as Featured Project
                            </label>
                        </div>

                        {/* Images Upload Section */}
                        <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="flex items-center justify-between">
                                <label style={{ color: 'var(--text-main)' }} className="font-semibold text-xs uppercase tracking-wider">
                                    Project Screenshots
                                </label>
                                <span className="text-xs text-emerald-400 font-medium">Max 5 total images</span>
                            </div>
                            
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                style={{ backgroundColor: 'var(--bg-main)', borderColor: isDragging ? '#10b981' : 'var(--border-color)' }}
                                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-all text-center ${
                                    isDragging ? 'bg-emerald-500/10' : ''
                                }`}
                            >
                                <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} multiple accept="image/*" className="hidden" />
                                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                                    <Upload size={24} />
                                </div>
                                <p style={{ color: 'var(--text-main)' }} className="font-semibold text-sm">Click to upload or drag & drop files</p>
                                <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-1">PNG, JPG, WEBP up to 5MB</p>
                            </div>

                            {/* Direct URL Input */}
                            <div className="flex gap-2 pt-2">
                                <input type="url" value={onlineUrlInput} onChange={(e) => setOnlineUrlInput(e.target.value)}
                                    placeholder="Or paste image web address..."
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="flex-1 border rounded-xl py-2.5 px-4 outline-none focus:border-emerald-500 transition-all text-sm" />
                                <button type="button" onClick={handleAddOnlineUrl}
                                    className="px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl transition-colors font-semibold text-sm whitespace-nowrap cursor-pointer">
                                    Add URL
                                </button>
                            </div>

                            {/* Image Previews */}
                            {(existingImages.length > 0 || previewUrls.length > 0 || onlineUrls.length > 0) && (
                                <div className="flex flex-wrap gap-4 pt-4">
                                    {existingImages.map((img, index) => (
                                        <div key={`existing-${index}`} className="relative h-24 w-24 rounded-xl overflow-hidden border border-emerald-500/30 shadow-sm group">
                                            <img src={getImageSrc(img)} alt={`Existing ${index}`} className="h-full w-full object-cover" />
                                            <button type="button" onClick={() => removeExistingImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {previewUrls.map((url, index) => (
                                        <div key={`file-${index}`} className="relative h-24 w-24 rounded-xl overflow-hidden border border-emerald-500/30 shadow-sm group">
                                            <img src={url} alt={`Local Preview ${index}`} className="h-full w-full object-cover" />
                                            <button type="button" onClick={() => removeFile(index)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {onlineUrls.map((url, index) => (
                                        <div key={`url-${index}`} className="relative h-24 w-24 rounded-xl overflow-hidden border border-sky-500/30 shadow-sm group">
                                            <img src={url} alt={`Online URL ${index}`} className="h-full w-full object-cover" />
                                            <button type="button" onClick={() => removeOnlineUrl(index)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {status.message && (
                            <div className={`p-4 rounded-xl text-sm ${status.error ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                {status.message}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                            <button type="button" onClick={resetForm}
                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                                className="px-6 py-2.5 border rounded-xl font-semibold hover:bg-slate-800 transition-colors text-sm cursor-pointer">
                                Cancel
                            </button>
                            <button type="submit" disabled={status.loading}
                                className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50 transition-all flex items-center gap-2 text-sm cursor-pointer">
                                {status.loading && <Loader2 size={16} className="animate-spin" />}
                                {status.loading ? 'Saving...' : editingId ? 'Update Project' : 'Save Project'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {projects.length === 0 ? (
                        <div style={{ borderColor: 'var(--border-color)' }} className="col-span-full py-16 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center">
                            <div className="h-16 w-16 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-500 mb-4">
                                <FolderOpen size={32} />
                            </div>
                            <h4 style={{ color: 'var(--text-main)' }} className="text-xl font-bold mb-1">No Projects Found</h4>
                            <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-sm">Click "Add New Project" to populate your developer portfolio.</p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div key={project._id} style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} 
                                 className="flex flex-col border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                                
                                {/* Image Carousel Container */}
                                {project.images && project.images.length > 0 ? (
                                    <div className="relative">
                                        <ProjectCarousel 
                                            images={project.images} 
                                            name={project.name} 
                                            getImageSrc={getImageSrc} 
                                        />
                                        {project.featured && (
                                            <div className="absolute top-3 left-3 bg-amber-500/90 text-black font-bold text-xs px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md z-10">
                                                <Star size={12} className="fill-black" /> Featured
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-44 w-full bg-slate-800/50 flex flex-col items-center justify-center text-slate-500 relative">
                                        <Code size={36} className="mb-2 opacity-40" />
                                        <span className="text-xs font-medium">No Image Uploaded</span>
                                        {project.featured && (
                                            <div className="absolute top-3 left-3 bg-amber-500/90 text-black font-bold text-xs px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
                                                <Star size={12} className="fill-black" /> Featured
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Card Body */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start gap-2 mb-3">
                                        <h4 style={{ color: 'var(--text-main)' }} className="text-xl font-bold line-clamp-1">{project.name}</h4>
                                        <div className="flex items-center gap-1 shrink-0">
                                            {project.githubLink && (
                                                <a href={project.githubLink} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors">
                                                    <GitBranch size={18} />
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a href={project.liveLink} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors">
                                                    <ExternalLink size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <p style={{ color: 'var(--text-muted)' }} className="text-sm line-clamp-3 mb-4 flex-1">{project.description}</p>
                                    
                                    {/* Tech Stack Badges */}
                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                        {Array.isArray(project.technologies) ? (
                                            project.technologies.map((tech, idx) => (
                                                <span key={idx} className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md text-xs font-medium">
                                                    {tech.trim()}
                                                </span>
                                            ))
                                        ) : (
                                            project.technologies?.split(',').map((tech, idx) => (
                                                <span key={idx} className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md text-xs font-medium">
                                                    {tech.trim()}
                                                </span>
                                            ))
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                                        <button onClick={() => startEdit(project)}
                                            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer">
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(project._id)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                                            title="Delete Project">
                                            <Trash2 size={18} />
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