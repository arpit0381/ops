import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Calculator, Users, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    /* — scroll detection — */
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* — close on route change — */
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    /* — lock body scroll when mobile menu open — */
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const lightHeroPages = ['/about', '/products', '/projects', '/services', '/contact', '/partner', '/calculator'];
    const isLightHero = lightHeroPages.includes(location.pathname);

    /* derived link colour for desktop */
    const desktopLinkColor = isScrolled
        ? 'text-gray-800 hover:text-brand-blue'
        : isLightHero
            ? 'text-gray-800 hover:text-brand-blue'
            : 'text-white hover:text-brand-yellow drop-shadow-md';

    const underlineColor = (isScrolled || isLightHero) ? 'bg-brand-blue' : 'bg-brand-yellow';

    return (
        <>
            {/* ── FIXED HEADER ─────────────────────────────────── */}
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-500 pointer-events-none'
                )}
            >
                {/* Top utility bar — desktop only, hidden on scroll */}
                <div className={cn(
                    'absolute top-0 left-0 w-full hidden lg:flex justify-end pr-8 transition-all duration-400 pointer-events-auto',
                    isScrolled ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                )}>
                    <div className="flex h-[40px] text-xs font-bold font-sans tracking-wide shadow-sm">
                        <Link to="/calculator" className="bg-brand-blue text-white px-6 flex items-center justify-center hover:bg-blue-800 transition-colors gap-2">
                            <Calculator className="w-4 h-4" /> Savings Calculator
                        </Link>
                        <Link to="/partner" className="bg-brand-green text-white px-6 flex items-center justify-center hover:bg-green-700 transition-colors gap-2">
                            <Users className="w-4 h-4" /> Partner With Us
                        </Link>
                        <a href="tel:18001234567" className="bg-brand-yellow text-brand-dark px-6 flex items-center justify-center hover:bg-yellow-500 transition-colors gap-2">
                            <Phone className="w-4 h-4" /> 1800 123 4567
                        </a>
                    </div>
                </div>

                {/* Main nav bar */}
                <div className={cn(
                    'relative flex items-center justify-between transition-all duration-500 pointer-events-auto w-full',
                    isScrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 mt-0 border-b border-gray-100'
                        : 'bg-transparent py-3 lg:py-4 mt-0 lg:mt-[40px]'
                )}>

                    {/* Slanted white bg behind logo — only on dark hero pages */}
                    {!isScrolled && !isLightHero && (
                        <div
                            className="absolute top-0 left-0 h-[75px] md:h-[85px] bg-white w-[220px] md:w-[300px] shadow-sm -z-10"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}
                        />
                    )}

                    <div className="container mx-auto px-4 md:px-8 flex justify-between items-center relative z-10">

                        {/* Logo */}
                        <Link
                            to="/"
                            className={cn(
                                'flex flex-col justify-center transition-all duration-300 hover:opacity-80',
                                !isScrolled ? 'mt-1 md:mt-2 ml-2' : 'ml-2'
                            )}
                        >
                            <div className="flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                <div className="flex flex-col leading-none">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl md:text-[1.75rem] font-[800] tracking-tight text-brand-blue drop-shadow-sm">OM</span>
                                        <span className="text-2xl md:text-[1.75rem] font-[300] tracking-tight text-brand-green">POWER</span>
                                    </div>
                                    <span className="text-[0.55rem] md:text-[0.6rem] font-[600] uppercase tracking-[0.5em] text-gray-500 mt-1 pl-0.5">
                                        SOLUTION
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Desktop nav links */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            {links.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={cn(
                                            'text-[14px] font-[600] tracking-wide transition-colors relative group',
                                            desktopLinkColor,
                                            isActive && 'opacity-100'
                                        )}
                                    >
                                        {link.name}
                                        <span className={cn(
                                            'absolute -bottom-1 left-0 h-[2px] transition-all duration-300 group-hover:w-full',
                                            underlineColor,
                                            isActive ? 'w-full' : 'w-0'
                                        )} />
                                    </Link>
                                );
                            })}
                            <Link
                                to="/contact"
                                className="bg-brand-yellow text-brand-dark px-6 py-2 text-sm font-[800] tracking-wide rounded-sm hover:bg-yellow-400 transition-all shadow-md flex items-center gap-1 group"
                            >
                                Get Quote <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </nav>

                        {/* ── Hamburger button — mobile ── */}
                        <button
                            onClick={() => setIsMobileMenuOpen(v => !v)}
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMobileMenuOpen}
                            className={cn(
                                'lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] transition-colors duration-300 rounded-sm focus:outline-none',
                                isScrolled || isLightHero
                                    ? 'text-gray-900'
                                    : 'text-white bg-white/10 backdrop-blur-sm'
                            )}
                        >
                            {/* Top bar */}
                            <span className={cn(
                                'block h-[2px] bg-current rounded-full transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center',
                                isMobileMenuOpen
                                    ? 'w-5 rotate-45 translate-y-[7px]'
                                    : 'w-5'
                            )} />
                            {/* Middle bar */}
                            <span className={cn(
                                'block h-[2px] bg-current rounded-full transition-all duration-300 ease-in-out',
                                isMobileMenuOpen
                                    ? 'w-0 opacity-0'
                                    : 'w-7 opacity-100'
                            )} />
                            {/* Bottom bar */}
                            <span className={cn(
                                'block h-[2px] bg-current rounded-full transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center',
                                isMobileMenuOpen
                                    ? 'w-5 -rotate-45 -translate-y-[7px]'
                                    : 'w-5'
                            )} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── FULL-SCREEN MOBILE MENU ───────────────────────── */}
            {/* Backdrop */}
            <div
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                    'fixed inset-0 z-40 bg-gray-950/60 backdrop-blur-sm lg:hidden transition-all duration-500',
                    isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
                aria-hidden="true"
            />

            {/* Slide-in panel from right */}
            <nav
                className={cn(
                    'fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-50 lg:hidden flex flex-col',
                    'shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]',
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                )}
                aria-label="Mobile navigation"
            >
                {/* Panel header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="flex items-baseline gap-1.5">
                        <span className="text-xl font-[800] tracking-tight text-brand-blue">OM</span>
                        <span className="text-xl font-[300] tracking-tight text-brand-green">POWER</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                        aria-label="Close menu"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Nav links — staggered */}
                <div className="flex-1 overflow-y-auto">
                    <ul className="py-4">
                        {links.map((link, i) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={cn(
                                            'flex items-center justify-between px-6 py-4 border-b border-gray-50',
                                            'text-base font-[700] tracking-tight transition-all duration-200',
                                            'group',
                                            isActive ? 'text-brand-blue bg-brand-blue/5' : 'text-gray-800 hover:text-brand-blue hover:bg-gray-50'
                                        )}
                                        style={{
                                            transitionDelay: isMobileMenuOpen ? `${i * 60 + 80}ms` : '0ms',
                                            opacity: isMobileMenuOpen ? 1 : 0,
                                            transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(20px)',
                                            transition: `opacity 0.4s ease ${i * 60 + 80}ms, transform 0.4s ease ${i * 60 + 80}ms, color 0.2s, background 0.2s`,
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-[0.6rem] font-[900] text-gray-300 w-5">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            {link.name}
                                        </div>
                                        {isActive ? (
                                            <div className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                                        ) : (
                                            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Panel footer */}
                <div
                    className="p-6 border-t border-gray-100 space-y-3"
                    style={{
                        transitionDelay: isMobileMenuOpen ? '440ms' : '0ms',
                        opacity: isMobileMenuOpen ? 1 : 0,
                        transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(16px)',
                        transition: `opacity 0.4s ease 440ms, transform 0.4s ease 440ms`,
                    }}
                >
                    <Link
                        to="/contact"
                        className="flex items-center justify-between w-full bg-brand-yellow text-gray-900 px-5 py-3.5 text-xs font-[900] uppercase tracking-widest hover:bg-yellow-400 transition-colors group"
                    >
                        Book Free Survey
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <a
                        href="tel:18001234567"
                        className="flex items-center justify-between w-full border border-gray-200 text-gray-700 px-5 py-3.5 text-xs font-[700] uppercase tracking-widest hover:border-gray-900 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" /> 1800 123 4567
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <p className="text-[0.6rem] text-gray-400 font-[400] text-center pt-1">
                        © {new Date().getFullYear()} OM Power Solutions Pvt. Ltd.
                    </p>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
