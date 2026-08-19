import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, BookOpen, Sparkles } from 'lucide-react';

export const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/public/blogs`);
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [BACKEND_URL]);

  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const calculateReadTime = (content) => {
    if (!content) return '2 min read';
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  return (
    <div className="w-full min-h-screen bg-[#070707] pt-32 pb-28 overflow-hidden relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background Decor */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase tracking-[0.2em] text-xs mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Engineering Insights
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">Articles & Blogs</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            In-depth tutorials, system design patterns, and lessons learned building scalable web apps with the MERN stack.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 text-gray-400">
            <span className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></span>
            <p className="font-mono text-xs uppercase tracking-widest animate-pulse">Loading Blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium">No articles published yet.</p>
            <p className="text-sm mt-1">Check back soon for fresh content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article 
                key={blog._id} 
                className="group flex flex-col bg-white/[0.02] border border-white/10 hover:border-amber-500/40 rounded-3xl overflow-hidden hover:bg-white/[0.04] transition-all duration-500 shadow-xl hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)]"
              >
                {/* Cover Image Link */}
                <Link to={`/blog/${blog._id}`} className="w-full h-56 overflow-hidden relative block">
                  <img 
                    src={getImageUrl(blog.coverImage)} 
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d11] via-transparent to-transparent opacity-80"></div>
                  
                  {/* Badge */}
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                    Article
                  </span>
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      {formatDate(blog.createdAt)}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      {calculateReadTime(blog.content)}
                    </div>
                  </div>

                  <Link to={`/blog/${blog._id}`}>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>
                  </Link>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {blog.tags.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-[11px] font-semibold px-2 py-0.5 text-amber-300 bg-amber-500/10 rounded-md border border-amber-500/20">
                          #{tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {blog.content.replace(/<[^>]+>/g, '')}
                  </p>

                  <Link 
                    to={`/blog/${blog._id}`} 
                    className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm tracking-wide group/btn hover:text-amber-300 transition-colors mt-auto pt-4 border-t border-white/5"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

