import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Plus, X, Upload, CheckCircle, Trash2, Image as ImageIcon, ExternalLink, GitBranch, Code, Briefcase, Edit2 } from 'lucide-react';

export const TopProjectsView = () => {
    const { token } = useSelector((state) => state.auth);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    
    const [projects, setProjects] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [technologies, setTechnologies] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [liveLink, setLiveLink] = useState('');
    
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
            const res = await fetch(`${BACKEND_URL}/api/projects?featured=true`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setProjects(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) fetchProjects();
    }, [token]);

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

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setTechnologies('');
        setGithubLink('');
        setLiveLink('');
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

    const removeOnlineUrl = (index) => {
        setOnlineUrls(prev => prev.filter((_, i) => i !== index));
    };

    const startEdit = (project) => {
        setEditingId(project._id);
        setIsAdding(true);
        setName(project.name);
        setDescription(project.description);
        setTechnologies(project.technologies ? project.technologies.join(', ') : '');
        setGithubLink(project.githubLink || '');
        setLiveLink(project.liveLink || '');
        setExistingImages(project.images || []);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setOnlineUrls([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name.trim() || !description.trim()) {
            setStatus({ loading: false, message: 'Name and Description are required.', error: true });
            return;
        }

        setStatus({ loading: true, message: 'Saving project...', error: false });

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('technologies', technologies);
        formData.append('githubLink', githubLink);
        formData.append('liveLink', liveLink);
        formData.append('featured', 'true');
        
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

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                throw new Error("Invalid server response");
            }

            if (res.ok) {
                if (editingId) {
                    setProjects(projects.map(p => p._id === editingId ? data.project : p));
                } else {
                    setProjects([data.project, ...projects]);
                }
                resetForm();
                setStatus({ loading: false, message: editingId ? 'Project updated!' : 'Project added!', error: false });
                setTimeout(() => setStatus({ loading: false, message: '', error: false }), 3000);
            } else {
                setStatus({ loading: false, message: data.message || 'Failed to save project.', error: true });
            }
        } catch (err) {
            setStatus({ loading: false, message: 'Server connection failed.', error: true });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setProjects(projects.filter(p => p._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getImageSrc = (img) => {
        return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
    };

    return (
        <div className="mt-4  px-4 pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 style={{ color: 'var(--text-main)' }} className="text-3xl font-bold flex items-center gap-3">
                        <Briefcase className="text-orange-500" />
                        Top Projects
                    </h3>
                    <p style={{ color: 'var(--text-muted)' }} className="text-base mt-2">
                        Showcase your best featured work.
                    </p>
                </div>
                {!isAdding && (
                    <button 
                        onClick={() => { resetForm(); setIsAdding(true); }}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl shadow-lg transition-all font-semibold flex items-center gap-2 hover:-translate-y-1 cursor-pointer"
                    >
                        <Plus size={20} /> Add Project
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
                            {editingId ? 'Edit Project' : 'Add New Project'}
                        </h4>
                        <button onClick={resetForm} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide">Project Name *</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. E-Commerce Platform"
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-orange-500 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide">Technologies Used</label>
                                <input type="text" value={technologies} onChange={(e) => setTechnologies(e.target.value)}
                                    placeholder="e.g. React, Node.js, MongoDB"
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-orange-500 transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide">Description *</label>
                            <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what the project is..."
                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-orange-500 transition-all resize-none" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                                    <GitBranch size={16} /> GitHub Link
                                </label>
                                <input type="url" value={githubLink} onChange={(e) => setGithubLink(e.target.value)}
                                    placeholder="https://github.com/..."
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-orange-500 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                                    <ExternalLink size={16} /> Live Project Link
                                </label>
                                <input type="url" value={liveLink} onChange={(e) => setLiveLink(e.target.value)}
                                    placeholder="https://myproject.com"
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="w-full border-2 rounded-xl py-3 px-4 outline-none focus:border-orange-500 transition-all" />
                            </div>
                        </div>

                        {/* Images Section */}
                        <div className="space-y-3 pt-2">
                            <label style={{ color: 'var(--text-main)' }} className="font-semibold text-sm uppercase tracking-wide flex items-center justify-between">
                                Project Images
                                <span className="text-xs text-orange-400 font-normal normal-case">Max 5 images</span>
                            </label>
                            
                            <div onClick={() => fileInputRef.current?.click()}
                                style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                                className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all text-center">
                                <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} multiple accept="image/*" className="hidden" />
                                <div className="h-16 w-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                                    <Upload size={28} />
                                </div>
                                <p style={{ color: 'var(--text-main)' }} className="font-semibold text-lg">Click to browse or drag images</p>
                                <p style={{ color: 'var(--text-muted)' }} className="text-sm mt-1">PNG, JPG up to 5MB each</p>
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-slate-700/50 flex-1"></div>
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">OR USE LINKS</span>
                                <div className="h-px bg-slate-700/50 flex-1"></div>
                            </div>

                            <div className="flex gap-2">
                                <input type="url" value={onlineUrlInput} onChange={(e) => setOnlineUrlInput(e.target.value)}
                                    placeholder="https://example.com/project-image.jpg"
                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                    className="flex-1 border-2 rounded-xl py-3 px-4 outline-none focus:border-orange-500 transition-all" />
                                <button type="button" onClick={handleAddOnlineUrl}
                                    className="px-6 py-3 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white rounded-xl transition-colors font-bold whitespace-nowrap cursor-pointer">
                                    Add Link
                                </button>
                            </div>

                            {(existingImages.length > 0 || previewUrls.length > 0 || onlineUrls.length > 0) && (
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {existingImages.map((img, index) => (
                                        <div key={`existing-${index}`} className="relative h-28 w-28 rounded-xl overflow-hidden border-2 border-emerald-500/30 shadow-md group">
                                            <img src={getImageSrc(img)} alt={`Existing ${index}`} className="h-full w-full object-cover" />
                                            <button type="button" onClick={() => removeExistingImage(index)}
                                                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {previewUrls.map((url, index) => (
                                        <div key={`file-${index}`} className="relative h-28 w-28 rounded-xl overflow-hidden border-2 border-orange-500/20 shadow-md group">
                                            <img src={url} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                                            <button type="button" onClick={() => removeFile(index)}
                                                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {onlineUrls.map((url, index) => (
                                        <div key={`url-${index}`} className="relative h-28 w-28 rounded-xl overflow-hidden border-2 border-sky-500/20 shadow-md group">
                                            <img src={url} alt={`Online ${index}`} className="h-full w-full object-cover" />
                                            <button type="button" onClick={() => removeOnlineUrl(index)}
                                                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
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
                                className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-1">
                                {status.loading ? 'Saving...' : editingId ? 'Update Project' : 'Save Project'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {projects.length === 0 ? (
                        <div style={{ borderColor: 'var(--border-color)' }} className="col-span-full py-20 border-2 border-dashed rounded-3xl flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 mb-6">
                                <Briefcase size={40} />
                            </div>
                            <h4 style={{ color: 'var(--text-main)' }} className="text-xl font-bold mb-2">No Top Projects Yet</h4>
                            <p style={{ color: 'var(--text-muted)' }} className="max-w-md">Add your featured projects to showcase your best work.</p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div key={project._id} style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="flex flex-col border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                                {project.images && project.images.length > 0 ? (
                                    <div className="h-64 w-full overflow-hidden relative">
                                        <img src={getImageSrc(project.images[0])} alt={project.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        {project.images.length > 1 && (
                                            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                <ImageIcon size={14} /> +{project.images.length - 1}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-48 w-full bg-slate-800 flex flex-col items-center justify-center text-slate-500">
                                        <Code size={40} className="mb-2 opacity-50" />
                                        <span className="text-sm font-medium">No Images Provided</span>
                                    </div>
                                )}
                                
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 style={{ color: 'var(--text-main)' }} className="text-2xl font-bold line-clamp-1">{project.name}</h4>
                                        <div className="flex gap-2">
                                            {project.githubLink && (
                                                <a href={project.githubLink} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-xl transition-colors">
                                                    <GitBranch size={20} />
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a href={project.liveLink} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-colors">
                                                    <ExternalLink size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <p style={{ color: 'var(--text-muted)' }} className="text-sm line-clamp-3 mb-6 flex-1">{project.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.technologies && project.technologies.map((tech, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-lg text-xs font-bold uppercase tracking-wider">{tech}</span>
                                        ))}
                                    </div>
                                    
                                    <div className="pt-6 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border-color)' }}>
                                        <button onClick={() => startEdit(project)}
                                            className="flex items-center gap-2 px-5 py-2.5 text-orange-400 hover:text-white hover:bg-orange-500 rounded-xl transition-colors text-sm font-bold cursor-pointer">
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(project._id)}
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
