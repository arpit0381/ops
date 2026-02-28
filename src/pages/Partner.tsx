import React, { useEffect, useRef, useState } from 'react';
import {
    ArrowRight, CheckCircle2,
    TrendingUp, Shield, Zap, Globe, Phone, Mail, Send, AlertCircle, CheckCircle
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../supabase/client';

gsap.registerPlugin(ScrollTrigger);

/* ── Partner tiers ─────────────────────────────────────────── */
const tiers = [
    {
        num: '01',
        name: 'Referral Partner',
        tag: 'Entry Level',
        tagBg: 'bg-brand-green',
        accent: 'text-brand-green',
        accentBorder: 'border-l-brand-green',
        accentBg: 'bg-brand-green',
        desc: 'Refer clients and earn a competitive commission on every deal we close. No investment, no risk — just your network.',
        commission: 'Up to 1.5%',
        commissionLabel: 'of project value',
        perks: [
            'Dedicated Partner Manager',
            'Referral tracking portal',
            'Marketing collateral access',
            'Instant commission payout',
        ],
    },
    {
        num: '02',
        name: 'Channel Partner',
        tag: 'Most Popular',
        tagBg: 'bg-brand-blue',
        accent: 'text-brand-blue',
        accentBorder: 'border-l-brand-blue',
        accentBg: 'bg-brand-blue',
        desc: 'Sell OM Power products and services under your brand with full technical and sales support from our team.',
        commission: 'Up to 4%',
        commissionLabel: 'of project value',
        perks: [
            'Co-branded proposals',
            'Priority technical support',
            'Exclusive territory rights',
            'Sales target incentives',
            'Joint customer visits',
            'Training & certification',
        ],
    },
    {
        num: '03',
        name: 'EPC Partner',
        tag: 'Premium Tier',
        tagBg: 'bg-brand-yellow',
        accent: 'text-brand-yellow',
        accentBorder: 'border-l-brand-yellow',
        accentBg: 'bg-brand-yellow',
        desc: 'Execute projects end-to-end as a licensed OM Power engineering & procurement contractor in your region.',
        commission: 'Up to 8%',
        commissionLabel: 'of project value',
        perks: [
            'Licensed OM brand usage',
            'Full project access',
            'Dedicated site engineer',
            'Tier-1 product supply',
            'Performance-linked bonuses',
            'Pan-India empanelment',
            'AMC contract participation',
        ],
    },
];

/* ── Why partner rows ───────────────────────────────────────── */
const whyRows = [
    {
        icon: TrendingUp,
        title: '₹25,000 Cr+ Market Opportunity',
        desc: "India's solar sector is growing at 25% annually. With government mandates pushing 500 GW by 2030, early partners lock in the most lucrative territories.",
        accent: 'bg-brand-blue',
    },
    {
        icon: Shield,
        title: '24 Years of Proven Execution',
        desc: 'Our partners inherit our reputation — 500+ delivered projects, Tier-1-only components, and an engineering team with 200+ certified professionals.',
        accent: 'bg-brand-green',
    },
    {
        icon: Zap,
        title: 'Industry-Leading Commissions',
        desc: 'Structured payout tiers, transparent tracking, and zero payment delays. Our top channel partners earn ₹50L+ per year from their networks alone.',
        accent: 'bg-brand-yellow',
    },
    {
        icon: Globe,
        title: 'Pan-India Brand & Support',
        desc: 'Leverage a nationally recognised brand with marketing support, co-branded proposals, joint site visits, and a dedicated RM — so you focus on selling.',
        accent: 'bg-brand-blue',
    },
];

/* ── Process steps ─────────────────────────────────────────── */
const steps = [
    { num: '01', title: 'Apply Online', desc: 'Submit your basic details and preferred partnership tier. Takes under 3 minutes.' },
    { num: '02', title: 'Partner Review', desc: 'Our partnerships team evaluates your profile and connects within 48 hours.' },
    { num: '03', title: 'Sign Agreement', desc: 'A simple, transparent digital partnership agreement. No hidden clauses.' },
    { num: '04', title: 'Get Onboarded', desc: 'Access your portal, marketing kit, and dedicated RM. Start closing deals.' },
];

/* ══════════════════════════════════════════════════════════════ */
const Partner: React.FC = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const [activeTier, setActiveTier] = useState(1); // default to middle tier

    /* form state */
    const [form, setForm] = useState({
        name: '', email: '', phone: '', company: '',
        city: '', tier: tiers[1].name, message: '',
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formError, setFormError] = useState('');
    const [focused, setFocused] = useState<string | null>(null);

    /* GSAP */
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
                    y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
                });
            });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('loading');
        setFormError('');
        try {
            // Store in inquiries table with a partner subject prefix
            const { error } = await supabase.from('inquiries').insert([{
                name: form.name,
                email: form.email,
                phone: form.phone,
                subject: `[Partner Application] ${form.tier} — ${form.company || 'Individual'}`,
                message: `City: ${form.city}\nTier: ${form.tier}\nMessage: ${form.message}`,
            }]);
            if (error) throw error;
            setFormStatus('success');
            setForm({ name: '', email: '', phone: '', company: '', city: '', tier: tiers[1].name, message: '' });
            setTimeout(() => setFormStatus('idle'), 8000);
        } catch (err: any) {
            setFormStatus('error');
            setFormError(err.message || 'Submission failed. Please try again.');
        }
    };

    const inputBase = `w-full bg-transparent border-b border-white/10 py-4 text-white text-sm font-[400] placeholder-gray-700 outline-none transition-all duration-300`;
    const inputFocus = (f: string) => focused === f ? 'border-white/40' : 'border-white/10';

    /* ── render ── */
    return (
        <div className="bg-white font-sans overflow-x-hidden" ref={pageRef}>

            {/* ── HERO ────────────────────────────────────────────── */}
            <section className="pt-40 pb-0 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-7xl relative z-10">

                    {/* Label rule */}
                    <div className="flex items-center gap-5 mb-14">
                        <div className="h-px flex-1 bg-gray-200 hero-line" />
                        <span className="hero-line text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">
                            Partnership Programme · OM Power Solutions
                        </span>
                        <div className="h-px flex-1 bg-gray-200 hero-line" />
                    </div>

                    {/* Giant headline */}
                    <div className="overflow-hidden mb-3">
                        <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-gray-900 uppercase">
                            Grow With
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-3 flex items-end gap-6 flex-wrap">
                        <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-gray-900 uppercase">
                            India's Sun.
                        </h1>
                        <div className="hero-line hidden md:block mb-2 border-l-2 border-brand-blue pl-5 max-w-sm flex-shrink-0">
                            <p className="text-gray-500 text-base font-[300] leading-snug">
                                Three partnership tiers. One shared mission. Join 200+ partners already powering our pan-India expansion.
                            </p>
                        </div>
                    </div>
                    <div className="overflow-hidden mb-16">
                        <h1
                            className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-transparent uppercase"
                            style={{ WebkitTextStroke: '2px #1a1a1a' }}
                        >
                            Together.
                        </h1>
                    </div>

                    {/* KPI strip */}
                    <div className="grid grid-cols-3 border-t border-gray-100 hero-line">
                        {[
                            { val: '200+', label: 'Active Partners' },
                            { val: '₹50L+', label: 'Avg. Partner Earnings / Year' },
                            { val: '18 States', label: 'Network Coverage' },
                        ].map((s, i) => (
                            <div key={i} className={`py-8 px-4 md:px-8 ${i < 2 ? 'border-r border-gray-100' : ''}`}>
                                <div className="text-2xl md:text-3xl font-[900] text-gray-900 tracking-tight">{s.val}</div>
                                <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-400 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY PARTNER ─────────────────────────────────────── */}
            <section className="py-0 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">Why Partner With Us</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <div className="pb-24 space-y-0">
                        {whyRows.map((row, i) => {
                            const Icon = row.icon;
                            return (
                                <div
                                    key={i}
                                    className="group grid grid-cols-12 gap-6 border-t border-gray-100 py-10 items-start hover:bg-gray-50 transition-colors duration-300 px-2 reveal-up"
                                >
                                    {/* Number */}
                                    <div className="col-span-1 hidden md:block">
                                        <span className="text-[0.65rem] font-[900] text-gray-200 tracking-widest">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    {/* Icon */}
                                    <div className="col-span-2 md:col-span-1">
                                        <div className={`w-10 h-10 ${row.accent} flex items-center justify-center`}>
                                            <Icon className={`w-5 h-5 ${row.accent.includes('yellow') ? 'text-gray-900' : 'text-white'}`} />
                                        </div>
                                    </div>
                                    {/* Title */}
                                    <div className="col-span-8 md:col-span-4">
                                        <h3 className="font-[900] text-gray-900 text-lg md:text-xl tracking-tight leading-snug group-hover:text-gray-700 transition-colors">
                                            {row.title}
                                        </h3>
                                    </div>
                                    {/* Desc */}
                                    <div className="col-span-12 md:col-span-5 md:col-start-8">
                                        <p className="text-gray-400 text-sm font-[300] leading-relaxed">{row.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="border-t border-gray-100" />
                    </div>
                </div>
            </section>

            {/* ── PARTNERSHIP TIERS ───────────────────────────────── */}
            <section className="py-0 bg-[#f7f7f8]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">Partnership Tiers</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {/* Tier selector tabs */}
                    <div className="flex items-center gap-0 border-b border-gray-200 mb-10 reveal-up overflow-x-auto">
                        {tiers.map((t, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTier(i)}
                                className={`flex items-center gap-2.5 px-6 py-4 text-[0.7rem] font-[800] uppercase tracking-widest whitespace-nowrap border-b-2 transition-all duration-300 ${activeTier === i
                                    ? `${t.accent} border-current`
                                    : 'text-gray-400 border-transparent hover:text-gray-700'
                                    }`}
                            >
                                <span className="text-gray-300 font-[900]">{t.num}</span>
                                {t.name}
                            </button>
                        ))}
                    </div>

                    {/* Active tier detail */}
                    {(() => {
                        const t = tiers[activeTier];
                        return (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-gray-200 mb-24 reveal-up" key={activeTier}>
                                {/* Left — commission highlight */}
                                <div className="lg:col-span-4 bg-gray-950 p-10 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className={`w-1.5 h-1.5 ${t.accentBg}`} />
                                            <span className={`text-[0.6rem] font-[800] uppercase tracking-[0.25em] ${t.accent}`}>{t.tag}</span>
                                        </div>
                                        <h2 className="text-3xl font-[900] text-white tracking-tight leading-snug mb-4">
                                            {t.name}
                                        </h2>
                                        <div className="h-px bg-white/10 mb-6" />
                                        <p className="text-gray-400 text-sm font-[300] leading-relaxed mb-10">
                                            {t.desc}
                                        </p>
                                    </div>
                                    {/* Commission */}
                                    <div>
                                        <div className="text-[0.55rem] font-[800] uppercase tracking-[0.25em] text-gray-600 mb-2">Commission</div>
                                        <div className={`text-5xl font-[900] ${t.accent} tracking-tight leading-none mb-1`}>
                                            {t.commission}
                                        </div>
                                        <div className="text-gray-600 text-xs font-[500]">{t.commissionLabel}</div>

                                        <button
                                            onClick={() => {
                                                setForm(f => ({ ...f, tier: t.name }));
                                                document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className={`mt-8 w-full flex items-center justify-between ${t.accentBg} ${t.accentBg.includes('yellow') ? 'text-gray-900' : 'text-white'} px-6 py-4 text-xs font-[900] uppercase tracking-widest hover:opacity-90 transition-opacity group`}
                                        >
                                            Apply for This Tier
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                {/* Right — perks */}
                                <div className="lg:col-span-8 bg-white p-10">
                                    <div className="text-[0.6rem] font-[800] uppercase tracking-[0.25em] text-gray-400 mb-8">
                                        What's Included
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                                        {t.perks.map((perk, pi) => (
                                            <div key={pi} className="flex items-center gap-3 py-4 border-b border-gray-100 last:border-0 sm:last:border-0">
                                                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${t.accent}`} />
                                                <span className="text-gray-700 text-sm font-[600]">{perk}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Comparison strip */}
                                    <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-3 gap-4">
                                        {tiers.map((ot, oi) => (
                                            <div key={oi} className={`p-4 border ${oi === activeTier ? 'border-gray-900 bg-gray-50' : 'border-gray-100'} cursor-pointer hover:border-gray-300 transition-colors`} onClick={() => setActiveTier(oi)}>
                                                <div className={`text-[0.55rem] font-[800] uppercase tracking-widest ${ot.accent} mb-1`}>{ot.name}</div>
                                                <div className="text-lg font-[900] text-gray-900">{ot.commission}</div>
                                                <div className="text-[0.6rem] text-gray-400">{ot.commissionLabel}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </section>

            {/* ── PROCESS ─────────────────────────────────────────── */}
            <section className="py-0 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">How It Works</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-gray-100 pb-24 reveal-up">
                        {steps.map((s, i) => (
                            <div key={i} className={`p-8 border-b md:border-b-0 ${i < 3 ? 'md:border-r' : ''} border-gray-100 group hover:bg-gray-50 transition-colors duration-300`}>
                                <div className="text-[3.5rem] font-[900] text-gray-100 leading-none select-none mb-4">{s.num}</div>
                                <h4 className="font-[900] text-gray-900 text-lg mb-3">{s.title}</h4>
                                <div className="h-px w-6 bg-brand-blue mb-4 group-hover:w-14 transition-all duration-500" />
                                <p className="text-gray-400 text-sm font-[300] leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PARTNER LOGOS STRIP ─────────────────────────────── */}
            <section className="py-0 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-8 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">Trusted By</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-0 border-t border-gray-100 pb-10 reveal-up">
                        {['Tata Projects', 'L&T ECC', 'BHEL Solar', 'NTPC Green', 'SECI India', 'Adani Solar'].map((name, i) => (
                            <div key={i} className={`flex items-center justify-center py-8 px-4 ${i < 5 ? 'border-r border-gray-100' : ''} border-b md:border-b-0 border-gray-100`}>
                                <div className="text-center">
                                    <div className="text-[0.6rem] font-[900] uppercase tracking-[0.2em] text-gray-300">{name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── APPLICATION FORM ────────────────────────────────── */}
            <section id="partner-form" className="py-0 bg-gray-950">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-500 whitespace-nowrap">Apply Now</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24">

                        {/* Left copy */}
                        <div className="lg:col-span-4 reveal-up">
                            <div className="text-[0.65rem] font-[800] uppercase tracking-[0.25em] text-gray-600 mb-4">Partnership Application</div>
                            <h2 className="text-4xl md:text-5xl font-[900] text-white leading-[1.0] tracking-tight mb-6">
                                Start Your<br />
                                <span className="text-brand-yellow">Journey Today.</span>
                            </h2>
                            <p className="text-gray-500 text-base font-[300] leading-relaxed border-l border-white/10 pl-5 mb-10">
                                Fill in your details and our partnerships team will reach out within 48 hours with a customised onboarding plan.
                            </p>

                            {/* Contact alternatives */}
                            <div className="space-y-3">
                                <a href="tel:+919876543210" className="flex items-center gap-3 text-gray-500 hover:text-gray-300 transition-colors text-sm group">
                                    <div className="w-8 h-8 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                        <Phone className="w-3.5 h-3.5" />
                                    </div>
                                    +91 98765 43210
                                </a>
                                <a href="mailto:partners@ompowersolutions.com" className="flex items-center gap-3 text-gray-500 hover:text-gray-300 transition-colors text-sm group">
                                    <div className="w-8 h-8 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                        <Mail className="w-3.5 h-3.5" />
                                    </div>
                                    partners@ompowersolutions.com
                                </a>
                            </div>
                        </div>

                        {/* Right form */}
                        <div className="lg:col-span-8 reveal-up">

                            {/* Success */}
                            {formStatus === 'success' && (
                                <div className="mb-8 border-l-4 border-brand-green bg-brand-green/10 p-6 flex items-start gap-4">
                                    <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-[800] text-white text-sm mb-1">Application Received!</div>
                                        <p className="text-gray-400 text-xs font-[300]">Thank you for your interest. Our partnerships team will reach out within 48 hours.</p>
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {formStatus === 'error' && (
                                <div className="mb-8 border-l-4 border-red-500 bg-red-500/10 p-6 flex items-start gap-4">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-red-400 text-sm font-[300]">{formError}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-0">
                                {/* Row 1 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                                    {[
                                        { name: 'name', label: 'Full Name *', placeholder: 'Rajesh Sharma', type: 'text' },
                                        { name: 'email', label: 'Email Address *', placeholder: 'rajesh@company.com', type: 'email' },
                                        { name: 'phone', label: 'Phone Number *', placeholder: '+91 90000 00000', type: 'tel' },
                                        { name: 'company', label: 'Company / Firm', placeholder: 'Your company (if any)', type: 'text' },
                                        { name: 'city', label: 'City / Region *', placeholder: 'Delhi, Mumbai…', type: 'text' },
                                    ].map(f => (
                                        <div key={f.name} className="pb-8">
                                            <label className="block text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-gray-600 mb-1">{f.label}</label>
                                            <input
                                                name={f.name}
                                                type={f.type}
                                                value={(form as any)[f.name]}
                                                onChange={handleChange}
                                                onFocus={() => setFocused(f.name)}
                                                onBlur={() => setFocused(null)}
                                                placeholder={f.placeholder}
                                                className={`${inputBase} ${inputFocus(f.name)}`}
                                                required={f.label.includes('*')}
                                                disabled={formStatus === 'loading'}
                                            />
                                        </div>
                                    ))}

                                    {/* Tier select */}
                                    <div className="pb-8">
                                        <label className="block text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-gray-600 mb-1">Partnership Tier *</label>
                                        <select
                                            name="tier"
                                            value={form.tier}
                                            onChange={handleChange}
                                            onFocus={() => setFocused('tier')}
                                            onBlur={() => setFocused(null)}
                                            className={`${inputBase} ${inputFocus('tier')} bg-transparent appearance-none cursor-pointer`}
                                            disabled={formStatus === 'loading'}
                                        >
                                            {tiers.map(t => <option key={t.name} className="bg-gray-900">{t.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="pb-10">
                                    <label className="block text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-gray-600 mb-1">Tell Us About Yourself</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        onFocus={() => setFocused('message')}
                                        onBlur={() => setFocused(null)}
                                        rows={4}
                                        placeholder="Your current business, network size, target regions, prior solar experience…"
                                        className={`${inputBase} ${inputFocus('message')} resize-none`}
                                        disabled={formStatus === 'loading'}
                                    />
                                </div>

                                {/* Submit */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2 border-t border-white/10">
                                    <button
                                        type="submit"
                                        disabled={formStatus === 'loading'}
                                        className="inline-flex items-center gap-3 bg-brand-yellow text-gray-900 px-10 py-4 text-xs font-[900] uppercase tracking-widest hover:bg-yellow-400 transition-all group disabled:opacity-50"
                                    >
                                        {formStatus === 'loading' ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                                                Submitting…
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-3.5 h-3.5" />
                                                Submit Application
                                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-gray-700 text-[0.65rem] font-[400] leading-relaxed max-w-xs">
                                        We respond within 48 hours. Your data is confidential and never shared.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Partner;
