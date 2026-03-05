import React, { useState } from 'react';
import { 
  QrCode, BarChart2, LayoutTemplate, CreditCard, User, 
  HelpCircle, Phone, Settings, PanelLeftClose, PanelLeftOpen,
  PlusSquare // Imported the new icon for creating QRs
} from 'lucide-react';

const Sidebar = ({ activeNav, setActiveNav }) => {
  // Local state to handle sidebar collapse/expand
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Main Navigation Links
  const mainNav = [
    { name: 'Create QR', icon: PlusSquare },       // New: For creating new QR codes
    { name: 'My QR Codes', icon: QrCode },         // New: For viewing existing QR codes
    { name: 'Statistics', icon: BarChart2 },
    { name: 'Templates', icon: LayoutTemplate },
    { name: 'Plans & Payments', icon: CreditCard },
    { name: 'User Profile', icon: User },
  ];

  // Bottom Navigation Links
  const bottomNav = [
    { name: 'Help Center', icon: HelpCircle },
    { name: 'Contact', icon: Phone },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between shrink-0 h-screen transition-all duration-300 ease-in-out`}
    >
      <div>
        {/* Sidebar Header / Collapse Button */}
        <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-end px-4'} border-b border-slate-200 dark:border-slate-800 transition-all duration-300`}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Main Nav */}
        <nav className="p-4 space-y-2">
          {mainNav.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveNav(item.name)}
              title={isCollapsed ? item.name : ""} // Shows tooltip when collapsed
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeNav === item.name
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeNav === item.name ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`} />
              
              {/* Text fades out/hides when collapsed */}
              {!isCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Nav */}
      <div className="p-4 space-y-2 mb-4">
        {bottomNav.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveNav(item.name)} 
            title={isCollapsed ? item.name : ""}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeNav === item.name
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
            }`}
          >
            <item.icon className={`w-5 h-5 shrink-0 ${activeNav === item.name ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`} />
            
            {!isCollapsed && (
              <span className="truncate">{item.name}</span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;