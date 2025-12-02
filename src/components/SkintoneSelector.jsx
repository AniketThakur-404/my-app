import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const skintones = [
    {
        id: 'fair',
        label: 'FAIR SKINTONE',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: 'neutral',
        label: 'NEUTRAL SKINTONE',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: 'dark',
        label: 'DARK SKINTONE',
        image: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?q=80&w=1000&auto=format&fit=crop',
    }
];

export default function SkintoneSelector({ onSelect }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % skintones.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + skintones.length) % skintones.length);
    };

    const getSlideIndex = (offset) => {
        return (currentIndex + offset + skintones.length) % skintones.length;
    };

    const handleSelect = (tone) => {
        if (onSelect) {
            onSelect(tone.id);
        }
    };

    const renderCard = (tone, isActive = false) => (
        <div
            onClick={() => isActive && handleSelect(tone)}
            className={`group relative w-full h-full bg-[#d1d1d1] flex items-center overflow-hidden ${isActive ? 'cursor-pointer ring-4 ring-offset-2 ring-transparent hover:ring-pink-500 transition-all' : ''}`}
        >
            {/* Image Section (Left Half approx) */}
            <div className="w-1/2 h-full relative z-10">
                <img
                    src={tone.image}
                    alt={tone.label}
                    className="h-full w-full object-cover object-top"
                />
            </div>

            {/* Text Section (Right Half) */}
            <div className="flex-1 flex items-center justify-between pr-6 pl-4 z-10">
                <span className="font-bold text-sm md:text-xl text-black uppercase tracking-wider">
                    {tone.label}
                </span>
                <ChevronRight className={`w-6 h-6 text-black transition-transform ${isActive ? 'group-hover:translate-x-1' : ''}`} />
            </div>

            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d1d1d1] to-[#d1d1d1] z-0" />
        </div>
    );

    return (
        <section className="site-shell py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#001f3f] mb-8 uppercase tracking-wide">
                Select Your Skintone & Get Perfect Combination
            </h2>

            <div className="relative w-full overflow-hidden bg-white py-4">
                <div className="relative h-[300px] flex items-center justify-center">

                    {/* Previous Slide (Left) */}
                    <div className="absolute left-0 w-[60%] h-[240px] opacity-40 transform -translate-x-[20%] scale-90 z-0 rounded-xl overflow-hidden hidden md:block pointer-events-none">
                        {renderCard(skintones[getSlideIndex(-1)])}
                        <div className="absolute inset-0 bg-white/30 z-20" />
                    </div>

                    {/* Next Slide (Right) */}
                    <div className="absolute right-0 w-[60%] h-[240px] opacity-40 transform translate-x-[20%] scale-90 z-0 rounded-xl overflow-hidden hidden md:block pointer-events-none">
                        {renderCard(skintones[getSlideIndex(1)])}
                        <div className="absolute inset-0 bg-white/30 z-20" />
                    </div>

                    {/* Active Slide (Center) */}
                    <div className="relative w-full md:w-[70%] h-full z-10 rounded-2xl overflow-hidden shadow-2xl">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full"
                            >
                                {renderCard(skintones[currentIndex], true)}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 md:left-8 z-20 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-black hover:bg-white shadow-md transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-2 md:right-8 z-20 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-black hover:bg-white shadow-md transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dots */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {skintones.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-[#001f3f]' : 'w-3 bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>

                </div>
                <p className="text-center text-sm text-gray-500 mt-8 animate-pulse">
                    Click on your skintone to see recommendations
                </p>
            </div>
        </section>
    );
}
