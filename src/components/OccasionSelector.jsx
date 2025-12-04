import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const occasions = [
    {
        id: 'date',
        title: 'DATE WEAR',
        description: 'You can wear it College, Coffee date and any casual occasions',
        image: '/images/occasion-date.jpg',
        bgColor: 'bg-[#b4c5ce]',
    },
    {
        id: 'puja',
        title: 'PUJA WEAR',
        description: 'You can wear it any religious Occasions',
        image: '/images/occasion-puja.jpg',
        bgColor: 'bg-[#c6b4ce]',
    },
    {
        id: 'office',
        title: 'Office Wear',
        description: 'You can wear it any formal occasions',
        image: '/images/occasion-office.jpg',
        bgColor: 'bg-[#bce3c5]',
    }
];

export default function OccasionSelector({ selectedSkintone }) {
    // If no skintone is selected, we can either hide this component (handled by parent) 
    // or show default links. The user wants it to show ONLY when skintone is chosen.

    return (
        <section className="site-shell py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f3f] mb-8">
                Select your occasion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {occasions.map((occasion) => (
                    <Link
                        key={occasion.id}
                        to={`/products?skintone=${selectedSkintone}&occasion=${occasion.id}`}
                        className={`${occasion.bgColor} relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl border border-white/40 shadow-md`}
                    >
                        <div className="w-full">
                            <img
                                src={occasion.image}
                                alt={occasion.title}
                                className="w-full h-auto object-contain"
                                loading="lazy"
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
