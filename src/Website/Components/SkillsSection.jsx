import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Categorized Skills Data (Cleaned: No percentages)
const skillCategories = [
  {
    category: 'Frontend Development',
    skills: [
      { name: 'HTML5', color: '#E34F26', icon: 'devicon-html5-plain colored' },
      { name: 'CSS3', color: '#1572B6', icon: 'devicon-css3-plain colored' },
      { name: 'JavaScript', color: '#F7DF1E', icon: 'devicon-javascript-plain colored' },
      { name: 'React JS', color: '#61DAFB', icon: 'devicon-react-original colored' },
      { name: 'Tailwind CSS', color: '#06B6D4', icon: 'devicon-tailwindcss-original colored' },
      { name: 'Redux Toolkit', color: '#764ABC', icon: 'devicon-redux-original colored' },
      { name: 'Animation (GSAP)', color: '#88CE02', icon: 'devicon-javascript-plain colored' },
    ],
  },
  {
    category: 'Backend Development',
    skills: [
      { name: 'Node.js', color: '#339933', icon: 'devicon-nodejs-plain colored' },
      { name: 'Express.js', color: '#FFFFFF', icon: 'devicon-express-original text-white' },
      { name: 'RESTful APIs', color: '#009688', icon: 'devicon-fastapi-plain colored' },
      { name: 'JWT Authentication', color: '#D63AFF', icon: 'devicon-json-plain colored' },
      { name: 'WebSockets / Socket.IO', color: '#010101', icon: 'devicon-socketio-original text-white' },
    ],
  },
  {
    category: 'Database & Cloud',
    skills: [
      { name: 'MongoDB', color: '#47A248', icon: 'devicon-mongodb-plain colored' },
      { name: 'Firebase', color: '#FFCA28', icon: 'devicon-firebase-plain colored' },
    ],
  },
  {
    category: 'Tools & Version Control',
    skills: [
      { name: 'Git / GitHub', color: '#F05032', icon: 'devicon-git-plain colored' },
    ],
  },
];

export const SkillsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkills();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const animateSkills = () => {
      const ctx = gsap.context(() => {
        // Headings Animation
        gsap.fromTo(
          '.skills-heading',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );

        // Category Cards Animation
        gsap.fromTo(
          '.skill-category-card',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
          }
        );

        // Individual Skill Badge Stagger Animation
        gsap.fromTo(
          '.skill-badge',
          { opacity: 0, scale: 0.9, y: 15 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.04,
            delay: 0.3,
            ease: 'back.out(1.4)',
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    };

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="w-full bg-[#070707] py-16 md:py-24 overflow-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <span className="skills-heading text-orange-500 font-bold uppercase tracking-[0.2em] text-xs block mb-2 opacity-0">
            Expertise & Technical Stack
          </span>
          <h2 className="skills-heading text-3xl md:text-5xl font-black uppercase tracking-tight text-white opacity-0">
            Skills & Capabilities
          </h2>
          <div className="skills-heading w-16 h-1 bg-orange-500 mx-auto mt-3 mb-4 rounded-full opacity-0"></div>
          <p className="skills-heading text-gray-400 text-sm md:text-base max-w-xl mx-auto opacity-0 leading-relaxed">
            Technologies and tools I use to build scalable, high-performance applications.
          </p>
        </div>

        {/* Categorized Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skillCategories.map((group) => (
            <div
              key={group.category}
              className="skill-category-card opacity-0 bg-white/[0.02] border border-white/[0.08] p-6 md:p-8 rounded-2xl flex flex-col justify-between backdrop-blur-sm hover:border-orange-500/30 transition-colors duration-300"
            >
              <div>
                {/* Category Title */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-6 tracking-wide flex items-center gap-3 border-b border-white/10 pb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block shadow-[0_0_10px_#f97316]"></span>
                  {group.category}
                </h3>

                {/* Skill Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="skill-badge opacity-0 group flex items-center gap-3.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] hover:border-white/20 p-3.5 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-default"
                    >
                      {/* Devicon Icon Container */}
                      <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <i className={`${skill.icon} text-2xl`}></i>
                      </div>

                      {/* Skill Name */}
                      <span className="text-gray-200 text-sm md:text-base font-medium tracking-wide group-hover:text-white transition-colors duration-200">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};