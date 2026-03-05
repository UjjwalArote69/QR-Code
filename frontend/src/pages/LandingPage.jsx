import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, ArrowRight, Activity, Palette, ShieldCheck, RefreshCw, BarChart3, Coffee, Home, ShoppingBag, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pricing from '../components/Pricing';

const LandingPage = () => {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const floatAnimation = {
    y: [-10, 10, -10],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-slate-600/30 relative">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-slate-800 p-1.5 rounded-lg border border-slate-700 text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">NexusQR</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-white hover:bg-slate-200 text-black rounded-md transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-slate-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Column: Copy */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
              <span>Nexus Redirection Engine v2.0</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Print Once. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
                Control Forever.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Transform static physical touchpoints into dynamic marketing assets. Route traffic in real-time, enforce design sovereignty, and capture high-fidelity analytics with sub-100ms resolution.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/register" className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-200 text-black font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 group">
                <span>Enter Command Center</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/demo" className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-all border border-slate-800">
                View Documentation
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Floating UI Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <motion.div animate={floatAnimation} className="relative w-full aspect-square max-w-md mx-auto">
              {/* Mock Dashboard Card */}
              <div className="absolute top-10 right-0 w-64 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl z-20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Live Scans</span>
                  <Activity className="w-4 h-4 text-slate-300" />
                </div>
                <div className="flex items-end space-x-2 mb-2">
                  <div className="text-3xl font-bold text-white">2,847</div>
                  <div className="text-xs text-green-400 mb-1">+14%</div>
                </div>
                {/* Mock Chart Bars */}
                <div className="flex items-end space-x-1.5 h-12 mt-4">
                  {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                    <div key={i} className="w-full bg-slate-700 rounded-t-sm" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>

              {/* Mock QR Target Card */}
              <div className="absolute bottom-10 left-0 w-72 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-5 shadow-2xl z-30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-white p-1 rounded-lg">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">NYC Billboard Campaign</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center">
                      <RefreshCw className="w-3 h-3 mr-1" /> Active Redirect
                    </div>
                  </div>
                </div>
                <div className="bg-slate-950 rounded-lg p-2 text-xs text-slate-500 font-mono flex items-center justify-between border border-slate-800">
                  <span className="truncate mr-2">nexusqr.com/r/nyc-01</span>
                  <ArrowRight className="w-3 h-3 shrink-0" />
                </div>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute inset-0 bg-slate-800/20 border border-slate-700/50 rounded-full scale-75 z-0" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="border-y border-slate-800 bg-slate-900/30 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4 md:mb-0">Trusted by modern teams</p>
          <div className="flex space-x-8 lg:space-x-12">
            <span className="text-xl font-bold">Acme Corp</span>
            <span className="text-xl font-bold">GlobalTech</span>
            <span className="text-xl font-bold">Stark Ind.</span>
            <span className="text-xl font-bold hidden sm:block">Wayne Ent.</span>
          </div>
        </div>
      </section>

      {/* Solutions / Targeted Use Cases Section */}
      <section id="solutions" className="py-24 px-6 relative z-10 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:flex md:justify-between md:items-end">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Adaptable to Any Industry</h2>
              <p className="text-slate-400 text-lg">
                Physical materials shouldn't limit your digital agility. See how different sectors leverage dynamic redirection.
              </p>
            </div>
            <Link to="/cases" className="hidden md:inline-flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white transition-colors group">
              <span>View all case studies</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bento Box Layout */}
            <div className="lg:col-span-2 p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6">
                <Coffee className="w-6 h-6 text-slate-100" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Hospitality</h3>
              <p className="text-slate-400 leading-relaxed max-w-md">
                Deploy table-top digital menus that automatically swap between breakfast, lunch, and dinner shifts based on the time of day, completely eliminating reprint costs.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6">
                <Home className="w-6 h-6 text-slate-100" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real Estate</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Yard signage that updates in real-time. Change a single link destination from "Coming Soon" to "Open House" to "Sold" without moving the physical sign.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6">
                <ShoppingBag className="w-6 h-6 text-slate-100" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Retail & CPG</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Transform product packaging into a rotating digital storefront. Link to seasonal promotions, video manuals, or loyalty sign-ups on the fly.
              </p>
            </div>

            <div className="lg:col-span-2 p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-end relative overflow-hidden">
              {/* Subtle background element for visual weight */}
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <CalendarDays className="w-48 h-48 text-white" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6">
                  <CalendarDays className="w-6 h-6 text-slate-100" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Live Events</h3>
                <p className="text-slate-400 leading-relaxed max-w-md">
                  Dynamic attendee badges and venue posters that route users to the most current scheduling info, live maps, or emergency broadcast channels as the event progresses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars (Features) Section */}
      <section id="features" className="py-24 px-6 relative z-10 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Engineered for Enterprise</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to manage physical-to-digital touchpoints securely and beautifully.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<RefreshCw className="w-6 h-6 text-slate-100" />}
              title="Dynamic Flexibility"
              description="Update destination URLs instantly post-printing. Never reprint a broken code or outdated campaign again."
            />
            <FeatureCard 
              icon={<Palette className="w-6 h-6 text-slate-100" />}
              title="Design Sovereignty"
              description="Craft high-resolution QR codes with custom colors, gradients, logos, and frames using our real-time canvas."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-slate-100" />}
              title="Actionable Intelligence"
              description="Capture OS, device type, and geographic data with our robust time-series analytics dashboard."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-slate-100" />}
              title="Enterprise Security"
              description="Bank-grade JWT authentication and secure, isolated workspaces for your team and campaign data."
            />
          </div>
        </div>
      </section>

      <div id="pricing">
        <Pricing />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <QrCode className="w-5 h-5 text-slate-500" />
            <span className="text-lg font-bold tracking-tight text-slate-300">NexusQR</span>
          </div>
          <div className="flex space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;