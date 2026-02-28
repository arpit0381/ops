import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowLeft, ShieldCheck, Users } from 'lucide-react';
import { cn } from '../components/Navbar'; // reuse utility

gsap.registerPlugin(ScrollTrigger);

const slides = [
    {
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop",
        title: <>Powered by Solar,<br /><span className="text-brand-yellow">Empowered by</span><br />Om Power.</>,
        subtitle: "Brighter tomorrow powered by Sun"
    },
    {
        image: "https://images.unsplash.com/photo-1548614606-52b4451f994b?q=80&w=2070&auto=format&fit=crop",
        title: <>Commercial Grade<br /><span className="text-brand-green">Energy Systems</span><br />Built to last.</>,
        subtitle: "Maximizing ROI for your business operations"
    },
    {
        image: "https://images.unsplash.com/photo-1613665813446-82a100462cca?q=80&w=2070&auto=format&fit=crop",
        title: <>Zero Bills,<br /><span className="text-brand-yellow">Infinite Power.</span><br />Go Independent.</>,
        subtitle: "Smart residential solar ecosystems"
    }
];

const testimonials = [
    {
        quote: "As part of Energy savings initiative, we decided to pursue clean energy option through Solar Rooftop installation by utilizing idle roof at our Kuppam, Facility. We are happy with quality of services and timely completion of our ~3 MWP Solar plant and would recommend OM Power for Solarizing your premises.",
        name: "Mr. Anurag Agarwal",
        title: "Director",
        company: "RBA Textiles Pvt. Ltd."
    },
    {
        quote: "The OM Power team displayed immense technical expertise and total commitment. We seamlessly transitioned our primary manufacturing hub to 100% solar power with zero operational downtime. Simply phenomenal.",
        name: "Dr. Vikram Sethi",
        title: "CEO",
        company: "Sethi Pharma Group"
    },
    {
        quote: "Our integrated residential township required a subtle, highly-efficient solar solution. OM Power not only met the aesthetic requirements but exceeded our energy generation guarantees. A top-tier engineering firm.",
        name: "Anjali Mehta",
        title: "Head of Infrastructure",
        company: "Platinum Estates"
    }
];

