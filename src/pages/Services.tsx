import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Home, Building2, Factory, Wrench, Activity, Landmark,
    ArrowRight, CheckCircle2, Phone
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        num: '01',
        id: 'residential',
        title: 'Residential Solar',
        subtitle: 'Homes & Villas',
        icon: Home,
        accent: 'bg-brand-green',
        accentText: 'text-brand-green',
        accentBorder: 'border-brand-green',
        img: 'https://images.unsplash.com/photo-1613665813446-82a100462cca?w=1200&auto=format&fit=crop',
        desc: 'Complete rooftop solar ecosystems for homes — from 1 kW to 100 kW. Zero electricity bills, smart monitoring, full subsidy assistance, and a 25-year performance guarantee.',
        points: ['Subsidy Procurement Support', 'Net Metering Setup', 'App-Based Monitoring', '25-Year Yield Guarantee'],
    },
    {
        num: '02',
        id: 'commercial',
        title: 'Commercial Solar',
        subtitle: 'Offices, Malls & Hotels',
        icon: Building2,
        accent: 'bg-brand-blue',
        accentText: 'text-brand-blue',
        accentBorder: 'border-brand-blue',
        img: 'https://images.unsplash.com/photo-1548614606-52b4451f994b?w=1200&auto=format&fit=crop',
        desc: 'High-yield rooftop and carport solar for offices, retail complexes, hotels, and commercial buildings. Optimized for ESG compliance, CAPEX/OPEX models, and maximum ROI.',
        points: ['CAPEX & OPEX Models', 'ESG Compliance Reports', 'On-Bill Financing', 'Multi-Site Management'],
    },
    {
        num: '03',
        id: 'industrial',
        title: 'Industrial Solar',
        subtitle: 'Factories & Plants',
        icon: Factory,
        accent: 'bg-brand-yellow',
        accentText: 'text-brand-yellow',
        accentBorder: 'border-brand-yellow',
        img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop',
        desc: 'Megawatt-scale ground-mount and rooftop solar engineered for 24×7 continuous industrial operations. From 500 kW to 10 MW+, built for factories, warehouses, and processing plants.',
        points: ['Upto 10 MW+ Installations', 'Ground Mount & Rooftop', 'Power Purchase Agreements', 'Load Analysis & Sizing'],
    },
    {
        num: '04',
        id: 'government',
        title: 'Government Projects',
        subtitle: 'Public & Utility Scale',
        icon: Landmark,
        accent: 'bg-brand-blue',
        accentText: 'text-brand-blue',
        accentBorder: 'border-brand-blue',
        img: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&auto=format&fit=crop',
        desc: 'Authorized partner for government solar tenders, public infrastructure electrification, and PM-KUSUM scheme implementations across state and central departments.',
        points: ['PM-KUSUM Scheme Expert', 'Tender & Bid Management', 'DPR Preparation', 'Government Liaising'],
    },
    {
        num: '05',
        id: 'maintenance',
        title: 'O&M Services',
        subtitle: 'Operations & Maintenance',
        icon: Wrench,
        accent: 'bg-brand-green',
        accentText: 'text-brand-green',
        accentBorder: 'border-brand-green',
        img: 'https://images.unsplash.com/photo-1508514177221-188b1fc16e9d?w=1200&auto=format&fit=crop',
        desc: 'Comprehensive Annual Maintenance Contracts (AMC) for plants we install and third-party systems. Preventive + corrective maintenance, performance reporting, and inverter warranties.',
        points: ['AMC Contracts Available', 'Remote Performance Monitoring', 'Panel Cleaning & Inspection', 'Inverter & BOS Maintenance'],
    },
    {
        num: '06',
        id: 'consultation',
        title: 'Energy Consultation',
        subtitle: 'Audit & Advisory',
        icon: Activity,
        accent: 'bg-brand-yellow',
        accentText: 'text-brand-yellow',
        accentBorder: 'border-brand-yellow',
        img: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1200&auto=format&fit=crop',
        desc: 'Expert energy auditing, site feasibility analysis, shadow analysis, and ROI forecasting by our veteran solar engineers — completely free with any project inquiry.',
        points: ['Shadow & Yield Analysis', 'Free ROI Projections', 'Grid & Load Assessment', 'Technology Recommendation'],
    },
];

