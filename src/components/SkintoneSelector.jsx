import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Check } from 'lucide-react';

const skintones = [
  {
    id: 'fair',
    label: 'FAIR SKINTONE',
    title: 'Fresh Fits for Every Mood',
    description: 'Be the first to wear them. Versatile styles, endless pairings.',
    subtitle: 'Sharp contrast looks',
    image: '/images/skintone-fair.jpg',
    accent: '#1c2f45',
    bg: '#f8f9fa',
    swatches: ['#0f2847', '#cbd8e9', '#f9f9f9'],
  },
  {
    id: 'neutral',
    label: 'NEUTRAL SKINTONE',
    title: 'Long Line Luxe Vibe',
    description: "Maxi & midi styles you'll love. Balanced tones & minimal fits.",
    subtitle: 'Balanced tones',
    image: '/images/skintone-neutral.jpg',
    accent: '#0f375f',
    bg: '#f2f5f7',
    swatches: ['#113d63', '#2f4b60', '#f1f1f1'],
  },
  {
    id: 'dark',
    label: 'DARK SKINTONE',
    title: 'Your Perfect Pair Awaits',
    description: 'Trousers that fit your every move. Rich, tonal layers.',
    subtitle: 'Rich layers',
    image: '/images/skintone-dark.jpg',
    accent: '#2f3036',
    bg: '#f4ede1',
    swatches: ['#2e3342', '#7f8a9b', '#f4eee2'],
  },
];

export default function SkintoneSelector({ onSelect }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const spring = { type: 'spring', stiffness: 120, damping: 16 };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % skintones.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + skintones.length) % skintones.length);

  const handlePick = (tone) => {
    onSelect?.(tone.id);
  };

  const getCardStatus = (index) => {
    if (index === activeIndex) return 'center';
    const total = skintones.length;
    const nextIndex = (activeIndex + 1) % total;
    const prevIndex = (activeIndex - 1 + total) % total;
    if (index === nextIndex) return 'right';
    if (index === prevIndex) return 'left';
    return 'hidden';
  };

  const variants = {
    center: {
      x: '0%',
      scale: 1,
      zIndex: 20,
      opacity: 1,
      rotateY: 0,
      filter: 'brightness(1)',
      transition: spring,
    },
    left: {
      x: isMobile ? '-6%' : '-68%',
      scale: isMobile ? 0.96 : 0.86,
      zIndex: isMobile ? 1 : 10,
      opacity: isMobile ? 0 : 0.68,
      rotateY: isMobile ? 0 : 6,
      filter: 'brightness(0.95)',
      transition: spring,
      pointerEvents: isMobile ? 'none' : 'auto',
    },
    right: {
      x: isMobile ? '6%' : '68%',
      scale: isMobile ? 0.96 : 0.86,
      zIndex: isMobile ? 1 : 10,
      opacity: isMobile ? 0 : 0.68,
      rotateY: isMobile ? 0 : -6,
      filter: 'brightness(0.95)',
      transition: spring,
      pointerEvents: isMobile ? 'none' : 'auto',
    },
    hidden: {
      scale: 0.7,
      opacity: 0,
      zIndex: 0,
      pointerEvents: 'none',
    },
  };

  return (
    <section className="site-shell py-12">
      <div className="relative w-full min-h-[500px] md:min-h-[660px] bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-start gap-6 md:gap-8 overflow-visible rounded-3xl md:rounded-[32px] shadow-sm pt-6 md:pt-8 pb-8 md:pb-10">
        <div className="absolute top-0 left-0 w-full h-48 bg-white/50 blur-3xl -z-10" />

        <div className="text-center px-4 z-10 mb-6 sm:mb-8">
          <p className="text-[11px] font-bold tracking-[0.22em] text-slate-500 uppercase mb-2">
            Discover Your Look
          </p>
          <h2 className="text-[30px] md:text-[38px] font-semibold text-slate-900 leading-tight max-w-3xl mx-auto">
            Style That Starts With<br /> You
          </h2>
        </div>

        <div
          className="relative w-full max-w-6xl mx-auto h-[400px] md:h-[520px] flex items-center justify-center px-2 sm:px-4"
          style={{ perspective: '1400px' }}
        >
          <button
            onClick={handlePrev}
            aria-label="Previous skintone"
            className="absolute -left-4 sm:-left-7 md:-left-12 top-1/2 -translate-y-1/2 z-40 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-slate-800 hover:bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next skintone"
            className="absolute -right-4 sm:-right-7 md:-right-12 top-1/2 -translate-y-1/2 z-40 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-slate-800 hover:bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            {skintones.map((tone, index) => {
              const status = getCardStatus(index);

              return (
                <motion.div
                  key={tone.id}
                  initial={false}
                  animate={status}
                  variants={variants}
                  className="absolute w-[95%] sm:w-[90%] md:w-[78%] max-w-[880px] h-[380px] md:h-auto md:min-h-[480px] bg-white rounded-[28px] shadow-2xl overflow-hidden border border-white/60 backdrop-blur"
                  onClick={() => {
                    if (status === 'left') handlePrev();
                    if (status === 'right') handleNext();
                    if (status === 'center' && isMobile) handlePick(tone);
                  }}
                >
                  {isMobile ? (
                    // Mobile: Image Only
                    <div className="w-full h-full relative">
                      <img
                        src={tone.image}
                        alt={tone.label}
                        className="w-full h-full object-contain bg-white"
                        loading="lazy"
                      />
                      {/* Optional: Add a subtle indicator to tap */}
                      {status === 'center' && (
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold backdrop-blur-sm">
                          Tap to Select
                        </div>
                      )}
                    </div>
                  ) : (
                    // Desktop: Full Content
                    <div className="flex flex-col md:flex-row h-full">
                      <div
                        className="relative w-full md:w-[45%] h-[340px] sm:h-[360px] md:h-full overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: tone.bg }}
                      >
                        <img
                          src={tone.image}
                          alt={tone.label}
                          className="w-full h-full object-contain md:object-cover md:object-center object-top transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/5" />
                      </div>

                      <div className="flex-1 p-6 md:p-10 flex flex-col justify-center bg-white relative">
                        <div
                          className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full transition-colors duration-500"
                          style={{ backgroundColor: tone.accent }}
                        />

                        <div className="space-y-4 relative z-10">
                          <div>
                            <h3 className="text-2xl md:text-4xl font-serif text-slate-900 leading-tight mb-2">
                              {tone.title}
                            </h3>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-sm">
                              {tone.description}
                            </p>
                          </div>

                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-[11px] font-semibold tracking-[0.24em] uppercase text-slate-700">
                            {tone.subtitle}
                          </div>

                          <div className="flex items-center gap-3 pt-1">
                            {tone.swatches.map((color, i) => (
                              <div
                                key={color}
                                className="w-7 h-7 rounded-full border border-slate-200 shadow-sm relative group"
                                style={{ backgroundColor: color }}
                              >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                  Swatch {i + 1}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4 flex items-center gap-4 flex-wrap">
                            <button
                              onClick={() => handlePick(tone)}
                              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all hover:gap-3 group"
                            >
                              Shop Style
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            {status === 'center' && (
                              <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                                <Check className="w-3 h-3" />
                                Best Match
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-8 z-20 px-4">
          {skintones.map((_, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-300 rounded-full h-2 ${isActive ? 'w-10 bg-slate-800' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>

        <p className="text-center text-sm text-slate-500 mt-4 px-4">
          Tap a tone to preview curated picks. Use the arrows or dots to explore.
        </p>
      </div>
    </section>
  );
}