const Home: React.FC = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);




    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    // Animate text on slide change
    useEffect(() => {
        if (!heroRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.slide-text',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
            );
        }, heroRef);
        return () => ctx.revert();
    }, [currentSlide]);

    // Scroll Animations for rest of page
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.reveal-up').forEach((elem: any) => {
                gsap.from(elem, {
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                    },
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                });
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="overflow-hidden bg-white text-gray-800 font-sans" ref={heroRef}>
            {/* Minimal Hero Section with Carousel */}
            <section className="relative h-screen w-full flex items-center bg-gray-900 overflow-hidden">

                {/* Images */}
                {slides.map((slide, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                            idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        )}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${slide.image})`,
                                // Optional zoom effect
                                transform: idx === currentSlide ? 'scale(1.05)' : 'scale(1)',
                                transition: 'transform 7s ease-out'
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    </div>
                ))}

                <div className="container mx-auto px-6 relative z-20 pt-20">
                    <div className="max-w-2xl min-h-[300px]"> {/* min-height prevents jumping */}
                        <h1 className="slide-text text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
                            {slides[currentSlide].title}
                        </h1>
                        <p className="slide-text text-xl md:text-2xl text-gray-200 mb-10 font-light border-l-4 border-brand-green pl-4">
                            {slides[currentSlide].subtitle}
                        </p>

                        <div className="slide-text flex gap-4">
                            <Link to="/contact" className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-3.5 rounded-sm font-medium transition-all shadow-lg flex items-center gap-2">
                                Discover Solutions <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Slider controls */}
                <div className="absolute bottom-16 right-10 hidden md:flex gap-4 z-30">
                    <button
                        onClick={prevSlide}
                        className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors backdrop-blur-sm"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Dots indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={cn(
                                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                idx === currentSlide ? "bg-brand-yellow w-8" : "bg-white/50 hover:bg-white"
                            )}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Side sticky ribbons mimicking the screenshot */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-1 z-30">
                    <Link to="/contact" className="bg-brand-yellow/90 hover:bg-brand-yellow text-brand-dark px-4 py-6 rotate-180 transition-colors" style={{ writingMode: 'vertical-rl' }}>
                        <span className="font-bold tracking-widest text-sm uppercase">Enquire Now</span>
                    </Link>
                    <Link to="/partner" className="bg-brand-blue/90 hover:bg-brand-blue text-white px-4 py-6 rotate-180 transition-colors" style={{ writingMode: 'vertical-rl' }}>
                        <span className="font-bold tracking-widest text-sm uppercase">Partner With Us</span>
                    </Link>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-12 bg-brand-blue flex items-center justify-center z-20">
                    <p className="text-white font-bold tracking-widest uppercase text-sm">#WeAreOmPowerSolutions</p>
                </div>
            </section>

            {/* ── WHO WE ARE — Corporate Editorial ─────────────── */}
            <section className="py-0 bg-white overflow-hidden">

                {/* Top rule + label */}
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">
                            Who We Are
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="container mx-auto px-6 max-w-7xl pb-0">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

                        {/* Left — Sticky Text Block */}
                        <div className="lg:col-span-5 reveal-up pb-16">
                            <div className="lg:sticky lg:top-32 space-y-10">

                                {/* Section number + heading */}
                                <div>
                                    <div className="text-[4rem] font-[900] text-gray-100 leading-none tracking-tight select-none mb-2">01</div>
                                    <h2 className="text-4xl md:text-5xl font-[900] text-gray-900 leading-[1.0] tracking-tight">
                                        Powering India's<br />
                                        <span className="text-brand-blue">Energy Future.</span>
                                    </h2>
                                </div>

                                <div className="h-px w-10 bg-brand-blue" />

                                <p className="text-gray-500 text-lg font-[300] leading-relaxed">
                                    Since 2000, OM Power Solutions has been architecting resilient solar infrastructure across India — for businesses, factories, and homes that refuse to compromise on performance or reliability.
                                </p>

                                <p className="text-gray-400 text-base font-[300] leading-relaxed border-l-2 border-gray-200 pl-5">
                                    We don't just install panels. We engineer complete energy ecosystems for maximum ROI and total energy independence.
                                </p>

                                {/* ISO badge row */}
                                <div className="flex items-center gap-4 pt-2">
                                    <div className="w-12 h-12 rounded-none bg-brand-green/10 flex items-center justify-center text-brand-green flex-shrink-0">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-[800] text-gray-900 text-sm">ISO 9001:2015</div>
                                        <div className="text-[0.65rem] font-[700] uppercase tracking-widest text-gray-400">Certified Company</div>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200 mx-2" />
                                    <div className="w-12 h-12 rounded-none bg-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-[800] text-gray-900 text-sm">1,500+</div>
                                        <div className="text-[0.65rem] font-[700] uppercase tracking-widest text-gray-400">Happy Clients</div>
                                    </div>
                                </div>

                                <Link
                                    to="/about"
                                    className="inline-flex items-center gap-3 text-sm font-[800] uppercase tracking-widest text-brand-blue border-b-2 border-brand-blue pb-1 hover:text-gray-900 hover:border-gray-900 transition-colors group"
                                >
                                    Our Full Story
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Right — Full-bleed Image + KPI Bar */}
                        <div className="lg:col-span-7 reveal-up flex flex-col">

                            {/* Image — flush to right edge on desktop */}
                            <div className="relative overflow-hidden group" style={{ aspectRatio: '4/3' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop"
                                    alt="Engineers inspecting solar panels"
                                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

                                {/* Caption inside image */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                                    <p className="text-white/60 text-xs font-[600] uppercase tracking-widest mb-2">Field Operations</p>
                                    <p className="text-white font-[300] text-lg md:text-xl leading-snug max-w-md">
                                        "Engineering reliable solar infrastructure one precision build at a time."
                                    </p>
                                </div>
                            </div>

                            {/* KPI Strip — dark bar below image */}
                            <div className="bg-gray-900 grid grid-cols-3 divide-x divide-white/10">
                                {[
                                    { val: '24+', label: 'Years Operating' },
                                    { val: '120 MW', label: 'Capacity Configured' },
                                    { val: '500+', label: 'Projects Completed' },
                                ].map((kpi, i) => (
                                    <div key={i} className="py-7 px-6 md:px-8">
                                        <div className="text-2xl md:text-3xl font-[900] text-white tracking-tight">{kpi.val}</div>
                                        <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-500 mt-1">{kpi.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── OUR VERTICALS — Corporate Minimal ─────────────── */}
            <section className="py-0 bg-white overflow-hidden">

                {/* Top rule + label */}
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">
                            Our Verticals
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>
                </div>

                {/* Section headline */}
                <div className="container mx-auto px-6 max-w-7xl mb-14 reveal-up">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div className="md:col-span-7">
                            <div className="text-[4rem] font-[900] text-gray-100 leading-none tracking-tight select-none mb-1">02</div>
                            <h2 className="text-4xl md:text-5xl font-[900] text-gray-900 leading-[1.0] tracking-tight">
                                Tailored Solar<br />
                                <span className="text-brand-blue">Ecosystems.</span>
                            </h2>
                        </div>
                        <div className="md:col-span-5 md:pb-2">
                            <p className="text-gray-400 text-base font-[300] leading-relaxed border-l-2 border-gray-200 pl-5">
                                Every sector demands a different energy strategy. We engineer it precisely — whether it's a rooftop in Jaipur or a 10 MW industrial plant in Pune.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Verticals — stacked rows */}
                <div className="container mx-auto px-6 max-w-7xl">
                    {[
                        {
                            num: '01',
                            title: 'Commercial',
                            subtitle: 'Corporate & Retail Spaces',
                            desc: 'High-yield rooftop and ground-mount solar for offices, malls, hotels, and commercial complexes. Optimized for ESG compliance, maximum savings, and zero downtime.',
                            img: 'https://images.unsplash.com/photo-1548614606-52b4451f994b?w=1200&auto=format&fit=crop',
                            accent: 'bg-brand-blue',
                            accentText: 'text-brand-blue',
                            tag: 'Commercial',
                        },
                        {
                            num: '02',
                            title: 'Industrial',
                            subtitle: 'Manufacturing & Plants',
                            desc: 'Megawatt-scale ground-mount and rooftop systems built for 24×7 continuous operations. Engineered to power factories, warehouses, and processing units reliably.',
                            img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop',
                            accent: 'bg-brand-yellow',
                            accentText: 'text-brand-yellow',
                            tag: 'Industrial',
                        },
                        {
                            num: '03',
                            title: 'Residential',
                            subtitle: 'Premium Housing & Villas',
                            desc: 'Silent, sleek, highly efficient home solar systems with smart monitoring. Guarantee zero electricity bills and complete household energy independence.',
                            img: 'https://images.unsplash.com/photo-1613665813446-82a100462cca?w=1200&auto=format&fit=crop',
                            accent: 'bg-brand-green',
                            accentText: 'text-brand-green',
                            tag: 'Residential',
                        },
                    ].map((v, i) => (
                        <div
                            key={i}
                            className="group grid grid-cols-1 lg:grid-cols-12 border-t border-gray-100 py-10 md:py-14 gap-8 lg:gap-12 items-center reveal-up hover:bg-gray-50/60 transition-colors duration-300"
                        >
                            {/* Index number */}
                            <div className="lg:col-span-1 hidden lg:flex items-start pt-1">
                                <span className="text-[0.65rem] font-[900] text-gray-300 tracking-widest">{v.num}</span>
                            </div>

                            {/* Image */}
                            <div className="lg:col-span-4 overflow-hidden" style={{ aspectRatio: '4/3' }}>
                                <img
                                    src={v.img}
                                    alt={v.title}
                                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-1000 ease-out"
                                />
                            </div>

                            {/* Text content */}
                            <div className="lg:col-span-5 space-y-5">
                                <div className={`inline-flex items-center gap-2 ${v.accentText}`}>
                                    <div className={`w-1.5 h-1.5 ${v.accent}`} />
                                    <span className="text-[0.6rem] font-[800] uppercase tracking-[0.25em]">{v.subtitle}</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-[900] text-gray-900 tracking-tight leading-snug">
                                    {v.title}
                                </h3>
                                <div className="h-px w-8 bg-gray-200" />
                                <p className="text-gray-500 text-[15px] font-[300] leading-relaxed max-w-sm">
                                    {v.desc}
                                </p>
                                <Link
                                    to="/services"
                                    className={`inline-flex items-center gap-2 text-xs font-[800] uppercase tracking-widest ${v.accentText} border-b border-current pb-0.5 hover:opacity-70 transition-opacity group/link`}
                                >
                                    Explore Solutions
                                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Right tag */}
                            <div className="lg:col-span-2 hidden lg:flex justify-end items-start pt-1">
                                <span className="text-[0.55rem] font-[800] tracking-[0.3em] uppercase text-gray-300 rotate-90 origin-right translate-y-4 whitespace-nowrap">
                                    {v.tag} Solution
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Bottom border */}
                    <div className="border-t border-gray-100 pb-16" />
                </div>
            </section>

            {/* ── TESTIMONIALS — Corporate Dark Grid ───────────── */}
            <section className="py-0 bg-gray-950 overflow-hidden">

                {/* Top rule + label — dark themed */}
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-500 whitespace-nowrap">
                            Client Testimonials
                        </span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>
                </div>

                <div className="container mx-auto px-6 max-w-7xl pb-24">

                    {/* Header */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16 reveal-up">
                        <div className="md:col-span-7">
                            <div className="text-[0.65rem] font-[800] tracking-[0.25em] uppercase text-gray-500 mb-4">
                                What Our Clients Say
                            </div>
                            <h2 className="text-4xl md:text-5xl font-[900] text-white leading-[1.0] tracking-tight">
                                Trusted by Industry.<br />
                                <span className="text-brand-yellow">Proven by Results.</span>
                            </h2>
                        </div>
                        <div className="md:col-span-5">
                            <p className="text-gray-500 text-base font-[300] leading-relaxed border-l border-white/10 pl-5">
                                From 3 MWP industrial plants to premium residential townships — our clients speak to the quality, precision, and reliability we deliver on every project.
                            </p>
                        </div>
                    </div>

                    {/* 3-card grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 reveal-up">
                        {testimonials.map((test, idx) => {
                            const initials = test.name.split(' ').filter(Boolean).slice(-2).map((w: string) => w[0]).join('');
                            const colors = ['bg-brand-blue', 'bg-brand-green', 'bg-brand-yellow'];
                            const accentColors = ['border-brand-blue', 'border-brand-green', 'border-brand-yellow'];
                            const textColors = ['text-brand-blue', 'text-brand-green', 'text-brand-yellow'];
                            return (
                                <div
                                    key={idx}
                                    className={`group relative flex flex-col p-8 md:p-10 border-t border-white/10 ${idx < 2 ? 'md:border-r md:border-r-white/10' : ''} hover:bg-white/5 transition-colors duration-500`}
                                >
                                    {/* Top accent line */}
                                    <div className={`w-8 h-[3px] ${colors[idx]} mb-8 group-hover:w-16 transition-all duration-500`} />

                                    {/* Stars */}
                                    <div className="flex items-center gap-1 mb-6">
                                        {[...Array(5)].map((_, s) => (
                                            <svg key={s} className="w-3.5 h-3.5 text-brand-yellow fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>

                                    {/* Quote mark */}
                                    <div className={`text-5xl font-[900] leading-none ${textColors[idx]} opacity-20 mb-2 select-none`}>"</div>

                                    {/* Quote text */}
                                    <p className="text-gray-300 text-[15px] font-[300] leading-relaxed flex-1 mb-8">
                                        {test.quote}
                                    </p>

                                    {/* Client info */}
                                    <div className={`pt-6 border-t ${accentColors[idx]} border-opacity-30 flex items-center gap-4`}>
                                        <div className={`w-10 h-10 ${colors[idx]} flex items-center justify-center text-white text-xs font-[900] flex-shrink-0 ${idx === 2 ? 'text-gray-900' : ''}`}>
                                            {initials}
                                        </div>
                                        <div>
                                            <div className="text-white text-sm font-[800]">{test.name}</div>
                                            <div className="text-gray-500 text-[0.65rem] font-[500] uppercase tracking-widest">{test.title} · {test.company}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom CTA strip */}
                    <div className="mt-0 border-t border-white/10 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 reveal-up">
                        <div className="flex items-center gap-8">
                            <div>
                                <div className="text-3xl font-[900] text-white">1,500+</div>
                                <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-500 mt-0.5">Satisfied Clients</div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div>
                                <div className="text-3xl font-[900] text-white">4.9 / 5</div>
                                <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-500 mt-0.5">Average Rating</div>
                            </div>
                        </div>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-3 bg-brand-yellow text-gray-900 px-7 py-3.5 text-xs font-[900] uppercase tracking-widest hover:bg-yellow-400 transition-colors group"
                        >
                            Start Your Project
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── BLOG SECTION ─────────────────────────────────── */}
            <section className="py-0 bg-white overflow-hidden">

                {/* Top rule + label */}
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">
                            Insights & Updates
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>
                </div>

                <div className="container mx-auto px-6 max-w-7xl pb-24">

                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 reveal-up">
                        <div>
                            <div className="text-[4rem] font-[900] text-gray-100 leading-none tracking-tight select-none mb-1">03</div>
                            <h2 className="text-4xl md:text-5xl font-[900] text-gray-900 leading-[1.0] tracking-tight">
                                From Our <span className="text-brand-blue">Blog.</span>
                            </h2>
                        </div>
                        <Link
                            to="/blog"
                            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-xs font-[800] uppercase tracking-widest text-brand-blue border-b-2 border-brand-blue pb-0.5 hover:text-gray-900 hover:border-gray-900 transition-colors group"
                        >
                            View All Posts
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Blog Grid — Featured + 2 secondary */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 reveal-up">

                        {/* Featured Post */}
                        <div className="lg:col-span-6 group cursor-pointer">
                            <div className="overflow-hidden mb-5" style={{ aspectRatio: '16/10' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1600&auto=format&fit=crop"
                                    alt="Solar Energy Future"
                                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-1000 ease-out"
                                />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-white bg-brand-blue px-3 py-1">
                                    Solar Technology
                                </span>
                                <span className="text-gray-400 text-xs font-[400]">8 min read</span>
                                <span className="text-gray-300 text-xs">·</span>
                                <span className="text-gray-400 text-xs font-[400]">Feb 2025</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-[900] text-gray-900 leading-snug tracking-tight mb-3 group-hover:text-brand-blue transition-colors duration-300">
                                How Next-Gen Solar Tech is Redefining India's Commercial Energy Landscape
                            </h3>
                            <p className="text-gray-500 text-[15px] font-[300] leading-relaxed mb-5 line-clamp-3">
                                From bifacial panels to AI-powered monitoring, advanced solar technologies are transforming how commercial enterprises across India generate, manage, and optimise energy — at scale, and with precision.
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs font-[900]">OP</div>
                                <div>
                                    <div className="text-xs font-[700] text-gray-900">OM Power Editorial</div>
                                    <div className="text-[0.6rem] font-[500] text-gray-400 uppercase tracking-widest">Research & Insights</div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Posts */}
                        <div className="lg:col-span-6 flex flex-col gap-6">
                            {[
                                {
                                    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
                                    category: 'Policy',
                                    categoryBg: 'bg-brand-green',
                                    read: '5 min read',
                                    date: 'Jan 2025',
                                    title: "India's Net Zero 2070 Pledge — What It Means for Solar EPC Companies",
                                    desc: "The government's ambitious climate targets are reshaping the solar EPC industry. We break down what these policy shifts mean for large-scale infrastructure players.",
                                },
                                {
                                    img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
                                    category: 'Case Study',
                                    categoryBg: 'bg-brand-yellow',
                                    read: '6 min read',
                                    date: 'Dec 2024',
                                    title: "Case Study: 3 MWP Industrial Installation for RBA Textiles",
                                    desc: "How OM Power designed, engineered, and delivered a 3 MWP rooftop solar plant for RBA Textiles in just 90 days — on-time and within budget.",
                                },
                            ].map((post, i) => (
                                <div key={i} className="group grid grid-cols-12 gap-5 border-t border-gray-100 pt-6 cursor-pointer">
                                    {/* Thumbnail */}
                                    <div className="col-span-4 overflow-hidden" style={{ aspectRatio: '4/3' }}>
                                        <img
                                            src={post.img}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                                        />
                                    </div>
                                    {/* Content */}
                                    <div className="col-span-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`text-[0.55rem] font-[800] uppercase tracking-[0.2em] text-white ${post.categoryBg} px-2 py-0.5`}>
                                                    {post.category}
                                                </span>
                                                <span className="text-gray-400 text-xs">{post.read}</span>
                                                <span className="text-gray-300 text-xs">·</span>
                                                <span className="text-gray-400 text-xs">{post.date}</span>
                                            </div>
                                            <h4 className="text-base md:text-lg font-[800] text-gray-900 leading-snug tracking-tight group-hover:text-brand-blue transition-colors duration-300 mb-2">
                                                {post.title}
                                            </h4>
                                            <p className="text-gray-400 text-xs font-[300] leading-relaxed line-clamp-2 hidden md:block">
                                                {post.desc}
                                            </p>
                                        </div>
                                        <div className="mt-3">
                                            <span className="inline-flex items-center gap-1 text-[0.6rem] font-[800] uppercase tracking-widest text-brand-blue border-b border-brand-blue pb-0.5">
                                                Read More <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Bottom border for symmetry */}
                            <div className="border-t border-gray-100" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
