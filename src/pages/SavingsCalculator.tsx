import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Sun, Zap, TrendingUp, Leaf, IndianRupee, ArrowRight,
    BarChart3, CheckCircle2, ChevronDown, Info, Phone
} from 'lucide-react';
import { cn } from '../components/Navbar';

// ─── Constants & Config ────────────────────────────────────────────────────────

const ELECTRICITY_RATES: Record<string, number> = {
    residential: 6.5,
    commercial: 8.5,
    industrial: 7.0,
};

const SYSTEM_COST_PER_KW = 45000; // ₹ per kWp (market average 2024)
const SUBSIDY_RESIDENTIAL_KW_LIMIT = 10; // kWp (PM Surya Ghar scheme)
const SUBSIDY_AMOUNT_UNDER_3KW = 18000; // ₹/kW for ≤ 3 kWp
const SUBSIDY_AMOUNT_3_TO_10KW = 9000;  // ₹/kW for 3–10 kWp (additional slab)
const PANEL_EFFICIENCY_LOSS = 0.005; // 0.5% per year degradation
const MAINTENANCE_COST_ANNUAL = 2500; // ₹/kWp/year (O&M)
const ELECTRICITY_ESCALATION = 0.06; // 6% annual tariff rise
const SYSTEM_LIFESPAN = 25; // years
const SUNLIGHT_HOURS_AVERAGE = 5.5; // hours/day (India average)

interface State {
    type: 'residential' | 'commercial' | 'industrial';
    monthlyBill: number;
    roofArea: number;
    state: string;
    phase: 'single' | 'three';
}

interface Results {
    systemSizeKw: number;
    systemCost: number;
    subsidy: number;
    netCost: number;
    annualGeneration: number;
    annualSavings: number;
    paybackYears: number;
    lifetimeSavings: number;
    co2Saved: number;
    roi: number;
    monthlyBillAfter: number;
    financedEMI: number;
    yearlyData: { year: number; savings: number; cumulative: number }[];
}

const STATES = [
    'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Haryana',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
    'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
    'Uttar Pradesh', 'West Bengal'
];

const STATE_IRRADIANCE: Record<string, number> = {
    'Rajasthan': 6.2, 'Gujarat': 5.9, 'Andhra Pradesh': 5.7,
    'Telangana': 5.6, 'Karnataka': 5.5, 'Tamil Nadu': 5.4,
    'Maharashtra': 5.5, 'Madhya Pradesh': 5.6, 'Delhi': 5.3,
    'Haryana': 5.2, 'Punjab': 5.0, 'Uttar Pradesh': 5.1,
    'Bihar': 4.9, 'West Bengal': 4.8, 'Kerala': 4.7,
};

// ─── Calculation Engine ────────────────────────────────────────────────────────

