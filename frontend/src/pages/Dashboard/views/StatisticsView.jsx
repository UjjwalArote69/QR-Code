import React from 'react';
import { 
  BarChart3, Users, MousePointerClick, TrendingUp, 
  Calendar, MapPin, MonitorSmartphone, ArrowUpRight 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  ArcElement, Title, Tooltip, Legend, Filler
);

const StatisticsView = () => {
  // --- Chart Configurations ---
  
  // Time-Series Line Chart Data (Scans over last 7 days)
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Total Scans',
        data: [1200, 1900, 1500, 2200, 1800, 2800, 2400],
        borderColor: '#94a3b8', // slate-400
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        borderWidth: 2,
        tension: 0.4, // Smooth curves
        fill: true,
        pointBackgroundColor: '#f8fafc',
        pointBorderColor: '#64748b',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a', // slate-900
        titleColor: '#f1f5f9', // slate-100
        bodyColor: '#cbd5e1', // slate-300
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#64748b', font: { family: 'Inter, sans-serif' } },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)', drawBorder: false },
        ticks: { color: '#64748b', font: { family: 'Inter, sans-serif' } },
        beginAtZero: true,
      },
    },
  };

  // Device Doughnut Chart Data
  const doughnutData = {
    labels: ['iOS', 'Android', 'Desktop', 'Other'],
    datasets: [
      {
        data: [55, 30, 10, 5],
        backgroundColor: [
          '#0f172a', // slate-900 (Darkest)
          '#475569', // slate-600
          '#94a3b8', // slate-400
          '#e2e8f0', // slate-200 (Lightest)
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#64748b',
          usePointStyle: true,
          padding: 20,
          font: { family: 'Inter, sans-serif', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 8,
      }
    },
    cutout: '75%', // Makes it a thin ring
  };

  // --- Top Locations Mock Data ---
  const topLocations = [
    { city: 'New York, USA', scans: '4,205', percentage: '35%' },
    { city: 'London, UK', scans: '2,840', percentage: '24%' },
    { city: 'Toronto, CAN', scans: '1,520', percentage: '12%' },
    { city: 'Sydney, AUS', scans: '980', percentage: '8%' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Date Picker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Global Statistics
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real-time insights across all your active campaigns.
            </p>
          </div>
          
          <button className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-medium text-sm">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Last 7 Days</span>
          </button>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Scans" value="13,800" trend="+14.5%" icon={BarChart3} />
          <KPICard title="Unique Visitors" value="9,420" trend="+8.2%" icon={Users} />
          <KPICard title="Scan Rate" value="2.4 / user" trend="Stable" icon={MousePointerClick} neutral />
          <KPICard title="Active Campaigns" value="12" trend="+2" icon={TrendingUp} />
        </div>

        {/* Charts Row 1: Main Timeline & Device Types */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Time Series Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Scan Volume</h2>
            </div>
            <div className="h-[300px] w-full">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          {/* Device Types Doughnut */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col">
            <div className="flex items-center space-x-2 mb-6">
              <MonitorSmartphone className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Operating Systems</h2>
            </div>
            <div className="flex-1 min-h-[250px] relative flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              {/* Center Text inside Doughnut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">85%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Mobile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Geographic Data & Top Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Locations */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Top Geographies</h2>
            </div>
            <div className="space-y-4">
              {topLocations.map((loc, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-4">{i + 1}.</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{loc.city}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{loc.scans} scans</span>
                    <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-800 dark:bg-slate-400 rounded-full" 
                        style={{ width: loc.percentage }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Links */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Top Performing Campaigns</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:underline">
                      {['Spring Menu 2026', 'NYC Subway Ad', 'App Download Banner'][i]}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">nexusqr.com/r/xyz{i}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {[4205, 2840, 1520][i]}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// Reusable KPI Card Component
const KPICard = ({ title, value, trend, icon: Icon, neutral }) => (
  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
      </div>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{value}</span>
      <span className={`text-xs font-semibold mb-0.5 ${
        neutral 
          ? 'text-slate-500 dark:text-slate-400' 
          : trend.startsWith('+') 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-500 dark:text-red-400'
      }`}>
        {trend}
      </span>
    </div>
  </div>
);

export default StatisticsView;