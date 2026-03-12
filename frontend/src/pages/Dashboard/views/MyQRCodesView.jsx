import React, { useState, useEffect } from 'react';
import { fetchMyQRCodes, deleteQRCode } from '../../../api/qrcode.api'; // Import deleteQRCode
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, Link as LinkIcon, BarChart2, Calendar, Copy, CheckCircle2, QrCode, Trash2 } from 'lucide-react'; // Added Trash2

const MyQRCodesView = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // Track which one is deleting

  useEffect(() => {
    const loadQRCodes = async () => {
      try {
        const result = await fetchMyQRCodes();
        if (result.success) setQrCodes(result.data);
      } catch (err) {
        setError(err.message || "Failed to load QR codes.");
      } finally {
        setLoading(false);
      }
    };
    loadQRCodes();
  }, []);

  const handleCopyLink = (shortId) => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace('/api', '') || 'http://localhost:5000';
    navigator.clipboard.writeText(`${baseUrl}/q/${shortId}`);
    setCopiedId(shortId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // NEW: Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this QR code? The printed code will stop working.")) return;
    
    setDeletingId(id);
    try {
      await deleteQRCode(id);
      // Remove it from the UI immediately
      setQrCodes(prev => prev.filter(qr => qr.id !== id));
    } catch (err) {
      alert("Failed to delete QR Code: " + (err.message || "Unknown error"));
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p>Loading your QR codes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl max-w-md text-center">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">My QR Codes</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and track your generated QR campaigns.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">{qrCodes.length}</span>
          </div>
        </div>

        {qrCodes.length === 0 ? (
           /* Empty State */
           <div className="p-8 text-center text-slate-500">No QR codes yet.</div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map((qr) => (
              <div key={qr.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                {/* Top Section */}
                <div className="p-5 flex gap-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-24 h-24 bg-white border border-slate-200 rounded-xl p-2 shrink-0 flex items-center justify-center">
                    <QRCodeSVG value={`${import.meta.env.VITE_BACKEND_URL?.replace('/api', '') || 'http://localhost:5000'}/q/${qr.shortId}`} size={80} level={"H"} />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate" title={qr.title}>{qr.title}</h3>
                    <div className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md w-max mt-1 mb-2">{qr.qrType}</div>
                    <div className="flex items-center text-xs text-slate-500 mt-auto">
                      <Calendar className="w-3.5 h-3.5 mr-1" /> {formatDate(qr.createdAt)}
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
                    <button 
                      onClick={() => handleCopyLink(qr.shortId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 transition-colors shadow-sm"
                    >
                      {copiedId === qr.shortId ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4 text-slate-400" />}
                    </button>
                    
                    {/* DELETE BUTTON */}
                    <button 
                      onClick={() => handleDelete(qr.id)}
                      disabled={deletingId === qr.id}
                      className="p-1.5 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg text-slate-400 transition-colors shadow-sm disabled:opacity-50"
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