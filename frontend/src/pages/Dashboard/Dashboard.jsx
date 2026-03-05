import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { ChevronRight } from "lucide-react"; // Import Chevron for the breadcrumb

// Your Views
import CreateQRView from "./views/CreateQRView";
import MyQRCodesView from "./views/MyQRCodesView";
import StatisticsView from "./views/StatisticsView";
import TemplatesView from "./views/TemplatesView";
import PlansView from "./views/PlansView";
import UserProfileView from "./views/UserProfileView";
import HelpCenterView from "./views/HelpCenterView";
import ContactView from "./views/ContactView";
import SettingsView from "./views/SettingsView";

const Dashboard = () => {
  const [activeNav, setActiveNav] =
    useState("Create QR");

  // Helper to figure out what goes in the main body
  const renderContent = () => {
    switch (activeNav) {
      case "Create QR":
        return <CreateQRView />;
      case "My QR Codes":
        return <MyQRCodesView />;
      case "Statistics":
        return <StatisticsView />;
      case "Templates":
        return <TemplatesView />;
      case "Plans & Payments":
        return <PlansView />;
      case "User Profile":
        return <UserProfileView />;
      case "Help Center":
        return <HelpCenterView />;
      case "Contact":
        return <ContactView />;
      case "Settings":
        return <SettingsView />;
      default:
        return <CreateQRView />;
    }
  };

  // Helper to figure out what goes in the Topbar's left side
  const getTopbarContent = () => {
    switch (activeNav) {
      case "Create QR":
        // Show the breadcrumb ONLY on the Create QR page
        return (
          <div className="flex items-center space-x-2 text-sm hidden sm:flex">
            <div className="flex items-center px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md font-medium border border-slate-300 dark:border-slate-700 transition-colors">
              Select a QR Code
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600" />
            <div className="flex items-center px-3 py-1.5 text-slate-500 dark:text-slate-400 font-medium">
              Content
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600" />
            <div className="flex items-center px-3 py-1.5 text-slate-500 dark:text-slate-400 font-medium">
              Design
            </div>
          </div>
        );

      case "My QR Codes":
        // Show a simple title for the Library page
        return (
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Library
          </h2>
        );

      case "Help Center":
        return (
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white text-sm">
            Help & Documentation
          </h2>
        );
      case "Contact":
        return (
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Get in Touch
          </h2>
        );
      case "Settings":
        return (
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            General Settings
          </h2>
        );
      default:
        // Default fallback
        return (
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {activeNav}
          </h2>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden selection:bg-slate-200 dark:selection:bg-slate-700/50 transition-colors duration-300">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Pass the dynamic content to the Topbar */}
        <Topbar
          leftContent={getTopbarContent()}
        />

        {/* Render the main view below */}
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
