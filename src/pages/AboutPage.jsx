import React from 'react';

const AboutPage = () => {
    return (
        <div className="pt-24 pb-16 min-h-screen site-shell flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-extrabold mb-4">About Us</h1>
            <p className="max-w-xl text-gray-600">
                Welcome to The House of Aradhya. We are dedicated to providing the best fashion and lifestyle products.
                Our story began with a simple idea: to make fashion accessible and stylish for everyone.
            </p>
            <div className="mt-8 h-64 w-full max-w-2xl bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                [About Us Content/Image Placeholder]
            </div>
        </div>
    );
};

export default AboutPage;
