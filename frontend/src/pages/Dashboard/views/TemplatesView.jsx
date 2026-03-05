import React from 'react';
import { 
  Search, Filter, Plus, LayoutTemplate, 
  Copy, Trash2, Edit2, CheckCircle2, QrCode
} from 'lucide-react';

const TemplatesView = () => {
  // Mock data for user's saved design templates
  const mockTemplates = [
    {
      id: '1',
      name: 'Default Corporate',
      usedCount: 45,
      style: { dotType: 'rounded', frame: 'square', color: 'bg-slate-900 dark:bg-slate-100' },
      isDefault: true,
    },
    {
      id: '2',
      name: 'Modern Circular',
      usedCount: 12,
      style: { dotType: 'dots', frame: 'circle', color: 'bg-slate-700 dark:bg-slate-300' },
      isDefault: false,
    },
    {
      id: '3',
      name: 'Marketing Campaign (Dark)',
      usedCount: 8,
      style: { dotType: 'classy', frame: 'rounded', color: 'bg-slate-950 dark:bg-slate-50' },
      isDefault: false,
    },
    {
      id: '4',
      name: 'Minimalist Event',
      usedCount: 3,
      style: { dotType: 'square', frame: 'none', color: 'bg-slate-600 dark:bg-slate-400' },
      isDefault: false,
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
              Design Templates
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Save your brand colors, logos, and frame shapes to generate QR codes faster.
            </p>
          </div>
          
          {/* Primary Action */}
          <button className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg shadow-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 shrink-0">
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </button>
        </div>

        {/* Toolbar: Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="relative flex-1 w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 sm:text-sm transition-colors"
              placeholder="Search templates..."
            />
          </div>
          
          <button className="inline-flex items-center justify-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors sm:w-auto w-full text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* "Create New" Card inside Grid */}
          <button className="flex flex-col items-center justify-center p-6 h-72 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all group">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
              Create Blank Template
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 text-center">
              Start from scratch with custom colors and shapes.
            </p>
          </button>

          {/* Render Saved Templates */}
          {mockTemplates.map((template) => (
            <div 
              key={template.id} 
              className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group overflow-hidden"
            >
              {/* Visual Preview Area */}
              <div className="h-48 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-center relative border-b border-slate-100 dark:border-slate-800">
                
                {/* Mock QR Rendering based on style */}
                <div className={`w-28 h-28 p-2 bg-white rounded-lg flex items-center justify-center shadow-sm relative`}>
                  <div className={`w-full h-full grid grid-cols-3 gap-1 ${template.style.color} opacity-90`}>
                    {/* Fake QR pattern */}
                    <div className="col-span-1 row-span-1 rounded-sm border-[3px] border-white outline outline-2 outline-inherit"></div>
                    <div className="col-span-1 row-span-1"></div>
                    <div className="col-span-1 row-span-1 rounded-sm border-[3px] border-white outline outline-2 outline-inherit"></div>
                    <div className="col-span-3 row-span-1 opacity-50"></div>
                    <div className="col-span-1 row-span-1 rounded-sm border-[3px] border-white outline outline-2 outline-inherit"></div>
                    <div className="col-span-2 row-span-1 flex items-end justify-end"><QrCode className="w-6 h-6 text-white mix-blend-difference" /></div>
                  </div>
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button className="p-2 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform" title="Edit Template">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform" title="Duplicate">
                    <Copy className="w-4 h-4" />
                  </button>
                  {!template.isDefault && (
                    <button className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Template Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate pr-2">
                      {template.name}
                    </h3>
                    {template.isDefault && (
                      <span title="Default Template">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {template.style.frame} Frame • {template.style.dotType}
                  </p>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                    Used {template.usedCount} times
                  </span>
                  <button className="text-xs font-semibold text-slate-900 dark:text-white hover:underline">
                    Apply Design
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

export default TemplatesView;