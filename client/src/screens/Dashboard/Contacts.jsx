import React, { useRef, useEffect } from 'react';

const Contact = () => {
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const cardsRef = useRef([]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up', 'opacity-100');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    const elements = [leftPanelRef.current, rightPanelRef.current, ...cardsRef.current].filter(Boolean);
    elements.forEach((el) => {
      if (el) {
        el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  const contactCards = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Call Us",
      details: ["+92 321 4250881"],
      subtext: "Mon–Sat, 11am – 7pm",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email Us",
      details: ["sabasandhuu786@gmail.com"],
      subtext: "Response within 24h",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      title: "Follow Us",
      details: ["@velour.clothing"],
      subtext: "Instagram | TikTok | Twitter",
      color: "from-rose-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-amber-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 md:pt-12 md:pb-12">
          <div ref={leftPanelRef} className="text-center max-w-3xl mx-auto opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium tracking-wide border border-orange-500/20 backdrop-blur-sm mb-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
              </span>
              Get in Touch
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-orange-600 dark:from-white dark:via-gray-200 dark:to-orange-400 bg-clip-text text-transparent">
                Let's Connect
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Have a question about our collections or need styling advice? We'd love to hear from you.
            </p>
            
            <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto mt-4"></div>
          </div>
        </div>
      </div>

      {/* Contact Cards Grid - 3 cards */}
      <div ref={rightPanelRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {contactCards.map((card, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} p-2 text-white shadow-md mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-2">
                {card.title}
              </h3>
              
              <div className="space-y-0.5 mb-2">
                {card.details.map((detail, idx) => (
                  <p key={idx} className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {detail}
                  </p>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {card.subtext}
              </p>
              
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-xs border-t border-gray-200 dark:border-gray-800">
        <p>© 2024 Velour Clothing. All rights reserved.</p>
      </div>

      <style>{`
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-up {
          animation: fade-up 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Contact;