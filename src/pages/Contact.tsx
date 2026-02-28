import React, { useState, useEffect, useRef } from 'react';
import {
    Mail, Phone, MapPin, Send, CheckCircle,
    AlertCircle, ArrowRight, MessageSquare
} from 'lucide-react';
import { supabase } from '../supabase/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SUBJECTS = [
    'New Solar Installation',
    'Maintenance Request (O&M)',
    'Consultation Appointment',
    'Product / Pricing Inquiry',
    'Government / Tender Project',
    'Career Inquiry',
    'Other',
];

const Contact: React.FC = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '',
        subject: SUBJECTS[0], message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const { error } = await supabase.from('inquiries').insert([{
                name: formData.name, email: formData.email,
                phone: formData.phone, subject: formData.subject,
                message: formData.message,
            }]);
            if (error) throw error;
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });
            setTimeout(() => setStatus('idle'), 6000);
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        }
    };

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

    const inputBase = `w-full bg-transparent border-b border-gray-200 py-4 text-gray-900 text-sm font-[400] placeholder-gray-300 outline-none transition-all duration-300`;
    const inputFocused = (field: string) => focusedField === field ? 'border-gray-900' : 'border-gray-200';

    return (
        <div className="bg-white font-sans overflow-x-hidden" ref={pageRef}>

            {/* ── HERO ───────────────────────────────────────────── */}
            <section className="pt-40 pb-0 bg-white overflow-hidden">
                <div className="container mx-auto px-6 max-w-7xl">

                    {/* Rule + label */}
                    <div className="flex items-center gap-5 mb-14">
                        <div className="h-px flex-1 bg-gray-200 hero-line" />
                        <span className="hero-line text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">
                            Contact · OM Power Solutions
                        </span>
                        <div className="h-px flex-1 bg-gray-200 hero-line" />
                    </div>

                    {/* Headlines */}
                    <div className="overflow-hidden mb-3">
                        <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-gray-900 uppercase">
                            Let's Build
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-3 flex items-end gap-6">
                        <h1 className="hero-line text-[clamp(3rem,8vw,7rem)] font-[900] leading-[0.9] tracking-[-0.03em] text-gray-900 uppercase">
                            Something
                        </h1>
                        <div className="hero-line hidden md:block mb-2 border-l-2 border-brand-blue pl-5 max-w-xs flex-shrink-0">
                            <p className="text-gray-500 text-base font-[300] leading-snug">
                                Free site survey. Free system design. Free ROI estimate. No commitment required.
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

                    {/* KPI / contact quick row */}
                    <div className="grid grid-cols-3 border-t border-gray-100 hero-line">
                        {[
                            { val: '24 hrs', label: 'Response Guarantee' },
                            { val: 'Free', label: 'Site Survey & Design' },
                            { val: '18 States', label: 'Service Coverage' },
                        ].map((s, i) => (
                            <div key={i} className={`py-8 px-4 md:px-8 ${i < 2 ? 'border-r border-gray-100' : ''}`}>
                                <div className="text-2xl md:text-3xl font-[900] text-gray-900 tracking-tight">{s.val}</div>
                                <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-400 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTACT GRID ──────────────────────────────── */}
            <section className="py-0 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">
                            Get In Touch
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24">

                        {/* ─ Left info panel ─ */}
                        <div className="lg:col-span-4 reveal-up space-y-0">

                            {/* Info rows */}
                            {[
                                {
                                    icon: MapPin,
                                    label: 'Head Office',
                                    accent: 'bg-brand-blue',
                                    lines: ['123 Solar Avenue, Green Business Park,', 'Phase-1, New Delhi, India — 110001'],
                                },
                                {
                                    icon: Phone,
                                    label: 'Phone',
                                    accent: 'bg-brand-green',
                                    lines: ['+91 98765 43210', '+91 011 4567 8900'],
                                },
                                {
                                    icon: Mail,
                                    label: 'Email',
                                    accent: 'bg-brand-yellow',
                                    lines: ['info@ompowersolutions.com', 'support@ompowersolutions.com'],
                                },
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div key={i} className="flex items-start gap-5 py-7 border-b border-gray-100 last:border-b-0 group">
                                        <div className={`w-9 h-9 flex-shrink-0 ${item.accent} flex items-center justify-center mt-0.5`}>
                                            <Icon className={`w-4 h-4 ${item.accent.includes('yellow') ? 'text-gray-900' : 'text-white'}`} />
                                        </div>
                                        <div>
                                            <div className="text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-gray-400 mb-2">
                                                {item.label}
                                            </div>
                                            {item.lines.map((line, li) => (
                                                <div key={li} className="text-gray-700 text-sm font-[400] leading-relaxed">
                                                    {line}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Quick actions */}
                            <div className="pt-10 space-y-3">
                                <a
                                    href="https://wa.me/919876543210"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between gap-3 border border-gray-200 px-5 py-4 hover:border-gray-900 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-4 h-4 text-[#25D366]" />
                                        <span className="text-sm font-[700] text-gray-900">Chat on WhatsApp</span>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                                </a>
                                <a
                                    href="tel:+919876543210"
                                    className="flex items-center justify-between gap-3 bg-brand-blue px-5 py-4 hover:bg-brand-blue/90 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-white" />
                                        <span className="text-sm font-[700] text-white">Call Us Directly</span>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                                </a>
                            </div>

                            {/* Office hours */}
                            <div className="pt-8 border-t border-gray-100 mt-6">
                                <div className="text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-gray-400 mb-4">Office Hours</div>
                                {[
                                    { day: 'Mon – Fri', time: '9:00 AM – 7:00 PM' },
                                    { day: 'Saturday', time: '10:00 AM – 4:00 PM' },
                                    { day: 'Sunday', time: 'Closed' },
                                ].map((h, i) => (
                                    <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-b-0">
                                        <span className="text-xs font-[600] text-gray-500">{h.day}</span>
                                        <span className="text-xs font-[700] text-gray-900">{h.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ─ Right form panel ─ */}
                        <div className="lg:col-span-8 reveal-up">

                            {/* Success state */}
                            {status === 'success' && (
                                <div className="mb-8 border-l-4 border-brand-green bg-brand-green/5 p-6 flex items-start gap-4">
                                    <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-[800] text-gray-900 text-sm mb-1">Message Sent Successfully</div>
                                        <p className="text-gray-500 text-xs font-[300]">Our team will respond within 24 hours. You may also call us directly for urgent requirements.</p>
                                    </div>
                                </div>
                            )}

                            {/* Error state */}
                            {status === 'error' && (
                                <div className="mb-8 border-l-4 border-red-400 bg-red-50 p-6 flex items-start gap-4">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-[800] text-gray-900 text-sm mb-1">Submission Failed</div>
                                        <p className="text-gray-500 text-xs font-[300]">{errorMsg}</p>
                                    </div>
                                </div>
                            )}

                            {/* Form header */}
                            <div className="mb-10">
                                <div className="text-[3rem] font-[900] text-gray-100 leading-none select-none mb-1">→</div>
                                <h2 className="text-3xl md:text-4xl font-[900] text-gray-900 tracking-tight leading-snug">
                                    Send Us an Inquiry
                                </h2>
                                <p className="text-gray-400 text-sm font-[300] mt-2">All fields marked with * are required.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-0">
                                {/* Row 1: Name + Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                                    <div className="pb-8">
                                        <label className="text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-gray-400 block mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            type="text"
                                            placeholder="Rajesh Sharma"
                                            className={`${inputBase} ${inputFocused('name')}`}
                                            required
                                            disabled={status === 'loading'}
                                        />
                                    </div>
                                    <div className="pb-8">
                                        <label className="text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-gray-400 block mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            type="email"
                                            placeholder="rajesh@company.com"
                                            className={`${inputBase} ${inputFocused('email')}`}
                                            required
                                            disabled={status === 'loading'}
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Phone + Subject */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                                    <div className="pb-8">
                                        <label className="text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-gray-400 block mb-1">
                                            Phone Number *
                                        </label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('phone')}
                                            onBlur={() => setFocusedField(null)}
                                            type="tel"
                                            placeholder="+91 90000 00000"
                                            className={`${inputBase} ${inputFocused('phone')}`}
                                            required
                                            disabled={status === 'loading'}
                                        />
                                    </div>
                                    <div className="pb-8">
                                        <label className="text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-gray-400 block mb-1">
                                            Subject *
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('subject')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`${inputBase} ${inputFocused('subject')} bg-white appearance-none cursor-pointer`}
                                            disabled={status === 'loading'}
                                        >
                                            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="pb-10">
                                    <label className="text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-gray-400 block mb-1">
                                        Your Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        rows={5}
                                        placeholder="Tell us about your property, energy requirements, and what you'd like to achieve…"
                                        className={`${inputBase} ${inputFocused('message')} resize-none`}
                                        required
                                        disabled={status === 'loading'}
                                    />
                                </div>

                                {/* Submit row */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="inline-flex items-center gap-3 bg-brand-blue text-white px-10 py-4 text-xs font-[900] uppercase tracking-widest hover:bg-brand-blue/90 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-3.5 h-3.5" />
                                                Send Inquiry
                                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-gray-400 text-[0.65rem] font-[400] leading-relaxed max-w-xs">
                                        By submitting, you agree to be contacted by OM Power Solutions. We never share your data.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MAP ────────────────────────────────────────────── */}
            <section className="py-0">
                <div className="container mx-auto px-6 max-w-7xl pb-0">
                    <div className="flex items-center gap-5 py-10 reveal-up">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">Find Us</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>
                </div>
                <div className="w-full reveal-up" style={{ height: '420px' }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d3502.502859187313!2d77.207908!3d28.614603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUyLjYiTiA3N8KwMTInMjguNSJF!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'grayscale(0.3) contrast(1.05)' }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="OM Power Solutions — New Delhi Office"
                    />
                </div>
            </section>

            {/* ── OFFICES STRIP ──────────────────────────────────── */}
            <section className="py-0 bg-gray-950">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-5 py-10">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-500 whitespace-nowrap">Our Offices</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 pb-16">
                        {[
                            { city: 'New Delhi', role: 'Registered & Head Office', addr: '123 Solar Avenue, Green Business Park, Phase-1, New Delhi — 110001', accent: 'bg-brand-blue' },
                            { city: 'Mumbai', role: 'Western Region Office', addr: 'Plot 45, MIDC Industrial Area, Andheri East, Mumbai — 400093', accent: 'bg-brand-green' },
                            { city: 'Bangalore', role: 'Southern Region Office', addr: '7th Floor, Prestige Tower, MG Road, Bangalore — 560001', accent: 'bg-brand-yellow' },
                        ].map((office, i) => (
                            <div key={i} className={`p-8 md:p-10 border-t border-white/10 ${i < 2 ? 'md:border-r md:border-r-white/10' : ''} group hover:bg-white/5 transition-colors duration-300`}>
                                <div className={`w-1.5 h-1.5 ${office.accent} mb-6`} />
                                <div className="text-[0.6rem] font-[800] uppercase tracking-[0.25em] text-gray-500 mb-2">{office.role}</div>
                                <h3 className="text-xl font-[900] text-white mb-3">{office.city}</h3>
                                <p className="text-gray-500 text-xs font-[300] leading-relaxed">{office.addr}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Contact;
