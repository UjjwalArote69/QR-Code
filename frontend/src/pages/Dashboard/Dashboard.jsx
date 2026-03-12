/* eslint-disable react-refresh/only-export-components */
import { useState, Suspense, lazy, createContext } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { ChevronRight, Loader2 } from "lucide-react";
import { ContainerLoader } from "../../components/layout/Loader";

// 1. Create Context to share builder state with the Topbar and Forms
export const BuilderContext = createContext();

// Lazy Load Dashboard Views
const CreateQRView = lazy(() => import("./views/CreateQRView"));
const MyQRCodesView = lazy(() => import("./views/MyQRCodesView"));
const StatisticsView = lazy(() => import("./views/StatisticsView"));
const TemplatesView = lazy(() => import("./views/TemplatesView"));
const PlansView = lazy(() => import("./views/PlansView"));
const UserProfileView = lazy(() => import("./views/UserProfileView"));
const HelpCenterView = lazy(() => import("./views/HelpCenterView"));
const ContactView = lazy(() => import("./views/ContactView"));
const SettingsView = lazy(() => import("./views/SettingsView"));

const ViewLoader = () => (
  <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
    <Loader2 className="w-8 h-8 animate-spin text-slate-400 dark:text-slate-600" />
  </div>
);

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState("Create QR");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- GLOBAL BUILDER STATE ---
  const [builderStep, setBuilderStep] = useState(1); // 1: Type, 2: Content, 3: Design
  const [selectedType, setSelectedType] = useState(null);

  const renderContent = () => {
    switch (activeNav) {
      case "Create QR": return <CreateQRView />;
      case "My QR Codes": return <MyQRCodesView />;
      case "Statistics": return <StatisticsView />;
      case "Templates": return <TemplatesView />;
      case "Plans & Payments": return <PlansView />;
      case "User Profile": return <UserProfileView />;
      case "Help Center": return <HelpCenterView />;
      case "Contact": return <ContactView />;
      case "Settings": return <SettingsView />;
      default: return <CreateQRView />;
    }
  };

  const getTopbarContent = () => {
    switch (activeNav) {
      case "Create QR":
        return (
          // Dynamic Clickable Breadcrumbs
          <div className="flex items-center space-x-1 sm:space-x-2 text-[13px] sm:text-sm">
            <button 
              onClick={() => { setBuilderStep(1); setSelectedType(null); }}
              className={`flex items-center px-2 sm:px-3 py-1.5 rounded-md font-medium transition-all ${builderStep === 1 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <span className="hidden sm:inline mr-1">1.</span> Type
            </button>
            
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600" />
            
            <button 
              onClick={() => selectedType && setBuilderStep(2)}
              disabled={!selectedType}
              className={`flex items-center px-2 sm:px-3 py-1.5 rounded-md font-medium transition-all ${builderStep === 2 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : selectedType ? 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer' : 'text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed'}`}
            >
              <span className="hidden sm:inline mr-1">2.</span> Content
            </button>
            
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600" />
            
            <button 
              onClick={() => selectedType && setBuilderStep(3)}
              disabled={!selectedType}
              className={`flex items-center px-2 sm:px-3 py-1.5 rounded-md font-medium transition-all ${builderStep === 3 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : selectedType ? 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer' : 'text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed'}`}
            >
              <span className="hidden sm:inline mr-1">3.</span> Design
            </button>
          </div>
        );
      case "My QR Codes": return <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Library</h2>;
      case "Help Center": return <h2 className="text-lg font-semibold text-slate-900 dark:text-white text-sm">Help & Docs</h2>;
      case "Contact": return <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Get in Touch</h2>;
      case "Settings": return <h2 className="text-lg font-semibold text-slate-900 dark:text-white">General Settings</h2>;
      default: return <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{activeNav}</h2>;
    }
  };

  return (
    // Wrap the app in the Context Provider
    <BuilderContext.Provider value={{ builderStep, setBuilderStep, selectedType, setSelectedType }}>
      <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden selection:bg-slate-200 dark:selection:bg-slate-700/50 transition-colors duration-300">
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Topbar
            leftContent={getTopbarContent()}
            toggleMobileMenu={() => setIsMobileMenuOpen(true)}
          />
          
          <Suspense fallback={<ContainerLoader text="Loading view..." />}>
            {renderContent()}
          </Suspense>
        </main>
      </div>
    </BuilderContext.Provider>
  );
};

export default Dashboard;