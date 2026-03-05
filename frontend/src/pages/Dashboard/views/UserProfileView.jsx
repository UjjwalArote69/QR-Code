import React, { useState } from 'react';
import { 
  User, Mail, Shield, Bell, Smartphone, 
  Camera, Check, AlertCircle, LogOut 
} from 'lucide-react';

const UserProfileView = () => {
  // Mock User Data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@mekagroup.com',
    role: 'Full Stack Developer',
    avatar: null
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              User Profile
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your personal information and account security.
            </p>
          </div>
          <button className="inline-flex items-center space-x-2 px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-all text-sm font-semibold">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Card */}
            <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Personal Details</h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    <User className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{userData.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{userData.role}</p>
                  <span className="inline-flex items-center mt-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase rounded border border-green-200 dark:border-green-800/50">
                    Verified Account
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      defaultValue={userData.name}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-700 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="email" 
                      defaultValue={userData.email}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-700 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all text-sm">
                  Save Changes
                </button>
              </div>
            </section>

            {/* Notification Settings */}
            <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div className="flex items-center space-x-2 mb-6">
                <Bell className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h2>
              </div>
              
              <div className="space-y-4">
                <ToggleRow title="Email Alerts" description="Receive weekly analytics reports via email." active />
                <ToggleRow title="Product Updates" description="Get notified about new QR shapes and features." active />
                <ToggleRow title="Scan Thresholds" description="Alert me when a QR code hits 1,000 scans." />
              </div>
            </section>
          </div>

          {/* Right Column: Security & Status */}
          <div className="space-y-6">
            
            {/* Security Card */}
            <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300">
                    <Smartphone className="w-4 h-4" />
                    <span>Two-Factor Auth</span>
                  </div>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">ENABLED</span>
                </div>
                
                <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                  Change Password
                </button>
              </div>
            </section>

            {/* Plan Usage Card */}
            <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white shadow-xl shadow-slate-200 dark:shadow-black/50 overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Current Plan</h3>
                <div className="text-2xl font-bold mb-1">Professional</div>
                <p className="text-xs text-slate-400 mb-6">$39 / billed annually</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Dynamic QRs</span>
                    <span>12 / Unlimited</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-[40%]" />
                  </div>
                </div>

                <button className="w-full mt-6 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-slate-200 transition-all">
                  Manage Subscription
                </button>
              </div>
              {/* Decorative Background Icon */}
              <Shield className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

// Internal Toggle Component
const ToggleRow = ({ title, description, active = false }) => (
  <div className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all">
    <div>
      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </div>
    <button className={`w-10 h-5 rounded-full transition-colors relative ${active ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-800'}`}>
      <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${active ? 'bg-white dark:bg-slate-900 left-6' : 'bg-slate-400 dark:bg-slate-600 left-1'}`} />
    </button>
  </div>
);

export default UserProfileView;