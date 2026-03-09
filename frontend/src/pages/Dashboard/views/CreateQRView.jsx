import React from 'react';
import QRGridSection from '../components/QRGridSection';
import {
  Globe, FileText, ImageIcon, UserSquare, Video, AlignJustify,
  Smile, Music, Building2, Ticket, Smartphone, Monitor,
  Type, Mail, MessageSquare, Wifi
} from "lucide-react";

const CreateQRView = () => {
  const dynamicQrTypes = [
    { name: "Website", desc: "Open a URL", icon: Globe },
    { name: "PDF", desc: "Show a PDF", icon: FileText },
    { name: "Images", desc: "Show an image gallery", icon: ImageIcon },
    { name: "vCard Plus", desc: "Share contact details", icon: UserSquare },
    { name: "Video", desc: "Show a video", icon: Video },
    { name: "List of links", desc: "Group links", icon: AlignJustify },
    { name: "Social Media", desc: "Share your social profiles", icon: Smile },
    { name: "MP3", desc: "Play an audio file", icon: Music },
    { name: "Business", desc: "Share information about your business", icon: Building2 },
    { name: "Coupon", desc: "Share a coupon", icon: Ticket },
    { name: "Apps", desc: "Redirect to app stores", icon: Smartphone },
    { name: "Landing page", desc: "Create a custom page", icon: Monitor },
  ];

  const staticQrTypes = [
    { name: "Text", desc: "Display plain text", icon: Type },
    { name: "Email", desc: "Send an email", icon: Mail },
    { name: "SMS", desc: "Send a text message", icon: MessageSquare },
    { name: "Wi-Fi", desc: "Connect to a wireless network", icon: Wifi },
  ];

  return (
    // Changed to flex-col on small screens, xl:flex-row for large screens
    <div className="flex-1 flex flex-col xl:flex-row overflow-y-auto xl:overflow-hidden">
      
      {/* Main Grid Area */}
      <div className="flex-1 xl:overflow-y-auto p-4 sm:p-8 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <QRGridSection 
            title="Dynamic QR" badge="with tracking"
            description="Update content in real time, without changing your code."
            items={dynamicQrTypes}
          />
          <QRGridSection 
            title="Static QR" badge="no tracking"
            description="Fixed content that cannot be changed once printed."
            items={staticQrTypes}
          />
        </div>
      </div>

      {/* RIGHT PREVIEW PANE */}
      {/* Changed to w-full on mobile, fixed w-[450px] on xl */}
      <aside className="w-full xl:w-[450px] border-t xl:border-t-0 xl:border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-12 px-4 shrink-0 xl:overflow-y-auto transition-colors duration-300">
        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-8">Example</h2>
        
        {/* Made the phone frame scale down slightly on very small screens */}
        <div className="relative w-[280px] sm:w-[320px] h-[580px] sm:h-[650px] rounded-[3rem] border-[12px] border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 shadow-xl dark:shadow-2xl flex items-center justify-center overflow-hidden transition-colors duration-300">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-200 dark:bg-slate-900 rounded-full z-20 transition-colors duration-300"></div>
          <div className="text-center space-y-2 p-6">
            <p className="text-lg text-slate-400 dark:text-slate-500 font-medium tracking-wide">
              double click<br />to replace
            </p>
          </div>
          <div className="absolute top-32 -left-3.5 w-1 h-12 bg-slate-300 dark:bg-slate-800 rounded-l-md transition-colors duration-300"></div>
          <div className="absolute top-48 -left-3.5 w-1 h-12 bg-slate-300 dark:bg-slate-800 rounded-l-md transition-colors duration-300"></div>
          <div className="absolute top-40 -right-3.5 w-1 h-16 bg-slate-300 dark:bg-slate-800 rounded-r-md transition-colors duration-300"></div>
        </div>
      </aside>
      
    </div>
  );
};

export default CreateQRView;