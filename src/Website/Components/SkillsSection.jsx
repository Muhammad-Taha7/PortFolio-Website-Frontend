import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiRedux,
  SiGreensock,
  SiNodedotjs,
  SiExpress,
  SiJsonwebtokens,
  SiSocketdotio,
  SiMongodb,
  SiFirebase,
  SiGit,
  SiGithub
} from 'react-icons/si';
import { Globe } from 'lucide-react';

// Categorized Skills Data with native SVG React Icons
const skillCategories = [
  {
    category: 'Frontend Development',
    skills: [
      { name: 'HTML5', color: '#E34F26', icon: SiHtml5 },
      { name: 'CSS3', color: '#1572B6', icon: SiCss3 },
      { name: 'JavaScript', color: '#F7DF1E', icon: SiJavascript },
      { name: 'React JS', color: '#61DAFB', icon: SiReact },
      { name: 'Tailwind CSS', color: '#06B6D4', icon: SiTailwindcss },
      { name: 'Redux Toolkit', color: '#764ABC', icon: SiRedux },
      { name: 'Animation (GSAP)', color: '#88CE02', icon: SiGreensock },
    ],
  },
  {
    category: 'Backend Development',
    skills: [
      { name: 'Node.js', color: '#339933', icon: SiNodedotjs },
      { name: 'Express.js', color: '#FFFFFF', icon: SiExpress },
      { name: 'RESTful APIs', color: '#009688', icon: Globe },
      { name: 'JWT Authentication', color: '#D63AFF', icon: SiJsonwebtokens },
      { name: 'WebSockets / Socket.IO', color: '#010101', icon: SiSocketdotio },
    ],
  },
  {
    category: 'Database & Cloud',
    skills: [
      { name: 'MongoDB', color: '#47A248', icon: SiMongodb },
      { name: 'Firebase', color: '#FFCA28', icon: SiFirebase },
    ],
  },
  {
    category: 'Tools & Version Control',
    skills: [
      { name: 'Git & GitHub', color: '#F05032', icon: SiGit },
      { name: 'GitHub Actions', color: '#FFFFFF', icon: SiGithub },
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const animateSkills = () => {
      const ctx = gsap.context(() => {
        // Headings Animation
        gsap.fromTo(
          '.skills-heading',
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
          }
        );

        // Category Cards Animation
        gsap.fromTo(
          '.skill-category-card',
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );

        // Individual Skill Badge Stagger Animation
        gsap.fromTo(
          '.skill-badge',
          { opacity: 0, scale: 0.95, y: 10 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.03,
            delay: 0.2,
            ease: 'back.out(1.4)',
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    };

    // Fallback: If intersection observer hasn't fired in 1s, reveal skills anyway
    const fallbackTimer = setTimeout(() => {
      animateSkills();
    }, 1200);

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="w-full bg-[#070707] py-16 md:py-24 overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <span className="skills-heading text-amber-500 font-bold uppercase tracking-[0.2em] text-xs block mb-2">
            Expertise & Technical Stack
          </span>
          <h2 className="skills-heading text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
            Skills & Capabilities
          </h2>
          <div className="skills-heading w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-3 mb-4 rounded-full"></div>
          <p className="skills-heading text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Technologies and tools I use to build scalable, high-performance applications.
          </p>
        </div>

        {/* Categorized Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skillCategories.map((group) => (
            <div
              key={group.category}
              className="skill-category-card bg-white/[0.02] border border-white/[0.08] p-6 md:p-8 rounded-2xl flex flex-col justify-between backdrop-blur-sm hover:border-amber-500/30 transition-colors duration-300 shadow-lg"
            >
              <div>
                {/* Category Title */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-6 tracking-wide flex items-center gap-3 border-b border-white/10 pb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-[0_0_10px_#f59e0b]"></span>
                  {group.category}
                </h3>

                {/* Skill Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.skills.map((skill) => {
                    const IconComponent = skill.icon;
                    return (
                      <div
                        key={skill.name}
                        className="skill-badge group flex items-center gap-3.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] hover:border-amber-500/30 p-3.5 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-default"
                      >
                        {/* Icon Container with dynamic color & hover glow */}
                        <div 
                          className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                          style={{ color: skill.color }}
                        >
                          <IconComponent className="text-xl w-5 h-5" />
                        </div>

                        {/* Skill Name */}
                        <span className="text-gray-200 text-sm md:text-base font-medium tracking-wide group-hover:text-white transition-colors duration-200">
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};