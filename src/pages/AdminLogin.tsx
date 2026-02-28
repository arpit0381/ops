import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { Lock, Mail, AlertCircle, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [focused, setFocused] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const fieldBase = `w-full bg-[#0f1117] border text-white text-sm placeholder-gray-600 px-4 py-3.5 outline-none transition-all duration-200 rounded-none`;
    const fieldBorder = (f: string) =>
        focused === f ? 'border-brand-blue' : 'border-white/10 hover:border-white/20';

    return (
        <div className="min-h-screen bg-[#09090b] flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── Left decorative panel ─── */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-[#0d0d10] overflow-hidden">
                {/* Background solar image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&auto=format&fit=crop')" }}
                />
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }}
                />
                {/* Glow */}
                <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Logo */}
                <div className="relative z-10" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-[800] text-brand-blue">OM</span>
                        <span className="text-3xl font-[300] text-brand-green">POWER</span>
                    </div>
                    <div className="text-[0.55rem] font-[600] uppercase tracking-[0.5em] text-gray-500 mt-1">SOLUTION</div>
                </div>

                {/* Center quote */}
                <div className="relative z-10 space-y-6">
                    <div className="w-8 h-[3px] bg-brand-yellow" />
                    <p className="text-2xl md:text-3xl font-[300] text-white leading-relaxed">
                        "Engineering India's solar future —<br />
                        <span className="font-[700] text-brand-yellow">one megawatt at a time.</span>"
                    </p>
                    <p className="text-gray-500 text-sm">OM Power Solutions Admin Portal · Restricted Access</p>
                </div>

                {/* Bottom stats */}
                <div className="relative z-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                    {[
                        { val: '500+', label: 'Projects' },
                        { val: '120 MW', label: 'Installed' },
                        { val: '1,500+', label: 'Clients' },
                    ].map((s, i) => (
                        <div key={i}>
                            <div className="text-xl font-[900] text-white">{s.val}</div>
                            <div className="text-[0.6rem] uppercase tracking-widest text-gray-500 mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right login panel ─── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
                <div className="absolute inset-0 bg-[#09090b]" />

                <div className="relative z-10 w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden mb-10" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-[800] text-brand-blue">OM</span>
                            <span className="text-2xl font-[300] text-brand-green">POWER</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/20 px-3 py-1 mb-5">
                            <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-pulse" />
                            <span className="text-[0.6rem] font-[800] uppercase tracking-widest text-brand-blue">Secure Admin Portal</span>
                        </div>
                        <h1 className="text-3xl font-[900] text-white tracking-tight mb-2">Sign In</h1>
                        <p className="text-gray-500 text-sm font-[300]">
                            Enter your administrative credentials to access the dashboard.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 border-l-4 border-red-500 bg-red-500/10 p-4 flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-400 text-sm font-[400]">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-gray-500 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onFocus={() => setFocused('email')}
                                    onBlur={() => setFocused(null)}
                                    placeholder="admin@ompowersolutions.com"
                                    className={`${fieldBase} ${fieldBorder('email')} pl-11`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[0.6rem] font-[800] uppercase tracking-[0.2em] text-gray-500 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused(null)}
                                    placeholder="••••••••••••"
                                    className={`${fieldBase} ${fieldBorder('password')} pl-11 pr-12`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-between bg-brand-blue text-white px-6 py-4 text-xs font-[900] uppercase tracking-widest hover:bg-brand-blue/90 transition-all group disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-3 mx-auto">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating…
                                </span>
                            ) : (
                                <>
                                    Sign In to Dashboard
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer warning */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-start gap-3">
                        <Zap className="w-3.5 h-3.5 text-brand-yellow flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600 text-[0.65rem] leading-relaxed">
                            Unauthorised access is strictly prohibited and will be reported. All login activity is logged and monitored.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
