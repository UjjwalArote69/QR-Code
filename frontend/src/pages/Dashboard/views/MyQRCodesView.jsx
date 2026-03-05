import React, { useState } from 'react';
import { 
  Search, Filter, Plus, MoreVertical, BarChart2, 
  Download, Edit2, Copy, ExternalLink, Globe, 
  FileText, Smartphone, CheckCircle2, Clock
} from 'lucide-react';

const MyQRCodesView = () => {
  // Mock data representing the user's saved QR codes
  const mockQRCodes = [
    {
      id: '1',
      name: 'Spring Menu 2026',
      type: 'PDF',
      icon: FileText,
      shortLink: 'nexusqr.com/r/sp-menu',
      scans: 1248,
      trend: '+12%',
      status: 'active',
      date: 'Mar 2, 2026',
    },
    {
      id: '2',
      name: 'NYC Subway Ad Campaign',
      type: 'Website',
      icon: Globe,
      shortLink: 'nexusqr.com/r/nyc-sub',
      scans: 8930,
      trend: '+45%',
      status: 'active',
      date: 'Feb 15, 2026',
    },
    {
      id: '3',
      name: 'App Download Banner',
      type: 'App Store',
      icon: Smartphone,
      shortLink: 'nexusqr.com/r/app-dl',
      scans: 412,
      trend: '-2%',
      status: 'paused',
      date: 'Jan 10, 2026',
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              My QR Codes
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage, edit, and track your existing campaigns.
            </p>
          </div>
          
          {/* Primary Action */}
          <button className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg shadow-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 shrink-0">
            <Plus className="w-4 h-4" />
            <span>Create QR Code</span>
          </button>
        </div>

        {/* Toolbar: Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 sm:text-sm transition-colors"
              placeholder="Search campaigns, tags, or links..."
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="inline-flex items-center justify-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors sm:w-auto w-full text-sm font-medium">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* QR Code List */}
        <div className="space-y-4">
          {mockQRCodes.map((qr) => (
            <div 
              key={qr.id} 
              className="flex flex-col lg:flex-row lg:items-center justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all group gap-6"
            >
              
              {/* Left Column: Icon & Details */}
              <div className="flex items-start lg:items-center gap-4 flex-1 min-w-0">
                {/* QR Thumbnail Placeholder */}
                <div className="w-16 h-16 shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center relative overflow-hidden group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors cursor-pointer">
                  {/* Visual representation of a QR code */}
                  <div className="grid grid-cols-2 gap-0.5 p-2 w-full h-full opacity-50 dark:opacity-40">
                    <div className="bg-slate-800 dark:bg-slate-300 rounded-sm"></div>
                    <div className="bg-slate-800 dark:bg-slate-300 rounded-sm"></div>
                    <div className="bg-slate-800 dark:bg-slate-300 rounded-sm"></div>
                    <div className="bg-slate-800 dark:bg-slate-300 rounded-sm w-3/4 h-3/4 self-end justify-self-end"></div>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg truncate hover:underline cursor-pointer">
                      {qr.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      qr.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {qr.status === 'active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {qr.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <qr.icon className="w-3.5 h-3.5" />
                      <span>{qr.type}</span>
                    </div>
                    <span>•</span>
                    <span className="truncate">{qr.date}</span>
                  </div>

                  {/* Short Link Action */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md max-w-sm">
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-mono truncate select-all">
                        {qr.shortLink}
                      </span>
                    </div>
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" title="Copy Link">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" title="Visit Link">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Middle Column: Quick Stats */}
              <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t lg:border-t-0 border-slate-100 dark:border-slate-800/50 pt-4 lg:pt-0 lg:px-6 shrink-0 w-full lg:w-48">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 lg:mb-0">
                  Total Scans
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">
                    {qr.scans.toLocaleString()}
                  </span>
                  <span className={`text-xs font-medium mb-0.5 ${
                    qr.trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {qr.trend}
                  </span>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center justify-end gap-2 shrink-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800/50 pt-4 lg:pt-0">
                <button className="inline-flex items-center justify-center px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2 ml-1">
                  <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors" title="Analytics">
                    <BarChart2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors" title="Edit Content">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors" title="More Options">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyQRCodesView;