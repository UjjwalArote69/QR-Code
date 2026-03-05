import React from 'react';
import { 
  Settings, Moon, Globe, Shield, 
  Database, Trash2, ChevronRight, 
  Languages, Fingerprint, Download
} from 'lucide-react';

const SettingsView = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure your workspace, preferences, and data management.
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Section: Appearance */}
          <SettingsSection title="Appearance" icon={Moon}>
            <div className="space-y-4">
              <SettingsRow 
                title="Theme Preference" 
                description="Choose between light and dark mode or follow system."
                action={<ThemePills />}
              />
              <SettingsRow 
                title="Language" 
                description="Select your preferred interface language."
                action={
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Languages className="w-4 h-4" />
                    <span>English (US)</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                }
              />
            </div>
          </SettingsSection>

          {/* Section: Security */}
          <SettingsSection title="Security & Access" icon={Shield}>
            <div className="space-y-4">
              <SettingsRow 
                title="Two-Factor Authentication" 
                description="Add an extra layer of security to your account."
                action={<StatusBadge text="Enabled" color="green" />}
              />
              <SettingsRow 
                title="Active Sessions" 
                description="Manage and sign out of other active devices."
                action={<button className="text-sm font-bold text-slate-900 dark:text-white hover:underline">View All</button>}
              />
            </div>
          </SettingsSection>

          {/* Section: Data Management */}
          <SettingsSection title="Data & Privacy" icon={Database}>
            <div className="space-y-4">
              <SettingsRow 
                title="Export Data" 
                description="Download a copy of all your QR codes and scan history."
                action={
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                }
              />
              <SettingsRow 
                title="Delete Account" 
                description="Permanently remove your account and all associated data."
                action={
                  <button className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-sm font-bold transition-all">
                    <Trash2 className="w-4 h-4" />
                    <span>Terminate</span>
                  </button>
                }
              />
            </div>
          </SettingsSection>

        </div>
      </div>
    </div>
  );
};

/* --- Internal Helper Components --- */

const SettingsSection = ({ title, icon: Icon, children }) => (
  <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const SettingsRow = ({ title, description, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
    <div className="max-w-md">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
    </div>
    <div className="flex shrink-0">
      {action}
    </div>
  </div>
);

const ThemePills = () => (
  <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
    <button className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg shadow-sm">Dark</button>
    <button className="px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300">Light</button>
  </div>
);

const StatusBadge = ({ text, color }) => (
  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-${color}-100 dark:bg-${color}-900/30 text-${color}-700 dark:text-${color}-400 border border-${color}-200 dark:border-${color}-800/50`}>
    {text}
  </span>
);

export default SettingsView;