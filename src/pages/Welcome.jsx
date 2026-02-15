import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaFileAlt,
    FaCalculator,
    FaChartLine,
    FaTruckMoving,
    FaArrowRight,
    FaCheckCircle,
    FaShieldAlt,
    FaUserTie,
    FaRegHandshake
} from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';

const Welcome = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Updated feature list for marquee
    const features = [
        { icon: FaFileAlt, title: "Simple Documentation", desc: "Easy data entry for every connection." },
        { icon: FaCalculator, title: "Smart Accounting", desc: "Accurate daily sales tracking." },
        { icon: MdInventory, title: "Inventory Tracking", desc: "Real-time stock management." },
        { icon: FaChartLine, title: "Clear Reports", desc: "Instant operational summaries." },
        { icon: FaTruckMoving, title: "Trip Management", desc: "Streamlined delivery operations." },
        { icon: FaShieldAlt, title: "Secure Access", desc: "Role-based permissions." },
        { icon: FaFileAlt, title: "Billing & Invoices", desc: "GSTR compliant invoice generation." },
    ];

    const handleCtaClick = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

            {/* 1. Hero Section */}
            <section className="relative px-6 py-15 flex flex-col items-center text-center bg-gradient-to-b from-blue-50/70 via-white to-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn">
                    <span className="inline-block py-2 px-4 rounded-full bg-blue-100 text-blue-800 text-sm font-bold tracking-wide shadow-sm">
                        We invite you to join us in this journey
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        D-Friend – Your Digital Friend for <span className="text-blue-700">LPG Distributorship Management</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                        Simplify operations, inventory, billing, and reporting for your LPG distributorship — all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
                        <button
                            onClick={handleCtaClick}
                            className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                        >
                            {isAuthenticated ? 'Go to Dashboard' : 'Join our free trial'} <FaArrowRight />
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. Seamless Marquee Feature Cards */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Comprehensive Agency Management</h2>
                    <p className="text-slate-500 mt-2 text-lg">Everything you need to run your operations smoothly.</p>
                </div>

                <div className="relative w-full overflow-hidden gradient-mask-l-r">
                    {/* Inner Track - Width tailored to fit content. 
                        We duplicate features to ensure smooth infinite scroll.
                    */}
                    <div className="flex w-max animate-marquee hover:pause">
                        {/* Render duplicates for seamless loop. Tripling to ensure coverage on wide screens. */}
                        {[...features, ...features, ...features].map((feature, index) => (
                            <div key={index} className="w-[300px] md:w-[350px] mx-4 flex-shrink-0">
                                <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-100 h-full hover:shadow-md hover:border-blue-200 transition-all duration-300 group">
                                    <div className="w-14 h-14 bg-white text-blue-600 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                        <feature.icon />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Early Stage Message */}
            <div className="bg-amber-50 border-y border-amber-100 py-6 text-center px-4">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-900 font-medium text-lg flex flex-col md:flex-row items-center justify-center gap-3">
                        <span className="bg-amber-200 text-amber-900 text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-wider">Early Access</span>
                        We will limit the trial users, so join our free trial now. We are actively building and improving D-Friend with real agency feedback.
                    </p>
                </div>
            </div>

            {/* 5. Why D-Friend Grid */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-6">Why choose D-Friend?</h2>
                        <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="text-emerald-500 text-4xl mb-4"><FaCheckCircle /></div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Designed for LPG</h3>
                            <p className="text-slate-600">Tailored specifically for Indian LPG distributors (IOCL, HPCL, BPCL).</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="text-blue-500 text-4xl mb-4"><MdInventory /></div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Inventory Sync</h3>
                            <p className="text-slate-600">Sync showroom bookings with godown stock.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="text-purple-500 text-4xl mb-4"><FaUserTie /></div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Staff Friendly</h3>
                            <p className="text-slate-600">Intuitive interface for all staff levels.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="text-slate-600 text-4xl mb-4"><FaShieldAlt /></div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Secure</h3>
                            <p className="text-slate-600">Role-based access controls for Managers, Staff, and Delivery boys.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Trial Invitation Section */}
            <section className="py-24 bg-slate-900 text-white text-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ready to modernize your distributorship?</h2>
                    <p className="text-slate-300 text-xl font-light">Join the early trial and experience the difference.</p>
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={handleCtaClick}
                            className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg flex items-center gap-2"
                        >
                            Start Free Trial <FaArrowRight />
                        </button>
                    </div>
                </div>
            </section>

            {/* 6. Footer */}
            <footer className="bg-white text-slate-500 py-12 border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">D-Friend</h2>
                        <p className="text-sm text-slate-400">Digital Friend for LPG Agencies</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Support</span>
                        <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
                    </div>
                    <div className="text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} D-Friend. All rights reserved.
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); } 
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .hover\\:pause:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default Welcome;