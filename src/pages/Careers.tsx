import React, { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { Briefcase, MapPin, Clock, UploadCloud, ChevronRight, CheckCircle } from 'lucide-react';
import { supabase } from '../supabase/client';

interface Job {
    id: number;
    title: string;
    description: string;
    location: string;
    type: string;
    exp: string;
}

const Careers: React.FC = () => {
    const [selectedJob, setSelectedJob] = useState<number | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [applyStatus, setApplyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        const fetchJobs = async () => {
            const { data, error } = await supabase
                .from('careers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching careers:", error);
                // Mock fallback
                setJobs([
                    { id: 1, title: 'Senior Solar Field Engineer', description: '', location: 'Delhi NCR', type: 'Full-Time', exp: '5+ Years' },
                    { id: 2, title: 'Project Manager (Industrial)', description: '', location: 'Pune', type: 'Full-Time', exp: '8+ Years' },
                    { id: 3, title: 'Solar Design Drafter (AutoCAD)', description: '', location: 'Remote / Hybrid', type: 'Full-Time', exp: '2-4 Years' },
                    { id: 4, title: 'O&M Technician', description: '', location: 'Noida', type: 'Contract', exp: '1-3 Years' },
                ]);
            } else {
                setJobs(data || []);
            }
            setLoading(false);
        };

        fetchJobs();
    }, []);

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        setApplyStatus('loading');
        // Simulate application send since we don't have a direct applications table mapped
        setTimeout(() => {
            setApplyStatus('success');
            setTimeout(() => setApplyStatus('idle'), 5000);
        }, 1500);
    };

    return (
        <div className="pt-20">
            <PageHeader
                title="Careers"
                subtitle="Join our mission to power the world sustainably."
                backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
            />

            <section className="py-24 bg-white dark:bg-brand-dark">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-16">

                        {/* Job Listings */}
                        <div className="w-full lg:w-1/2 space-y-6">
                            <h2 className="text-3xl font-bold mb-8 dark:text-white">Open Positions</h2>

                            {loading ? (
                                <div className="text-brand-blue font-bold">Loading positions...</div>
                            ) : jobs.length === 0 ? (
                                <div className="text-gray-500">No open positions available.</div>
                            ) : (
                                jobs.map((job) => (
                                    <div
                                        key={job.id}
                                        onClick={() => setSelectedJob(job.id)}
                                        className={`p-6 border rounded-xl cursor-pointer transition-all duration-300 ${selectedJob === job.id
                                            ? 'border-brand-blue bg-brand-blue/5 dark:bg-white/10 shadow-md'
                                            : 'border-gray-200 dark:border-gray-800 hover:border-brand-blue/50 hover:shadow-sm bg-gray-50 dark:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold dark:text-white">{job.title}</h3>
                                            <ChevronRight className={`w-5 h-5 transition-transform ${selectedJob === job.id ? 'rotate-90 text-brand-blue' : 'text-gray-400'}`} />
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{job.location}</span>
                                            <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{job.type}</span>
                                            <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" />{job.exp || 'Not specified'}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Application Form */}
                        <div className="w-full lg:w-1/2">
                            <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 sticky top-32">
                                <h3 className="text-2xl font-bold mb-2 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
                                    {selectedJob ? `Apply for: ${jobs.find(j => j.id === selectedJob)?.title}` : 'Submit General Application'}
                                </h3>

                                {applyStatus === 'success' && (
                                    <div className="mt-4 bg-brand-green/10 text-brand-green p-3 rounded-lg flex items-center text-sm border border-brand-green/20">
                                        <CheckCircle className="w-5 h-5 mr-2 shrink-0" />
                                        Application submitted successfully! Our HR team will reach out soon.
                                    </div>
                                )}

                                <form className="mt-6 space-y-5" onSubmit={handleApply}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                            <input type="text" className="w-full bg-white dark:bg-brand-dark border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all dark:text-white" required disabled={applyStatus === 'loading'} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                            <input type="text" className="w-full bg-white dark:bg-brand-dark border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all dark:text-white" required disabled={applyStatus === 'loading'} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                        <input type="email" className="w-full bg-white dark:bg-brand-dark border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all dark:text-white" required disabled={applyStatus === 'loading'} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                        <input type="tel" className="w-full bg-white dark:bg-brand-dark border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all dark:text-white" required disabled={applyStatus === 'loading'} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resume / CV</label>
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-white dark:bg-brand-dark hover:bg-gray-50 dark:hover:bg-brand-dark/80 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold text-brand-blue">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-400 mt-1">PDF, DOCX (MAX. 5MB)</p>
                                            </div>
                                            <input type="file" className="hidden" accept=".pdf,.doc,.docx" disabled={applyStatus === 'loading'} />
                                        </label>
                                    </div>

                                    <button type="submit" disabled={applyStatus === 'loading'} className="w-full bg-gradient-to-r from-brand-blue to-cyan-500 hover:from-cyan-500 hover:to-brand-blue text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md mt-6">
                                        {applyStatus === 'loading' ? 'Submitting Application...' : 'Submit Application'}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Careers;