const Services: React.FC = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const [activeService, setActiveService] = useState(0);

    useEffect(() => {
        if (!pageRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.hero-line', {
                y: '100%', opacity: 0, duration: 1,
                stagger: 0.1, ease: 'expo.out', delay: 0.2,
            });
            gsap.utils.toArray<HTMLElement>('.reveal-up').forEach(el => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 88%' },
                    y: 28, opacity: 0, duration: 0.75, ease: 'power2.out',
                });
            });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    const active = services[activeService];

    return (
        <div className="bg-white font-sans overflow-x-hidden" ref={pageRef}>

            {/* ── HERO ───────────────────────────────────────────── */}
            <section className="pt-40 pb-0 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-7xl relative z-10">

                    {/* Rule + label */}
                    <div className="flex items-center gap-5 mb-14">
                        <div className="h-px flex-1 bg-gray-200 hero-line" />
                        <span className="hero-line text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">
                            EPC Services · OM Power Solutions
                        </span>
                        <div className="h-px flex-1 bg-gray-200 hero-line" />
                    </div>

                    {/* Headline */}
                    <div className="overflow-hidden mb-3">
                        <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-gray-900 uppercase">
                            End-to-End
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-3 flex items-end gap-6">
                        <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-gray-900 uppercase">
                            Solar EPC
                        </h1>
                        <div className="hero-line hidden md:block mb-2 border-l-2 border-brand-blue pl-5 max-w-xs flex-shrink-0">
                            <p className="text-gray-500 text-base font-[300] leading-snug">
                                Survey, design, supply, install, commission — and maintain. One partner for the full lifecycle.
                            </p>
                        </div>
                    </div>
                    <div className="overflow-hidden mb-16">
                        <h1
                            className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-transparent uppercase"
                            style={{ WebkitTextStroke: '2px #1a1a1a' }}
                        >
                            Services.
                        </h1>
                    </div>

                    {/* KPI strip */}
                    <div className="grid grid-cols-3 border-t border-gray-100 hero-line">
                        {[
                            { val: '6', label: 'Service Verticals' },
                            { val: '24+', label: 'Years of Expertise' },
                            { val: '100%', label: 'In-House Workforce' },
                        ].map((s, i) => (
                            <div key={i} className={`py-8 px-4 md:px-8 ${i < 2 ? 'border-r border-gray-100' : ''}`}>
                                <div className="text-2xl md:text-3xl font-[900] text-gray-900 tracking-tight">{s.val}</div>
                                <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-400 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── INTERACTIVE SERVICE EXPLORER ───────────────────── */}
            <section className="py-0 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">
                            Service Portfolio
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>
                </div>

                {/* Two-panel layout: left tabs + right detail */}
                <div className="container mx-auto px-6 max-w-7xl pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 reveal-up">

                        {/* Left — service menu */}
                        <div className="lg:col-span-4 border border-gray-100">
                            {services.map((s, i) => {
                                const Icon = s.icon;
                                const isActive = activeService === i;
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveService(i)}
                                        className={`w-full text-left flex items-center gap-4 px-6 py-5 border-b border-gray-100 transition-all duration-300 group ${isActive ? 'bg-gray-950' : 'bg-white hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${isActive ? s.accent : 'bg-gray-100'} transition-colors duration-300`}>
                                            <Icon className={`w-4 h-4 ${isActive ? (s.accent.includes('yellow') ? 'text-gray-900' : 'text-white') : 'text-gray-500'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-[0.65rem] font-[700] uppercase tracking-widest mb-0.5 ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {s.num}
                                            </div>
                                            <div className={`text-sm font-[800] truncate ${isActive ? 'text-white' : 'text-gray-800'}`}>
                                                {s.title}
                                            </div>
                                        </div>
                                        <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 transition-all duration-300 ${isActive ? s.accentText : 'text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5'}`} />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right — service detail */}
                        <div className="lg:col-span-8 flex flex-col border border-l-0 border-gray-100" key={active.id}>

                            {/* Image */}
                            <div className="overflow-hidden" style={{ aspectRatio: '16/8' }}>
                                <img
                                    src={active.img}
                                    alt={active.title}
                                    className="w-full h-full object-cover"
                                    style={{ transition: 'opacity 0.4s ease' }}
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-8 md:p-10 flex flex-col">
                                {/* Top metadata row */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-1.5 h-1.5 ${active.accent}`} />
                                    <span className={`text-[0.6rem] font-[800] uppercase tracking-[0.25em] ${active.accentText}`}>{active.subtitle}</span>
                                    <div className="h-3 w-px bg-gray-200" />
                                    <span className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-400">{active.num} of {String(services.length).padStart(2, '0')}</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-[900] text-gray-900 tracking-tight leading-snug mb-4">
                                    {active.title}
                                </h2>
                                <div className="h-px w-8 bg-gray-200 mb-6" />

                                <p className="text-gray-500 text-[15px] font-[300] leading-relaxed mb-8">
                                    {active.desc}
                                </p>

                                {/* Feature points */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                    {active.points.map((pt, pi) => (
                                        <div key={pi} className="flex items-center gap-2.5">
                                            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${active.accentText}`} />
                                            <span className="text-gray-700 text-sm font-[500]">{pt}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA row */}
                                <div className="flex items-center gap-5 pt-5 border-t border-gray-100 mt-auto">
                                    <Link
                                        to="/contact"
                                        className={`inline-flex items-center gap-2 text-xs font-[900] uppercase tracking-widest ${active.accentText} border-b border-current pb-0.5 hover:opacity-70 transition-opacity group`}
                                    >
                                        Get Free Consultation
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SERVICE LIST — full scrollable index ───────────── */}
            <section className="py-0 bg-[#f7f7f8]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">Full Service Index</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <div className="pb-20">
                        {services.map((s) => {
                            const Icon = s.icon;
                            return (
                                <div
                                    key={s.id}
                                    className="group grid grid-cols-12 gap-6 border-t border-gray-200 py-8 md:py-10 items-center hover:bg-white transition-colors duration-300 px-2 reveal-up"
                                >
                                    {/* Number */}
                                    <div className="col-span-1 hidden md:flex">
                                        <span className="text-[0.65rem] font-[900] text-gray-300 tracking-widest">{s.num}</span>
                                    </div>

                                    {/* Icon */}
                                    <div className="col-span-2 md:col-span-1">
                                        <div className={`w-10 h-10 ${s.accent} flex items-center justify-center`}>
                                            <Icon className={`w-5 h-5 ${s.accent.includes('yellow') ? 'text-gray-900' : 'text-white'}`} />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="col-span-6 md:col-span-3">
                                        <div className={`text-[0.55rem] font-[700] uppercase tracking-[0.2em] ${s.accentText} mb-1`}>{s.subtitle}</div>
                                        <h3 className="font-[900] text-gray-900 text-base md:text-lg tracking-tight group-hover:text-gray-600 transition-colors">{s.title}</h3>
                                    </div>

                                    {/* Description */}
                                    <div className="col-span-12 md:col-span-5 md:col-start-7">
                                        <p className="text-gray-400 text-sm font-[300] leading-relaxed">{s.desc}</p>
                                    </div>

                                    {/* CTA arrow */}
                                    <div className="col-span-2 md:col-span-1 flex justify-end">
                                        <div className={`w-8 h-8 border ${s.accentBorder} flex items-center justify-center ${s.accentText} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="border-t border-gray-200" />
                    </div>
                </div>
            </section>

            {/* ── PROCESS STRIP ──────────────────────────────────── */}
            <section className="py-0 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">How It Works</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-100 pb-24 reveal-up">
                        {[
                            { step: '01', title: 'Site Survey', desc: 'Our engineers visit your site for shadow analysis, load assessment, and feasibility study — free of cost.' },
                            { step: '02', title: 'Design & Proposal', desc: 'We deliver a detailed system design, yield report, ROI calculation, and competitive quotation within 48 hours.' },
                            { step: '03', title: 'Procurement & Build', desc: 'We supply only Tier-1 components and execute installation with our in-house certified workforce.' },
                            { step: '04', title: 'Commission & Monitor', desc: 'Full grid commissioning, net-meter setup, and handover with a live monitoring app and AMC contract.' },
                        ].map((p, i) => (
                            <div key={i} className={`p-8 border-b md:border-b-0 ${i < 3 ? 'md:border-r' : ''} border-gray-100 group hover:bg-gray-50 transition-colors duration-300`}>
                                <div className="text-[3rem] font-[900] text-gray-100 leading-none select-none mb-4">{p.step}</div>
                                <h4 className="font-[900] text-gray-900 text-lg mb-3">{p.title}</h4>
                                <div className="h-px w-6 bg-brand-blue mb-4 group-hover:w-12 transition-all duration-500" />
                                <p className="text-gray-400 text-sm font-[300] leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DARK CTA ───────────────────────────────────────── */}
            <section className="py-0 bg-gray-950">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-500 whitespace-nowrap">Get Started</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="grid md:grid-cols-12 gap-10 items-center pb-20">
                        <div className="md:col-span-7">
                            <h2 className="text-4xl md:text-5xl font-[900] text-white leading-[1.0] tracking-tight mb-6">
                                Ready to Cut Your<br />
                                <span className="text-brand-yellow">Power Bills Forever?</span>
                            </h2>
                            <p className="text-gray-500 text-base font-[300] leading-relaxed max-w-lg border-l border-white/10 pl-5">
                                Free site visit, free system design, free ROI report. No obligation. Our engineering team has designed 500+ projects — yours is next.
                            </p>
                        </div>
                        <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-4">
                            <Link to="/contact" className="inline-flex items-center justify-between gap-3 bg-brand-yellow text-gray-900 px-8 py-4 text-xs font-[900] uppercase tracking-widest hover:bg-yellow-400 transition-colors group">
                                Book Free Site Survey
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="tel:+919876543210" className="inline-flex items-center justify-between gap-3 border border-white/15 text-white px-8 py-4 text-xs font-[700] uppercase tracking-widest hover:border-white/40 transition-colors">
                                <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Call Now</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Services;
