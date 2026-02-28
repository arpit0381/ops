import React, { useEffect, useRef } from 'react';
import { Target, Eye, Award, ShieldCheck, Globe2, TrendingUp, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { value: '24+', label: 'Years of Operation', icon: TrendingUp },
    { value: '120 MW', label: 'Total Capacity Configured', icon: Globe2 },
    { value: '500+', label: 'Projects Completed', icon: ShieldCheck },
    { value: '1200+', label: 'Happy Clients', icon: Users },
];

const About: React.FC = () => {
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!pageRef.current) return;
        const ctx = gsap.context(() => {
            // Hero number counter animation
            gsap.from('.hero-line', {
                y: '100%',
                opacity: 0,
                duration: 1,
                stagger: 0.12,
                ease: 'expo.out',
                delay: 0.3,
            });

            gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 88%' },
                    y: 32,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                });
            });

            gsap.utils.toArray<HTMLElement>('.reveal-left').forEach((el) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 88%' },
                    x: -40,
                    opacity: 0,
                    duration: 0.9,
                    ease: 'power2.out',
                });
            });

            gsap.utils.toArray<HTMLElement>('.stat-num').forEach((el) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 90%' },
                    opacity: 0,
                    y: 20,
                    duration: 0.7,
                    ease: 'power2.out',
                    stagger: 0.1,
                });
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="bg-white font-sans" ref={pageRef}>

            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className="pt-36 pb-0 bg-white overflow-hidden">
                <div className="container mx-auto px-6 max-w-7xl">

                    {/* Top rule + label */}
                    <div className="flex items-center gap-4 mb-14 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.65rem] font-[800] tracking-[0.25em] uppercase text-gray-400">
                            Est. 2000 · OM Power Solutions
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {/* Massive editorial headline */}
                    <div className="overflow-hidden mb-4">
                        <h1 className="hero-line text-[clamp(3rem,9vw,8rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-gray-900 uppercase">
                            Engineering
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-4 flex items-end gap-6">
                        <h1 className="hero-line text-[clamp(3rem,9vw,8rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-gray-900 uppercase">
                            A Cleaner
                        </h1>
                        {/* Small descriptor block */}
                        <div className="hero-line mb-4 hidden md:block pb-2 border-l-2 border-brand-blue pl-5 flex-shrink-0 max-w-xs">
                            <p className="text-gray-500 text-base font-[300] leading-snug">
                                Since 2000, we have been transforming how India generates and consumes energy — one rooftop at a time.
                            </p>
                        </div>
                    </div>
                    <div className="overflow-hidden mb-16">
                        <h1 className="hero-line text-[clamp(3rem,9vw,8rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-transparent"
                            style={{ WebkitTextStroke: '2px #1a1a1a' }}>
                            Tomorrow.
                        </h1>
                    </div>

                    {/* Hero full-width image */}
                    <div className="hero-line w-full h-[50vh] md:h-[70vh] rounded-t-3xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop"
                            alt="Solar Installation"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent flex items-end p-10 md:p-16">
                            <div>
                                <div className="text-brand-yellow font-[800] uppercase tracking-widest text-xs mb-2">Our Commitment</div>
                                <p className="text-white text-2xl md:text-4xl font-[300] max-w-xl leading-snug">
                                    "Solar energy, precisely engineered for every scale of ambition."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── IMPACT NUMBERS ───────────────────────────────────── */}
            <section className="py-0 bg-gray-900">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4">
                        {stats.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div
                                    key={i}
                                    className={`stat-num py-14 px-8 flex flex-col gap-3 ${i < stats.length - 1 ? 'border-r border-white/10' : ''} ${i >= 2 ? 'border-t border-t-white/10 md:border-t-0' : ''}`}
                                >
                                    <Icon className="w-6 h-6 text-brand-yellow" />
                                    <div className="text-4xl md:text-5xl font-[900] text-white tracking-tight">{s.value}</div>
                                    <div className="text-gray-400 text-xs font-[600] uppercase tracking-widest">{s.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── LEGACY STORY ─────────────────────────────────────── */}
            <section className="py-24 md:py-36 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                        {/* Left sticky label */}
                        <div className="lg:col-span-3 reveal-left">
                            <div className="lg:sticky lg:top-32">
                                <div className="text-[0.65rem] font-[800] tracking-[0.25em] uppercase text-gray-400 mb-4">Our Legacy</div>
                                <div className="h-px w-12 bg-brand-blue mb-8" />
                                <h2 className="text-3xl font-[900] text-gray-900 leading-tight tracking-tight">
                                    A 24-Year<br />Journey of<br />Impact.
                                </h2>
                            </div>
                        </div>

                        {/* Right content */}
                        <div className="lg:col-span-9 grid md:grid-cols-2 gap-16 items-start">
                            <div className="reveal-up space-y-6">
                                <p className="text-gray-500 text-lg font-[300] leading-relaxed border-t border-gray-100 pt-8">
                                    Founded in 2000, OM Power Solutions started with a single, unwavering vision — to make clean energy an economic reality, not just an environmental aspiration. We began as a local installer and grew into one of India's most trusted solar EPC firms.
                                </p>
                                <p className="text-gray-500 text-lg font-[300] leading-relaxed">
                                    Today, our footprint spans commercial complexes, industrial townships, and premium residences nationwide. Each project is an exercise in engineering precision, financial intelligence, and lasting reliability.
                                </p>

                                {/* Founder quote block */}
                                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mt-8">
                                    <div className="text-4xl text-brand-blue font-[900] leading-none mb-4">"</div>
                                    <p className="text-gray-700 font-[400] text-base leading-relaxed italic mb-6">
                                        We don't just install panels. We architect energy independence — and we stand behind every watt we generate.
                                    </p>
                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                                        <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-[900] text-sm flex-shrink-0">RS</div>
                                        <div>
                                            <div className="font-[800] text-gray-900 text-sm">Rajesh Sharma</div>
                                            <div className="text-brand-blue text-[0.65rem] font-[700] tracking-widest uppercase">Founder & CEO</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right image column */}
                            <div className="reveal-up space-y-6">
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
                                        alt="Industrial Solar Project"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-brand-blue rounded-xl p-5">
                                        <div className="text-2xl font-[900] text-white">120 MW</div>
                                        <div className="text-white/70 text-xs uppercase tracking-widest font-[600] mt-1">Capacity Installed</div>
                                    </div>
                                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-5">
                                        <div className="text-2xl font-[900] text-gray-900">500+</div>
                                        <div className="text-gray-500 text-xs uppercase tracking-widest font-[600] mt-1">Projects Delivered</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MISSION & VISION ─────────────────────────────────── */}
            <section className="py-24 md:py-32 bg-[#f7f7f8]">
                <div className="container mx-auto px-6 max-w-7xl">

                    {/* Section header */}
                    <div className="flex items-center gap-6 mb-20 reveal-up">
                        <div className="text-[0.65rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">Our Purpose</div>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Mission */}
                        <div className="reveal-up bg-white rounded-3xl p-10 md:p-14 border border-gray-100 group hover:border-brand-blue transition-colors duration-500">
                            <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-10 group-hover:bg-brand-blue/20 transition-colors">
                                <Target className="w-7 h-7 text-brand-blue" />
                            </div>
                            <div className="text-[0.65rem] font-[800] tracking-[0.25em] uppercase text-brand-blue mb-4">Mission</div>
                            <h3 className="text-3xl md:text-4xl font-[900] text-gray-900 mb-6 tracking-tight leading-snug">
                                Accelerating India's<br />Energy Transition.
                            </h3>
                            <p className="text-gray-500 text-base font-[300] leading-relaxed">
                                To make high-performance solar energy universally accessible — rigorously engineered, financially optimized, and purpose-built for the sector it serves.
                            </p>
                            <div className="mt-10 pt-6 border-t border-gray-100 text-[0.65rem] font-[800] text-gray-400 tracking-widest uppercase">
                                Driving Net Zero →
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="reveal-up bg-gray-900 rounded-3xl p-10 md:p-14 group">
                            <div className="w-14 h-14 rounded-2xl bg-brand-yellow/20 flex items-center justify-center mb-10">
                                <Eye className="w-7 h-7 text-brand-yellow" />
                            </div>
                            <div className="text-[0.65rem] font-[800] tracking-[0.25em] uppercase text-brand-yellow mb-4">Vision</div>
                            <h3 className="text-3xl md:text-4xl font-[900] text-white mb-6 tracking-tight leading-snug">
                                Powering Every<br />Ambitious Business.
                            </h3>
                            <p className="text-gray-400 text-base font-[300] leading-relaxed">
                                To be the most respected renewable energy group in the country — one where engineering integrity, technological leadership, and client success are non-negotiable.
                            </p>
                            <div className="mt-10 pt-6 border-t border-white/10 text-[0.65rem] font-[800] text-gray-400 tracking-widest uppercase">
                                Securing the Future →
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CERTIFICATIONS ───────────────────────────────────── */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">

                    {/* Section header */}
                    <div className="flex items-center gap-6 mb-20 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <div className="text-[0.65rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">Certifications & Accolades</div>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 reveal-up">
                        {[
                            { title: 'ISO 9001:2015', desc: 'Quality Management System' },
                            { title: 'MNRE Partner', desc: 'Ministry of New & Renewable Energy' },
                            { title: 'Best EPC 2022', desc: 'Energy Times Award' },
                            { title: '100 MW+ Club', desc: 'Golden Tier Renewable Alliance' },
                        ].map((c, i) => (
                            <div key={i} className="px-6 md:px-10 py-8 flex flex-col gap-3 group hover:bg-gray-50 transition-colors duration-300 first:pl-0 last:pr-0">
                                <Award className="w-8 h-8 text-brand-green mb-2" />
                                <div className="font-[900] text-gray-900 text-lg leading-tight">{c.title}</div>
                                <div className="text-gray-400 text-xs font-[500] leading-relaxed">{c.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
