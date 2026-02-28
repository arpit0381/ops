import React, { useEffect, useRef, useState } from 'react';
import { Download, FileText, ArrowRight, Zap, ShieldCheck, Battery, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../supabase/client';

gsap.registerPlugin(ScrollTrigger);

const BASE_CATEGORIES = [
    {
        id: '01',
        title: 'Solar Panels',
        subtitle: 'Photovoltaic Modules',
        icon: Zap,
        accent: 'brand-blue',
        accentClass: 'text-brand-blue',
        accentBg: 'bg-brand-blue',
        borderAccent: 'border-brand-blue',
    },
    {
        id: '02',
        title: 'Inverters & Electronics',
        subtitle: 'Power Conversion Systems',
        icon: ShieldCheck,
        accent: 'brand-green',
        accentClass: 'text-brand-green',
        accentBg: 'bg-brand-green',
        borderAccent: 'border-brand-green',
    },
    {
        id: '03',
        title: 'Energy Storage',
        subtitle: 'Battery & Storage Systems',
        icon: Battery,
        accent: 'brand-yellow',
        accentClass: 'text-brand-yellow',
        accentBg: 'bg-brand-yellow',
        borderAccent: 'border-brand-yellow',
    },
];

interface ProductData {
    id: number;
    name: string;
    category: string;
    description: string;
    specs: string;
    image_url: string;
}

const Products: React.FC = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const [products, setProducts] = useState<ProductData[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            if (data) setProducts(data);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!pageRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.hero-line', {
                y: '100%',
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'expo.out',
                delay: 0.2,
            });
            gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 88%' },
                    y: 28,
                    opacity: 0,
                    duration: 0.75,
                    ease: 'power2.out',
                });
            });
        }, pageRef);
        return () => ctx.revert();
    }, []);
    const categoriesWithItems = BASE_CATEGORIES.map(cat => ({
        ...cat,
        items: products.filter(p => p.category === cat.title).map(p => ({
            id: p.id,
            name: p.name,
            tag: 'Featured', // Default tag
            tagBg: cat.accentBg,
            specs: p.specs.split(',').map(s => {
                const parts = s.split(':');
                if (parts.length === 2) return { label: parts[0].trim(), value: parts[1].trim() };
                return { label: 'Spec', value: s.trim() }; // fallback
            }),
            img: p.image_url || 'https://images.unsplash.com/photo-1508514177221-188b1fc16e9d?w=800&auto=format&fit=crop',
            desc: p.description,
        }))
    }));

    const activeCat = categoriesWithItems[activeCategoryIndex];

    return (
        <div className="bg-white font-sans overflow-x-hidden" ref={pageRef}>

            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className="pt-40 pb-0 bg-white relative overflow-hidden">
                {/* Subtle noise texture bg */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508514177221-188b1fc16e9d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.04] pointer-events-none" />

                <div className="container mx-auto px-6 max-w-7xl relative z-10">

                    {/* Rule + label */}
                    <div className="flex items-center gap-5 mb-14 overflow-hidden">
                        <div className="h-px flex-1 bg-gray-200 hero-line" />
                        <span className="hero-line text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">
                            Product Catalogue · OM Power Solutions
                        </span>
                        <div className="h-px flex-1 bg-gray-200 hero-line" />
                    </div>

                    {/* Big headline */}
                    <div className="overflow-hidden mb-3">
                        <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-gray-900 uppercase">
                            Tier-1
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-3 flex items-end gap-6">
                        <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-gray-900 uppercase">
                            Components
                        </h1>
                        <div className="hero-line hidden md:block mb-2 border-l-2 border-brand-blue pl-5 max-w-xs">
                            <p className="text-gray-500 text-base font-[300] leading-snug">
                                Panels, inverters, and storage systems engineered for maximum yield, longevity, and zero compromise.
                            </p>
                        </div>
                    </div>
                    <div className="overflow-hidden mb-20">
                        <h1
                            className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-transparent uppercase"
                            style={{ WebkitTextStroke: '2px #1a1a1a' }}
                        >
                            Built to Last.
                        </h1>
                    </div>

                    {/* Stat strip */}
                    <div className="hero-line grid grid-cols-3 border-t border-gray-100 mb-0">
                        {[
                            { val: '25+', label: 'Years Product Warranty' },
                            { val: '6,000', label: 'Battery Cycle Life' },
                            { val: '21.5%', label: 'Peak Panel Efficiency' },
                        ].map((s, i) => (
                            <div key={i} className={`py-8 px-4 md:px-8 ${i < 2 ? 'border-r border-gray-100' : ''}`}>
                                <div className="text-2xl md:text-3xl font-[900] text-gray-900 tracking-tight">{s.val}</div>
                                <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-400 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CATEGORY TABS ─────────────────────────────────────── */}
            <section className="bg-white border-b border-gray-100 sticky top-[60px] z-40">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-0 overflow-x-auto">
                        {categoriesWithItems.map((cat, i) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setActiveCategoryIndex(i)}
                                    className={`group flex items-center gap-2.5 px-6 py-5 text-[0.7rem] font-[800] uppercase tracking-widest whitespace-nowrap border-b-2 transition-all duration-300 ${activeCategoryIndex === i
                                        ? `${cat.accentClass} border-current`
                                        : 'text-gray-400 border-transparent hover:text-gray-700'
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {cat.title}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── PRODUCT CATALOG ───────────────────────────────────── */}
            <section className="py-0 bg-[#f7f7f8]">

                {/* Category header */}
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px w-10 bg-gray-300" />
                        <div>
                            <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400">{activeCat.subtitle}</span>
                        </div>
                    </div>

                    <div className="flex items-end gap-4 mb-14 reveal-up">
                        <div>
                            <div className="text-[3.5rem] font-[900] text-gray-100 leading-none tracking-tight select-none">{activeCat.id}</div>
                            <h2 className="text-4xl md:text-5xl font-[900] text-gray-900 leading-[1.0] tracking-tight -mt-2">
                                {activeCat.title}
                            </h2>
                        </div>
                        <div className={`h-1.5 w-1.5 ${activeCat.accentBg} mb-4 ml-1`} />
                    </div>
                </div>

                {/* Product rows */}
                <div className="container mx-auto px-6 max-w-7xl pb-24">
                    <div className="space-y-4">
                        {activeCat.items.length === 0 && (
                            <div className="py-24 text-center text-gray-400 font-[500] uppercase tracking-widest text-sm reveal-up">
                                No products found in this category.
                            </div>
                        )}
                        {activeCat.items.map((item, i) => (
                            <div
                                key={item.id}
                                className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-500 reveal-up overflow-hidden"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12">

                                    {/* Image */}
                                    <div className="lg:col-span-4 overflow-hidden" style={{ aspectRatio: '16/10' }}>
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-1000 ease-out"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="lg:col-span-8 p-8 md:p-10 flex flex-col justify-between">
                                        <div>
                                            {/* Tag + number */}
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className={`text-[0.55rem] font-[900] uppercase tracking-[0.25em] text-white ${item.tagBg} px-2.5 py-1`}>
                                                    {item.tag}
                                                </span>
                                                <span className="text-[0.6rem] font-[700] text-gray-300 uppercase tracking-widest">
                                                    Product {String(i + 1).padStart(2, '0')}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl md:text-3xl font-[900] text-gray-900 tracking-tight leading-snug mb-4 group-hover:text-brand-blue transition-colors duration-300">
                                                {item.name}
                                            </h3>

                                            <p className="text-gray-400 text-[15px] font-[300] leading-relaxed mb-8 max-w-lg">
                                                {item.desc}
                                            </p>

                                            {/* Specs grid */}
                                            {item.specs.length > 0 && item.specs[0].value !== '' && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-gray-100 mb-8 max-w-2xl">
                                                    {item.specs.map((spec, si) => (
                                                        <div key={si} className={`py-4 pr-4 border-r border-gray-100 mr-4 last:border-r-0 last:mr-0`}>
                                                            <div className={`text-[0.55rem] font-[800] uppercase tracking-[0.2em] ${activeCat.accentClass} mb-1 truncate`}>{spec.label}</div>
                                                            <div className="font-[800] text-gray-900 text-sm truncate">{spec.value}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* CTAs */}
                                        <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                                            <button className={`inline-flex items-center gap-2 text-xs font-[900] uppercase tracking-widest ${activeCat.accentClass} border-b border-current pb-0.5 hover:opacity-70 transition-opacity group/dl`}>
                                                <FileText className="w-3.5 h-3.5" />
                                                Download Datasheet
                                                <Download className="w-3 h-3 group-hover/dl:translate-y-0.5 transition-transform" />
                                            </button>
                                            <button className="inline-flex items-center gap-1.5 text-xs font-[700] text-gray-400 hover:text-gray-800 uppercase tracking-widest transition-colors group/rq">
                                                Request Quote
                                                <ChevronRight className="w-3.5 h-3.5 group-hover/rq:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BOTTOM CTA ────────────────────────────────────────── */}
            <section className="py-0 bg-gray-950">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-500 whitespace-nowrap">
                            Custom Requirements
                        </span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="grid md:grid-cols-12 gap-10 items-center pb-20">
                        <div className="md:col-span-7">
                            <h2 className="text-4xl md:text-5xl font-[900] text-white leading-[1.0] tracking-tight mb-6">
                                Need a Custom<br />
                                <span className="text-brand-yellow">Product Configuration?</span>
                            </h2>
                            <p className="text-gray-500 text-base font-[300] leading-relaxed max-w-lg border-l border-white/10 pl-5">
                                Every project is unique. Our engineering team specifies the exact product mix, sizing, and configurations required for your site — at no additional cost during proposal.
                            </p>
                        </div>
                        <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-4">
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-between gap-3 bg-brand-yellow text-gray-900 px-8 py-4 text-xs font-[900] uppercase tracking-widest hover:bg-yellow-400 transition-colors group"
                            >
                                Request Engineering Quote
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="tel:+919876543210"
                                className="inline-flex items-center justify-between gap-3 border border-white/15 text-white px-8 py-4 text-xs font-[700] uppercase tracking-widest hover:border-white/40 transition-colors"
                            >
                                Talk to Technical Team
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Products;