function calculate(inputs: State): Results {
    const tariff = ELECTRICITY_RATES[inputs.type];
    const irradiance = STATE_IRRADIANCE[inputs.state] || SUNLIGHT_HOURS_AVERAGE;

    // Recommended system size (kWp)
    const monthlyUnits = inputs.monthlyBill / tariff;
    const systemSizeKw = Math.max(1, Math.round((monthlyUnits / (irradiance * 30)) * 10) / 10);

    // Cost calculation
    const systemCost = systemSizeKw * SYSTEM_COST_PER_KW;

    // Subsidy (only residential, PM Surya Ghar)
    let subsidy = 0;
    if (inputs.type === 'residential') {
        if (systemSizeKw <= 3) {
            subsidy = systemSizeKw * SUBSIDY_AMOUNT_UNDER_3KW;
        } else if (systemSizeKw <= SUBSIDY_RESIDENTIAL_KW_LIMIT) {
            subsidy = 3 * SUBSIDY_AMOUNT_UNDER_3KW + (systemSizeKw - 3) * SUBSIDY_AMOUNT_3_TO_10KW;
        } else {
            subsidy = 3 * SUBSIDY_AMOUNT_UNDER_3KW + 7 * SUBSIDY_AMOUNT_3_TO_10KW;
        }
    }
    // Industrial: accelerated depreciation (40% of system cost effectively saved as tax)
    if (inputs.type === 'industrial') {
        subsidy = systemCost * 0.40;
    }
    // Commercial: AD benefit ~30%
    if (inputs.type === 'commercial') {
        subsidy = systemCost * 0.30;
    }

    const netCost = systemCost - subsidy;

    // Annual generation (kWh)
    const annualGeneration = systemSizeKw * irradiance * 365 * 0.80; // 80% system efficiency

    // Annual savings (year 1)
    const annualSavings = annualGeneration * tariff;

    // Payback
    const paybackYears = netCost / annualSavings;

    // 25-year lifetime savings with escalation and degradation
    let lifetimeSavings = 0;
    const yearlyData: { year: number; savings: number; cumulative: number }[] = [];
    let cumulative = -netCost;

    for (let y = 1; y <= SYSTEM_LIFESPAN; y++) {
        const gen = systemSizeKw * irradiance * 365 * 0.80 * Math.pow(1 - PANEL_EFFICIENCY_LOSS, y - 1);
        const tariffY = tariff * Math.pow(1 + ELECTRICITY_ESCALATION, y - 1);
        const savingsY = gen * tariffY - systemSizeKw * MAINTENANCE_COST_ANNUAL;
        cumulative += savingsY;
        lifetimeSavings += savingsY;
        yearlyData.push({ year: y, savings: Math.round(savingsY), cumulative: Math.round(cumulative) });
    }

    // CO2 saved (kg) — 0.82 kg CO2/kWh (India grid emission factor)
    const co2Saved = annualGeneration * 0.82 * SYSTEM_LIFESPAN / 1000; // tonnes

    const roi = ((lifetimeSavings - netCost) / netCost) * 100;
    const monthlyBillAfter = Math.max(0, inputs.monthlyBill - annualSavings / 12);

    // EMI estimate (7-year loan at 9.5% — typical solar loan)
    const loanAmt = netCost * 0.7; // assume 30% down payment
    const r = 0.095 / 12;
    const n = 84;
    const financedEMI = (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    return {
        systemSizeKw,
        systemCost,
        subsidy,
        netCost,
        annualGeneration: Math.round(annualGeneration),
        annualSavings: Math.round(annualSavings),
        paybackYears: Math.round(paybackYears * 10) / 10,
        lifetimeSavings: Math.round(lifetimeSavings),
        co2Saved: Math.round(co2Saved),
        roi: Math.round(roi),
        monthlyBillAfter: Math.round(monthlyBillAfter),
        financedEMI: Math.round(financedEMI),
        yearlyData,
    };
}

// ─── Utility ───────────────────────────────────────────────────────────────────

function formatINR(val: number): string {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const Tooltip: React.FC<{ text: string }> = ({ text }) => {
    const [show, setShow] = useState(false);
    return (
        <span className="relative inline-block ml-1.5">
            <Info
                className="w-3.5 h-3.5 text-gray-400 cursor-help inline"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            />
            {show && (
                <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900 text-white text-xs rounded px-3 py-2 leading-relaxed shadow-xl pointer-events-none">
                    {text}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                </span>
            )}
        </span>
    );
};

interface SliderInputProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    prefix?: string;
    suffix?: string;
    tooltip?: string;
    color: string;
    onChange: (v: number) => void;
}

const SliderInput: React.FC<SliderInputProps> = ({ label, value, min, max, step, prefix, suffix, tooltip, color, onChange }) => {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-[700] text-gray-700 tracking-tight flex items-center">
                    {label} {tooltip && <Tooltip text={tooltip} />}
                </label>
                <div className={`text-sm font-[900] ${color} px-3 py-1 bg-gray-50 border border-gray-100`}>
                    {prefix}{value.toLocaleString('en-IN')}{suffix}
                </div>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full">
                <div
                    className="absolute h-2 rounded-full transition-all duration-150"
                    style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, #0284c7, #0ea5e9)'
                    }}
                />
                <input
                    type="range"
                    min={min} max={max} step={step} value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                    style={{ zIndex: 2 }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-brand-blue rounded-full shadow-md transition-all duration-150"
                    style={{ left: `calc(${pct}% - 10px)`, zIndex: 1 }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-[600]">
                <span>{prefix}{min.toLocaleString('en-IN')}{suffix}</span>
                <span>{prefix}{max.toLocaleString('en-IN')}{suffix}</span>
            </div>
        </div>
    );
};

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub?: string;
    accent: string;
    delay?: number;
    animate?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, sub, accent, delay = 0, animate }) => (
    <div
        className={cn(
            "bg-white border border-gray-100 p-5 flex flex-col gap-3 transition-all duration-700",
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
        style={{ transitionDelay: `${delay}ms` }}
    >
        <div className={`w-8 h-8 ${accent} flex items-center justify-center text-white`}>{icon}</div>
        <div>
            <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-400 mb-1">{label}</div>
            <div className="text-2xl font-[900] text-gray-900 leading-none">{value}</div>
            {sub && <div className="text-xs text-gray-400 font-[400] mt-1">{sub}</div>}
        </div>
    </div>
);

// ─── Bar Chart ─────────────────────────────────────────────────────────────────

const SavingsChart: React.FC<{ data: { year: number; savings: number; cumulative: number }[]; netCost: number }> = ({ data, netCost }) => {
    const displayData = data.filter((_, i) => i % 5 === 4 || i === 0);
    const maxCumulative = Math.max(...data.map(d => d.cumulative));
    const minCumulative = Math.min(...data.map(d => d.cumulative));
    const range = maxCumulative - minCumulative;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="text-xs font-[700] uppercase tracking-widest text-gray-500">Cumulative Profit/Loss Over 25 Years</div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-brand-blue" /><span className="text-[10px] font-[600] text-gray-500">Profit</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-400" /><span className="text-[10px] font-[600] text-gray-500">Investment</span></div>
                </div>
            </div>
            <div className="flex items-end gap-1.5 h-40">
                {data.map((d, i) => {
                    const isPositive = d.cumulative >= 0;
                    const height = Math.abs(d.cumulative / range) * 100;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                            <div
                                className={cn(
                                    "w-full transition-all duration-300 group-hover:opacity-80",
                                    isPositive ? "bg-brand-blue" : "bg-red-400"
                                )}
                                style={{ height: `${Math.max(2, height)}%` }}
                            />
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full mb-1 bg-gray-900 text-white text-[10px] rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Yr {d.year}: {formatINR(d.cumulative)}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 font-[600]">
                <span>Yr 1</span>
                <span>Yr 5</span>
                <span>Yr 10</span>
                <span>Yr 15</span>
                <span>Yr 20</span>
                <span>Yr 25</span>
            </div>
        </div>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const SavingsCalculator: React.FC = () => {
    const [inputs, setInputs] = useState<State>({
        type: 'residential',
        monthlyBill: 3000,
        roofArea: 400,
        state: 'Maharashtra',
        phase: 'single',
    });

    const [showResults, setShowResults] = useState(false);
    const [animate, setAnimate] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);

    const results = useMemo(() => calculate(inputs), [inputs]);

    const handleCalculate = () => {
        setShowResults(true);
        setAnimate(false);
        setTimeout(() => {
            setAnimate(true);
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    };

    // Live update if results already shown
    useEffect(() => {
        if (showResults) {
            setAnimate(false);
            const t = setTimeout(() => setAnimate(true), 100);
            return () => clearTimeout(t);
        }
    }, [inputs]);

    const billMaxMap = { residential: 30000, commercial: 200000, industrial: 500000 };
    const billMax = billMaxMap[inputs.type];

    const TYPE_LABELS: Record<string, string> = {
        residential: 'Residential',
        commercial: 'Commercial',
        industrial: 'Industrial',
    };

    const subsidyLabel: Record<string, string> = {
        residential: 'Govt. Subsidy (PM Surya Ghar)',
        commercial: 'Accelerated Depreciation Benefit (30%)',
        industrial: 'Accelerated Depreciation Benefit (40%)',
    };

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="relative bg-gray-950 pt-32 pb-20 overflow-hidden">
                {/* Background grid */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }} />

                {/* Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #0284c7 0%, transparent 70%)' }} />

                <div className="container mx-auto px-6 max-w-5xl relative z-10">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 backdrop-blur-sm">
                            <Sun className="w-4 h-4 text-brand-yellow" />
                            <span className="text-[0.6rem] font-[800] uppercase tracking-[0.3em] text-gray-400">Solar Savings Calculator</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-[900] text-white leading-[1.0] tracking-tight">
                            How Much Can You <br />
                            <span className="text-brand-yellow">Save with Solar?</span>
                        </h1>

                        <p className="text-gray-400 text-lg font-[300] max-w-2xl mx-auto leading-relaxed">
                            Enter your electricity details below and get an instant, accurate estimate
                            of your savings, payback period, and 25-year ROI — based on real
                            market data and government subsidy schemes.
                        </p>

                        {/* Trust badges */}
                        <div className="flex flex-wrap justify-center gap-6 pt-4">
                            {[
                                { icon: '🏛️', label: 'PM Surya Ghar Scheme' },
                                { icon: '📊', label: 'Real Market Rates' },
                                { icon: '⚡', label: 'State-wise Tariffs' },
                                { icon: '🌿', label: 'CO₂ Impact' },
                            ].map((b, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-400">
                                    <span className="text-base">{b.icon}</span>
                                    <span className="text-[0.65rem] font-[700] uppercase tracking-widest">{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Calculator Form ─────────────────────────────────── */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6 max-w-5xl">

                    {/* Step 1 — Installation Type */}
                    <div className="mb-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-7 h-7 bg-brand-blue flex items-center justify-center text-white text-xs font-[900]">1</div>
                            <span className="text-sm font-[800] uppercase tracking-widest text-gray-500">Select Installation Type</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(['residential', 'commercial', 'industrial'] as const).map((t) => {
                                const icons = {
                                    residential: '🏠',
                                    commercial: '🏢',
                                    industrial: '🏭',
                                };
                                const descs = {
                                    residential: 'Home & Villas · Subsidy Available',
                                    commercial: 'Offices & Malls · 30% AD Benefit',
                                    industrial: 'Factories & Plants · 40% AD Benefit',
                                };
                                const active = inputs.type === t;
                                return (
                                    <button
                                        key={t}
                                        id={`type-${t}`}
                                        onClick={() => setInputs(p => ({ ...p, type: t }))}
                                        className={cn(
                                            "relative p-6 text-left border-2 transition-all duration-300 group",
                                            active
                                                ? "border-brand-blue bg-white shadow-lg shadow-brand-blue/10"
                                                : "border-transparent bg-white hover:border-gray-200"
                                        )}
                                    >
                                        {active && (
                                            <div className="absolute top-3 right-3">
                                                <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                                            </div>
                                        )}
                                        <div className="text-2xl mb-3">{icons[t]}</div>
                                        <div className="text-sm font-[800] text-gray-900 capitalize mb-1">{TYPE_LABELS[t]}</div>
                                        <div className="text-[0.65rem] font-[500] text-gray-400 leading-relaxed">{descs[t]}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2 — Inputs */}
                    <div className="mb-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-7 h-7 bg-brand-blue flex items-center justify-center text-white text-xs font-[900]">2</div>
                            <span className="text-sm font-[800] uppercase tracking-widest text-gray-500">Your Electricity Details</span>
                        </div>

                        <div className="bg-white border border-gray-100 p-8 space-y-10">

                            {/* Monthly Bill Slider */}
                            <SliderInput
                                label="Monthly Electricity Bill"
                                value={inputs.monthlyBill}
                                min={500}
                                max={billMax}
                                step={inputs.type === 'residential' ? 500 : 5000}
                                prefix="₹"
                                tooltip={`Your average monthly electricity bill in ₹. Tariff used: ₹${ELECTRICITY_RATES[inputs.type]}/unit for ${TYPE_LABELS[inputs.type]}.`}
                                color="text-brand-blue"
                                onChange={v => setInputs(p => ({ ...p, monthlyBill: v }))}
                            />

                            {/* Roof Area */}
                            <SliderInput
                                label="Available Roof / Ground Area"
                                value={inputs.roofArea}
                                min={50}
                                max={inputs.type === 'residential' ? 2000 : inputs.type === 'commercial' ? 10000 : 50000}
                                step={inputs.type === 'residential' ? 50 : 500}
                                suffix=" sq.ft"
                                tooltip="Available shadow-free area for solar panel installation. ~100 sq.ft is needed per kWp."
                                color="text-brand-green"
                                onChange={v => setInputs(p => ({ ...p, roofArea: v }))}
                            />

                            {/* State & Phase */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-[700] text-gray-700 mb-2 block tracking-tight flex items-center">
                                        Your State
                                        <Tooltip text="Determines the solar irradiance (sun hours) in your region, which affects system output." />
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="state-select"
                                            value={inputs.state}
                                            onChange={e => setInputs(p => ({ ...p, state: e.target.value }))}
                                            className="w-full appearance-none border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-[600] text-gray-800 focus:outline-none focus:border-brand-blue transition-colors pr-10"
                                        >
                                            {STATES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {inputs.type !== 'residential' && (
                                    <div>
                                        <label className="text-sm font-[700] text-gray-700 mb-2 block tracking-tight">
                                            Phase Connection
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(['single', 'three'] as const).map(p => (
                                                <button
                                                    key={p}
                                                    id={`phase-${p}`}
                                                    onClick={() => setInputs(prev => ({ ...prev, phase: p }))}
                                                    className={cn(
                                                        "py-3 text-sm font-[700] border transition-all",
                                                        inputs.phase === p
                                                            ? "border-brand-blue text-brand-blue bg-brand-blue/5"
                                                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                                                    )}
                                                >
                                                    {p === 'single' ? 'Single Phase' : 'Three Phase'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Live Preview Bar */}
                    <div className="bg-brand-blue/5 border border-brand-blue/20 px-8 py-5 mb-8 flex flex-wrap gap-6 items-center justify-between">
                        <div className="flex flex-wrap gap-8">
                            <div>
                                <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-brand-blue/60">Recommended System</div>
                                <div className="text-xl font-[900] text-brand-blue">{results.systemSizeKw} kWp</div>
                            </div>
                            <div>
                                <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-500">Est. Annual Savings</div>
                                <div className="text-xl font-[900] text-gray-900">{formatINR(results.annualSavings)}</div>
                            </div>
                            <div>
                                <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-500">Payback Period</div>
                                <div className="text-xl font-[900] text-gray-900">{results.paybackYears} years</div>
                            </div>
                        </div>
                        <button
                            id="calculate-btn"
                            onClick={handleCalculate}
                            className="inline-flex items-center gap-3 bg-brand-blue text-white px-8 py-4 text-sm font-[900] uppercase tracking-widest hover:bg-blue-700 transition-colors group shadow-lg shadow-brand-blue/30"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Get Full Report
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                </div>
            </section>

            {/* ── Results ─────────────────────────────────────────── */}
            {showResults && (
                <section ref={resultsRef} className="py-16 bg-white">
                    <div className="container mx-auto px-6 max-w-5xl">

                        {/* Section Header */}
                        <div className="flex items-center gap-5 mb-12">
                            <div className="h-px flex-1 bg-gray-100" />
                            <span className="text-[0.6rem] font-[800] tracking-[0.25em] uppercase text-gray-400 whitespace-nowrap">Your Solar Report</span>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        {/* System & Cost Overview */}
                        <div className="bg-gray-950 p-8 mb-8">
                            <div className="text-[0.6rem] font-[800] uppercase tracking-widest text-gray-500 mb-6">System Overview & Cost Breakdown</div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-white/5 overflow-hidden">
                                {[
                                    { label: 'System Size', val: `${results.systemSizeKw} kWp`, sub: 'Recommended' },
                                    { label: 'Total System Cost', val: formatINR(results.systemCost), sub: '@ ₹45,000/kWp' },
                                    { label: subsidyLabel[inputs.type], val: formatINR(results.subsidy), sub: 'Direct Benefit', color: 'text-brand-green' },
                                    { label: 'Your Net Investment', val: formatINR(results.netCost), sub: 'After Benefit', color: 'text-brand-yellow' },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "bg-gray-900/50 px-5 py-6 transition-all duration-500",
                                            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                                        )}
                                        style={{ transitionDelay: `${i * 80}ms` }}
                                    >
                                        <div className="text-[0.55rem] font-[700] uppercase tracking-widest text-gray-500 mb-2 leading-relaxed">{item.label}</div>
                                        <div className={`text-xl md:text-2xl font-[900] ${item.color || 'text-white'} leading-none`}>{item.val}</div>
                                        <div className="text-[0.6rem] text-gray-600 mt-1">{item.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Financed EMI note */}
                            <div className="mt-5 flex items-start gap-3 bg-white/5 border border-white/10 px-5 py-3">
                                <IndianRupee className="w-4 h-4 text-brand-yellow flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-400 font-[400] leading-relaxed">
                                    <span className="text-white font-[700]">EMI Option:</span> With 30% down payment (₹{formatINR(results.netCost * 0.3)}) and a 7-year solar loan at 9.5%, estimated EMI is <span className="text-brand-yellow font-[700]">₹{results.financedEMI.toLocaleString('en-IN')}/month</span> — less than your current electricity bill.
                                </p>
                            </div>
                        </div>

                        {/* Key Metrics — 6 cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            <MetricCard icon={<Zap className="w-4 h-4" />} label="Annual Generation" value={`${(results.annualGeneration / 1000).toFixed(1)} MWh`} sub="kWh per year" accent="bg-brand-blue" delay={0} animate={animate} />
                            <MetricCard icon={<IndianRupee className="w-4 h-4" />} label="1st Year Savings" value={formatINR(results.annualSavings)} sub="₹/year saved" accent="bg-brand-green" delay={80} animate={animate} />
                            <MetricCard icon={<TrendingUp className="w-4 h-4" />} label="Payback Period" value={`${results.paybackYears} Yrs`} sub="Return on investment" accent="bg-brand-yellow" delay={160} animate={animate} />
                            <MetricCard icon={<BarChart3 className="w-4 h-4" />} label="25-Year ROI" value={`${results.roi}%`} sub="Total return" accent="bg-purple-600" delay={240} animate={animate} />
                            <MetricCard icon={<IndianRupee className="w-4 h-4" />} label="Lifetime Savings" value={formatINR(results.lifetimeSavings)} sub="Over 25 years" accent="bg-rose-500" delay={320} animate={animate} />
                            <MetricCard icon={<Leaf className="w-4 h-4" />} label="CO₂ Offset" value={`${results.co2Saved} T`} sub="Tonnes over lifespan" accent="bg-teal-500" delay={400} animate={animate} />
                        </div>

                        {/* Monthly Bill Impact */}
                        <div className={cn(
                            "bg-gray-50 border border-gray-100 p-8 mb-8 transition-all duration-700",
                            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )} style={{ transitionDelay: '500ms' }}>
                            <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-400 mb-6">Monthly Bill Impact</div>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Before */}
                                <div className="flex-1 text-center">
                                    <div className="text-[0.65rem] font-[700] uppercase tracking-widest text-gray-400 mb-3">Before Solar</div>
                                    <div className="text-4xl font-[900] text-red-500">₹{inputs.monthlyBill.toLocaleString('en-IN')}</div>
                                    <div className="text-xs text-gray-400 mt-1">per month</div>
                                </div>

                                {/* Arrow */}
                                <div className="flex flex-col items-center gap-1 text-brand-green">
                                    <div className="text-xs font-[700] text-brand-green">Save {Math.round(((inputs.monthlyBill - results.monthlyBillAfter) / inputs.monthlyBill) * 100)}%</div>
                                    <ArrowRight className="w-8 h-8" />
                                </div>

                                {/* After */}
                                <div className="flex-1 text-center">
                                    <div className="text-[0.65rem] font-[700] uppercase tracking-widest text-gray-400 mb-3">After Solar</div>
                                    <div className="text-4xl font-[900] text-brand-green">₹{results.monthlyBillAfter.toLocaleString('en-IN')}</div>
                                    <div className="text-xs text-gray-400 mt-1">per month</div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-8">
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-brand-green to-teal-400 rounded-full transition-all duration-1000"
                                        style={{
                                            width: animate
                                                ? `${Math.round(((inputs.monthlyBill - results.monthlyBillAfter) / inputs.monthlyBill) * 100)}%`
                                                : '0%'
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-[600]">
                                    <span>₹0 Grid Dependeny</span>
                                    <span className="text-brand-green font-[700]">{Math.round(((inputs.monthlyBill - results.monthlyBillAfter) / inputs.monthlyBill) * 100)}% Savings</span>
                                    <span>Current Bill</span>
                                </div>
                            </div>
                        </div>

                        {/* 25-Year Chart */}
                        <div className={cn(
                            "bg-white border border-gray-100 p-8 mb-8 transition-all duration-700",
                            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )} style={{ transitionDelay: '600ms' }}>
                            <SavingsChart data={results.yearlyData} netCost={results.netCost} />
                        </div>

                        {/* Assumptions */}
                        <div className={cn(
                            "border border-gray-100 p-6 mb-12 transition-all duration-700",
                            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )} style={{ transitionDelay: '700ms' }}>
                            <div className="text-[0.6rem] font-[700] uppercase tracking-widest text-gray-400 mb-4">Calculation Assumptions</div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
                                {[
                                    { label: 'Electricity Tariff', val: `₹${ELECTRICITY_RATES[inputs.type]}/unit` },
                                    { label: 'Tariff Escalation', val: '6% per year' },
                                    { label: 'System Efficiency', val: '80% (inc. losses)' },
                                    { label: 'Panel Degradation', val: '0.5% per year' },
                                    { label: 'Solar Irradiance', val: `${STATE_IRRADIANCE[inputs.state] || 5.5} hrs/day` },
                                    { label: 'Maintenance Cost', val: '₹2,500/kWp/year' },
                                    { label: 'System Lifespan', val: '25 years' },
                                    { label: 'CO₂ Factor', val: '0.82 kg/kWh' },
                                ].map((a, i) => (
                                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                                        <span className="text-[0.65rem] text-gray-400 font-[500]">{a.label}</span>
                                        <span className="text-[0.65rem] text-gray-700 font-[700]">{a.val}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[0.6rem] text-gray-400 mt-4 leading-relaxed">
                                * Estimates are indicative and based on industry averages. Actual savings may vary based on site conditions, local tariffs, shading, and system design. Contact OM Power for a free on-site assessment.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="bg-brand-blue p-10 text-center">
                            <div className="text-brand-yellow text-[0.65rem] font-[800] uppercase tracking-widest mb-3">Ready to Go Solar?</div>
                            <h2 className="text-3xl md:text-4xl font-[900] text-white mb-4">
                                Your System Could Save <span className="text-brand-yellow">{formatINR(results.annualSavings)}</span> This Year
                            </h2>
                            <p className="text-blue-200 text-sm font-[300] mb-8 max-w-xl mx-auto">
                                Our engineers will conduct a free site survey, validate these numbers, and design the perfect solar system for your property.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/contact"
                                    id="get-free-survey-btn"
                                    className="inline-flex items-center gap-3 bg-brand-yellow text-gray-900 px-8 py-4 font-[900] text-sm uppercase tracking-widest hover:bg-yellow-400 transition-colors group"
                                >
                                    Book Free Site Survey
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                                <a
                                    href="tel:18001234567"
                                    className="inline-flex items-center gap-3 border-2 border-white/30 text-white px-8 py-4 font-[700] text-sm uppercase tracking-widest hover:border-white/60 transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    1800 123 4567
                                </a>
                            </div>
                        </div>

                    </div>
                </section>
            )}

            {/* ── Why Solar Section ────────────────────────────────── */}
            {!showResults && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="text-center mb-14">
                            <div className="text-[0.6rem] font-[800] uppercase tracking-widest text-gray-400 mb-4">Why Go Solar?</div>
                            <h2 className="text-3xl md:text-4xl font-[900] text-gray-900">Benefits That Last <span className="text-brand-blue">25 Years</span></h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: '💰', title: 'Immediate Savings', desc: 'Reduce your electricity bill by up to 90% from day one of installation.' },
                                { icon: '📈', title: 'Excellent ROI', desc: 'Solar delivers 15–25% returns — outperforming most traditional investments.' },
                                { icon: '🏦', title: 'Government Subsidies', desc: 'PM Surya Ghar scheme offers up to ₹78,000 subsidy for residential customers.' },
                                { icon: '🌿', title: 'Environmental Impact', desc: 'Each kWp of solar offsets ~20 tonnes of CO₂ over its lifetime.' },
                                { icon: '🔒', title: 'Energy Security', desc: 'Protect yourself from rising electricity tariffs and power cuts.' },
                                { icon: '🏠', title: 'Property Value', desc: 'Solar installations increase property value by 4–6% on average.' },
                            ].map((item, i) => (
                                <div key={i} className="border border-gray-100 p-6 hover:border-brand-blue/30 hover:shadow-sm transition-all group">
                                    <div className="text-2xl mb-3">{item.icon}</div>
                                    <div className="text-sm font-[800] text-gray-900 mb-2">{item.title}</div>
                                    <div className="text-sm text-gray-500 font-[400] leading-relaxed">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
};

export default SavingsCalculator;
