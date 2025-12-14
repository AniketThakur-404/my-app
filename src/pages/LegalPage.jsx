import React from 'react';
import { NavLink, useParams, Navigate } from 'react-router-dom';
import { Shield, Cookie, RefreshCw, Key, Lock, FileText, AlertCircle } from 'lucide-react';

const LegalPage = () => {
    const { section } = useParams();

    const links = [
        { name: 'Terms of Use', path: 'terms-of-use' },
        { name: 'Privacy Policy', path: 'privacy-policy' },
        { name: 'Money Back Policy', path: 'money-back-policy' },
        { name: 'Accessibility', path: 'accessibility' },
        { name: 'Cookie policy', path: 'cookie-policy' },
        { name: 'Security overview', path: 'security-overview', isSeparator: true },
    ];

    const renderContent = () => {
        switch (section) {
            case 'security-overview':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
                                <Shield className="w-6 h-6 text-blue-500" />
                                Security Overview
                            </h1>
                            <p className="text-xs text-gray-500 font-bold mb-4">Last Updated: July 21, 2025</p>
                        </div>

                        <section>
                            <h2 className="text-xl font-bold mb-2">1. Website Protection</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Our website <strong>thehouseofaradhya.com</strong> is hosted on secure servers with up-to-date SSL encryption (HTTPS), ensuring that all data transferred between your browser and our site remains private and secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">2. Secure Payments</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We do not store any payment information on our servers. All transactions are processed through trusted and PCI-DSS compliant payment gateways. Your credit/debit card data is fully encrypted and handled with maximum security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">3. Account Protection</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Customer accounts are protected by unique login credentials. We recommend using a strong password and avoiding sharing your account details with anyone else.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">4. Data Access Control</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Only authorized staff at The House of Aradhya can access your personal information. All such access is logged, monitored, and handled strictly for service-related purposes such as order fulfillment and customer support.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">5. Software Updates</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We regularly update our website platform, plugins, and server-side applications to protect against known vulnerabilities and ensure smooth operation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">6. Reporting Issues</h2>
                            <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                If you notice any suspicious activity or believe your account may have been compromised, please notify us immediately at:
                            </p>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li>📧 aradhyaclothing09@gmail.com</li>
                                <li>📞 7602455773</li>
                            </ul>
                            <p className="text-gray-600 text-sm leading-relaxed mt-4">
                                We are committed to keeping your information safe while you shop confidently at The House of Aradhya.
                            </p>
                        </section>
                    </div>
                );

            case 'cookie-policy':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Cookie Policy</h1>
                            <p className="text-xs text-gray-500 font-bold mb-4">Last Revised: July 21, 2025</p>
                        </div>

                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <Cookie className="w-5 h-5 text-orange-400" />
                                Why We Use Cookies
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                At <strong>The House of Aradhya</strong>, we use cookies to enhance your shopping experience, personalize content, track website performance, and remember your preferences (like outfit selections based on skin tone, occasion, or bundles).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <span className="text-red-500">📌</span>
                                Types of Cookies We Use
                            </h2>
                            <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600 text-sm">
                                <li><strong>Essential Cookies:</strong> These enable core site functionality, like navigation and secure checkout.</li>
                                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our site — so we can improve design and product offerings.</li>
                                <li><strong>Preference Cookies:</strong> Remember your skin tone, last viewed items, or bundle preferences.</li>
                                <li><strong>Marketing Cookies:</strong> Used to deliver offers on platforms like Facebook, Instagram, and Google Ads.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <span className="text-gray-500">⚙️</span>
                                How You Can Control Cookies
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                You can accept or decline cookies through your browser settings. Most browsers allow you to:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                                <li>Clear cookies manually</li>
                                <li>Block third-party cookies</li>
                                <li>Get notifications before cookies are stored</li>
                            </ul>
                            <p className="text-gray-600 text-sm leading-relaxed mt-2">
                                However, blocking some cookies may affect site functionality — especially outfit recommendation and quick checkout.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <Lock className="w-5 h-5 text-yellow-500" />
                                Third-Party Cookies
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We may allow trusted partners like Facebook Pixel or Google Analytics to set cookies for retargeting and performance insights. These are governed by their own policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <span className="text-blue-500">📬</span>
                                Contact Us
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                If you have questions about this Cookie Policy or need help adjusting your settings:
                            </p>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li><strong>Email:</strong> aradhyaclothing09@gmail.com</li>
                                <li><strong>Phone:</strong> 7602455773</li>
                            </ul>
                            <p className="text-gray-600 text-sm leading-relaxed mt-4">
                                We update our Cookie Policy from time to time. Check back for updates.
                            </p>
                        </section>
                    </div>
                );

            case 'money-back-policy':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
                                <span className="text-green-500">💸</span>
                                Money Back Policy
                            </h1>
                            <p className="text-xs text-gray-500 font-bold mb-4">Last Updated: July 21, 2025</p>
                        </div>

                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <RefreshCw className="w-6 h-6 text-blue-500" />
                                7-Day Money Back Guarantee
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We offer a 7-day money back policy for products that meet the return eligibility. If you’re not satisfied, you can request a refund within <strong>7 days of delivery</strong>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <span className="text-green-500">✅</span>
                                Eligibility for Refund
                            </h2>
                            <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600 text-sm">
                                <li>Product must be unused and in original condition</li>
                                <li>Must include original packaging (if any)</li>
                                <li>Refund request must be raised within 7 days of delivery</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <span className="text-red-500">🚫</span>
                                Non-Refundable Situations
                            </h2>
                            <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600 text-sm">
                                <li>Product was used or worn</li>
                                <li>Customized or altered outfits</li>
                                <li>Return requested after the 7-day window</li>
                                <li>Items damaged due to misuse</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <span className="text-blue-500">💳</span>
                                Refund Process
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Once we receive and inspect the returned product, your refund will be processed within <strong>5–7 business days</strong> to the original payment method.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <span className="text-orange-900">📦</span>
                                Return Shipping
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Return pickup will be arranged through our logistics partner (<strong>Shiprocket</strong>) if eligible. Otherwise, you may be asked to self-ship the item.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <span className="text-blue-500">📬</span>
                                Need Help?
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                We're here to help you at every step. Contact us:
                            </p>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li><strong>Email:</strong> aradhyaclothing09@gmail.com</li>
                                <li><strong>Phone:</strong> 7602455773</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-4">
                                Note: Aradhya reserves the right to reject returns that do not meet the policy terms.
                            </p>
                        </section>
                    </div>
                );

            case 'accessibility':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Accessibility Statement</h1>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                The House of Aradhya is committed to ensuring digital accessibility for everyone — including individuals with disabilities. We are continually improving the user experience for all visitors and applying the relevant accessibility standards.
                            </p>
                        </div>

                        <section>
                            <h2 className="text-xl font-bold mb-2">Our Efforts</h2>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> We follow WCAG 2.1 Level AA guidelines.</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Our website is navigable by keyboard.</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> All images include descriptive alt text.</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> We maintain readable font sizes and high color contrast.</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Forms are labeled for screen readers and mobile accessibility.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">Feedback & Assistance</h2>
                            <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                If you face any accessibility barriers while using our site, please let us know. We aim to respond within 24–48 hours.
                            </p>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li><strong>Email:</strong> aradhyaclothing09@gmail.com</li>
                                <li><strong>Phone:</strong> 7602455773</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">Third-Party Content</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                While we strive for full accessibility, some third-party content or integrations (like embedded videos or payment gateways) may not fully comply. We are working with partners to ensure compatibility.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">Ongoing Commitment</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We regularly audit and improve our website's accessibility features. As our brand grows, so will our focus on inclusivity — making sure fashion is truly for everyone.
                            </p>
                            <p className="text-xs text-gray-500 mt-4">Last updated: July 2025</p>
                        </section>

                    </div>
                );

            case 'privacy-policy':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
                                <span className="text-yellow-600">🔒</span>
                                Privacy Policy
                            </h1>
                            <p className="text-xs text-gray-500 font-bold mb-4">Last Updated: July 21, 2025</p>
                        </div>

                        <section>
                            <h2 className="text-xl font-bold mb-2">1. Introduction</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                At <strong>The House of Aradhya</strong>, we value your privacy. This policy outlines how we collect, use, and protect your personal information when you visit or make a purchase from our website: thehouseofaradhya.com.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">2. What Information We Collect</h2>
                            <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600 text-sm">
                                <li>Name, email address, phone number</li>
                                <li>Shipping and billing address</li>
                                <li>Payment information (secured via payment gateway)</li>
                                <li>Browser/device details (for analytics)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">3. How We Use Your Information</h2>
                            <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600 text-sm">
                                <li>To process and deliver your orders</li>
                                <li>To communicate order status or promotions</li>
                                <li>To improve your shopping experience</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">4. Sharing Your Information</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We do <strong>not sell or rent</strong> your personal information. We only share it with trusted services such as payment processors and delivery partners like <strong>Shiprocket</strong>, solely for order fulfillment.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">5. Data Security</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We use secure protocols (HTTPS) and encrypted payment gateways to ensure your data is safe. However, no online transmission is ever 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">6. Cookies</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We use cookies to enhance your shopping experience and track website performance. You may disable cookies via browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">7. Your Rights</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                You can request to access, correct, or delete your personal data by contacting us via email or phone.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-2">8. Contact Us</h2>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li><strong>Email:</strong> aradhyaclothing09@gmail.com</li>
                                <li><strong>Phone:</strong> 7602455773</li>
                                <li><strong>Address:</strong> Village Sarada, PO Sarada, PS Amta, District: Howrah, West Bengal, PIN 711413</li>
                            </ul>
                        </section>

                        <p className="text-xs text-gray-500 mt-4">
                            By using our website, you agree to this Privacy Policy.
                        </p>
                    </div>
                );

            default:
                // Terms of Use default or placeholder
                return (
                    <div className="space-y-8 animate-fade-in">
                        <h1 className="text-2xl font-bold mb-4">Terms of Use</h1>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Welcome to The House of Aradhya. By accessing our website, you agree to these terms and conditions.
                            Please read them carefully before using our services.
                        </p>
                        {/* ... Typical generic terms content or placeholder ... */}
                        <div className="h-40 flex items-center justify-center bg-gray-50 rounded text-gray-400">
                            Terms content coming soon...
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="pt-20 md:pt-28 pb-16 min-h-screen site-shell">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a]">Legal</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-16 max-w-5xl mx-auto px-4">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="flex flex-col border-l-2 border-gray-100">
                        {links.map((link) => (
                            <NavLink
                                key={link.path}
                                to={`/legal/${link.path}`}
                                className={({ isActive }) =>
                                    `pl-4 py-3 text-sm font-medium transition-colors border-l-2 -ml-[2px] ${isActive
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-black'
                                    } ${link.isSeparator ? 'mt-4' : ''}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 max-w-2xl">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default LegalPage;
