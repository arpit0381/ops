import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, ArrowUpRight, Youtube } from 'lucide-react';

const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Projects', to: '/projects' },
    { label: 'Contact', to: '/contact' },
];

const serviceLinks = [
    { label: 'Residential Solar', to: '/services' },
    { label: 'Commercial Solar', to: '/services' },
    { label: 'Industrial Solutions', to: '/services' },
    { label: 'Solar Maintenance', to: '/services' },
    { label: 'Energy Consultation', to: '/services' },
];

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#0d0d0d] text-white font-sans">

            {/* ── TOP CTA BAND ──────────────────────────────────── */}
            <div className="border-b border-white/10">
                <div className="container mx-auto px-6 max-w-7xl py-16 md:py-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
                    <div className="max-w-2xl">
                        <div className="text-[0.65rem] font-[800] tracking-[0.25em] uppercase text-gray-500 mb-5">
                            Start your energy journey
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-[900] tracking-tight leading-[1.0] text-white">
                            Ready to Switch<br />
                            to <span className="text-brand-yellow">Solar?</span>
                        </h2>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-3 bg-brand-yellow text-gray-900 px-8 py-4 font-[800] text-sm tracking-wide rounded-none hover:bg-yellow-400 transition-colors group"
                        >
                            Get a Free Quote
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                        <a
                            href="tel:+919876543210"
                            className="inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 font-[600] text-sm tracking-wide rounded-none hover:border-white/50 transition-colors"
                        >
                            <Phone className="w-4 h-4 text-brand-green" />
                            +91 98765 43210
                        </a>
                    </div>
                </div>
            </div>

            {/* ── MAIN FOOTER GRID ──────────────────────────────── */}
            <div className="container mx-auto px-6 max-w-7xl py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-8">
                        {/* Typography Logo */}
                        <Link to="/" className="inline-flex flex-col leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-[900] tracking-tight text-white">OM</span>
                                <span className="text-3xl font-[300] tracking-tight text-brand-green">POWER</span>
                            </div>
                            <span className="text-[0.55rem] font-[700] uppercase tracking-[0.5em] text-gray-500 mt-1">
                                SOLUTION
                            </span>
                        </Link>

                        <p className="text-gray-400 text-[15px] font-[300] leading-relaxed max-w-xs border-l border-white/10 pl-5">
                            Pioneering clean energy since 2000. India's most trusted engineering partner for solar infrastructure at every scale.
                        </p>

                        {/* Social */}
                        <div className="flex items-center gap-4">
                            {[
                                { icon: <Linkedin className="w-4 h-4" />, href: '#' },
                                { icon: <Instagram className="w-4 h-4" />, href: '#' },
                                { icon: <Facebook className="w-4 h-4" />, href: '#' },
                                { icon: <Youtube className="w-4 h-4" />, href: '#' },
                            ].map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    className="w-9 h-9 border border-white/15 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/40 transition-all duration-300"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block md:col-span-1" />

                    {/* Quick Links */}
                    <div className="md:col-span-2">
                        <div className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-500 mb-7">
                            Company
                        </div>
                        <div className="h-px w-8 bg-brand-blue mb-7" />
                        <ul className="space-y-4">
                            {navLinks.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-400 text-[15px] font-[400] hover:text-white transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="md:col-span-2">
                        <div className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-500 mb-7">
                            Services
                        </div>
                        <div className="h-px w-8 bg-brand-green mb-7" />
                        <ul className="space-y-4">
                            {serviceLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-400 text-[15px] font-[400] hover:text-white transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-3">
                        <div className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-500 mb-7">
                            Get in Touch
                        </div>
                        <div className="h-px w-8 bg-brand-yellow mb-7" />
                        <ul className="space-y-5">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-400 text-[14px] font-[300] leading-relaxed">
                                    123 Solar Avenue, Green Business Park,<br />New Delhi – 110001, India
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <a href="tel:+919876543210" className="text-gray-400 text-[14px] font-[400] hover:text-white transition-colors">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <a href="mailto:info@ompowersolutions.com" className="text-gray-400 text-[14px] font-[400] hover:text-white transition-colors">
                                    info@ompowersolutions.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── BOTTOM BAR ────────────────────────────────────── */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-6 max-w-7xl py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-xs font-[400] tracking-wide">
                        © {new Date().getFullYear()} OM Power Solutions Pvt. Ltd. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((item) => (
                            <Link
                                key={item}
                                to="#"
                                className="text-gray-600 text-xs font-[400] hover:text-gray-300 transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
