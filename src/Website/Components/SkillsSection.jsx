import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Updated Categorized Skills Data with Icons
const skillCategories = [
  {
    category: 'Frontend Development',
    skills: [
      { name: 'HTML5', percent: 90, color: '#E34F26', icon: 'devicon-html5-plain colored' },
      { name: 'CSS3', percent: 86, color: '#1572B6', icon: 'devicon-css3-plain colored' },
      { name: 'JavaScript', percent: 90, color: '#F7DF1E', icon: 'devicon-javascript-plain colored' },
      { name: 'React JS', percent: 90, color: '#61DAFB', icon: 'devicon-react-original colored' },
      { name: 'Tailwind CSS', percent: 89, color: '#06B6D4', icon: 'devicon-tailwindcss-original colored' },
      { name: 'Redux Toolkit', percent: 86, color: '#764ABC', icon: 'devicon-redux-original colored' },
      { name: 'Animation (GSAP)', percent: 79, color: '#88CE02', icon: 'devicon-javascript-plain colored' },
    ],
  },
  {
    category: 'Backend Development',
    skills: [
      { name: 'Node.js', percent: 87, color: '#339933', icon: 'devicon-nodejs-plain colored' },
      { name: 'Express.js', percent: 83, color: '#FFFFFF', icon: 'devicon-express-original text-white' },
      { name: 'RESTful APIs', percent: 88, color: '#009688', icon: 'devicon-fastapi-plain colored' },
      { name: 'JWT Authentication', percent: 85, color: '#D63AFF', icon: 'devicon-json-plain colored' },
      { name: 'WebSockets / Socket.IO', percent: 80, color: '#010101', icon: 'devicon-socketio-original text-white' },
    ],
  },
  {
    category: 'Database & Cloud',
    skills: [
      { name: 'MongoDB', percent: 85, color: '#47A248', icon: 'devicon-mongodb-plain colored' },
      { name: 'Firebase', percent: 90, color: '#FFCA28', icon: 'devicon-firebase-plain colored' },
    ],
  },
  {
    category: 'Tools & Version Control',
    skills: [
      { name: 'Git / GitHub', percent: 89, color: '#F05032', icon: 'devicon-git-plain colored' },
    ],
  },
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
      gsap.context(() => {
        // Headings Animation
        gsap.fromTo(
          gsap.utils.toArray('.skills-heading', sectionRef.current),
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
          gsap.utils.toArray('.skill-category-card', sectionRef.current),
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );

        // Progress Bars & Numbers Animation
        barsRef.current.forEach((bar, i) => {
          const fill = bar.querySelector('.skill-fill');
          const percent = bar.querySelector('.skill-percent');
          const targetPercent = parseInt(bar.dataset.percent, 10);

          gsap.fromTo(
            fill,
            { width: '0%' },
            {
              width: `${targetPercent}%`,
              duration: 1.2,
              delay: 0.2 + i * 0.03,
              ease: 'power4.out',
            }
          );

          const counter = { val: 0 };
          gsap.to(counter, {
            val: targetPercent,
            duration: 1.2,
            delay: 0.2 + i * 0.03,
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
      className="w-full bg-[#070707] py-12 md:py-16 overflow-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-14">
          <span className="skills-heading text-orange-500 font-bold uppercase tracking-[0.2em] text-xs block mb-2 opacity-0">
            Expertise & Technical Stack
          </span>
          <h2 className="skills-heading text-3xl md:text-5xl font-black uppercase tracking-tight text-white opacity-0">
            Skills & Capabilities
          </h2>
          <div className="skills-heading w-16 h-1 bg-orange-500 mx-auto mt-3 mb-4 rounded-full opacity-0"></div>
          <p className="skills-heading text-gray-400 text-sm md:text-base max-w-xl mx-auto opacity-0 leading-normal">
            Technologies categorized by area of expertise to deliver end-to-end applications.
          </p>
        </div>

        {/* Categorized Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skillCategories.map((group) => (
            <div
              key={group.category}
              className="skill-category-card opacity-0 bg-white/[0.02] border border-white/[0.06] p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-6 tracking-wide flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                  {group.category}
                </h3>

                <div className="space-y-4">
                  {group.skills.map((skill) => (
                    <div key={skill.name} ref={addToBarRefs} data-percent={skill.percent}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {/* Devicon Icon */}
                          <i className={`${skill.icon} text-xl flex-shrink-0`}></i>
                          <span className="text-gray-200 text-sm md:text-base font-semibold">
                            {skill.name}
                          </span>
                        </div>
                        <span className="skill-percent text-orange-500 text-sm font-bold tabular-nums">
                          0%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="skill-fill h-full rounded-full"
                          style={{
                            width: '0%',
                            background: `linear-gradient(90deg, ${skill.color}aa, ${skill.color})`,
                            boxShadow: `0 0 8px ${skill.color}40`,
                          }}
                        ></div>
                      </div>
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