import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const occasions = [
    {
        id: 'date',
        title: 'DATE WEAR',
        description: 'You can wear it College, Coffee date and any casual occasions',
        image: 'https://images.unsplash.com/photo-1488161628813-99425205f28d?q=80&w=1000&auto=format&fit=crop',
        bgColor: 'bg-[#b4c5ce]',
    },
    {
        id: 'puja',
        title: 'PUJA WEAR',
        description: 'You can wear it any religious Occasions',
        image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?q=80&w=1000&auto=format&fit=crop',
        bgColor: 'bg-[#c6b4ce]',
    },
    {
        id: 'office',
        title: 'Office Wear',
        description: 'You can wear it any formal occasions',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
        bgColor: 'bg-[#bce3c5]',
    }
];

export default function OccasionSelector({ selectedSkintone }) {
    // If no skintone is selected, we can either hide this component (handled by parent) 
    // or show default links. The user wants it to show ONLY when skintone is chosen.

    return (
        <section className="site-shell py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f3f] mb-8">
                Select your occasion {selectedSkintone && <span className="text-pink-600 capitalize">for {selectedSkintone} Skin</span>}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {occasions.map((occasion) => (
                    <Link
                        key={occasion.id}
                        to={`/products?skintone=${selectedSkintone}&occasion=${occasion.id}`}
                        className={`${occasion.bgColor} h-64 flex overflow-hidden group hover:shadow-lg transition-all cursor-pointer`}
                    >
                        {/* Image Section */}
                        <div className="w-[40%] relative">
                            <img
                                src={occasion.image}
                                alt={occasion.title}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-6 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-lg text-black uppercase">{occasion.title}</h3>
                                <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {occasion.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
