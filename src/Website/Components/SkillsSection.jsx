import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const skills = [
  { name: 'HTML', percent: 90, color: '#E34F26' },
  { name: 'CSS', percent: 86, color: '#1572B6' },
  { name: 'Tailwind CSS', percent: 89, color: '#06B6D4' },
  { name: 'JavaScript', percent: 90, color: '#F7DF1E' },
  { name: 'React JS', percent: 90, color: '#61DAFB' },
  { name: 'Redux Toolkit', percent: 86, color: '#764ABC' },
  { name: 'Node.js', percent: 87, color: '#339933' },
  { name: 'Express.js', percent: 80, color: '#ffffff' },
  { name: 'MongoDB', percent: 85, color: '#47A248' },
  { name: 'Firebase', percent: 90, color: '#FFCA28' },
  { name: 'Git / GitHub', percent: 89, color: '#F05032' },
  { name: 'Animation Libraries', percent: 79, color: '#FF6B6B' },
];

export const SkillsSection = () => {
  const sectionRef = useRef(null);
  const barsRef = useRef([]);
  barsRef.current = [];

  const addToBarRefs = (el) => {
    if (el && !barsRef.current.includes(el)) {
      barsRef.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate once
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
      let ctx = gsap.context(() => {
        // Heading animation
        gsap.fromTo(
          gsap.utils.toArray('.skills-heading', sectionRef.current),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
          }
        );

        // Skill bars animate in
        barsRef.current.forEach((bar, i) => {
          const fill = bar.querySelector('.skill-fill');
          const percent = bar.querySelector('.skill-percent');
          const targetPercent = parseInt(bar.dataset.percent);

          gsap.fromTo(
            bar,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: i * 0.05,
              ease: 'power3.out',
            }
          );

          gsap.fromTo(
            fill,
            { width: '0%' },
            {
              width: `${targetPercent}%`,
              duration: 1.4,
              delay: 0.2 + i * 0.05,
              ease: 'power4.out',
            }
          );

          // Counter animation
          const counter = { val: 0 };
          gsap.to(counter, {
            val: targetPercent,
            duration: 1.4,
            delay: 0.2 + i * 0.05,
            ease: 'power4.out',
            onUpdate: () => {
              if (percent) percent.textContent = Math.floor(counter.val) + '%';
            },
          });
        });
      }, sectionRef);
    };

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="w-full bg-[#070707] py-28 md:py-20 overflow-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="text-center mb-20 md:mb-28">
          <span className="skills-heading text-orange-500 font-bold uppercase tracking-[0.2em] text-xs sm:text-sm block mb-4 opacity-0">
            Expertise & Stack
          </span>
          <h2 className="skills-heading text-4xl md:text-6xl font-black uppercase tracking-tight text-white opacity-0">
            MERN Stack Skills
          </h2>
          <div className="skills-heading w-24 h-1.5 bg-orange-500 mx-auto mt-6 mb-8 rounded-full opacity-0"></div>
          <p className="skills-heading text-gray-400 text-base md:text-lg max-w-2xl mx-auto opacity-0 leading-relaxed">
            Technologies and tools I use to build robust, scalable, and high-performance full-stack applications.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {skills.map((skill) => (
            <div
              key={skill.name}
              ref={addToBarRefs}
              data-percent={skill.percent}
              className="opacity-0 bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-lg animate-pulse"
                    style={{ 
                      backgroundColor: skill.color,
                      boxShadow: `0 0 10px ${skill.color}` 
                    }}
                  ></div>
                  <span className="text-white text-base md:text-lg font-bold tracking-wide">
                    {skill.name}
                  </span>
                </div>
                <span className="skill-percent text-orange-500 text-base md:text-lg font-extrabold tabular-nums tracking-wider">
                  0%
                </span>
              </div>
              
              {/* Outer Bar */}
              <div className="w-full h-3.5 bg-white/5 rounded-full overflow-hidden p-[2px]">
                {/* Inner Fill */}
                <div
                  className="skill-fill h-full rounded-full"
                  style={{
                    width: '0%',
                    background: `linear-gradient(90deg, ${skill.color}99, ${skill.color})`,
                    boxShadow: `0 0 15px ${skill.color}60`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
