import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Clock, Tag, Share2, Check, 
  MessageCircle, Sparkles, BookOpen, User, Eye
} from 'lucide-react';
import { FaLinkedin, FaXTwitter } from 'react-icons/fa6';

export const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch Blog by ID & All Blogs for Related Posts
  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/api/public/blogs`);
        if (response.ok) {
          const data = await response.json();
          setAllBlogs(data);
          const found = data.find((b) => b._id === id);
          setBlog(found || null);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id, BACKEND_URL]);

  // Reading Progress Calculator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Estimate Read Time
  const calculateReadTime = (content) => {
    if (!content) return '2 min read';
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  // Copy Link Handler
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Content Renderer with rich markdown / headings / blockquotes support
  const renderFormattedContent = (content) => {
    if (!content) return null;

    // Split paragraphs
    const paragraphs = content.split('\n');

    return (
      <div className="space-y-6 text-gray-300 font-normal leading-relaxed text-base md:text-lg">
        {paragraphs.map((para, idx) => {
          const trimmed = para.trim();
          if (!trimmed) return null;

          // Headings
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl md:text-2xl font-bold text-white pt-6 pb-2 border-b border-white/10 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-amber-400 rounded-full inline-block"></span>
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-2xl md:text-3xl font-extrabold text-white pt-8 pb-3 border-b border-white/10 flex items-center gap-3">
                <span className="w-2 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full inline-block"></span>
                {trimmed.replace('## ', '')}
              </h2>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-3xl md:text-4xl font-black text-white pt-10 pb-4">
                {trimmed.replace('# ', '')}
              </h1>
            );
          }

          // Blockquote / Tip Box
          if (trimmed.startsWith('> ') || trimmed.startsWith('Note:') || trimmed.startsWith('Tip:')) {
            const quoteText = trimmed.replace(/^>\s*/, '').replace(/^(Note:|Tip:)\s*/, '');
            return (
              <div key={idx} className="p-5 my-6 rounded-2xl bg-amber-500/[0.07] border-l-4 border-amber-500 backdrop-blur-md shadow-md">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  Key Takeaway
                </div>
                <p className="text-gray-200 text-base md:text-lg italic leading-relaxed">
                  "{quoteText}"
                </p>
              </div>
            );
          }

          // Bullet point
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
            const bulletContent = trimmed.replace(/^[-*•]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-3 pl-2 md:pl-4">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-2.5 flex-shrink-0"></span>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  {bulletContent}
                </p>
              </div>
            );
          }

          // Code block indicator (simple single line chip or multiline)
          if (trimmed.startsWith('```') || trimmed.endsWith('```')) {
            const codeText = trimmed.replace(/```[a-zA-Z]*/g, '').replace(/```/g, '');
            if (!codeText.trim()) return null;
            return (
              <div key={idx} className="p-4 rounded-xl bg-[#141418] border border-white/10 font-mono text-sm text-amber-300 overflow-x-auto shadow-lg my-4">
                <code>{codeText}</code>
              </div>
            );
          }

          // Normal paragraph with basic bold parsing
          return (
            <p key={idx} className="text-gray-300 leading-relaxed text-base md:text-lg">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  // Related Blogs (excluding current)
  const relatedBlogs = allBlogs.filter((b) => b._id !== id).slice(0, 3);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#070707] flex flex-col items-center justify-center pt-24 text-white">
        <span className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></span>
        <p className="text-gray-400 font-mono text-sm uppercase tracking-widest animate-pulse">
          Loading Article...
        </p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="w-full min-h-screen bg-[#070707] flex flex-col items-center justify-center pt-24 px-6 text-center text-white">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-6">
          📝
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-4">
          Article Not Found
        </h2>
        <p className="text-gray-400 max-w-md mb-8">
          The blog post you're looking for might have been moved, updated, or removed.
        </p>
        <Link
          to="/Blogs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold uppercase tracking-wider text-xs hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#070707] text-white pt-28 pb-28 relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 transition-all duration-100 ease-out shadow-[0_0_12px_rgba(251,191,36,0.8)]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 relative z-10">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/Blogs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 text-gray-400 hover:text-white transition-all text-xs font-semibold uppercase tracking-wider group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-amber-400" />
            Back to All Articles
          </Link>
        </div>

        {/* Header Metadata */}
        <header className="mb-10">
          
          {/* Category & Read Time Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Insight & Tech
            </span>
            
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              {formatDate(blog.createdAt)}
            </div>

            <span className="text-gray-600">•</span>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              {calculateReadTime(blog.content)}
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white mb-8">
            {blog.title}
          </h1>

          {/* Author Details Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 flex items-center justify-center shadow-lg">
                <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center font-black text-amber-400 text-base">
                  MT
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-white font-bold text-sm tracking-wide">Muhammad Taha</h4>
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px] font-black" title="Verified Author">
                    ✓
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-medium">Full Stack MERN Developer</p>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 border border-white/10 transition-all text-xs font-semibold flex items-center gap-1.5"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-[#1DA1F2]/20 text-gray-300 hover:text-[#1DA1F2] border border-white/10 transition-all"
                title="Share on Twitter / X"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-[#0A66C2]/20 text-gray-300 hover:text-[#0A66C2] border border-white/10 transition-all"
                title="Share on LinkedIn"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

        </header>

        {/* Cover Image Container */}
        <div className="relative mb-12 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
          <img
            src={getImageUrl(blog.coverImage)}
            alt={blog.title}
            className="w-full max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-40"></div>
        </div>

        {/* Tags Bar */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-white/10">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              Tags:
            </span>
            {blog.tags.map((tag, i) => (
              <span 
                key={i} 
                className="text-xs font-semibold px-3 py-1 text-amber-300 bg-amber-500/10 rounded-full border border-amber-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Main Article Body */}
        <main className="prose prose-invert max-w-none mb-16">
          {renderFormattedContent(blog.content)}
        </main>

        {/* Article Footer & Author Signature */}
        <div className="my-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 flex-shrink-0">
            <div className="w-full h-full rounded-2xl bg-[#121212] flex items-center justify-center text-2xl font-black text-amber-400">
              👨‍💻
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white mb-1">Written by Muhammad Taha</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
              Passionate MERN stack engineer creating high-performance web applications, architecture blueprints, and developer tutorials.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link
                to="/Contact"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform"
              >
                Get In Touch
              </Link>
              <Link
                to="/Projects"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
              >
                View Projects
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-amber-400 font-mono font-bold text-xs uppercase tracking-widest block mb-1">
                  Continue Reading
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
                  Related Articles
                </h3>
              </div>
              <Link
                to="/Blogs"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider flex items-center gap-1"
              >
                View All &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relBlog) => (
                <Link
                  key={relBlog._id}
                  to={`/blog/${relBlog._id}`}
                  className="group flex flex-col bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-amber-500/30 rounded-2xl overflow-hidden transition-all duration-300 p-4"
                >
                  <div className="w-full h-40 rounded-xl overflow-hidden relative mb-4">
                    <img
                      src={getImageUrl(relBlog.coverImage)}
                      alt={relBlog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
                    <span>{formatDate(relBlog.createdAt)}</span>
                    <span>•</span>
                    <span>{calculateReadTime(relBlog.content)}</span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2">
                    {relBlog.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mt-auto">
                    {relBlog.content.replace(/<[^>]+>/g, '')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogDetails;
