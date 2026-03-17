import React, { useState, useEffect, useMemo, useRef } from 'react';
import { fetchMyQRCodes, deleteQRCode } from '../../../api/qrcode.api';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import {
  Loader2, Link as LinkIcon, BarChart2, Calendar,
  CheckCircle2, QrCode, Trash2, Search, Download, Filter, RefreshCw,
  ChevronDown, FileImage, FileText, Image
} from 'lucide-react';

const MyQRCodesView = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Interaction States
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // 1. Extracted fetch logic into a reusable function
  const loadQRCodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMyQRCodes();
      if (result.success) setQrCodes(result.data);
    } catch (err) {
      setError(err.message || "Failed to load QR codes.");
    } finally {
      setLoading(false);
    }
  };

  // Call it on initial mount
  useEffect(() => {
    loadQRCodes();
  }, []);

  const handleCopyLink = (shortId) => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace('/api', '') || 'http://localhost:5000';
    navigator.clipboard.writeText(`${baseUrl}/q/${shortId}`);
    setCopiedId(shortId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this QR code? The printed code will stop working.")) return;
    
    setDeletingId(id);
    try {
      await deleteQRCode(id);
      setQrCodes(prev => prev.filter(qr => qr.id !== id));
    } catch (err) {
      alert("Failed to delete QR Code: " + (err.message || "Unknown error"));
    } finally {
      setDeletingId(null);
    }
  };

  // Export dropdown state
  const [exportMenuId, setExportMenuId] = useState(null);
  const exportMenuRef = useRef(null);

  // Close export menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setExportMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper: get SVG data URL at a given size for raster export
  const svgToCanvas = (qrId, size = 1024) => {
    return new Promise((resolve, reject) => {
      const svgElement = document.getElementById(`qr-${qrId}`);
      if (!svgElement) return reject(new Error('SVG not found'));

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
      img.src = url;
    });
  };

  const slugify = (title) => title.replace(/\s+/g, '-').toLowerCase();

  const handleDownload = async (qrId, title, format) => {
    setExportMenuId(null);
    const filename = slugify(title);

    if (format === 'svg') {
      const svgElement = document.getElementById(`qr-${qrId}`);
      if (!svgElement) return;
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-qr.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    try {
      const canvas = await svgToCanvas(qrId, 1024);

      if (format === 'png') {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}-qr.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/png');
      } else if (format === 'jpeg') {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}-qr.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/jpeg', 0.95);
      } else if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const qrSize = 120;
        const x = (pageWidth - qrSize) / 2;
        const y = 40;
        pdf.setFontSize(18);
        pdf.text(title, pageWidth / 2, 25, { align: 'center' });
        pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize);
        pdf.setFontSize(10);
        pdf.setTextColor(120);
        pdf.text('Generated by NexusQR', pageWidth / 2, y + qrSize + 12, { align: 'center' });
        pdf.save(`${filename}-qr.pdf`);
      }
    } catch (err) {
      console.error(`Failed to export as ${format}:`, err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Derived state for filtering and searching
  const filteredQRCodes = useMemo(() => {
    return qrCodes.filter(qr => {
      const matchesSearch = qr.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || qr.qrType === filterType;
      return matchesSearch && matchesType;
    });
  }, [qrCodes, searchTerm, filterType]);

  const uniqueTypes = ['All', ...new Set(qrCodes.map(qr => qr.qrType))];

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl max-w-md text-center border border-red-100">
          <p className="font-medium">{error}</p>
        </div>
        <button 
          onClick={loadQRCodes}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-slate-700"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">My QR Codes</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage, track, and download your generated campaigns.</p>
          </div>
          
          {/* Action Buttons & Stats */}
          <div className="flex items-center gap-3 w-max">
            {/* 2. REFRESH BUTTON */}
            <button
              onClick={loadQRCodes}
              disabled={loading}
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-blue-500' : ''}`} />
            </button>

            <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {loading && qrCodes.length === 0 ? '-' : qrCodes.length} Total
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search and Filter */}
        {(!loading || qrCodes.length > 0) && qrCodes.length > 0 && (
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search campaigns..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              />
            </div>
            <div className="relative min-w-[160px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              >
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Skeleton Loading State (Only show on initial load when no data exists) */}
        {loading && qrCodes.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 animate-pulse h-[180px]">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mt-4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredQRCodes.length === 0 ? (
           /* Empty State */
           <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mt-8">
             <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4">
               <QrCode className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No QR Codes Found</h3>
             <p className="text-slate-500 max-w-sm mb-6 text-sm">
               {qrCodes.length === 0 
                 ? "You haven't created any QR campaigns yet. Head over to the Create tab to get started."
                 : "No QR codes match your current search and filter settings."}
             </p>
           </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQRCodes.map((qr) => (
              <div key={qr.id} className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
                
                {/* Top Section */}
                <div className="p-5 flex gap-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-24 h-24 bg-white border border-slate-200 rounded-xl p-2 shrink-0 flex items-center justify-center relative group-hover:border-blue-200 transition-colors">
                    <QRCodeSVG 
                      id={`qr-${qr.id}`}
                      value={`${import.meta.env.VITE_BACKEND_URL?.replace('/api', '') || 'http://localhost:5000'}/q/${qr.shortId}`} 
                      size={80} 
                      level={"H"} 
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate" title={qr.title}>{qr.title}</h3>
                    <div className="inline-block px-2.5 py-0.5 bg-blue-50/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider rounded-md w-max mt-1.5 mb-2 border border-blue-100 dark:border-blue-800">
                      {qr.qrType}
                    </div>
                    <div className="flex items-center text-xs text-slate-500 mt-auto">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" /> {formatDate(qr.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Stats & Actions */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <BarChart2 className="w-4 h-4 text-emerald-500" />
                    <span>{qr.scanCount} scans</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* DOWNLOAD DROPDOWN */}
                    <div className="relative" ref={exportMenuId === qr.id ? exportMenuRef : null}>
                      <button
                        onClick={() => setExportMenuId(exportMenuId === qr.id ? null : qr.id)}
                        className="flex items-center gap-0.5 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors shadow-sm"
                        title="Download QR Code"
                      >
                        <Download className="w-4 h-4" />
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {exportMenuId === qr.id && (
                        <div className="absolute right-0 bottom-full mb-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 py-1 animate-in fade-in duration-150">
                          <button onClick={() => handleDownload(qr.id, qr.title, 'svg')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <QrCode className="w-4 h-4 text-slate-400" /> SVG
                          </button>
                          <button onClick={() => handleDownload(qr.id, qr.title, 'png')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <FileImage className="w-4 h-4 text-blue-400" /> PNG
                          </button>
                          <button onClick={() => handleDownload(qr.id, qr.title, 'jpeg')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <Image className="w-4 h-4 text-amber-400" /> JPEG
                          </button>
                          <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                          <button onClick={() => handleDownload(qr.id, qr.title, 'pdf')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <FileText className="w-4 h-4 text-red-400" /> PDF
                          </button>
                        </div>
                      )}
                    </div>

                    {/* COPY LINK BUTTON */}
                    <button 
                      onClick={() => handleCopyLink(qr.shortId)}
                      className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors shadow-sm"
                      title="Copy Tracking Link"
                    >
                      {copiedId === qr.shortId ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
                    </button>
                    
                    {/* DELETE BUTTON */}
                    <button 
                      onClick={() => handleDelete(qr.id)}
                      disabled={deletingId === qr.id}
                      className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg text-slate-500 transition-colors shadow-sm disabled:opacity-50"
                      title="Delete QR Code"
                    >
                      {deletingId === qr.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQRCodesView;