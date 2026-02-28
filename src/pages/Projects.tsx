import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Zap, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
    id: number;
    title: string;
    category: string;
    capacity: string;
    location: string;
    year: number;
    image_url: string;
}

const FILTERS = ['All', 'Residential', 'Commercial', 'Industrial'];

const categoryAccent: Record<string, string> = {
    Residential: 'bg-brand-green',
    Commercial: 'bg-brand-blue',
    Industrial: 'bg-brand-yellow',
};

const FALLBACK: Project[] = [
    { id: 1, title: 'TechPark Phase I', category: 'Commercial', capacity: '1.2 MW', location: 'Noida, Uttar Pradesh', year: 2023, image_url: 'https://images.unsplash.com/photo-1548614606-52b4451f994b?w=900&auto=format&fit=crop' },
    { id: 2, title: 'RBA Textiles Plant', category: 'Industrial', capacity: '3 MW', location: 'Kuppam, Andhra Pradesh', year: 2023, image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&auto=format&fit=crop' },
    { id: 3, title: 'Green Valley Township', category: 'Residential', capacity: '50 kW', location: 'Gurugram, Haryana', year: 2024, image_url: 'https://images.unsplash.com/photo-1613665813446-82a100462cca?w=900&auto=format&fit=crop' },
    { id: 4, title: 'SteelCo Manufacturing', category: 'Industrial', capacity: '5.5 MW', location: 'Pune, Maharashtra', year: 2022, image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900&auto=format&fit=crop' },
    { id: 5, title: 'City Mall Plaza', category: 'Commercial', capacity: '800 kW', location: 'Connaught Place, Delhi', year: 2023, image_url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900&auto=format&fit=crop' },
    { id: 6, title: 'Platinum Estates Society', category: 'Residential', capacity: '120 kW', location: 'Jaipur, Rajasthan', year: 2024, image_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=900&auto=format&fit=crop' },
];

const Projects: React.FC = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState('All');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    /* — fetch — */
    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('year', { ascending: false });
            setProjects(error || !data?.length ? FALLBACK : data);
            setLoading(false);
        };
        fetchProjects();
    }, []);

    /* — GSAP — */
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

    const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

    /* ─────────────────────────────────────────────────────────── */
    return (
        <div className="bg-white font-sans overflow-x-hidden" ref={pageRef}>

            {/* ── HERO ───────────────────────────────────────────── */}
            <section className="pt-40 pb-0 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-7xl relative z-10">

                    {/* Rule + label */}
                    <div className="flex items-center gap-5 mb-14">
                        <div className="h-px flex-1 bg-gray-200 hero-line" />
                        <span className="hero-line text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">
                            Project Portfolio · OM Power Solutions
                        </span>
                        <div className="h-px flex-1 bg-gray-200 hero-line" />
                    </div>

                    {/* Headline */}
                    <div className="overflow-hidden mb-3">
                        <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-gray-900 uppercase">500+</h1>
                    </div>
                    <div className="overflow-hidden mb-3 flex items-end gap-6">
                        <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-gray-900 uppercase">Projects</h1>
                        <div className="hero-line hidden md:block mb-2 border-l-2 border-brand-blue pl-5 max-w-xs flex-shrink-0">
                            <p className="text-gray-500 text-base font-[300] leading-snug">
                                From 50 kW rooftops to 5+ MW industrial plants — engineered to last a generation.
                            </p>
                        </div>
                    </div>
                    <div className="overflow-hidden mb-16">
                        <h1
                            className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-transparent uppercase"
                            style={{ WebkitTextStroke: '2px #1a1a1a' }}
                        >
                            Delivered.
                        </h1>
                    </div>

                    {/* KPI strip */}
                    <div className="grid grid-cols-3 border-t border-gray-100 hero-line">
                        {[
                            { val: '120 MW', label: 'Total Capacity Installed' },
                            { val: '24+', label: 'Years in Operation' },
                            { val: '18 States', label: 'Pan-India Presence' },
                        ].map((s, i) => (
                            <div key={i} className={`py-8 px-4 md:px-8 ${i < 2 ? 'border-r border-gray-100' : ''}`}>
                                <div className="text-2xl md:text-3xl font-[900] text-gray-900 tracking-tight">{s.val}</div>
                                <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-400 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FILTER BAR ─────────────────────────────────────── */}
            <section className="bg-white border-b border-gray-100 sticky top-[60px] z-40">
                <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between gap-6">
                    <div className="flex items-center gap-0 overflow-x-auto">
                        {FILTERS.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-5 text-[0.7rem] font-[800] uppercase tracking-widest whitespace-nowrap border-b-2 transition-all duration-300 ${filter === cat
                                    ? 'text-brand-blue border-brand-blue'
                                    : 'text-gray-400 border-transparent hover:text-gray-700'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <span className="text-[0.65rem] font-[700] uppercase tracking-widest text-gray-400 whitespace-nowrap hidden sm:block">
                        {filtered.length} Project{filtered.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </section>

            {/* ── PROJECTS GRID ──────────────────────────────────── */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    {loading ? (
                        /* Skeleton */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gray-100 animate-pulse" style={{ aspectRatio: '4/3' }} />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="text-5xl font-[900] text-gray-100 mb-4">0</div>
                            <p className="text-gray-400 font-[300]">No projects in this category yet.</p>
                        </div>
                    ) : (
                        /* Masonry-style grid: first item is big (col-span-2), rest are standard */
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
                            {filtered.map((project, idx) => {
                                const isFeatured = idx === 0;
                                const accent = categoryAccent[project.category] ?? 'bg-brand-blue';
                                return (
                                    <div
                                        key={project.id}
                                        className={`group relative overflow-hidden reveal-up ${isFeatured ? 'md:col-span-8' : 'md:col-span-4'}`}
                                        style={{ aspectRatio: isFeatured ? '16/9' : '4/3' }}
                                    >
                                        {/* Image */}
                                        <img
                                            src={project.image_url}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-1000 ease-out"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/20 to-transparent" />

                                        {/* Category pill */}
                                        <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 ${accent}`} />
                                            <span className="text-[0.55rem] font-[900] uppercase tracking-[0.25em] text-white/80">{project.category}</span>
                                        </div>

                                        {/* Year badge */}
                                        <div className="absolute top-5 right-5 z-20">
                                            <span className="text-[0.55rem] font-[800] uppercase tracking-widest text-gray-400 bg-black/50 backdrop-blur-sm px-2.5 py-1">
                                                {project.year}
                                            </span>
                                        </div>

                                        {/* Content — bottom */}
                                        <div className={`absolute bottom-0 left-0 right-0 z-20 p-6 ${isFeatured ? 'md:p-10' : ''}`}>
                                            <h3 className={`font-[900] text-white tracking-tight leading-snug mb-3 ${isFeatured ? 'text-2xl md:text-4xl' : 'text-lg md:text-xl'}`}>
                                                {project.title}
                                            </h3>

                                            <div className={`flex items-center gap-4 flex-wrap ${isFeatured ? '' : 'gap-3'}`}>
                                                <span className="inline-flex items-center gap-1.5 text-gray-400 text-[0.65rem] font-[500]">
                                                    <MapPin className="w-3 h-3 text-gray-500" />
                                                    {project.location}
                                                </span>
                                                <div className="h-3 w-px bg-white/20" />
                                                <span className="inline-flex items-center gap-1.5 text-brand-yellow text-[0.65rem] font-[800] uppercase tracking-widest">
                                                    <Zap className="w-3 h-3" />
                                                    {project.capacity}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Hover CTA overlay */}
                                        <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20 backdrop-blur-[1px]">
                                            <div className="flex items-center gap-2 text-[0.65rem] font-[900] uppercase tracking-widest text-white border-b border-white pb-0.5">
                                                View Project <ArrowRight className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* ── TIMELINE — notable projects ────────────────────── */}
            <section className="py-0 bg-[#f7f7f8]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">Notable Milestones</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <div className="pb-20 reveal-up">
                        {[
                            { year: '2024', title: '120 MW Milestone Crossed', desc: 'OM Power crosses cumulative 120 MW installed capacity across residential, commercial, and industrial sectors.', accent: 'bg-brand-blue' },
                            { year: '2023', title: '3 MWP Plant for RBA Textiles', desc: 'Delivered India\'s largest single-rooftop installation for a textile manufacturer — in 90 days flat with zero downtime.', accent: 'bg-brand-green' },
                            { year: '2022', title: '5.5 MW Industrial Ground Mount', desc: 'Engineered a fully ground-mounted 5.5 MW plant for SteelCo Manufacturing in Pune, Maharashtra — on schedule and within budget.', accent: 'bg-brand-yellow' },
                            { year: '2020', title: 'Pan-India Expansion to 18 States', desc: 'Expanded operations to 18 Indian states, establishing regional offices and certified installation teams in each zone.', accent: 'bg-brand-blue' },
                        ].map((m, i) => (
                            <div key={i} className={`grid grid-cols-12 gap-8 py-8 border-t border-gray-200 items-start group hover:bg-white transition-colors duration-300 px-4`}>
                                <div className="col-span-2 md:col-span-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 flex-shrink-0 ${m.accent}`} />
                                        <span className="text-[0.65rem] font-[900] text-gray-400 uppercase tracking-widest">{m.year}</span>
                                    </div>
                                </div>
                                <div className="col-span-4 md:col-span-4">
                                    <h4 className="font-[900] text-gray-900 text-base md:text-lg tracking-tight">{m.title}</h4>
                                </div>
                                <div className="col-span-12 md:col-span-6 md:col-start-7">
                                    <p className="text-gray-400 text-sm font-[300] leading-relaxed">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                        <div className="border-t border-gray-200" />
                    </div>
                </div>
            </section>

            {/* ── DARK CTA ───────────────────────────────────────── */}
            <section className="py-0 bg-gray-950">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-500 whitespace-nowrap">Start Your Project</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="grid md:grid-cols-12 gap-10 items-center pb-20">
                        <div className="md:col-span-7">
                            <h2 className="text-4xl md:text-5xl font-[900] text-white leading-[1.0] tracking-tight mb-6">
                                Your Project Could Be<br />
                                <span className="text-brand-yellow">On This Page.</span>
                            </h2>
                            <p className="text-gray-500 text-base font-[300] leading-relaxed max-w-lg border-l border-white/10 pl-5">
                                We scope, design, finance, and deliver — end to end. Get a free site analysis and capacity estimate from our engineering team.
                            </p>
                        </div>
                        <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-4">
                            <a href="/contact" className="inline-flex items-center justify-between gap-3 bg-brand-yellow text-gray-900 px-8 py-4 text-xs font-[900] uppercase tracking-widest hover:bg-yellow-400 transition-colors group">
                                Start Free Consultation
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="tel:+919876543210" className="inline-flex items-center justify-between gap-3 border border-white/15 text-white px-8 py-4 text-xs font-[700] uppercase tracking-widest hover:border-white/40 transition-colors">
                                Call Engineering Team
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Projects;
