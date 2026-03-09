import React from 'react';
import { DATA_SCHEMA_SPEC } from '../constants';
import { CheckCircle2, DollarSign, ShieldCheck, Zap, Server, Cloud, Code2, GitBranch } from 'lucide-react';

const Specs: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-slate-900 text-slate-300 pb-32 overflow-y-auto no-scrollbar pt-safe">
            <div className="p-6">
                <h1 className="text-2xl font-serif text-amber-400 mb-2">Technical Specification</h1>
                <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest">Prepared for Dream Vacation Club (Beekman Group)</p>

                {/* EXECUTIVE SUMMARY */}
                <section className="mb-8 bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                    <h2 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Zap className="text-amber-500" size={18} />
                        The Efficiency Engine
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                        This PWA (Progressive Web App) is designed to reduce call center volume by 60% while monetizing unused inventory via the "Cancellation Watch" algorithm which automatically fulfills member requests when matched with real-time cancellations.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-900 p-2 rounded border border-slate-700 flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-green-400" />
                            <span>Cross-Platform (iOS/Android)</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-700 flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-green-400" />
                            <span>Real-time Point Sync</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-700 flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-green-400" />
                            <span>AI Concierge (Gemini)</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-700 flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-green-400" />
                            <span>Bank-Grade Security</span>
                        </div>
                    </div>
                </section>

                {/* COMMERCIAL PROPOSAL */}
                <section className="mb-8">
                    <h2 className="text-white font-bold mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
                        <DollarSign className="text-green-500" size={18} />
                        Commercial Proposal
                    </h2>

                    <div className="space-y-4">
                        {/* Option A */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-600 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-slate-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg text-slate-300">OPTION A</div>
                            <h3 className="text-white font-bold text-lg mb-1">Source Code Buyout</h3>
                            <p className="text-2xl font-bold text-amber-400 mb-2">R 350,000 <span className="text-xs font-normal text-slate-400">once-off</span></p>
                            <p className="text-xs text-slate-400 mb-4">Complete ownership of IP, GitHub repository, and deployment pipelines. Your team takes full control.</p>
                            <ul className="text-xs space-y-2 text-slate-300">
                                <li className="flex gap-2 items-center"><Code2 size={12} className="text-amber-500" /> Full React/Vite Source Code</li>
                                <li className="flex gap-2 items-center"><GitBranch size={12} className="text-amber-500" /> Netlify CI/CD Pipeline Configured</li>
                                <li className="flex gap-2 items-center"><CheckCircle2 size={12} className="text-amber-500" /> 2 Weeks Handover Support</li>
                                <li className="flex gap-2 items-center"><CheckCircle2 size={12} className="text-amber-500" /> Zero Monthly Fees</li>
                            </ul>
                        </div>

                        {/* Option B */}
                        <div className="bg-gradient-to-br from-navy-900 to-slate-900 rounded-xl p-5 border border-amber-500/30 relative overflow-hidden ring-1 ring-amber-500/20">
                            <div className="absolute top-0 right-0 bg-amber-500 text-[10px] font-bold px-2 py-1 rounded-bl-lg text-navy-900">RECOMMENDED</div>
                            <h3 className="text-white font-bold text-lg mb-1">Acceleration Partner</h3>
                            <p className="text-2xl font-bold text-white mb-2">R 90,000 <span className="text-xs font-normal text-slate-400">+ R25k/mo</span></p>
                            <p className="text-xs text-slate-400 mb-4">Lower upfront cost. We act as your external innovation lab, handling hosting, AI updates, and app store compliance.</p>
                            <ul className="text-xs space-y-2 text-slate-300">
                                <li className="flex gap-2"><div className="w-1 h-1 bg-green-500 rounded-full mt-1.5"></div> 12-Month SLA Agreement</li>
                                <li className="flex gap-2"><div className="w-1 h-1 bg-green-500 rounded-full mt-1.5"></div> Hosted Backend & Database</li>
                                <li className="flex gap-2"><div className="w-1 h-1 bg-green-500 rounded-full mt-1.5"></div> Continuous AI Improvements</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* TECH STACK */}
                <section className="mb-8">
                    <h2 className="text-white font-bold mb-2">3. Architecture</h2>
                    <div className="bg-slate-800 rounded-xl p-4 text-xs font-mono space-y-2 border border-slate-700">
                        <p><span className="text-blue-400">Frontend:</span> React 18, Tailwind CSS</p>
                        <p><span className="text-blue-400">Build System:</span> Vite (Production Bundling)</p>
                        <p><span className="text-blue-400">Infrastructure:</span> Netlify Edge (Global CDN)</p>
                        <p><span className="text-blue-400">AI Core:</span> Google Gemini 2.0 Flash (Optimized for Travel Planning)</p>
                        <p><span className="text-blue-400">Security:</span> RSA ID Validation, JWT Authentication, End-to-End Encryption</p>
                    </div>
                </section>

                {/* CLOUD INFRASTRUCTURE VISUAL */}
                <section className="mb-8">
                    <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Cloud className="text-blue-400" size={18} />
                        Deployment Strategy
                    </h2>
                    <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-1 rounded-bl-lg">LIVE READY</div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                                <Server size={20} className="text-slate-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Serverless Middleware</h4>
                                <p className="text-xs text-slate-500">Connects DVC Legacy SQL ↔ Modern App</p>
                            </div>
                        </div>

                        <div className="h-1 w-full bg-slate-800 rounded-full mb-4 overflow-hidden">
                            <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
                        </div>

                        <p className="text-[10px] text-slate-400 leading-relaxed">
                            By utilizing a serverless architecture, we eliminate fixed server costs. You only pay for exact compute time used during bookings. This reduces infrastructure overhead by approximately 45% compared to traditional dedicated hosting.
                        </p>
                    </div>
                </section>

                {/* JSON SCHEMA */}
                <section className="mb-8">
                    <h2 className="text-white font-bold mb-2">5. Data Schema Integration</h2>
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-700 overflow-x-auto">
                        <pre className="text-[10px] text-green-400 font-mono">
                            {JSON.stringify(DATA_SCHEMA_SPEC, null, 2)}
                        </pre>
                    </div>
                </section>

                <div className="flex items-center justify-center space-x-2 opacity-50 mt-10">
                    <ShieldCheck size={16} className="text-slate-500" />
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest">Confidential • Boraine Tech 2024</p>
                </div>
            </div>
        </div>
    );
};

export default Specs;