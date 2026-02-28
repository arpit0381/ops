import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import {
    LayoutDashboard, Folder, Briefcase, Mail, Settings, LogOut,
    TrendingUp, Zap, Bell, Search, ChevronRight,
    ArrowUpRight, Clock, CheckCircle2, AlertCircle, ExternalLink,
    Plus, Upload, X, MessageSquare
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

interface Service {
    id: number;
    title: string;
    description: string;
    icon: string;
    image_url: string;
    color: string;
    created_at: string;
}

interface Product {
    id: number;
    name: string;
    category: string;
    description: string;
    specs: string;
    image_url: string;
    brochure_url: string;
    created_at: string;
}

interface PartnerInquiry {
    id: number;
    name: string;
    company_name: string;
    email: string;
    phone: string;
    location: string;
    partnership_type: string;
    message: string;
    status: string;
    created_at: string;
}

interface Testimonial {
    id: number;
    client_name: string;
    company: string;
    testimonial: string;
    rating: number;
    image_url: string;
    created_at: string;
}

/* ── Sidebar nav ── */
const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inquiries', label: 'Inquiries', icon: Mail },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'services', label: 'Services', icon: Zap },
    { id: 'products', label: 'Products', icon: Folder },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'partners', label: 'Partners', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings },
];

/* ── Helpers ── */
export const uploadToCloudinary = async (file: File) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset || cloudName.includes('your_cloud_name')) {
        throw new Error("Cloudinary not configured in .env.local");
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    });
    const data = await res.json();
    if (!data.secure_url) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
};
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

    const [stats, setStats] = useState({ projects: 0, inquiries: 0, partners: 0 });
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [partners, setPartners] = useState<PartnerInquiry[]>([]);
    const [searchQ, setSearchQ] = useState('');

    /* ── Project modal state ── */
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '', category: 'Commercial', capacity: '', location: '', year: new Date().getFullYear(), imageFile: null as File | null, imagePreview: ''
    });
    const [isSubmittingP, setIsSubmittingP] = useState(false);

    /* ── Service modal state ── */
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
    const [newService, setNewService] = useState({
        title: '', description: '', icon: 'Zap', color: 'blue', imageFile: null as File | null, imagePreview: ''
    });
    const [isSubmittingS, setIsSubmittingS] = useState(false);

    /* ── Product modal state ── */
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [newProduct, setNewProduct] = useState({
        name: '', category: 'Solar Panels', description: '', specs: '', imageFile: null as File | null, imagePreview: ''
    });
    const [isSubmittingProd, setIsSubmittingProd] = useState(false);

    /* ── Testimonial modal state ── */
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
    const [newTestimonial, setNewTestimonial] = useState({
        client_name: '', company: '', testimonial: '', rating: 5, imageFile: null as File | null, imagePreview: ''
    });
    const [isSubmittingT, setIsSubmittingT] = useState(false);

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
            const [projRes, inqRes, srvRes, prodRes, testRes, partRes] = await Promise.all([
                supabase.from('projects').select('*').order('year', { ascending: false }),
                supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
                supabase.from('services').select('*').order('created_at', { ascending: true }),
                supabase.from('products').select('*').order('created_at', { ascending: false }),
                supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
                supabase.from('partner_inquiries').select('*').order('created_at', { ascending: false }),
            ]);
            setProjects(projRes.data || []);
            setInquiries(inqRes.data || []);
            setServices(srvRes.data || []);
            setProducts(prodRes.data || []);
            setTestimonials(testRes.data || []);
            setPartners(partRes.data || []);
            setStats({
                projects: projRes.data?.length || 0,
                inquiries: inqRes.data?.length || 0,
                partners: partRes.data?.length || 0,
            });
        } catch (e) { console.error(e); }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNewProject(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProject.title || !newProject.imageFile) return alert('Title and Image required.');

        setIsSubmittingP(true);
        try {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset || cloudName.includes('your_cloud_name')) {
                throw new Error("Cloudinary not configured. Please add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env.local file.");
            }

            // 1. Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', newProject.imageFile);
            formData.append('upload_preset', uploadPreset);

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();
            if (!uploadData.secure_url) throw new Error(uploadData.error?.message || "Image upload failed");

            // 2. Insert text details & image URL to Supabase
            const { error, data } = await supabase.from('projects').insert([{
                title: newProject.title,
                category: newProject.category,
                capacity: newProject.capacity,
                location: newProject.location,
                year: newProject.year,
                image_url: uploadData.secure_url
            }]).select();

            if (error) throw error;
            if (data) {
                setProjects(prev => [data[0], ...prev]);
                setStats(prev => ({ ...prev, projects: prev.projects + 1 }));
            }
            setIsProjectModalOpen(false);
            setNewProject({ title: '', category: 'Commercial', capacity: '', location: '', year: new Date().getFullYear(), imageFile: null, imagePreview: '' });
        } catch (error: any) {
            alert(error.message || 'Error creating project');
        } finally {
            setIsSubmittingP(false);
        }
    };

    const handleImageUploadService = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNewService(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    };

    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newService.title || (!newService.imageFile && !editingServiceId)) return alert('Title and Image required.');
        setIsSubmittingS(true);
        try {
            let imageUrl = newService.imagePreview; // fallback to existing for edit
            if (newService.imageFile) {
                imageUrl = await uploadToCloudinary(newService.imageFile);
            }

            if (editingServiceId) {
                const { error, data } = await supabase.from('services').update({
                    title: newService.title,
                    description: newService.description,
                    icon: newService.icon,
                    color: newService.color,
                    image_url: imageUrl
                }).eq('id', editingServiceId).select();
                if (error) throw error;
                if (data) setServices(prev => prev.map(s => s.id === editingServiceId ? data[0] : s));
            } else {
                const { error, data } = await supabase.from('services').insert([{
                    title: newService.title,
                    description: newService.description,
                    icon: newService.icon,
                    color: newService.color,
                    image_url: imageUrl
                }]).select();
                if (error) throw error;
                if (data) setServices(prev => [data[0], ...prev]);
            }
            setIsServiceModalOpen(false);
            setEditingServiceId(null);
            setNewService({ title: '', description: '', icon: 'Zap', color: 'blue', imageFile: null, imagePreview: '' });
        } catch (error: any) { alert(error.message || 'Error saving service'); }
        finally { setIsSubmittingS(false); }
    };

    const handleImageUploadProduct = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNewProduct(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProduct.name || (!newProduct.imageFile && !editingProductId)) return alert('Name and Image required.');
        setIsSubmittingProd(true);
        try {
            let imageUrl = newProduct.imagePreview; // existing image url if editing and no new file
            if (newProduct.imageFile) {
                imageUrl = await uploadToCloudinary(newProduct.imageFile);
            }

            if (editingProductId) {
                const { error, data } = await supabase.from('products').update({
                    name: newProduct.name,
                    category: newProduct.category,
                    description: newProduct.description,
                    specs: newProduct.specs,
                    image_url: imageUrl
                }).eq('id', editingProductId).select();
                if (error) throw error;
                if (data) setProducts(prev => prev.map(p => p.id === editingProductId ? data[0] : p));
            } else {
                const { error, data } = await supabase.from('products').insert([{
                    name: newProduct.name,
                    category: newProduct.category,
                    description: newProduct.description,
                    specs: newProduct.specs,
                    image_url: imageUrl
                }]).select();
                if (error) throw error;
                if (data) setProducts(prev => [data[0], ...prev]);
            }
            setIsProductModalOpen(false);
            setEditingProductId(null);
            setNewProduct({ name: '', category: 'Solar Panels', description: '', specs: '', imageFile: null, imagePreview: '' });
        } catch (error: any) { alert(error.message || 'Error saving product'); }
        finally { setIsSubmittingProd(false); }
    };

    const handleImageUploadTestimonial = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNewTestimonial(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    };

    const handleCreateTestimonial = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTestimonial.client_name || !newTestimonial.testimonial) return alert('Name and Testimonial required.');
        setIsSubmittingT(true);
        try {
            let imageUrl = newTestimonial.imagePreview || '';
            if (newTestimonial.imageFile) {
                imageUrl = await uploadToCloudinary(newTestimonial.imageFile);
            }

            if (editingTestimonialId) {
                const { error, data } = await supabase.from('testimonials').update({
                    client_name: newTestimonial.client_name,
                    company: newTestimonial.company,
                    testimonial: newTestimonial.testimonial,
                    rating: newTestimonial.rating,
                    image_url: imageUrl
                }).eq('id', editingTestimonialId).select();
                if (error) throw error;
                if (data) setTestimonials(prev => prev.map(t => t.id === editingTestimonialId ? data[0] : t));
            } else {
                const { error, data } = await supabase.from('testimonials').insert([{
                    client_name: newTestimonial.client_name,
                    company: newTestimonial.company,
                    testimonial: newTestimonial.testimonial,
                    rating: newTestimonial.rating,
                    image_url: imageUrl
                }]).select();
                if (error) throw error;
                if (data) setTestimonials(prev => [data[0], ...prev]);
            }
            setIsTestimonialModalOpen(false);
            setEditingTestimonialId(null);
            setNewTestimonial({ client_name: '', company: '', testimonial: '', rating: 5, imageFile: null, imagePreview: '' });
        } catch (error: any) { alert(error.message || 'Error saving testimonial'); }
        finally { setIsSubmittingT(false); }
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
                                    { label: 'Partner Requests', val: stats.partners, icon: Briefcase, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10', change: 'Updated recently' },
                                    { label: 'Total Services', val: services.length, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10', change: 'All time' },
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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-[900] text-white tracking-tight">Projects</h1>
                                    <p className="text-gray-600 text-sm mt-1">{projects.length} projects in database</p>
                                </div>
                                <button
                                    onClick={() => setIsProjectModalOpen(true)}
                                    className="flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 text-sm font-[800] uppercase tracking-widest hover:bg-blue-600 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add Project
                                </button>
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

                            {/* ── NEW PROJECT MODAL ── */}
                            {isProjectModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSubmittingP && setIsProjectModalOpen(false)} />
                                    <div className="relative bg-[#0d0d10] border border-white/[0.06] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                                            <h2 className="text-lg font-[800] text-white tracking-tight">Add New Project</h2>
                                            <button onClick={() => !isSubmittingP && setIsProjectModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="p-6 overflow-y-auto">
                                            <form id="project-form" onSubmit={handleCreateProject} className="space-y-5">
                                                {/* Image Upload */}
                                                <div>
                                                    <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-2">Project Image</label>
                                                    <div className="border border-dashed border-white/[0.1] hover:border-brand-blue/50 transition-colors p-4 flex flex-col items-center justify-center min-h-[160px] relative mt-1 bg-white/[0.02] group">
                                                        {newProject.imagePreview ? (
                                                            <div className="relative w-full h-40">
                                                                <img src={newProject.imagePreview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <span className="text-white text-xs font-[600] uppercase tracking-widest bg-black/60 px-3 py-1.5 backdrop-blur-sm">Click to change</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <Upload className="w-8 h-8 text-gray-600 mb-2 group-hover:text-brand-blue group-hover:-translate-y-1 transition-all duration-300" />
                                                                <span className="text-sm font-[600] text-gray-400">Drag & drop or click to upload</span>
                                                                <span className="text-[0.6rem] text-gray-500 mt-1 uppercase tracking-widest font-[700]">Powered by Cloudinary</span>
                                                            </>
                                                        )}
                                                        <input required={!newProject.imageFile} disabled={isSubmittingP} type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer p-0 m-0" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-5">
                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Project Title</label>
                                                        <input disabled={isSubmittingP} required type="text" value={newProject.title} onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2.5 text-white text-sm outline-none focus:border-brand-blue/50 transition-colors" placeholder="e.g. 5 MWp Solar Plant for RBA Textiles" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
                                                        <select disabled={isSubmittingP} value={newProject.category} onChange={e => setNewProject(p => ({ ...p, category: e.target.value }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2.5 text-white text-sm outline-none focus:border-brand-blue/50 transition-colors appearance-none cursor-pointer">
                                                            <option value="Commercial">Commercial</option>
                                                            <option value="Industrial">Industrial</option>
                                                            <option value="Residential">Residential</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Capacity</label>
                                                        <input disabled={isSubmittingP} required type="text" value={newProject.capacity} onChange={e => setNewProject(p => ({ ...p, capacity: e.target.value }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2.5 text-white text-sm outline-none focus:border-brand-blue/50 transition-colors" placeholder="e.g. 1.2 MW" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Location</label>
                                                        <input disabled={isSubmittingP} required type="text" value={newProject.location} onChange={e => setNewProject(p => ({ ...p, location: e.target.value }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2.5 text-white text-sm outline-none focus:border-brand-blue/50 transition-colors" placeholder="e.g. Pune, Maharashtra" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Completion Year</label>
                                                        <input disabled={isSubmittingP} required type="number" value={newProject.year} onChange={e => setNewProject(p => ({ ...p, year: Number(e.target.value) }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2.5 text-white text-sm outline-none focus:border-brand-blue/50 transition-colors" />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="p-5 border-t border-white/[0.06] flex items-center justify-end gap-3 bg-[#09090b]">
                                            <button disabled={isSubmittingP} type="button" onClick={() => setIsProjectModalOpen(false)} className="px-5 py-2.5 text-sm font-[700] text-gray-400 hover:text-white transition-colors uppercase tracking-widest disabled:opacity-50">
                                                Cancel
                                            </button>
                                            <button form="project-form" disabled={isSubmittingP} type="submit" className="flex items-center gap-2 bg-brand-blue text-white px-6 py-2.5 text-sm font-[800] uppercase tracking-widest hover:bg-blue-600 transition-colors disabled:opacity-50">
                                                {isSubmittingP ? (
                                                    <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                                                ) : 'Save Project'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SERVICES ── */}
                    {activeTab === 'services' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-[900] text-white tracking-tight">Services</h1>
                                    <p className="text-gray-600 text-sm mt-1">{services.length} services in database</p>
                                </div>
                                <button onClick={() => {
                                    setEditingServiceId(null);
                                    setNewService({ title: '', description: '', icon: 'Zap', color: 'blue', imageFile: null, imagePreview: '' });
                                    setIsServiceModalOpen(true);
                                }} className="flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 text-sm font-[800] uppercase tracking-widest hover:bg-blue-600 transition-colors">
                                    <Plus className="w-4 h-4" /> Add Service
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {services.map(s => (
                                    <div key={s.id} className="bg-[#0d0d10] border border-white/[0.06] p-4 flex flex-col justify-between group">
                                        <div className="flex gap-4 mb-3">
                                            <div className="w-16 h-16 bg-white/[0.02] flex items-center justify-center flex-shrink-0">
                                                {s.image_url ? <img src={s.image_url} alt={s.title} className="w-full h-full object-cover opacity-60" /> : <Zap className="w-6 h-6 text-brand-blue opacity-50" />}
                                            </div>
                                            <div>
                                                <h3 className="font-[800] text-white text-sm mb-1">{s.title}</h3>
                                                <p className="text-xs text-gray-500 line-clamp-2">{s.description}</p>
                                            </div>
                                        </div>
                                        <div className="border-t border-white/[0.06] pt-3 mt-auto flex justify-end">
                                            <button onClick={() => {
                                                setEditingServiceId(s.id);
                                                setNewService({ title: s.title, description: s.description, icon: s.icon, color: s.color, imageFile: null, imagePreview: s.image_url });
                                                setIsServiceModalOpen(true);
                                            }} className="text-[0.65rem] font-[800] uppercase tracking-widest text-brand-blue hover:text-blue-400">Edit Service</button>
                                        </div>
                                    </div>
                                ))}
                                {services.length === 0 && (
                                    <div className="col-span-3 flex flex-col items-center justify-center py-20 text-gray-700"><Zap className="w-10 h-10 mb-3 opacity-20" /><p className="text-sm">No services yet.</p></div>
                                )}
                            </div>

                            {/* Service Modal */}
                            {isServiceModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSubmittingS && setIsServiceModalOpen(false)} />
                                    <div className="relative bg-[#0d0d10] border border-white/[0.06] w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
                                        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                                            <h2 className="text-lg font-[800] text-white">Add Service</h2>
                                            <button onClick={() => setIsServiceModalOpen(false)}><X className="w-5 h-5 text-gray-500 hover:text-white" /></button>
                                        </div>
                                        <div className="p-6 overflow-y-auto">
                                            <form id="service-form" onSubmit={handleCreateService} className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-2">Service Banner Image</label>
                                                    <input required disabled={isSubmittingS} type="file" accept="image/*" onChange={handleImageUploadService} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-[700] file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Title</label>
                                                    <input required disabled={isSubmittingS} value={newService.title} onChange={e => setNewService(p => ({ ...p, title: e.target.value }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2 text-white text-sm focus:border-brand-blue/50" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Description</label>
                                                    <textarea required disabled={isSubmittingS} value={newService.description} onChange={e => setNewService(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2 text-white text-sm focus:border-brand-blue/50 min-h-[80px]" />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
                                            <button disabled={isSubmittingS} type="submit" form="service-form" className="bg-brand-blue text-white px-6 py-2.5 text-sm font-[800] uppercase tracking-widest hover:bg-blue-600 disabled:opacity-50">
                                                {isSubmittingS ? 'Uploading...' : 'Save Service'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── PRODUCTS ── */}
                    {activeTab === 'products' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-[900] text-white tracking-tight">Products</h1>
                                    <p className="text-gray-600 text-sm mt-1">{products.length} products in database</p>
                                </div>
                                <button onClick={() => {
                                    setEditingProductId(null);
                                    setNewProduct({ name: '', category: 'Solar Panels', description: '', specs: '', imageFile: null, imagePreview: '' });
                                    setIsProductModalOpen(true);
                                }} className="flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 text-sm font-[800] uppercase tracking-widest hover:bg-blue-600">
                                    <Plus className="w-4 h-4" /> Add Product
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {products.map(p => (
                                    <div key={p.id} className="bg-[#0d0d10] border border-white/[0.06] overflow-hidden flex flex-col group">
                                        <div className="h-40 bg-white/[0.02]">
                                            {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" /> : null}
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[0.55rem] font-[800] uppercase tracking-widest text-brand-green">{p.category}</span>
                                            </div>
                                            <h3 className="font-[800] text-white text-sm truncate mb-3">{p.name}</h3>
                                            <div className="border-t border-white/[0.06] pt-3 mt-auto flex justify-end">
                                                <button onClick={() => {
                                                    setEditingProductId(p.id);
                                                    setNewProduct({ name: p.name, category: p.category, description: p.description, specs: p.specs, imageFile: null, imagePreview: p.image_url });
                                                    setIsProductModalOpen(true);
                                                }} className="text-[0.65rem] font-[800] uppercase tracking-widest text-brand-green hover:text-green-400">Edit Product</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {products.length === 0 && (
                                    <div className="col-span-full py-20 text-center text-gray-700 text-sm">No products found</div>
                                )}
                            </div>

                            {/* Product Modal */}
                            {isProductModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSubmittingProd && setIsProductModalOpen(false)} />
                                    <div className="relative bg-[#0d0d10] border border-white/[0.06] w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
                                        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                                            <h2 className="text-lg font-[800] text-white">Add Product</h2>
                                            <button onClick={() => setIsProductModalOpen(false)}><X className="w-5 h-5 text-gray-500 hover:text-white" /></button>
                                        </div>
                                        <div className="p-6 overflow-y-auto">
                                            <form id="product-form" onSubmit={handleCreateProduct} className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-2">Product Image</label>
                                                    <input required disabled={isSubmittingProd} type="file" accept="image/*" onChange={handleImageUploadProduct} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-[700] file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Name</label>
                                                        <input required disabled={isSubmittingProd} value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2 text-white text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
                                                        <select disabled={isSubmittingProd} value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2 text-white text-sm">
                                                            <option>Solar Panels</option>
                                                            <option>Inverters</option>
                                                            <option>Batteries</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Description</label>
                                                    <textarea required disabled={isSubmittingProd} value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2 text-white text-sm min-h-[80px]" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Key Specs</label>
                                                    <input required disabled={isSubmittingProd} value={newProduct.specs} onChange={e => setNewProduct(p => ({ ...p, specs: e.target.value }))} placeholder="e.g. 540W, Monocrystalline" className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2 text-white text-sm" />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
                                            <button disabled={isSubmittingProd} type="submit" form="product-form" className="bg-brand-blue text-white px-6 py-2.5 text-sm font-[800] uppercase tracking-widest hover:bg-blue-600 disabled:opacity-50">
                                                {isSubmittingProd ? 'Uploading...' : 'Save Product'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── TESTIMONIALS ── */}
                    {activeTab === 'testimonials' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-[900] text-white tracking-tight">Testimonials</h1>
                                    <p className="text-gray-600 text-sm mt-1">{testimonials.length} testimonials in database</p>
                                </div>
                                <button onClick={() => {
                                    setEditingTestimonialId(null);
                                    setNewTestimonial({ client_name: '', company: '', testimonial: '', rating: 5, imageFile: null, imagePreview: '' });
                                    setIsTestimonialModalOpen(true);
                                }} className="flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 text-sm font-[800] uppercase tracking-widest hover:bg-blue-600">
                                    <Plus className="w-4 h-4" /> Add Testimonial
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {testimonials.map(t => (
                                    <div key={t.id} className="bg-[#0d0d10] border border-white/[0.06] p-5 flex flex-col justify-between group">
                                        <div className="flex gap-4 mb-4">
                                            <div className="w-12 h-12 bg-white/[0.02] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {t.image_url ? <img src={t.image_url} alt={t.client_name} className="w-full h-full object-cover" /> : <MessageSquare className="w-5 h-5 text-gray-500" />}
                                            </div>
                                            <div>
                                                <h3 className="font-[800] text-white text-sm">{t.client_name}</h3>
                                                <p className="text-[0.65rem] font-[700] uppercase tracking-widest text-brand-blue">{t.company}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} className={`w-3 h-3 ${i < t.rating ? 'text-brand-yellow' : 'text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400 italic mb-4">"{t.testimonial}"</p>
                                        <div className="border-t border-white/[0.06] pt-3 mt-auto flex justify-end">
                                            <button onClick={() => {
                                                setEditingTestimonialId(t.id);
                                                setNewTestimonial({ client_name: t.client_name, company: t.company, testimonial: t.testimonial, rating: t.rating, imageFile: null, imagePreview: t.image_url });
                                                setIsTestimonialModalOpen(true);
                                            }} className="text-[0.65rem] font-[800] uppercase tracking-widest text-brand-blue hover:text-blue-400">Edit</button>
                                        </div>
                                    </div>
                                ))}
                                {testimonials.length === 0 && (
                                    <div className="col-span-full py-20 text-center text-gray-700 text-sm">No testimonials found</div>
                                )}
                            </div>

                            {/* Testimonial Modal */}
                            {isTestimonialModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSubmittingT && setIsTestimonialModalOpen(false)} />
                                    <div className="relative bg-[#0d0d10] border border-white/[0.06] w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
                                        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                                            <h2 className="text-lg font-[800] text-white">{editingTestimonialId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                                            <button onClick={() => setIsTestimonialModalOpen(false)}><X className="w-5 h-5 text-gray-500 hover:text-white" /></button>
                                        </div>
                                        <div className="p-6 overflow-y-auto">
                                            <form id="testimonial-form" onSubmit={handleCreateTestimonial} className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-2">Client Photo / Company Logo (Optional)</label>
                                                    <input disabled={isSubmittingT} type="file" accept="image/*" onChange={handleImageUploadTestimonial} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-[700] file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Client Name</label>
                                                        <input required disabled={isSubmittingT} value={newTestimonial.client_name} onChange={e => setNewTestimonial(p => ({ ...p, client_name: e.target.value }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2 text-white text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Company Role / Org</label>
                                                        <input disabled={isSubmittingT} value={newTestimonial.company} onChange={e => setNewTestimonial(p => ({ ...p, company: e.target.value }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2 text-white text-sm" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Testimonial</label>
                                                    <textarea required disabled={isSubmittingT} value={newTestimonial.testimonial} onChange={e => setNewTestimonial(p => ({ ...p, testimonial: e.target.value }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2 text-white text-sm min-h-[100px]" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-[700] text-gray-400 uppercase tracking-widest mb-1.5">Rating (1-5)</label>
                                                    <input required type="number" min="1" max="5" disabled={isSubmittingT} value={newTestimonial.rating} onChange={e => setNewTestimonial(p => ({ ...p, rating: Number(e.target.value) }))} className="w-full bg-[#09090b] border border-white/[0.08] px-4 py-2 text-white text-sm" />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
                                            <button disabled={isSubmittingT} type="submit" form="testimonial-form" className="bg-brand-blue text-white px-6 py-2.5 text-sm font-[800] uppercase tracking-widest hover:bg-blue-600 disabled:opacity-50">
                                                {isSubmittingT ? 'Saving...' : 'Save Testimonial'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── PARTNERS ── */}
                    {activeTab === 'partners' && (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-[900] text-white tracking-tight">Partner Inquiries</h1>
                            <div className="bg-[#0d0d10] border border-white/[0.06] overflow-hidden">
                                {partners.length > 0 ? partners.map(p => (
                                    <div key={p.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                                        <div className="col-span-3">
                                            <div className="text-sm font-[700] text-white">{p.company_name}</div>
                                            <div className="text-[0.65rem] text-gray-600">{p.name}</div>
                                        </div>
                                        <div className="col-span-3 text-sm text-gray-400"><div className="truncate">{p.email}</div><div className="text-[0.65rem]">{p.phone}</div></div>
                                        <div className="col-span-2 text-xs text-gray-400"><span className="bg-white/[0.05] px-2 py-0.5 rounded-full">{p.partnership_type}</span></div>
                                        <div className="col-span-3 text-xs text-gray-600 line-clamp-2">{p.message}</div>
                                        <div className="col-span-1 text-right text-[0.6rem] text-gray-700">{timeAgo(p.created_at)}</div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center text-gray-700 text-sm">No partner inquiries yet</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── SETTINGS ── */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-[900] text-white tracking-tight capitalize">{activeTab}</h1>
                                <p className="text-gray-600 text-sm mt-1">Configure your dashboard parameters.</p>
                            </div>
                            <div className="bg-[#0d0d10] border border-white/[0.06] p-8 max-w-xl">
                                <h3 className="text-white text-sm font-[800] mb-4">Cloudinary Config</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-[700] text-gray-400 uppercase mb-1">Upload Preset</label>
                                        <div className="px-3 py-2 bg-white/[0.02] border border-white/[0.04] text-xs text-gray-400 shrink-0 font-[500]">{import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Not Set'}</div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-[700] text-gray-400 uppercase mb-1">Cloud Name</label>
                                        <div className="px-3 py-2 bg-white/[0.02] border border-white/[0.04] text-xs text-gray-400 shrink-0 font-[500]">{import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'Not Set'}</div>
                                    </div>
                                </div>
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
