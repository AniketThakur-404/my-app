import React from 'react';
import { ChevronRight } from 'lucide-react';

const skintones = [
  {
    id: 'fair',
    label: 'FAIR SKINTONE',
    image: '/images/skintone-fair.jpg',
  },
  {
    id: 'neutral',
    label: 'NEUTRAL SKINTONE',
    image: '/images/skintone-neutral.jpg',
  },
  {
    id: 'dark',
    label: 'DARK SKINTONE',
    image: '/images/skintone-dark.jpg',
  },
];

export default function SkintoneSelector({ onSelect }) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-8 uppercase tracking-wide">
          Select Your Skintone & Get Perfect Combination
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {skintones.map((tone) => (
            <button
              key={tone.id}
              onClick={() => onSelect?.(tone.id)}
              className="group relative h-[300px] w-full overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500"
            >
              {/* Full Background Image */}
              <div className="absolute inset-0">
                <img
                  src={tone.image}
                  alt={tone.label}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 flex items-center justify-between text-white z-10 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-lg md:text-xl font-bold uppercase tracking-widest drop-shadow-md">
                  {tone.label}
                </span>
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
