import React, { useState, useEffect } from 'react';

export const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://port-folio-website-backend-xjvf.vercel.app";

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
  }, []);

  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full min-h-screen bg-[#070707] pt-32 pb-24 overflow-hidden relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Background Decor */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-sm block mb-4">
            Insights
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
            Latest Blogs
          </h1>
          <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Thoughts, tutorials, and insights on modern web development, MERN stack, and engineering best practices.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No blogs published yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article 
                key={blog._id} 
                className="group flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="w-full h-56 overflow-hidden relative">
                  <img 
                    src={getImageUrl(blog.coverImage)} 
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070707] to-transparent opacity-60"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">
                      Article
                    </span>
                    <span className="text-gray-500 text-xs font-medium">
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags?.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-xs font-semibold px-2 py-0.5 text-gray-400 bg-white/5 rounded-md border border-white/5">
                        #{tech}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {blog.content.replace(/<[^>]+>/g, '') /* Basic strip HTML if it was rich text */}
                  </p>

                  <button className="self-start text-white font-semibold text-sm tracking-wide border-b-2 border-orange-500 pb-1 hover:text-orange-500 transition-colors">
                    Read Article &rarr;
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
