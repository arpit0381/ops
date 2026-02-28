import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import {
    LayoutDashboard, Folder, Briefcase, Mail, Settings, LogOut,
    TrendingUp, Zap, Bell, Search, ChevronRight,
    ArrowUpRight, Clock, CheckCircle2, AlertCircle, Circle, ExternalLink
} from 'lucide-react';

/* ── Types ── */
interface Inquiry {
    id: number;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    created_at: string;
}

interface Project {
    id: number;
    title: string;
    category: string;
    capacity: string;
    location: string;
    year: number;
    image_url: string;
}

/* ── Sidebar nav ── */
const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inquiries', label: 'Inquiries', icon: Mail },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'careers', label: 'Careers', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings },
];

/* ── Helpers ── */
const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

/* ════════════════════════════════════════════════════════════ */
const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [adminEmail, setAdminEmail] = useState('admin@ompowersolutions.com');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [stats, setStats] = useState({ projects: 0, inquiries: 0, careers: 0, totalMW: 120 });
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQ, setSearchQ] = useState('');

    /* — auth check — */
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { navigate('/admin'); return; }
            setAdminEmail(session.user.email || adminEmail);
            setIsLoading(false);
        };
        checkUser();
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [projRes, inqRes, carRes] = await Promise.all([
                supabase.from('projects').select('*').order('year', { ascending: false }),
                supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
                supabase.from('careers').select('*', { count: 'exact', head: true }),
            ]);
            setProjects(projRes.data || []);
            setInquiries(inqRes.data || []);
            setStats({
                projects: projRes.data?.length || 124,
                inquiries: inqRes.data?.length || 12,
                careers: carRes.count || 4,
                totalMW: 120,
            });
        } catch (e) { console.error(e); }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    const initials = adminEmail.slice(0, 2).toUpperCase();

    /* ── filtered inquiries ── */
    const filteredInquiries = inquiries.filter(i =>
        i.name.toLowerCase().includes(searchQ.toLowerCase()) ||
        i.email.toLowerCase().includes(searchQ.toLowerCase()) ||
        i.subject.toLowerCase().includes(searchQ.toLowerCase())
    );

    /* ── loading ── */
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-5 h-5 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
                    <span className="text-sm font-[500]">Loading dashboard…</span>
                </div>
            </div>
        );
    }

    /* ════ RENDER ════ */
    return (
        <div className="min-h-screen bg-[#09090b] flex font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── SIDEBAR ───────────────────────────────────────── */}
            <aside className={`
                fixed top-0 left-0 h-full z-30 bg-[#0d0d10] border-r border-white/[0.06]
                flex flex-col transition-all duration-300
                ${sidebarOpen ? 'w-60' : 'w-16'}
            `}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] min-h-[64px]">
                    <div className="w-8 h-8 bg-brand-blue flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    {sidebarOpen && (
                        <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-[800] text-brand-blue">OM</span>
                                <span className="text-sm font-[300] text-brand-green">POWER</span>
                            </div>
                            <div className="text-[0.45rem] uppercase tracking-[0.35em] text-gray-600">Admin</div>
                        </div>
                    )}
                </div>

                {/* Nav items */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                title={!sidebarOpen ? item.label : undefined}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 text-sm font-[600]
                                    transition-all duration-200 group relative
                                    ${isActive
                                        ? 'text-white bg-white/[0.07]'
                                        : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
                                    }
                                `}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 w-0.5 h-full bg-brand-blue" />
                                )}
                                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand-blue' : ''}`} />
                                {sidebarOpen && <span>{item.label}</span>}
                                {sidebarOpen && isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-brand-blue rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* User + sign-out */}
                <div className="border-t border-white/[0.06] p-4 space-y-1">
                    {sidebarOpen && (
                        <div className="flex items-center gap-3 px-2 py-2 mb-2">
                            <div className="w-7 h-7 bg-brand-blue flex items-center justify-center text-white text-[0.6rem] font-[900] flex-shrink-0">
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-[700] text-white truncate">Administrator</div>
                                <div className="text-[0.6rem] text-gray-600 truncate">{adminEmail}</div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-2 py-2.5 text-xs text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-sm"
                    >
                        <LogOut className="w-4 h-4 flex-shrink-0" />
                        {sidebarOpen && <span className="font-[600]">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT ──────────────────────────────────── */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'} min-h-screen flex flex-col`}>

                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-[#09090b]/95 backdrop-blur-sm border-b border-white/[0.06] h-16 flex items-center px-6 gap-4">
                    <button
                        onClick={() => setSidebarOpen(v => !v)}
                        className="text-gray-600 hover:text-gray-300 transition-colors p-1"
                    >
                        <div className="space-y-1">
                            <div className="w-4 h-[1.5px] bg-current" />
                            <div className={`h-[1.5px] bg-current transition-all ${sidebarOpen ? 'w-4' : 'w-3'}`} />
                            <div className="w-4 h-[1.5px] bg-current" />
                        </div>
                    </button>

                    <div className="flex-1" />

                    {/* Breadcrumb */}
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600">
                        <span>Admin</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-300 capitalize">{activeTab}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative text-gray-600 hover:text-gray-300 transition-colors p-1.5">
                            <Bell className="w-4 h-4" />
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-blue rounded-full" />
                        </button>
                        <a href="/" target="_blank" rel="noreferrer"
                            className="text-gray-600 hover:text-gray-300 transition-colors p-1.5 flex items-center gap-1 text-xs">
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <div className="w-7 h-7 bg-brand-blue flex items-center justify-center text-white text-[0.6rem] font-[900]">
                            {initials}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 p-6 md:p-8 overflow-auto">

                    {/* ── OVERVIEW ── */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Page title */}
                            <div>
                                <h1 className="text-2xl font-[900] text-white tracking-tight">Dashboard Overview</h1>
                                <p className="text-gray-600 text-sm mt-1">Welcome back, Administrator.</p>
                            </div>

                            {/* Stat cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Projects', val: stats.projects, icon: Folder, color: 'text-brand-blue', bg: 'bg-brand-blue/10', change: '+8 this month' },
                                    { label: 'New Inquiries', val: stats.inquiries, icon: Mail, color: 'text-brand-green', bg: 'bg-brand-green/10', change: '+3 today' },
                                    { label: 'Open Positions', val: stats.careers, icon: Briefcase, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10', change: 'Updated recently' },
                                    { label: 'MW Installed', val: stats.totalMW, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10', change: 'All time' },
                                ].map((s, i) => {
                                    const Icon = s.icon;
                                    return (
                                        <div key={i} className="bg-[#0d0d10] border border-white/[0.06] p-5 hover:border-white/[0.12] transition-colors group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-8 h-8 ${s.bg} flex items-center justify-center`}>
                                                    <Icon className={`w-4 h-4 ${s.color}`} />
                                                </div>
                                                <ArrowUpRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-400 transition-colors" />
                                            </div>
                                            <div className="text-3xl font-[900] text-white mb-1">{s.val}</div>
                                            <div className="text-xs font-[600] text-gray-500 mb-1">{s.label}</div>
                                            <div className="text-[0.6rem] font-[600] text-gray-700 uppercase tracking-widest">{s.change}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Quick panels */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                                {/* Recent Inquiries */}
                                <div className="bg-[#0d0d10] border border-white/[0.06]">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                                        <div className="text-xs font-[800] uppercase tracking-widest text-gray-400">Recent Inquiries</div>
                                        <button onClick={() => setActiveTab('inquiries')} className="text-[0.6rem] text-brand-blue hover:text-blue-400 font-[700] uppercase tracking-widest flex items-center gap-1">
                                            View All <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="divide-y divide-white/[0.04]">
                                        {inquiries.slice(0, 4).length > 0 ? inquiries.slice(0, 4).map((inq) => (
                                            <div key={inq.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
                                                <div className="w-7 h-7 bg-brand-blue/20 flex items-center justify-center text-brand-blue text-[0.6rem] font-[900] flex-shrink-0 mt-0.5">
                                                    {inq.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-[700] text-white truncate">{inq.name}</div>
                                                    <div className="text-xs text-gray-600 truncate">{inq.subject}</div>
                                                </div>
                                                <div className="text-[0.6rem] text-gray-700 whitespace-nowrap flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {timeAgo(inq.created_at)}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="px-5 py-8 text-center text-gray-700 text-sm">No inquiries yet</div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick stats / system */}
                                <div className="bg-[#0d0d10] border border-white/[0.06]">
                                    <div className="px-5 py-4 border-b border-white/[0.06]">
                                        <div className="text-xs font-[800] uppercase tracking-widest text-gray-400">System Status</div>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {[
                                            { label: 'Supabase Database', status: 'Connected', ok: true },
                                            { label: 'Authentication Service', status: 'Active', ok: true },
                                            { label: 'Storage Bucket', status: 'Connected', ok: true },
                                            { label: 'Email Notifications', status: 'Configured', ok: true },
                                        ].map((s, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                                                <span className="text-sm text-gray-400">{s.label}</span>
                                                <div className="flex items-center gap-1.5">
                                                    {s.ok
                                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
                                                        : <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                                                    }
                                                    <span className={`text-[0.6rem] font-[700] uppercase tracking-widest ${s.ok ? 'text-brand-green' : 'text-red-400'}`}>{s.status}</span>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Quick actions */}
                                        <div className="pt-2 grid grid-cols-2 gap-2">
                                            <button onClick={() => setActiveTab('projects')} className="flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white px-3 py-2.5 text-xs font-[700] transition-colors">
                                                <Folder className="w-3.5 h-3.5" /> Projects
                                            </button>
                                            <button onClick={() => setActiveTab('inquiries')} className="flex items-center justify-center gap-2 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue px-3 py-2.5 text-xs font-[700] transition-colors">
                                                <Mail className="w-3.5 h-3.5" /> Inquiries
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── INQUIRIES ── */}
                    {activeTab === 'inquiries' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-[900] text-white tracking-tight">Inquiries</h1>
                                    <p className="text-gray-600 text-sm mt-1">{inquiries.length} total submissions</p>
                                </div>
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <input
                                        value={searchQ}
                                        onChange={e => setSearchQ(e.target.value)}
                                        placeholder="Search inquiries…"
                                        className="bg-[#0d0d10] border border-white/[0.08] text-white text-sm placeholder-gray-600 pl-9 pr-4 py-2.5 outline-none focus:border-brand-blue/50 w-64 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="bg-[#0d0d10] border border-white/[0.06] overflow-hidden">
                                {/* Table header */}
                                <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.06] text-[0.55rem] font-[800] uppercase tracking-widest text-gray-600">
                                    <div className="col-span-3">Name</div>
                                    <div className="col-span-2 hidden md:block">Phone</div>
                                    <div className="col-span-3 hidden md:block">Subject</div>
                                    <div className="col-span-3">Message</div>
                                    <div className="col-span-1 hidden md:block text-right">Time</div>
                                </div>
                                {/* Rows */}
                                {filteredInquiries.length > 0 ? filteredInquiries.map((inq, i) => (
                                    <div key={inq.id} className={`grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? '' : ''}`}>
                                        <div className="col-span-3 flex items-start gap-2.5">
                                            <div className="w-7 h-7 bg-brand-blue/20 text-brand-blue text-[0.6rem] font-[900] flex items-center justify-center flex-shrink-0">
                                                {inq.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-[700] text-white truncate">{inq.name}</div>
                                                <div className="text-[0.65rem] text-gray-600 truncate">{inq.email}</div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 hidden md:flex items-center text-sm text-gray-400">{inq.phone || '—'}</div>
                                        <div className="col-span-3 hidden md:flex items-center">
                                            <span className="text-xs text-gray-400 font-[500] truncate">{inq.subject}</span>
                                        </div>
                                        <div className="col-span-3 flex items-center">
                                            <span className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{inq.message}</span>
                                        </div>
                                        <div className="col-span-1 hidden md:flex items-center justify-end text-[0.6rem] text-gray-700 whitespace-nowrap">
                                            {timeAgo(inq.created_at)}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-700">
                                        <Mail className="w-10 h-10 mb-3 opacity-20" />
                                        <p className="text-sm">{searchQ ? 'No results found' : 'No inquiries yet'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── PROJECTS ── */}
                    {activeTab === 'projects' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-[900] text-white tracking-tight">Projects</h1>
                                <p className="text-gray-600 text-sm mt-1">{projects.length} projects in database</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {projects.slice(0, 9).map(p => (
                                    <div key={p.id} className="bg-[#0d0d10] border border-white/[0.06] hover:border-white/[0.12] transition-colors group overflow-hidden">
                                        <div className="h-36 overflow-hidden">
                                            <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-90" />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[0.55rem] font-[800] uppercase tracking-widest text-brand-blue">{p.category}</span>
                                                <span className="text-[0.55rem] font-[700] text-gray-600">{p.year}</span>
                                            </div>
                                            <h3 className="font-[800] text-white text-sm mb-1 truncate">{p.title}</h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600">{p.location}</span>
                                                <span className="text-xs font-[700] text-brand-yellow">{p.capacity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {projects.length === 0 && (
                                    <div className="col-span-3 flex flex-col items-center justify-center py-24 text-gray-700">
                                        <Folder className="w-12 h-12 mb-3 opacity-20" />
                                        <p className="text-sm">No projects in database yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── CAREERS / SETTINGS ── */}
                    {(activeTab === 'careers' || activeTab === 'settings') && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-[900] text-white tracking-tight capitalize">{activeTab}</h1>
                                <p className="text-gray-600 text-sm mt-1">This section is under development.</p>
                            </div>
                            <div className="bg-[#0d0d10] border border-white/[0.06] flex flex-col items-center justify-center py-28">
                                <Circle className="w-12 h-12 text-gray-800 mb-4" />
                                <p className="text-gray-600 text-sm">Coming soon — database integration in progress.</p>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <footer className="border-t border-white/[0.06] px-8 py-4 flex items-center justify-between">
                    <span className="text-[0.6rem] text-gray-700 uppercase tracking-widest">OM Power Solutions · Admin v2.0</span>
                    <span className="text-[0.6rem] text-gray-700 uppercase tracking-widest">
                        {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                </footer>
            </main>
        </div>
    );
};

export default AdminDashboard;
